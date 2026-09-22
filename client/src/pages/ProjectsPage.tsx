import styles from './ProjectsPage.module.css';
import GitRepos from '../components/repo/Repo';


const ProjectsPage: React.FC = () => {
    return (
        <main className={styles.page}>
            <div
                className={styles.spacer}
                aria-hidden="true"
            />
            <section className={styles.content}>
                <h1 className={styles.header}>Projects</h1>
                <div className={styles.reposContainer}>
                    <GitRepos
                        userName="andrewenletoh"
                        numOfrepos={3}
                        showLanguage={true}
                        theme="light"
                    />
                </div>
            </section>
        </main>
    )
}

export default ProjectsPage