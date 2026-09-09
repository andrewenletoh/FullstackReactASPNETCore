import styles from './TaskBoard.module.css';
import TaskColumn from './TaskColumn';
import type { ColumnMap } from './taskBoard.types';

type TaskBoardProps = {
    columns: ColumnMap;
    onDrop: (columnId: string) => void;
    onDragStart: (columnId: string, taskId: number) => void;
    onDelete: (columnId: string, taskId: number) => void;
    onEdit: (columnId: string, taskId: number, title: string, description: string) => Promise<void>;
    expandAll: boolean;
};

function TaskBoard({ columns, onDrop, onDragStart, onDelete, onEdit, expandAll }: TaskBoardProps) {
    return (
        <div className={styles.taskDashboard}>
            <div className={styles.taskBoardInteractContainer}>
                <div className={styles.columns}>
                    {Object.entries(columns).map(([columnId, column]) => (
                        <TaskColumn
                            key={columnId}
                            column={column}
                            onDrop={() => onDrop(columnId)}
                            onDragStart={(taskId) => onDragStart(columnId, taskId)}
                            onDelete={(taskId) => onDelete(columnId, taskId)}
                            onEdit={(taskId, title, description) => onEdit(columnId, taskId, title, description)}
                            expandAll={expandAll}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TaskBoard;