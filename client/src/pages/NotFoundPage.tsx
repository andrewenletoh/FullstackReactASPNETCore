import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <div className={styles.banner}>
                <h1>404 - Page Not Found</h1>
            </div>
        </div>
    )
}

export default NotFoundPage