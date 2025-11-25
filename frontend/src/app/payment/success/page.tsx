'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function PaymentSuccess() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.icon}>🎉</div>
                <h1 className={styles.title}>Payment Successful!</h1>
                <p className={styles.message}>Your reservation has been confirmed.</p>
                <Link href="/" className={styles.link}>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
