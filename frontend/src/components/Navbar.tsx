'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        api.get('/auth/profile')
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    PlaceRes
                </Link>
                <div className={styles.links}>
                    {user ? (
                        <>
                            <span className={styles.welcome}>Hello, {user.email}</span>
                            {user.role === 'admin' && (
                                <Link href="/admin/places/new" className={styles.link}>
                                    Add Place
                                </Link>
                            )}
                            <Link href="/account" className={styles.accountLink}>
                                Account
                            </Link>
                            <button onClick={handleLogout} className={styles.link} style={{ cursor: 'pointer' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.link}>
                                Login
                            </Link>
                            <Link href="/register" className={styles.link}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
