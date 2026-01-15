// app/protected/stakeholder/dashboard/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getCrisisSummary, getDashboardStats } from '@/lib/queries/crisis';
import { getRecentAnnouncements } from '@/lib/queries/announcement';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function StakeholderDashboard() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/auth/login');
  }

  if (profile.role !== 'stakeholder') {
    redirect(`/protected/${profile.role}/dashboard`);
  }

  const [stats, crisisSummary, announcements] = await Promise.all([
    getDashboardStats().catch(() => ({
      totalCrises: 0,
      activeCrises: 0,
      totalHelpRequests: 0,
      pendingHelpRequests: 0,
      totalDonations: 0,
      totalVolunteers: 0,
    })),
    getCrisisSummary().catch(() => []),
    getRecentAnnouncements().catch(() => []),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Operation Keep Safe!</h1>
            <p className="text-sm text-muted-foreground">Welcome, {profile.name}</p>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/protected/stakeholder/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <form action="/api/auth/signout" method="post">
              <Button variant="outline" type="submit">Sign Out</Button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Active Crises</CardTitle>
                <CardDescription>Current emergencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.activeCrises}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Help Requests</CardTitle>
                <CardDescription>Pending assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pendingHelpRequests}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Support</CardTitle>
                <CardDescription>Volunteers & donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.totalVolunteers + stats.totalDonations}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Latest updates from the administration</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No announcements at this time.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{announcement.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {announcement.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(announcement.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          announcement.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : announcement.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {announcement.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Crises */}
          {crisisSummary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Crisis Events</CardTitle>
                <CardDescription>Current emergency situations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {crisisSummary.map((crisis) => (
                    <div key={crisis.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{crisis.type}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {crisis.summary}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Affected areas: {crisis.affected_areas.join(', ')}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          crisis.severity === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {crisis.severity} severity
                        </span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/protected/stakeholder/crisis/${crisis.id}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                        <Link href={`/protected/stakeholder/crisis/${crisis.id}/help`}>
                          <Button size="sm" variant="destructive">Request Help</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" asChild>
                  <Link href="/protected/stakeholder/survey">
                    Take Safety Survey
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/protected/stakeholder/volunteer">
                    Volunteer
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/protected/stakeholder/donate">
                    Make a Donation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}