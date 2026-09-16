export type Role = 'User' | 'Admin'

export interface AuthUser {
    id: string;
    username: string;
    role: Role;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    password: string;
}