import { BookMarked, House, Menu, Link, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './NavBar.module.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkBackground, setIsDarkBackground] = useState(false);

    useEffect(() => {
        const updateNavbarTheme = () => {
            const navbarCenter = window.innerHeight * 0.05;
            const darkSections = document.querySelectorAll<HTMLElement>('[data-navbar-theme="dark"]');
            const isDark = Array.from(darkSections).some((section) => {
                const bounds = section.getBoundingClientRect();
                return bounds.top <= navbarCenter && bounds.bottom >= navbarCenter;
            });

            setIsDarkBackground(isDark);
        };

        updateNavbarTheme();
        window.addEventListener('scroll', updateNavbarTheme, { passive: true });
        window.addEventListener('resize', updateNavbarTheme);

        return () => {
            window.removeEventListener('scroll', updateNavbarTheme);
            window.removeEventListener('resize', updateNavbarTheme);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMenuOpen]);

    return (
        <header className={`${styles.header} ${isDarkBackground ? styles.darkBackground : ''}`}>
            <div className={styles.bar}>
                <div className={styles.content}>
                    {/* Home Icon */}
                    <div className={styles.brandSlot}>
                        <NavLink
                            to='/'
                            className={({ isActive }) => `${styles.iconLink} ${isActive ? styles.hidden : ''}`}
                        >
                            <House className={styles.icon} aria-hidden="true" />
                        </NavLink>
                    </div>

                    <nav className={styles.centerSlot}>
                        {/* Desktop Navigation */}
                        <nav className={styles.desktopNav}>
                            <div className={styles.navLinks}>
                                <NavLink
                                    to='/tasks'
                                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    tasks
                                </NavLink>

                                <NavLink
                                    to='/projects'
                                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    projects
                                </NavLink>

                                <NavLink
                                    to='/agent'
                                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    agent
                                </NavLink>
                            </div>
                        </nav>

                        {/* Mobile menu button */}
                        <div className={styles.mobileMenuButton}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={styles.menuButton}
                                aria-expanded={isMenuOpen}
                            >
                                <span className={styles.srOnly}>Open main menu</span>
                                {isMenuOpen ? (
                                    <X className={styles.mobileIcon} aria-hidden="true" />
                                ) : (
                                    <Menu className={styles.mobileIcon} aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </nav>

                    <div className={styles.socialLinks}>
                        <a
                            href="https://www.linkedin.com/in/andrew-toh-20126557/"
                            target="_blank"
                            className={styles.iconLink}
                        >
                            <Link className={styles.icon} aria-hidden="true" />
                        </a>
                        <a
                            href="https://github.com/andrewenletoh?tab=repositories"
                            target="_blank"
                            className={styles.iconLink}
                        >
                            <BookMarked className={styles.icon} aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuOpen : ''}`}
            >
                <div className={styles.mobileMenuContent}>
                    <NavLink
                        to="/tasks"
                        className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                    >
                        tasks
                    </NavLink>

                    <NavLink
                        to="/projects"
                        className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                    >
                        projects
                    </NavLink>

                    <NavLink
                        to="/agent"
                        className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                    >
                        agent
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
