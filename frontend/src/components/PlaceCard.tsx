import Link from 'next/link';
import styles from './PlaceCard.module.css';

interface Place {
    _id: string;
    name: string;
    description: string;
    city: string;
    country: string;
    pricePerDay: number;
    images: string[];
}

export default function PlaceCard({ place, hasReservation }: { place: Place; hasReservation?: boolean }) {
    return (
        <Link href={`/places/${place._id}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {hasReservation && (
                    <div className={styles.reservationBadge}>
                        ✓ Reserved
                    </div>
                )}
                <img src={place.images[0] || 'https://via.placeholder.com/400'} alt={place.name} className={styles.image} />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{place.name}</h3>
                <p className={styles.location}>{place.city}, {place.country}</p>
                <p className={styles.price}>${place.pricePerDay} / night</p>
            </div>
        </Link>
    );
}
