import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

type Mode = 'login' | 'register';

interface AuthFormValues {
    username: string;
    password: string;
}

interface LocationState {
    from?: { pathname?: string };
}

const AuthPage = () => {
    const [mode, setMode] = useState<Mode>('login');
    const { login, register: registerAccount } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AuthFormValues>();

    const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/tasks';

    const onSubmit = async (values: AuthFormValues) => {
        try {
            if (mode === 'login') {
                await login(values);
            } else {
                await registerAccount(values);
            }
            navigate(redirectTo, { replace: true });
        } catch (error) {
            const fallback = mode === 'login' ? 'Invalid username or password.' : 'Could not create account.';
            const message =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;
            toast.error(message);
        }
    };

    const switchMode = () => {
        setMode((current) => (current === 'login' ? 'register' : 'login'));
        reset();
    };

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.card}>
                    <h1 className={styles.title}>{mode === 'login' ? 'Welcome back' : 'Create an account'}</h1>
                    <p className={styles.subtitle}>
                        {mode === 'login'
                            ? 'Sign in to see your tasks.'
                            : 'Set up an account to start tracking tasks.'}
                    </p>

                    <form key={mode} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
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
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'At least 8 characters' },
                                })}
                            />
                            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
                        </label>

                        <button className={styles.submit} type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
                        </button>
                    </form>

                    <button className={styles.switch} type="button" onClick={switchMode}>
                        {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
