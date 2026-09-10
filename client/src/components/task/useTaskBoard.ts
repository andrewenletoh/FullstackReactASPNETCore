import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from './taskBoard.api';
import { initialColumns, groupTasksByStatus } from './taskBoard.utils';
import type { ColumnMap, DraggedTask } from './taskBoard.types';

export function useTaskBoard() {
    const [columns, setColumns] = useState<ColumnMap>(initialColumns);
    const [newTask, setNewTask] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [activeColumn, setActiveColumn] = useState('Todo');
    const [draggedTask, setDraggedTask] = useState<DraggedTask>(null);
    const [isEditorPanelOpen, setEditorPanelOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                setColumns(groupTasksByStatus(await getTasks()));
            } catch (error) {
                toast.error('Unable to load tasks.');
                console.error('Error retrieving tasks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadTasks();
    }, []);

    const addNewTask = async () => {
        if (newTask.trim() === '' || newTaskDescription.trim() === '') {
            toast.error('Add a title and description before creating a task.');
            return;
        }

        try {
            const task = await createTask(
                newTask.trim(),
                newTaskDescription.trim(),
                initialColumns[activeColumn].status
            );
            setColumns((currentColumns) => ({
                ...currentColumns,
                [activeColumn]: {
                    ...currentColumns[activeColumn],
                    tasks: [...currentColumns[activeColumn].tasks, task],
                },
            }));
            setNewTask('');
            setNewTaskDescription('');
        } catch (error) {
            toast.error('Unable to create task.');
            console.error('Error creating task:', error);
        }
    };

    const removeTask = async (columnId: string, taskId: string) => {
        try {
            await deleteTask(taskId);
            setColumns((currentColumns) => ({
                ...currentColumns,
                [columnId]: {
                    ...currentColumns[columnId],
                    tasks: currentColumns[columnId].tasks.filter((task) => task.id !== taskId),
                },
            }));
        } catch (error) {
            toast.error('Unable to delete task.');
            console.error('Error deleting task:', error);
        }
    };

    const editTask = async (columnId: string, taskId: string, title: string, description: string) => {
        const currentTask = columns[columnId].tasks.find((task) => task.id === taskId);
        if (!currentTask) return;

        const updatedTask = { ...currentTask, title, description };
        try {
            await updateTask(updatedTask);
            setColumns((currentColumns) => ({
                ...currentColumns,
                [columnId]: {
                    ...currentColumns[columnId],
                    tasks: currentColumns[columnId].tasks.map((task) => task.id === taskId ? updatedTask : task),
                },
            }));
        } catch (error) {
            toast.error('Unable to edit task.');
            console.error('Error editing task:', error);
            throw error;
        }
    };

    const startDragging = (columnId: string, taskId: string) => {
        const task = columns[columnId].tasks.find((item) => item.id === taskId);
        if (task) setDraggedTask({ columnId, task });
    };

    const dropTask = async (columnId: string) => {
        if (!draggedTask || draggedTask.columnId === columnId) return;

        const { columnId: sourceColumnId, task } = draggedTask;

        try {
            const status = initialColumns[columnId].status;
            await updateTaskStatus(task, status);
            setColumns((currentColumns) => ({
                ...currentColumns,
                [sourceColumnId]: {
                    ...currentColumns[sourceColumnId],
                    tasks: currentColumns[sourceColumnId].tasks.filter((currentTask) => currentTask.id !== task.id),
                },
                [columnId]: {
                    ...currentColumns[columnId],
                    tasks: [...currentColumns[columnId].tasks, { ...task, status }],
                },
            }));
        } catch (error) {
            toast.error('Unable to move task.');
            console.error('Error moving task:', error);
        } finally {
            setDraggedTask(null);
        }
    };

    return {
        columns,
        newTask,
        newTaskDescription,
        activeColumn,
        isEditorPanelOpen,
        isLoading,
        setNewTask,
        setNewTaskDescription,
        setActiveColumn,
        setEditorPanelOpen,
        addNewTask,
        removeTask,
        editTask,
        startDragging,
        dropTask,
    };
}
