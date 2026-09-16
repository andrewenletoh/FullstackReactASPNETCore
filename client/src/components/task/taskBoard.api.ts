import { apiClient } from '../../lib/apiclient';

import type { BackendTask } from './taskBoard.types';

export const getTasks = async () => {
    const response = await apiClient.get<BackendTask[]>('/tasks');
    return response.data;
};

export const createTask = async (title: string, description: string, status: number) => {
    const response = await apiClient.post<BackendTask>('/tasks', {
        title,
        description,
        status,
    });
    return response.data;
};

export const updateTaskStatus = async (task: BackendTask, status: number) => {
    await apiClient.put(`/tasks/${task.id}`, {
        ...task,
        status,
    });
};

export const updateTask = async (task: BackendTask) => {
    await apiClient.put(`/tasks/${task.id}`, task);
};

export const deleteTask = async (taskId: string) => {
    await apiClient.delete(`/tasks/${taskId}`);
};
