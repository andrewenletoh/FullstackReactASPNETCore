export type BackendTask = {
    id: string;
    title: string;
    description: string;
    status: number | string;
};

export type ColumnId = 'Todo' | 'InProgress' | 'Blocked' | 'Done' | 'Backlog';

export type TaskColumn = {
    name: string;
    status: number;
    tasks: BackendTask[];
};

export type ColumnMap = Record<string, TaskColumn>;

export type DraggedTask = {
    columnId: ColumnId;
    task: BackendTask;
} | null;
