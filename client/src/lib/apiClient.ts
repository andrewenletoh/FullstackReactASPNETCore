import axios from 'axios';


// Need to create a separate instance instead of global
// so that creds and tokens can't get stolen.
// This is mostly because we use the global axios for the github repo components,
// so a separate instance is safer here.
export const apiClient = axios.create({
    baseURL: (import.meta.env.VITE_BASE_API_URL ?? 'http://localhost:3000/api').replace(/\/$/, ''),
    withCredentials: true,
});

// Need to sign+hash these methods because Cloudfront doesn't handle POST/PUT/PATCH calls correctly
const WRITE_METHODS = new Set(['post', 'put', 'patch']);

// SHA-256 hashing for request bodies in POST/PUT/PATCH calls 
async function sha256Hex(message: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

// Intercepting POST/PUT/PATCH requests before axios sends the request,
// attaching it as a new header so that Cloudfront OAC can detect and sign it correctly
apiClient.interceptors.request.use(async (config) => {
    const method = config.method?.toLowerCase() ?? '';

    if (config.data !== undefined && WRITE_METHODS.has(method)) {
        const body = typeof config.data == 'string' ? config.data : JSON.stringify(config.data);
        config.headers.set('x-amz-content-sha256', await sha256Hex(body));
    }

    return config;
});

// Setting up token silent refresh and retries on other api requests when a 401 occurs.
// Catching the response before it hits the UI and resending the request with refreshed token.
let refreshPromise: Promise<unknown> | null = null;

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthCall = originalRequest?.url?.startsWith('/auth/');

        if (error.response?.status === 401 && !isAuthCall && !originalRequest?._retried) {
            if (originalRequest) {
                originalRequest._retried = true;
            }

            try {
                refreshPromise ??= apiClient.post('/auth/refresh').finally(() => {
                    refreshPromise = null;
                });
                await refreshPromise;
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
