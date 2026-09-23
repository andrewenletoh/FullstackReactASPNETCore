import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookMarked, House, Menu, Link, LogIn, LogOut, X } from 'lucide-react';
import styles from './NavBar.module.css';
import { useAuth } from '../../context/AuthContext';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkBackground, setIsDarkBackground] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // Detect when navbar enters a different section that is light or dark
        const intersectingSections = new Set<Element>();
        const recomputeIsDark = () => setIsDarkBackground(intersectingSections.size > 0);
        let observer: IntersectionObserver;

        const observeSections = () => {
            const lineY = window.innerHeight * 0.05;
            const bandHalfHeight = 1;
            const topMargin = Math.round(lineY - bandHalfHeight);
            const bottomMargin = Math.round(window.innerHeight - lineY - bandHalfHeight);
            const rootMargin = `-${topMargin}px 0px -${bottomMargin}px 0px`;
            observer = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        intersectingSections.add(entry.target);
                    } else {
                        intersectingSections.delete(entry.target);
                    }
                }
                recomputeIsDark();
            }, { rootMargin });

            document.querySelectorAll<HTMLElement>('[data-navbar-theme="dark"]').forEach((section) => {
                observer.observe(section);
            });
        };

        observeSections();

        // On screen resize, need to adjust detection line's position or page change
        const handleResize = () => {
            observer.disconnect();
            intersectingSections.clear();
            observeSections();
        };

        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, [location.pathname]);

    return (
        <header
            className={`${styles.header}
            ${isDarkBackground ? styles.darkBackground : ''}`}
        >
            <div className={styles.bar}>
                <div className={styles.content}>
                    {/* Home Icon */}
                    <div className={styles.brandSlot}>
                        <NavLink
                            to='/'
                            className={({ isActive }) => `${styles.iconLink} ${isActive ? styles.hidden : ''}`}
                            aria-label="Home"
                        >
                            <House className={styles.icon} aria-hidden="true" />
                        </NavLink>
                    </div>

                    <nav className={styles.centerSlot}>
                        {/* Desktop Navigation */}
                        <nav className={styles.desktopNav}
                            aria-label="Primary"
                        >
                            <ul className={styles.navLinks}>
                                <li>
                                    <NavLink
                                        to='/tasks'
                                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                    >
                                        tasks
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to='/projects'
                                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                    >
                                        projects
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to='/agent'
                                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                    >
                                        agent
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>

                        {/* Mobile menu button */}
                        <div className={styles.mobileMenuButton}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={styles.menuButton}
                                aria-expanded={isMenuOpen}
                                aria-controls="mobile-nav"
                            >
                                {isMenuOpen ? (
                                    <X
                                        className={styles.mobileIcon}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <Menu
                                        className={styles.mobileIcon}
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </div>
                    </nav>

                    <ul className={styles.socialLinks}>
                        <li>
                            <a
                                href="https://www.linkedin.com/in/andrew-toh-20126557/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.iconLink}
                                aria-label="LinkedIn profile"
                            >
                                <Link className={styles.icon} aria-hidden="true" />
                            </a>
                        </li>

                        <li>
                            <a
                                href="https://github.com/andrewenletoh?tab=repositories"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.iconLink}
                                aria-label="GitHub repositories"
                            >
                                <BookMarked
                                    className={styles.icon}
                                    aria-hidden="true"
                                />
                            </a>
                        </li>
                        <li>
                            {user ? (
                                <button
                                    type="button"
                                    onClick={() => logout()}
                                    className={styles.iconLink}
                                    aria-label={`Sign out (${user.username})`}
                                    title={`Sign out (${user.username})`}
                                >
                                    <LogOut className={styles.icon} aria-hidden="true" />
                                </button>
                            ) : (
                                <NavLink
                                    to="/auth"
                                    className={styles.iconLink}
                                    aria-label="Sign in"
                                    title="Sign in"
                                >
                                    <LogIn className={styles.icon} aria-hidden="true" />
                                </NavLink>
                            )}

                        </li>
                    </ul>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <nav
                id="mobile-nav"
                className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuOpen : ''}`}
                aria-label="Mobile"
                aria-hidden={!isMenuOpen}

            >
                <div className={styles.mobileMenuContent}>
                    <NavLink
                        to="/tasks"
                        className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                        tabIndex={isMenuOpen ? undefined : -1}
                    >
                        tasks
                    </NavLink>

                    <NavLink
                        to="/projects"
                        className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                        tabIndex={isMenuOpen ? undefined : -1}
                    >
                        projects
                    </NavLink>

                    <NavLink
                        to="/agent"
                        className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                        tabIndex={isMenuOpen ? undefined : -1}
                    >
                        agent
                    </NavLink>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
