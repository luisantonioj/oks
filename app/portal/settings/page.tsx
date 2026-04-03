import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Settings, Shield, Database, Bell, Key, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminSignOut } from '@/app/actions/auth';

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  if (cookieStore.get('oks_admin_session')?.value !== 'authenticated') redirect('/login-portal');

  const adminName = process.env.ADMIN_NAME || 'Administrator';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dlsl.edu.ph';

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-muted-foreground" />System Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage admin configuration and system preferences.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Shield className="h-4 w-4" />Admin Account
        </h2>
        <div className="rounded-lg border bg-card shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-lg font-bold text-red-600">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{adminName}</p>
              <p className="text-sm text-muted-foreground">{adminEmail}</p>
              <p className="text-xs text-red-600 font-medium mt-0.5">System Administrator</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Admin credentials are configured via environment variables. To change the admin password, update <code className="bg-muted px-1 py-0.5 rounded text-xs">ADMIN_PASSWORD</code> and redeploy.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Database className="h-4 w-4" />System Information
        </h2>
        <div className="rounded-lg border bg-card shadow-sm divide-y">
          {[
            { label: 'Application', value: 'Operation Keep Safe (OKS!)' },
            { label: 'Institution', value: 'De La Salle Lipa' },
            { label: 'Version', value: '1.0.0' },
            { label: 'Framework', value: 'Next.js 16 + Supabase' },
            { label: 'Environment', value: process.env.NODE_ENV || 'development' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Bell className="h-4 w-4" />Features
        </h2>
        <div className="rounded-lg border bg-card shadow-sm divide-y">
          {['Crisis Management','Announcements','Help Requests (SOS)','Surveys','Donations Tracking','Volunteer Coordination'].map((f) => (
            <div key={f} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm">{f}</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-full px-2 py-0.5">Enabled</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-red-500 flex items-center gap-2">
          <Key className="h-4 w-4" />Session
        </h2>
        <div className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Sign out of admin session</p>
            <p className="text-xs text-muted-foreground mt-0.5">You will need to re-enter credentials to access the admin portal.</p>
          </div>
          <form action={adminSignOut}>
            <Button type="submit" variant="outline" size="sm" className="gap-1.5 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700">
              <LogOut className="h-3.5 w-3.5" />Sign Out
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}