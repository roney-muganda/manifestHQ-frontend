// src/pages/settings/Settings.tsx
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';
import { useUIStore } from '@/store/uiStore';
import { getReadableError } from '@/lib/errors';

export function Settings() {
  const { user, agent } = useAuthStore();
  const { showToast } = useUIStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      showToast('Password changed successfully. Please log in again.', 'success');
      setCurrentPassword(''); 
      setNewPassword('');
    } catch (err) {
      showToast(getReadableError(err), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account and business profile." />

      <div className="bg-card rounded-lg border border-border p-6 space-y-3">
        <h3 className="text-xs font-semibold text-muted font-body uppercase tracking-wide">Profile</h3>
        <div className="text-sm font-body">
          <p className="text-body font-semibold">{user?.name}</p>
          <p className="text-muted">{user?.email}</p>
          <p className="text-muted mt-1">
            {agent?.business_name} · <span className="capitalize">{agent?.plan_tier}</span> plan
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-xs font-semibold text-muted font-body uppercase tracking-wide mb-4">Change Password</h3>
        <form onSubmit={changePassword} className="space-y-4">
          <Input 
            label="Current password" 
            type="password" 
            required
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
          />
          <Input 
            label="New password" 
            type="password" 
            required
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />
          <Button type="submit" loading={loading}>Update Password</Button>
        </form>
      </div>
    </div>
  );
}