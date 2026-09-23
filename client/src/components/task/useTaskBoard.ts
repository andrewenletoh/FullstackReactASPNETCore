import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from './taskBoard.api';
import { initialColumns, groupTasksByStatus } from './taskBoard.utils';
import type { ColumnMap, DraggedTask } from './taskBoard.types';

const LOAD_TASKS_TOAST_ID = 'load-tasks';
const SLOW_LOAD_DELAY_MS = 1000;

export function useTaskBoard() {
    const [columns, setColumns] = useState<ColumnMap>(initialColumns);
    const draggedTaskRef = useRef<DraggedTask>(null);
    const [isEditorPanelOpen, setEditorPanelOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    // A ref is checked synchronously, so rapid clicks or Enter presses can't
    // slip through before the isCreating state has re-rendered.
    const isCreatingRef = useRef(false);
    const deletingTaskIdsRef = useRef<Set<string>>(new Set());
    const [deletingTaskIds, setDeletingTaskIds] = useState<Set<string>>(new Set());
    const editingTaskIdsRef = useRef<Set<string>>(new Set());
    const isDroppingRef = useRef(false);



    useEffect(() => {
        let cancelled = false;

        // Only show a toast if the request is slow (e.g. a cold-starting backend),
        // so fast loads don't flash a message. The fixed id lets later toasts replace it.
        const slowLoadTimer = setTimeout(() => {
            toast.loading('Loading tasks...', { id: LOAD_TASKS_TOAST_ID });
        }, SLOW_LOAD_DELAY_MS);

        const loadTasks = async () => {
            try {
                const tasks = await getTasks();
                if (!cancelled) {
                    setColumns(groupTasksByStatus(tasks));
                    toast.dismiss(LOAD_TASKS_TOAST_ID);
                }
            } catch (error) {
                if (!cancelled) {
                    toast.error('Unable to load tasks.', { id: LOAD_TASKS_TOAST_ID });
                    console.error('Error retrieving tasks:', error);
                }
            }
            clearTimeout(slowLoadTimer);
            if (!cancelled) setIsLoading(false);
        };

        void loadTasks();

        return () => {
            cancelled = true;
            clearTimeout(slowLoadTimer);
            toast.dismiss(LOAD_TASKS_TOAST_ID);
        };
    }, []);

    const addNewTask = async (title: string, description: string, columnId: string): Promise<boolean> => {
        if (isCreatingRef.current || isLoading) return false;

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
        if (trimmedTitle === '' || trimmedDescription === '') {
            toast.error('Add a title and description before creating a task.');
            return false;
        }

        isCreatingRef.current = true;
        setIsCreating(true);

        let created = false;
        try {
            const task = await createTask(trimmedTitle, trimmedDescription, initialColumns[columnId].status);
            setColumns((currentColumns) => ({
                ...currentColumns,
                [columnId]: {
                    ...currentColumns[columnId],
                    tasks: [...currentColumns[columnId].tasks, task],
                },
            }));
            created = true;
        } catch (error) {
            toast.error('Unable to create task.');
            console.error('Error creating task:', error);
        }
        isCreatingRef.current = false;
        setIsCreating(false);
        return created;
    };

    const removeTask = async (columnId: string, taskId: string) => {
        if (deletingTaskIdsRef.current.has(taskId)) return;

        deletingTaskIdsRef.current.add(taskId);
        setDeletingTaskIds((current) => new Set(current).add(taskId));

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

        deletingTaskIdsRef.current.delete(taskId);
        setDeletingTaskIds((current) => {
            const next = new Set(current);
            next.delete(taskId);
            return next;
        });
    };

    const editTask = async (columnId: string, taskId: string, title: string, description: string) => {
        if (editingTaskIdsRef.current.has(taskId)) return;

        const currentTask = columns[columnId].tasks.find((task) => task.id === taskId);
        if (!currentTask) return;

        editingTaskIdsRef.current.add(taskId);
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
            editingTaskIdsRef.current.delete(taskId);
            throw error;
        }
        editingTaskIdsRef.current.delete(taskId);
    };

    const startDragging = (columnId: string, taskId: string) => {
        const task = columns[columnId].tasks.find((item) => item.id === taskId);
        if (task) draggedTaskRef.current = { columnId, task };
    };

    const dropTask = async (columnId: string) => {
        if (isDroppingRef.current) return;

        const draggedTask = draggedTaskRef.current;
        if (!draggedTask || draggedTask.columnId === columnId) return;

        isDroppingRef.current = true;
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
        }
        draggedTaskRef.current = null;
        isDroppingRef.current = false;
    };

    return {
        columns,
        isEditorPanelOpen,
        isLoading,
        isCreating,
        deletingTaskIds,
        setEditorPanelOpen,
        addNewTask,
        removeTask,
        editTask,
        startDragging,
        dropTask,
    };
}
