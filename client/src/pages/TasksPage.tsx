import TaskBoard from "../components/task/TaskBoard";
import TaskEditorPanel from "../components/task/TaskEditorPanel";
import { useAuth } from "../context/AuthContext";
import { useTaskBoard } from "../components/task/useTaskBoard";
import { ChevronsDownUp } from 'lucide-react';
import { useState } from 'react';
import styles from './TasksPage.module.css';

const TasksPage: React.FC = () => {
    const [expandAll, setExpandAll] = useState(false);
    const { user } = useAuth();
    const {
        columns,
        newTask,
        newTaskDescription,
        activeColumn,
        isEditorPanelOpen,
        isLoading,
        setNewTask,
        setNewTaskDescription,
        setActiveColumn,
        setEditorPanelOpen,
        addNewTask,
        removeTask,
        editTask,
        startDragging,
        dropTask,
    } = useTaskBoard();

    return (
        <main className={styles.page}>
            <div
                className={styles.spacer}
                aria-hidden="true"
            />
            <section className={styles.content}>
                <div
                    className={`${styles.taskLayout}
                    ${isEditorPanelOpen ? '' : styles.panelCollapsed}`}
                >
                    <h1 className={styles.header}>Tasks</h1>
                    <aside className={styles.editorRail}>
                        <button
                            className={styles.expandAllButton}
                            type="button"
                            onClick={() => setExpandAll((isExpanded) => !isExpanded)}
                            aria-pressed={expandAll}
                            aria-label={expandAll ? 'Collapse all task cards' : 'Expand all task cards'}
                            title={expandAll ? 'Collapse all task cards' : 'Expand all task cards'}
                        >
                            <ChevronsDownUp aria-hidden="true" />
                            <span>{expandAll ? 'Collapse all' : 'Expand all'}</span>
                        </button>
                        {user ? <TaskEditorPanel
                            columns={columns}
                            newTask={newTask}
                            newTaskDescription={newTaskDescription}
                            activeColumn={activeColumn}
                            isOpen={isEditorPanelOpen}
                            isLoading={isLoading}
                            onNewTaskChange={setNewTask}
                            onNewTaskDescriptionChange={setNewTaskDescription}
                            onActiveColumnChange={setActiveColumn}
                            onToggle={() => setEditorPanelOpen(!isEditorPanelOpen)}
                            onAddTask={() => void addNewTask()}
                        /> : null}
                    </aside>
                    <TaskBoard
                        columns={columns}
                        expandAll={expandAll}
                        onDrop={(columnId) => void dropTask(columnId)}
                        onDragStart={startDragging}
                        onDelete={(columnId, taskId) => void removeTask(columnId, taskId)}
                        onEdit={(columnId, taskId, title, description) => editTask(columnId, taskId, title, description)}
                    />
                </div>
            </section>
        </main>
    )
}

export default TasksPage