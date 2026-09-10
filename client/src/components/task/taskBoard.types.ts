export type BackendTask = {
    id: string;
    title: string;
    description: string;
    status: number | string;
};

export type TaskColumn = {
    name: string;
    status: number;
    tasks: BackendTask[];
};

export type ColumnMap = Record<string, TaskColumn>;

export type DraggedTask = {
    columnId: string;
    task: BackendTask;
} | null;
