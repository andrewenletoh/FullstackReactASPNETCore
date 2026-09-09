import GitRepos from '../components/repo/Repo';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
    return (
        <div className={styles.page}>
            <header className={styles.spacer} />
            <div className={styles.content}>
                <div className={styles.intro}>
                    <h1 className={styles.introHeader1}>Andrew</h1>
                    <h1 className={styles.introHeader1}>Toh</h1>
                    <h2 className={styles.introHeader2}>Software Slave | AI Chattel</h2>
                    <p className={styles.introText}> I throw all my random stuff here.</p>
                </div>
                <div className={styles.introPortrait} />
            </div>
            <div className={styles.projects} data-navbar-theme="dark">
                <div className={styles.projectsContent}>
                    <h1 className={styles.projectsHeader1}>Recent Projects</h1>
                    <GitRepos userName="andrewenletoh" numOfrepos={3} showLanguage={true} />
                </div>
            </div>
        </div>
    )
}

export default HomePage