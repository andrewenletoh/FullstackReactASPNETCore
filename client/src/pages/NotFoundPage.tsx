import styles from './NotFoundPage.module.css';
import DotGridBackground from '../components/background/Background';


const NotFoundPage: React.FC = () => {
    return (
        <main className={styles.page}>
            <DotGridBackground theme="light" />
            <div className={styles.banner}>
                <h1>404 - Page Not Found</h1>
            </div>
        </main>


    )
}

export default NotFoundPage