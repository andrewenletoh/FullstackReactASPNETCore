import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Edit3, Save, Trash, X } from 'lucide-react';

import styles from './TaskCard.module.css';
import type { BackendTask } from './taskBoard.types';

type TaskCardProps = {
    task: BackendTask;
    onDragStart: () => void;
    onDelete: () => void;
    onEdit: (title: string, description: string) => Promise<void>;
    expandAll: boolean;
};

function TaskCard({ task, onDragStart, onDelete, onEdit, expandAll }: TaskCardProps) {
    const [isDeleteWarningVisible, setDeleteWarningVisible] = useState(false);
    const [isExpanded, setExpanded] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);
    const [isSaving, setSaving] = useState(false);

    useEffect(() => {
        setExpanded(expandAll);
    }, [expandAll]);

    const startEditing = () => {
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditing(true);
        setExpanded(true);
    };

    const cancelEditing = () => {
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditing(false);
    };

    const saveEditing = async () => {
        if (editTitle.trim() === '' || editDescription.trim() === '') return;

        setSaving(true);
        try {
            await onEdit(editTitle.trim(), editDescription.trim());
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    return (
        <article
            className={styles.taskCard}
            draggable
            onDragStart={onDragStart}
            onDoubleClick={() => setExpanded(!isExpanded)}
            aria-labelledby={`task-title-${task.id}`}
        >
            <h3 className={styles.cardHeader}>{task.title}</h3>
            <div
                className={`${styles.expandedContent}
                ${isExpanded ? styles.expanded : ''}`}
            >
                {isEditing ? (
                    <div
                        className={styles.editFields}
                        onDoubleClick={(event) => event.stopPropagation()}
                    >
                        <input
                            className={styles.editInput}
                            value={editTitle}
                            onChange={(event) => setEditTitle(event.target.value)}
                            aria-label="Task title"
                        />
                        <textarea
                            className={styles.editDescription}
                            value={editDescription}
                            onChange={(event) => setEditDescription(event.target.value)}
                            maxLength={32767}
                            aria-label="Task description"
                        />
                        <div className={styles.editActions}>
                            <button
                                className={styles.saveButton}
                                type="button"
                                onClick={() => void saveEditing()}
                                disabled={isSaving}
                            >
                                <Save aria-hidden="true" />
                                <span>{isSaving ? 'Saving...' : 'Save'}</span>
                            </button>
                            <button
                                className={styles.cancelEditButton}
                                type="button"
                                onClick={cancelEditing}
                                disabled={isSaving}
                            >
                                <X aria-hidden="true" />
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className={styles.description}>{task.description || 'No description provided.'}</p>
                        <div className={styles.detailActions}>
                            <button
                                className={styles.editButton}
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    startEditing();
                                }}
                                aria-label={`Edit ${task.title}`}
                                title="Edit task"
                            >
                                <Edit3 aria-hidden="true" />
                                <span>Edit</span>
                            </button>
                            {isDeleteWarningVisible ? (
                                <div
                                    className={styles.deleteWarning}
                                    role="alert"
                                >
                                    <AlertTriangle
                                        className={styles.warningIcon}
                                        aria-hidden="true"
                                    />
                                    <span>Delete this task?</span>
                                    <button
                                        className={styles.confirmDeleteButton}
                                        onClick={onDelete}
                                        type="button"
                                        aria-label="Confirm delete task"
                                        title="Delete task"
                                    >
                                        <Check aria-hidden="true" />
                                    </button>
                                    <button
                                        className={styles.cancelDeleteButton}
                                        onClick={() => setDeleteWarningVisible(false)}
                                        type="button" aria-label="Cancel delete task"
                                        title="Cancel"
                                    >
                                        <X aria-hidden="true" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => setDeleteWarningVisible(true)}
                                    type="button"
                                    aria-label="Delete task"
                                    title="Delete task"
                                >
                                    <Trash aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </article>
    );
}

export default TaskCard;
