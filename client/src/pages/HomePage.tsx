import GitRepos from '../components/repo/Repo';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
    return (
        <main className={styles.page}>
            <div
                className={styles.spacer}
                aria-hidden="true"
            />
            <section
                className={styles.content}
                aria-label="Introduction"
            >
                <div className={styles.intro}>
                    <h1 className={styles.introHeader1}>
                        Andrew
                        <br />
                        Toh
                    </h1>
                    <h2 className={styles.introHeader2}>Software Engineer | Working with Machines</h2>
                    <p className={styles.introText}> I throw all my random stuff here.</p>
                </div>
                <div
                    className={styles.introPortrait}
                    aria-hidden="true"
                />
            </section>
            <section
                className={styles.projects}
                data-navbar-theme="dark"
                aria-labelledby="recent-projects-heading"
            >
                <div className={styles.projectsContent}>
                    <h2
                        id="recent-projects-heading"
                        className={styles.projectsHeader1}
                    >
                        Recent Projects
                    </h2>
                    <GitRepos
                        userName="andrewenletoh"
                        numOfrepos={3}
                        showLanguage={true}
                    />
                </div>
            </section>
            <div className={styles.spacer} />
        </main>
    )
}

export default HomePage