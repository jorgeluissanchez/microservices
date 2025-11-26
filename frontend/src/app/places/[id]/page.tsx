'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import styles from './page.module.css';

export default function PlaceDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [place, setPlace] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [userReservation, setUserReservation] = useState<any>(null);

    useEffect(() => {
        // Fetch place details
        api.get(`/places/${id}`)
            .then(res => {
                setPlace(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        // Fetch user profile
        api.get('/auth/profile')
            .then(res => setUser(res.data))
            .catch(() => setUser(null));

        // Fetch user reservations
        api.get('/reservations/user/me')
            .then(res => {
                // Check if user has a reservation for this place
                const reservation = res.data.find((r: any) => r.placeId === id && r.status === 'CONFIRMED');
                setUserReservation(reservation);
            })
            .catch(err => {
                console.log('Could not fetch reservations:', err);
            });
    }, [id]);

    const handleReservation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            router.push('/login');
            return;
        }

        try {
            // Calculate amount (simple calculation for now, backend should validate)
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            if (days <= 0) {
                setError('End date must be after start date');
                return;
            }

            const amount = days * place.pricePerDay;

            const res = await api.post('/reservations', {
                placeId: place._id,
                startDate,
                endDate,
                amount,
                currency: 'usd',
                customerEmail: user.email,
            });

            // Redirect to Stripe payment URL
            if (res.data.paymentUrl) {
                sessionStorage.setItem('lastReservationPlaceId', place._id);
                window.location.href = res.data.paymentUrl;
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Reservation failed. Please login first.');
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!place) return <div className={styles.loading}>Place not found</div>;

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img src={place.images[0] || 'https://via.placeholder.com/800x400'} alt={place.name} className={styles.image} />
            </div>

            <div className={styles.content}>
                <div className={styles.details}>
                    <h1 className={styles.title}>{place.name}</h1>
                    <p className={styles.location}>{place.city}, {place.country}</p>
                    <p className={styles.description}>{place.description}</p>

                    <div className={styles.amenities}>
                        <h3>Amenities</h3>
                        <ul>
                            {place.amenities.map((amenity: string, index: number) => (
                                <li key={index}>{amenity}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.reservationCard}>
                    <h2 className={styles.price}>${place.pricePerDay} <span className={styles.perNight}>/ night</span></h2>
                    {userReservation && (
                        <div className={styles.reservationNotice}>
                            <h3>✓ You have a reservation here</h3>
                            <p>Check-in: {new Date(userReservation.startDate).toLocaleDateString()}</p>
                            <p>Check-out: {new Date(userReservation.endDate).toLocaleDateString()}</p>
                            <p>Status: <strong>{userReservation.status}</strong></p>
                        </div>
                    )}
                    {error && <div className={styles.error}>{error}</div>}
                    <form onSubmit={handleReservation}>
                        <Input
                            label="Check-in"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                        <Input
                            label="Check-out"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                        <Button type="submit">Reserve</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
