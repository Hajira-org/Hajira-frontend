'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  PageWrapper,
  LeftPanel,
  RightPanel,
  FormContainer,
  InputGroup,
  Input,
  Button,
  GoogleButton,
} from '@/app/common/styledComponents';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

export default function SigninPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Sign in failed');
      } else {
        localStorage.setItem('token', data.token);

        toast.success('Login successful! 🎉');

        if (data.user?.role?.toLowerCase() === 'poster') {
          router.push('/poster/dashboard');
        } else if (data.user?.role?.toLowerCase() === 'seeker') {
          router.push('/dashboard');
        } else {
          toast.error('Role not recognized, cannot redirect');
        }


      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = () => {
    toast('Google sign-in not yet implemented', { icon: '⚠️' });
  };

  return (
    <>
      {/* Toast system */}

      <PageWrapper>
        {/* Left Logo Panel */}
        <LeftPanel>
          <Image
            src="/images/logo.png"
            alt="Hajira Logo"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </LeftPanel>

        {/* Right Sign In Panel */}
        <RightPanel>
          <FormContainer
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Welcome Back</h2>

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
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <GoogleButton type="button" onClick={handleGoogleSignin}>
              <FaGoogle /> Sign in with Google
            </GoogleButton>

            {/* New account link */}
            <p
              style={{
                marginTop: '1rem',
                fontSize: '0.9rem',
                textAlign: 'center',
              }}
            >
              New to Hajira?{' '}
              <span
                style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => router.push('/signup')}
              >
                Create an account
              </span>
            </p>
          </FormContainer>
        </RightPanel>
      </PageWrapper>
    </>
  );
}
