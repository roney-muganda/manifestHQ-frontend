// src/pages/auth/VerifyEmail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api'; // Corrected import path
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/api/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch((e) => {
        setStatus('error');
        setMessage(e.response?.data?.detail || 'This link is invalid or has expired.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
      <div className="bg-card rounded-xl p-8 max-w-sm text-center shadow-lg">
        {status === 'loading' && <Loader2 className="w-10 h-10 text-teal animate-spin mx-auto mb-4" />}
        {status === 'success' && <CheckCircle2 className="w-10 h-10 text-green mx-auto mb-4" />}
        {status === 'error' && <XCircle className="w-10 h-10 text-red mx-auto mb-4" />}

        <h1 className="font-display font-bold text-lg text-body mb-2 tracking-tight">
          {status === 'loading' && 'Verifying your email...'}
          {status === 'success' && 'Email verified!'}
          {status === 'error' && 'Verification failed'}
        </h1>
        <p className="text-sm text-slate font-body mb-6">
          {status === 'success' && 'You can now log in to your ManifestHQ account.'}
          {status === 'error' && message}
        </p>

        {status !== 'loading' && (
          <Link to="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}