import styles from './TaskBoard.module.css';
import TaskColumn from './TaskColumn';
import type { ColumnMap } from './taskBoard.types';


type TaskBoardProps = {
    columns: ColumnMap;
    onDrop: (columnId: string) => void;
    onDragStart: (columnId: string, taskId: string) => void;
    onDelete: (columnId: string, taskId: string) => void;
    onEdit: (columnId: string, taskId: string, title: string, description: string) => Promise<void>;
    expandAll: boolean;
    readOnly: boolean;
};

function TaskBoard({ columns, onDrop, onDragStart, onDelete, onEdit, expandAll, readOnly }: TaskBoardProps) {
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
                            readOnly={readOnly}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TaskBoard;