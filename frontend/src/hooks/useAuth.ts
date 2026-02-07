import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { client } from '../lib/sdk';

export function useAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    try {
      await client.login(email, password);
      navigate({ to: '/dashboard' });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    try {
      await client.register(email, password);
      // Auto login after register
      await client.login(email, password);
      navigate({ to: '/dashboard' });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    error,
    isLoading,
    setError
  };
}
