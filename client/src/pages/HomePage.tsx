import styles from './HomePage.module.css';
import GitRepos from '../components/repo/Repo';


const HomePage: React.FC = () => {
    return (
        <main>
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
                    <h2 className={styles.introHeader2}>Build Things. Help People.</h2>
                    <p className={styles.introText}> I throw all my random stuff here.</p>
                </div>
                <div
                    className={styles.terminalCard}
                    aria-hidden="true"
                >
                    <p className={styles.terminalPath}>~/andrew</p>
                    <p className={styles.terminalLine}>
                        <span className={styles.terminalPrompt}>$</span> whoami
                    </p>
                    <p className={styles.terminalOutput}>&gt; software engineer</p>
                    <p className={styles.terminalLine}>
                        <span className={styles.terminalPrompt}>$</span> uptime
                    </p>
                    <p className={styles.terminalOutput}>&gt; 5+ yrs shipping code</p>
                    <p className={styles.terminalCursor}>&#9608;</p>
                </div>
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
                        theme="dark"
                    />
                </div>
            </section>
            <div className={styles.spacer} />
        </main>
    )
}

export default HomePage