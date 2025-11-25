'use client';

import Link from 'next/link';
import styles from '../success/page.module.css';

export default function PaymentFail() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.icon}>❌</div>
                <h1 className={styles.title}>Payment Failed</h1>
                <p className={styles.message}>Something went wrong with your payment.</p>
                <Link href="/" className={styles.link}>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
