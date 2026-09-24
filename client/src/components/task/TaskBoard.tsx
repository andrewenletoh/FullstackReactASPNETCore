import styles from './TaskBoard.module.css';
import TaskColumn from './TaskColumn';
import type { ColumnId, ColumnMap } from './taskBoard.types';


type TaskBoardProps = {
    columns: ColumnMap;
    onDrop: (columnId: ColumnId) => void;
    onDragStart: (columnId: ColumnId, taskId: string) => void;
    onDelete: (columnId: ColumnId, taskId: string) => void;
    onEdit: (columnId: ColumnId, taskId: string, title: string, description: string) => Promise<void>;
    expandAll: boolean;
    isLoading: boolean;
    deletingTaskIds: Set<string>;
    readOnly: boolean;
};

function TaskBoard({ columns, onDrop, onDragStart, onDelete, onEdit, expandAll, isLoading, deletingTaskIds, readOnly }: TaskBoardProps) {
    return (
        <div className={styles.taskDashboard}>
            <div className={styles.taskBoardInteractContainer}>
                <div className={styles.columns}>
                    {(Object.entries(columns) as [ColumnId, ColumnMap[ColumnId]][]).map(([columnId, column]) => (
                        <TaskColumn
                            key={columnId}
                            column={column}
                            onDrop={() => onDrop(columnId)}
                            onDragStart={(taskId) => onDragStart(columnId, taskId)}
                            onDelete={(taskId) => onDelete(columnId, taskId)}
                            onEdit={(taskId, title, description) => onEdit(columnId, taskId, title, description)}
                            expandAll={expandAll}
                            isLoading={isLoading}
                            deletingTaskIds={deletingTaskIds}
                            readOnly={readOnly}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TaskBoard;