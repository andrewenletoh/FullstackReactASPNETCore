import type { DragEvent } from 'react';

import styles from './TaskColumn.module.css';
import TaskCard from './TaskCard';
import type { TaskColumn as TaskColumnData } from './taskBoard.types';

type TaskColumnProps = {
    column: TaskColumnData;
    onDrop: () => void;
    onDragStart: (taskId: number) => void;
    onDelete: (taskId: number) => void;
    onEdit: (taskId: number, title: string, description: string) => Promise<void>;
    expandAll: boolean;
};

function TaskColumn({ column, onDrop, onDragStart, onDelete, onEdit, expandAll }: TaskColumnProps) {
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div
            className={styles.column}
            data-status={column.status}
            onDragOver={handleDragOver}
            onDrop={onDrop}
        >
            <div className={styles.columnHeader}>
                {column.name}
                <span className={styles.columnTaskCount}>{column.tasks.length}</span>
            </div>
            <div className={styles.columnBody}>
                {column.tasks.length === 0 ? (
                    <div className={styles.emptyColumn}>Drop Tasks Here</div>
                ) : (
                    column.tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDragStart={() => onDragStart(task.id)}
                            onDelete={() => onDelete(task.id)}
                            onEdit={(title, description) => onEdit(task.id, title, description)}
                            expandAll={expandAll}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default TaskColumn;
