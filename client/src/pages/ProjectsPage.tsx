import styles from './ProjectsPage.module.css';
import GitRepos from '../components/repo/Repo';

const ProjectsPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <header className={styles.spacer} />
            <main className={styles.content}>
                <h1 className={styles.header}>Projects</h1>
                <div className={styles.reposContainer}>
                    <GitRepos userName="andrewenletoh" numOfrepos={3} showLanguage={true} />
                </div>

            </main>
        </div>
    )
}

export default ProjectsPage