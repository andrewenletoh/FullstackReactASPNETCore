import axios from 'axios';

import type { BackendTask } from './taskBoard.types';

const API_BASE_URL = `${(import.meta.env.VITE_BASE_API_URL ?? 'http://localhost:3000/api').replace(/\/$/, '')}/tasks`;



// CloudFront's OAC can only compute a request signature for the lambda function URL origin when it
// knows the SHA-256 hash of the body. For GET/DELETE requests (no body) OAC handles this on its
// own, but for POST/PUT/PATCH we have to supply the hash ourselves as the x-amz-content-sha256
// header, hashing the exact bytes axios will send.
const WRITE_METHODS = new Set(['post', 'put', 'patch']);

async function sha256Hex(message: string): Promise<string> {

    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));

    return Array.from(new Uint8Array(digest))

        .map((byte) => byte.toString(16).padStart(2, '0'))

        .join('');

}

axios.interceptors.request.use(async (config) => {

    const method = config.method?.toLowerCase() ?? '';

    if (config.data !== undefined && WRITE_METHODS.has(method)) {

        // axios's default transformRequest JSON.stringifies plain objects with no extra

        // whitespace; replicate that exactly so the hash matches the bytes actually sent.

        const body = typeof config.data === 'string' ? config.data : JSON.stringify(config.data);

        config.headers.set('x-amz-content-sha256', await sha256Hex(body));

    }

    return config;

});

export const getTasks = async () => {
    const response = await axios.get<BackendTask[]>(API_BASE_URL);
    return response.data;
};

export const createTask = async (title: string, description: string, status: number) => {
    const response = await axios.post<BackendTask>(API_BASE_URL, {
        title,
        description,
        status,
    });
    return response.data;
};

export const updateTaskStatus = async (task: BackendTask, status: number) => {
    await axios.put(`${API_BASE_URL}/${task.id}`, {
        ...task,
        status,
    });
};

export const updateTask = async (task: BackendTask) => {
    await axios.put(`${API_BASE_URL}/${task.id}`, task);
};

export const deleteTask = async (taskId: string) => {
    await axios.delete(`${API_BASE_URL}/${taskId}`);
};
