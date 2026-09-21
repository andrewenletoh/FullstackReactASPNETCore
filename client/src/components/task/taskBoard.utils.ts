import type { BackendTask, ColumnMap } from './taskBoard.types';


export const initialColumns: ColumnMap = {
    Todo: { name: 'To Do', status: 0, tasks: [] },
    InProgress: { name: 'In Progress', status: 1, tasks: [] },
    Blocked: { name: 'Blocked', status: 2, tasks: [] },
    Done: { name: 'Done', status: 3, tasks: [] },
    Backlog: { name: 'Backlog', status: 4, tasks: [] },
};

const statusColumns: Record<number | string, string> = {
    0: 'Todo',
    1: 'InProgress',
    2: 'Blocked',
    3: 'Done',
    4: 'Backlog',
    todo: 'Todo',
    inprogress: 'InProgress',
    blocked: 'Blocked',
    done: 'Done',
    backlog: 'Backlog',
};

export const getColumnId = (status: number | string) => {
    const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : status;
    return statusColumns[normalizedStatus] ?? 'Todo';
};

export const groupTasksByStatus = (tasks: BackendTask[]) => {
    const groupedColumns: ColumnMap = Object.fromEntries(
        Object.entries(initialColumns).map(([columnId, column]) => [columnId, { ...column, tasks: [] }])
    );

    tasks.forEach((task) => {
        groupedColumns[getColumnId(task.status)].tasks.push(task);
    });

    return groupedColumns;
};
