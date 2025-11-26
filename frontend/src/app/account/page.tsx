'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import styles from './account.module.css';

interface Profile {
  _id: string;
  email: string;
  role: string;
}

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/auth/profile')
      .then(res => {
        if (!active) return;
        setProfile(res.data);
        setEmail(res.data.email);
        setError(null);
      })
      .catch(err => {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load profile');
        setProfile(null);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setUpdating(true);
    try {
      const updates: any = { email };
      if (password) {
        updates.password = password;
      }

      const res = await api.patch('/auth/profile', updates);
      setProfile(res.data);
      setSuccess('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Account Information</h1>
      {loading && <p>Loading profile...</p>}
      {error && !loading && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      {!loading && profile && (
        <>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.label}>Email </span>
              <span>{profile.email}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Role</span>
              <span className={styles.role}>{profile.role}</span>
            </div>
          </div>

          <section className={styles.passwordSection}>
            <h2>Update Profile</h2>
            <p className={styles.note}>Update your email address or change your password. Leave password fields empty to keep current password.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={updating}>
                {updating ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </section>
        </>
      )}

      <div className={styles.back}>
        <Link href="/">← Back to Home</Link>
      </div>
    </div>
  );
}
