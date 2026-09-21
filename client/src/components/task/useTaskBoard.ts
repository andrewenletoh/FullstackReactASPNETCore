import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from './taskBoard.api';
import { initialColumns, groupTasksByStatus } from './taskBoard.utils';
import type { ColumnMap, DraggedTask } from './taskBoard.types';

const LOAD_TASKS_TOAST_ID = 'load-tasks';
const SLOW_LOAD_DELAY_MS = 1000;

export function useTaskBoard() {
    const [columns, setColumns] = useState<ColumnMap>(initialColumns);
    const [newTask, setNewTask] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [activeColumn, setActiveColumn] = useState('Todo');
    const [draggedTask, setDraggedTask] = useState<DraggedTask>(null);
    const [isEditorPanelOpen, setEditorPanelOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    // A ref is checked synchronously, so rapid clicks or Enter presses can't
    // slip through before the isCreating state has re-rendered.
    const isCreatingRef = useRef(false);

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
                if (cancelled) return;
                setColumns(groupTasksByStatus(tasks));
                toast.dismiss(LOAD_TASKS_TOAST_ID);
            } catch (error) {
                if (cancelled) return;
                toast.error('Unable to load tasks.', { id: LOAD_TASKS_TOAST_ID });
                console.error('Error retrieving tasks:', error);
            } finally {
                clearTimeout(slowLoadTimer);
                if (!cancelled) setIsLoading(false);
            }
        };

        void loadTasks();

        return () => {
            cancelled = true;
            clearTimeout(slowLoadTimer);
            toast.dismiss(LOAD_TASKS_TOAST_ID);
        };
    }, []);

    const addNewTask = async () => {
        if (isCreatingRef.current || isLoading) return;

        if (newTask.trim() === '' || newTaskDescription.trim() === '') {
            toast.error('Add a title and description before creating a task.');
            return;
        }

        isCreatingRef.current = true;
        setIsCreating(true);

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
        } finally {
            // Runs after the board update above, so the next add is only
            // allowed once the new task is visible.
            isCreatingRef.current = false;
            setIsCreating(false);
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
        isCreating,
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
