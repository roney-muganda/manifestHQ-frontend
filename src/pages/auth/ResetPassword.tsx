// src/pages/auth/ResetPassword.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api'; // Corrected import path
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getReadableError } from '@/lib/errors';

export function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/password-reset/confirm', { token, new_password: password });
      // Optionally, you could trigger a success toast here before navigating!
      navigate('/login');
    } catch (err) {
      setError(getReadableError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
      <div className="bg-card rounded-xl p-7 max-w-sm w-full shadow-lg">
        <h1 className="font-display font-bold text-lg text-body mb-1 tracking-tight">Choose a new password</h1>
        <p className="text-sm text-muted font-body mb-6">
          At least 8 characters, one uppercase letter, one number.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="New password" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)} />
          
          {error && (
            <p className="text-sm text-red font-body bg-red-pale border border-red/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          
          <Button type="submit" loading={loading} className="w-full">Update Password</Button>
        </form>
      </div>
    </div>
  );
}