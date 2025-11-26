'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function PaymentCancel() {
    const router = useRouter();
    const [placeId, setPlaceId] = useState<string | null>(null);

    useEffect(() => {
        const storedPlaceId = sessionStorage.getItem('lastReservationPlaceId');
        if (storedPlaceId) {
            setPlaceId(storedPlaceId);
        }
    }, []);

    const handleContinuePurchase = () => {
        if (placeId) {
            router.push(`/places/${placeId}`);
        } else {
            router.push('/');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.icon}>✕</div>
                <h1 className={styles.title}>Payment Cancelled</h1>
                <p className={styles.message}>
                    Your payment has been cancelled. No charges were made to your account.
                </p>
                <div className={styles.actions}>
                    <button onClick={handleContinuePurchase} className={styles.buttonPrimary}>
                        Continue Purchase
                    </button>
                    <Link href="/" className={styles.buttonSecondary}>
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
