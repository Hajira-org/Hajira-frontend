'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useDashboardRedirect = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // ensure we are in browser

  useEffect(() => {
    setIsClient(true);
  }, []);

  const goToDashboard = () => {
    if (!isClient) return; // prevent SSR issues

    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (!token) {
        router.push('/signin');
        return;
      }

      if (role === 'seeker') {
        router.push('/dashboard');
      } else if (role === 'poster') {
        router.push('/poster/dashboard');
      } else {
        router.push('/signin');
      }
    } catch (err) {
      console.error('Error accessing localStorage', err);
      router.push('/signin');
    }
  };

  return { goToDashboard, isClient };
};
