// src/pages/auth/Register.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getReadableError } from '@/lib/errors';

export function Register() {
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    business_name: '', kra_pin: '', full_name: '',
    email: '', phone: '', password: '',
  });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      setDone(true);
    } catch (err) {
      setError(getReadableError(err));
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
        <div className="bg-card rounded-xl p-8 max-w-sm text-center shadow-lg">
          <h1 className="font-display font-bold text-xl text-body mb-2 tracking-tight">Check your email</h1>
          <p className="text-sm text-slate font-body mb-6">
            We sent a verification link to <strong>{form.email}</strong>. Click it to activate your account.
          </p>
          <Link to="/login">
            <Button variant="secondary" className="w-full">Back to login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
            <span className="text-midnight font-display font-bold text-sm">M</span>
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">ManifestHQ</span>
        </div>

        <div className="bg-card rounded-xl p-7 shadow-lg">
          <h1 className="font-display font-bold text-xl text-body mb-1 tracking-tight">Create your agency account</h1>
          <p className="text-sm text-muted font-body mb-6">Start tracking shipments in minutes.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Business name" required value={form.business_name}
              onChange={(e) => update('business_name', e.target.value)} placeholder="JK Clearing & Forwarding" />
            
            <Input label="KRA Customs Agent PIN" required mono value={form.kra_pin}
              onChange={(e) => update('kra_pin', e.target.value)} placeholder="A012345678B" />
            
            <Input label="Your full name" required value={form.full_name}
              onChange={(e) => update('full_name', e.target.value)} placeholder="James Kariuki" />
            
            <Input label="Email address" type="email" required value={form.email}
              onChange={(e) => update('email', e.target.value)} placeholder="you@agency.co.ke" />
            
            <Input label="Phone number" required prefix="+254" value={form.phone}
              onChange={(e) => update('phone', e.target.value)} placeholder="712345678" />
            
            <Input label="Password" type="password" required value={form.password}
              onChange={(e) => update('password', e.target.value)}
              hint="At least 8 characters, one uppercase letter, one number, one symbol." />

            {error && (
              <p className="text-sm text-red font-body bg-red-pale border border-red/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-sm text-center mt-5 font-body text-slate">
            Already have an account?{' '}
            <Link to="/login" className="text-teal hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}