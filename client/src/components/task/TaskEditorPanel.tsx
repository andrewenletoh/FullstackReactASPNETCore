import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import styles from './TaskEditorPanel.module.css';
import type { ColumnMap } from './taskBoard.types';


type TaskEditorPanelProps = {
    columns: ColumnMap;
    newTask: string;
    newTaskDescription: string;
    activeColumn: string;
    isOpen: boolean;
    isLoading: boolean;
    onNewTaskChange: (value: string) => void;
    onNewTaskDescriptionChange: (value: string) => void;
    onActiveColumnChange: (value: string) => void;
    onToggle: () => void;
    onAddTask: () => void;
};

function TaskEditorPanel({
    columns,
    newTask,
    newTaskDescription,
    activeColumn,
    isOpen,
    isLoading,
    onNewTaskChange,
    onNewTaskDescriptionChange,
    onActiveColumnChange,
    onToggle,
    onAddTask,
}: TaskEditorPanelProps) {
    return (
        <aside
            className={`${styles.taskEditorContainer} ${isOpen ? '' : styles.panelCollapsed}`}
            aria-label="Create a task"
        >
            <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>Add task</span>
                <button
                    className={styles.panelToggle}
                    type="button"
                    onClick={onToggle}
                    aria-label={isOpen ? 'Collapse task creation panel' : 'Expand task creation panel'}
                    title={isOpen ? 'Collapse task creation panel' : 'Expand task creation panel'}
                >
                    {isOpen ? (
                        <PanelLeftClose className={styles.panelIcon} aria-hidden="true" />
                    ) : (
                        <PanelLeftOpen className={styles.panelIcon} aria-hidden="true" />
                    )}
                </button>
            </div>

            <div className={styles.taskCreationForm}>
                <input
                    className={styles.inputContainer}
                    type="text"
                    value={newTask}
                    onChange={(event) => onNewTaskChange(event.target.value)}
                    placeholder="Add a new task..."
                    onKeyDown={(event) => event.key === 'Enter' && onAddTask()}
                    aria-label="New task title"
                />
                <textarea
                    className={styles.descriptionContainer}
                    value={newTaskDescription}
                    onChange={(event) => onNewTaskDescriptionChange(event.target.value)}
                    placeholder="Describe the task..."
                    maxLength={32767}
                    required
                    aria-label="New task description"
                />
                <select
                    className={styles.columnSelect}
                    value={activeColumn}
                    onChange={(event) => onActiveColumnChange(event.target.value)}
                    aria-label="Column"
                >
                    {Object.keys(columns).map((columnId) => (
                        <option value={columnId} key={columnId}>
                            {columns[columnId].name}
                        </option>
                    ))}
                </select>
                <button
                    className={styles.addButton}
                    onClick={onAddTask}
                    disabled={isLoading}
                    type="button"
                >
                    Add
                </button>
            </div>
        </aside>
    );
}

export default TaskEditorPanel;
