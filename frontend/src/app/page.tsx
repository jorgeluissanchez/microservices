'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import PlaceCard from '@/components/PlaceCard';
import styles from './page.module.css';

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReservations, setUserReservations] = useState([]);

  useEffect(() => {
    api.get('/places')
      .then(res => {
        setPlaces(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch user reservations
    api.get('/reservations/user/me')
      .then(res => setUserReservations(res.data))
      .catch(() => setUserReservations([]));
  }, []);

  if (loading) return <div className={styles.loading}>Loading places...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Find your next stay</h1>
        <p className={styles.subtitle}>Explore the best places for your vacation</p>
      </header>

      <div className={styles.grid}>
        {places.map((place: any) => {
          const hasReservation = userReservations.some(
            (r: any) => r.placeId === place._id && r.status === 'CONFIRMED'
          );
          return <PlaceCard key={place._id} place={place} hasReservation={hasReservation} />;
        })}
      </div>
    </div>
  );
}
