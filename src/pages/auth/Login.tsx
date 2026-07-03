// src/pages/auth/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore'; // Corrected import
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getReadableError } from '@/lib/errors';

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(getReadableError(err));
    }
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
            <span className="text-midnight font-display font-bold text-sm">M</span>
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">ManifestHQ</span>
        </div>

        <div className="bg-card rounded-xl p-7 shadow-lg">
          <h1 className="font-display font-bold text-xl text-body mb-1 tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted font-body mb-6">Log in to your clearing agent dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.co.ke"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <p className="text-sm text-red font-body bg-red-pale border border-red/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Log In
            </Button>
          </form>

          <div className="flex items-center justify-between mt-5 text-sm font-body">
            <Link to="/forgot-password" className="text-teal hover:underline">
              Forgot password?
            </Link>
            <Link to="/register" className="text-slate hover:text-body transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}