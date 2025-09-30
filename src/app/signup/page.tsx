'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  PageWrapper,
  LeftPanel,
  RightPanel,
  FormContainer,
  InputGroup,
  Input,
  Select,
  Button,
  GoogleButton,
} from '@/app/common/styledComponents';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [loading, setLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Signup failed');
      } else {
        localStorage.setItem('token', data.token);
        toast.success('Account created successfully 🎉');

        // Show loading screen
        setShowLoadingScreen(true);

        // Simulate short delay before redirecting
        setTimeout(() => {
          router.push('/profile/setup');
        }, 1500); // 1.5s loading screen
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast('Google signup not yet implemented', { icon: '⚠️' });
  };

  return (
    <>
      {/* Toast container */}
      <Toaster position="bottom-center" reverseOrder={false} />

      <PageWrapper>
        {/* Left Image Panel */}
        <LeftPanel>
          <Image
            src="/images/logo.png"
            alt="Hajira Logo"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </LeftPanel>

        {/* Right Signup Panel */}
        <RightPanel>
          <FormContainer
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Create Your Account</h2>

            <InputGroup>
              <FaUser className="icon" />
              <Input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <FaEnvelope className="icon" />
              <Input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <FaLock className="icon" />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <Button type="submit" loading={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>

            <GoogleButton type="button" onClick={handleGoogleSignup}>
              <FaGoogle /> Sign up with Google
            </GoogleButton>

            <p style={{ marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
              Already have an account?{' '}
              <span
                style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => router.push('/signin')}
              >
                Sign in
              </span>
            </p>
          </FormContainer>
        </RightPanel>

        {/* Loading Screen Overlay */}
        {showLoadingScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.85)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            Loading setup page...
          </motion.div>
        )}
      </PageWrapper>
    </>
  );
}
