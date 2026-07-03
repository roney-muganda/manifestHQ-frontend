// src/pages/auth/ForgotPassword.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api'; // Corrected import path
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/password-reset/request', { email });
    } finally {
      // Always show success to prevent email enumeration attacks
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
      <div className="bg-card rounded-xl p-7 max-w-sm w-full shadow-lg">
        {sent ? (
          <>
            <h1 className="font-display font-bold text-lg text-body mb-2 tracking-tight">Check your email</h1>
            <p className="text-sm text-slate font-body mb-6">
              If <strong>{email}</strong> is registered, you will receive a password reset link shortly.
            </p>
            <Link to="/login"><Button variant="secondary" className="w-full">Back to login</Button></Link>
          </>
        ) : (
          <>
            <h1 className="font-display font-bold text-lg text-body mb-1 tracking-tight">Reset your password</h1>
            <p className="text-sm text-muted font-body mb-6">
              Enter your email and we will send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email address" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}