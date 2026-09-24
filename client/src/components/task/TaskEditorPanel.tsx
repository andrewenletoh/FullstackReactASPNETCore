import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import styles from './TaskEditorPanel.module.css';
import type { ColumnId, ColumnMap } from './taskBoard.types';


type TaskEditorPanelProps = {
    columns: ColumnMap;
    isOpen: boolean;
    isLoading: boolean;
    isCreating: boolean;
    onToggle: () => void;
    onAddTask: (title: string, description: string, columnId: ColumnId) => Promise<boolean>;
};

function TaskEditorPanel({
    columns,
    isOpen,
    isLoading,
    isCreating,
    onToggle,
    onAddTask,
}: TaskEditorPanelProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [columnId, setColumnId] = useState<ColumnId>(() => (Object.keys(columns) as ColumnId[])[0] ?? 'Todo');

    const submit = async () => {
        const didCreate = await onAddTask(title, description, columnId);
        if (didCreate) {
            setTitle('');
            setDescription('');
        }
    };

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
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Add a new task..."
                    onKeyDown={(event) => event.key === 'Enter' && void submit()}
                    readOnly={isCreating}
                    aria-label="New task title"
                />
                <textarea
                    className={styles.descriptionContainer}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe the task..."
                    maxLength={32767}
                    required
                    readOnly={isCreating}
                    aria-label="New task description"
                />
                <select
                    className={styles.columnSelect}
                    value={columnId}
                    onChange={(event) => setColumnId(event.target.value as ColumnId)}
                    aria-label="Column"
                >
                    {(Object.keys(columns) as ColumnId[]).map((id) => (
                        <option value={id} key={id}>
                            {columns[id].name}
                        </option>
                    ))}
                </select>
                <button
                    className={styles.addButton}
                    onClick={() => void submit()}
                    disabled={isLoading || isCreating}
                    aria-busy={isCreating}
                    type="button"
                >
                    {isCreating ? 'Adding...' : 'Add'}
                </button>
            </div>
        </aside>
    );
}

export default TaskEditorPanel;
