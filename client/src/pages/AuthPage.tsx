import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';
import { useAuth } from '../context/AuthContext';


interface AuthFormValues {
    username: string;
    password: string;
}

interface LocationState {
    from?: { pathname?: string };
}

const AuthPage = () => {
    const { login/*, register: registerAccount*/ } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AuthFormValues>();

    const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/tasks';

    const onSubmit = async (values: AuthFormValues) => {
        try {
            await login(values);
            navigate(redirectTo, { replace: true });
        } catch (error) {
            const fallback = 'Invalid username or password.';
            const message =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;
            toast.error(message);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Sign in to see your tasks.'</p>

                    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                        <label className={styles.field}>
                            <span className={styles.label}>Username</span>
                            <input
                                className={styles.input}
                                type="text"
                                autoComplete="username"
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: { value: 3, message: 'At least 3 characters' },
                                })}
                            />
                            {errors.username && <span className={styles.error}>{errors.username.message}</span>}
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Password</span>
                            <input
                                className={styles.input}
                                type="password"
                                autoComplete={'current-password'}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'At least 8 characters' },
                                })}
                            />
                            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
                        </label>

                        <button className={styles.submit} type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Please wait…' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
