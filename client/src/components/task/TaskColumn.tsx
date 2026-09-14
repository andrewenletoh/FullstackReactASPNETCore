import type { DragEvent } from 'react';

import styles from './TaskColumn.module.css';
import TaskCard from './TaskCard';
import type { TaskColumn as TaskColumnData } from './taskBoard.types';

type TaskColumnProps = {
    column: TaskColumnData;
    onDrop: () => void;
    onDragStart: (taskId: string) => void;
    onDelete: (taskId: string) => void;
    onEdit: (taskId: string, title: string, description: string) => Promise<void>;
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
            role="group"
            aria-label={`${column.name} column`}
        >
            <h2 className={styles.columnHeader}>
                {column.name}
                <span
                    className={styles.columnTaskCount}
                    aria-label={`${column.tasks.length} tasks`} >
                    {column.tasks.length}
                </span>
            </h2>
            <ul className={styles.columnBody}>
                {column.tasks.length === 0 ? (
                    <li className={styles.emptyColumn}>Drop Tasks Here</li>
                ) : (
                    column.tasks.map((task) => (
                        <li key={task.id}>
                            <TaskCard
                                key={task.id}
                                task={task}
                                onDragStart={() => onDragStart(task.id)}
                                onDelete={() => onDelete(task.id)}
                                onEdit={(title, description) => onEdit(task.id, title, description)}
                                expandAll={expandAll}
                            />
                        </li>
                    ))
                )}
            </ul>
        </div >
    );
}

export default TaskColumn;
