import { useState } from 'react';
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import styles from './TasksPage.module.css';
import DotGridBackground from '../components/background/Background';
import TaskBoard from "../components/task/TaskBoard";
import TaskEditorPanel from "../components/task/TaskEditorPanel";
import { useAuth } from "../context/AuthContext";
import { useTaskBoard } from "../components/task/useTaskBoard";


const TasksPage: React.FC = () => {
    const [expandAll, setExpandAll] = useState(false);
    const { user } = useAuth();
    const {
        columns,
        isEditorPanelOpen,
        isLoading,
        isCreating,
        setEditorPanelOpen,
        addNewTask,
        removeTask,
        editTask,
        startDragging,
        dropTask,
    } = useTaskBoard();

    return (
        <main className={styles.page}>
            <DotGridBackground theme="light" />
            <div
                className={styles.spacer}
                aria-hidden="true"
            />
            <aside className={styles.editorRail}>
                <button
                    className={styles.expandAllButton}
                    type="button"
                    onClick={() => setExpandAll((isExpanded) => !isExpanded)}
                    aria-pressed={expandAll}
                    aria-label={expandAll ? 'Collapse all task cards' : 'Expand all task cards'}
                    title={expandAll ? 'Collapse all task cards' : 'Expand all task cards'}
                >
                    {expandAll ?
                        <ChevronsDownUp className={styles.icon} aria-hidden="true" /> :
                        <ChevronsUpDown className={styles.icon} aria-hidden="true" />
                    }
                </button>
                {<TaskEditorPanel
                    columns={columns}
                    isOpen={isEditorPanelOpen}
                    isLoading={isLoading}
                    isCreating={isCreating}
                    onToggle={() => setEditorPanelOpen(!isEditorPanelOpen)}
                    onAddTask={addNewTask}
                />}
            </aside>
            <section className={styles.content}>
                <div
                    className={`${styles.taskLayout}
                    ${isEditorPanelOpen ? '' : styles.panelCollapsed}`}
                >
                    <h1 className={styles.header}>Tasks</h1>
                    <TaskBoard
                        columns={columns}
                        expandAll={expandAll}
                        isLoading={isLoading}
                        onDrop={(columnId) => void dropTask(columnId)}
                        onDragStart={startDragging}
                        onDelete={(columnId, taskId) => void removeTask(columnId, taskId)}
                        onEdit={(columnId, taskId, title, description) => editTask(columnId, taskId, title, description)}
                        readOnly={!user}
                    />
                </div>
            </section>
        </main>
    )
}

export default TasksPage