// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 text-center">
      <div>
        <p className="font-data text-5xl font-bold text-teal mb-3 tracking-tighter">404</p>
        <p className="text-lg font-display font-bold text-body mb-2 tracking-tight">Page not found</p>
        <p className="text-sm text-slate font-body mb-6">The page you are looking for does not exist.</p>
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}