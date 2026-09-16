import { apiClient } from '../lib/apiClient';

import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth';

export const registerUser = async (payload: RegisterPayload) => {
    const response = await apiClient.post<AuthUser>('/auth/register', payload);
    return response.data;
};

export const loginUser = async (payload: LoginPayload) => {
    const response = await apiClient.post<AuthUser>('/auth/login', payload);
    return response.data;
};

export const logoutUser = async () => {
    await apiClient.post('/auth/logout');
};

export const fetchCurrentUser = async () => {
    const response = await apiClient.get<AuthUser>('/auth/me');
    return response.data;
};
