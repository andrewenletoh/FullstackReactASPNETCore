import styles from './NotFoundPage.module.css';


const NotFoundPage: React.FC = () => {
    return (
        <main className={styles.page}>
            <div className={styles.banner}>
                <h1>404 - Page Not Found</h1>
            </div>
        </main>


    )
}

export default NotFoundPage