'use client';
import { useState, useEffect } from 'react';

export const useUser = () => {
  const [user, setUser] = useState<any>(null);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user || null);
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();

    // Listen for storage changes in other tabs/windows
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'token') fetchUser();
    };

    // Listen for login event in the same tab
    const handleLogin = () => fetchUser();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('login', handleLogin);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('login', handleLogin);
    };
  }, []);

  return { user, fetchUser, setUser };
};
