'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Input from '@/components/Input';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function NewPlace() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        city: '',
        country: '',
        capacity: '',
        pricePerDay: '',
        amenities: '',
        images: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/places', {
                ...formData,
                capacity: Number(formData.capacity),
                pricePerDay: Number(formData.pricePerDay),
                amenities: formData.amenities.split(',').map(s => s.trim()),
                images: formData.images.split(',').map(s => s.trim()),
            });
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create place');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Add New Place</h1>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
                    <div className={styles.wrapper}>
                        <label className={styles.label}>Description</label>
                        <textarea className={styles.textarea} name="description" value={formData.description} onChange={handleChange} required />
                    </div>
                    <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
                    <div className={styles.row}>
                        <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                        <Input label="Country" name="country" value={formData.country} onChange={handleChange} required />
                    </div>
                    <div className={styles.row}>
                        <Input label="Capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} required />
                        <Input label="Price per Day" name="pricePerDay" type="number" value={formData.pricePerDay} onChange={handleChange} required />
                    </div>
                    <Input label="Amenities (comma separated)" name="amenities" value={formData.amenities} onChange={handleChange} required />
                    <Input label="Images (comma separated URLs)" name="images" value={formData.images} onChange={handleChange} required />

                    <Button type="submit">Create Place</Button>
                </form>
            </div>
        </div>
    );
}
