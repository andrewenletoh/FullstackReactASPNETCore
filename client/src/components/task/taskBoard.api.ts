import axios from 'axios';

import type { BackendTask } from './taskBoard.types';

const API_BASE_URL = `${(import.meta.env.VITE_BASE_API_URL ?? 'http://localhost:3000/api').replace(/\/$/, '')}/tasks`;

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

export const deleteTask = async (taskId: number) => {
    await axios.delete(`${API_BASE_URL}/${taskId}`);
};
