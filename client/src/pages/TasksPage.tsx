import TaskBoard from "../components/task/TaskBoard";
import TaskEditorPanel from "../components/task/TaskEditorPanel";
import { useTaskBoard } from "../components/task/useTaskBoard";
import { ChevronsDownUp } from 'lucide-react';
import { useState } from 'react';
import styles from './TasksPage.module.css';

const TasksPage: React.FC = () => {
    const [expandAll, setExpandAll] = useState(false);
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
        <div className={styles.page}>
            <header className={styles.spacer} />
            <div className={styles.content}>
                <div className={`${styles.taskLayout} ${isEditorPanelOpen ? '' : styles.panelCollapsed}`}>
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
                        <TaskEditorPanel
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
                        />
                    </aside>
                    <h1 className={styles.header}>Tasks</h1>
                    <TaskBoard
                        columns={columns}
                        expandAll={expandAll}
                        onDrop={(columnId) => void dropTask(columnId)}
                        onDragStart={startDragging}
                        onDelete={(columnId, taskId) => void removeTask(columnId, taskId)}
                        onEdit={(columnId, taskId, title, description) => editTask(columnId, taskId, title, description)}
                    />
                </div>
            </div>
        </div>
    )
}

export default TasksPage