import { getCurrentUserProfile } from '@/lib/queries/user';
import { getAnnouncements } from '@/lib/queries/announcement';
import { getActiveCrises } from '@/lib/queries/crisis';
import { redirect } from 'next/navigation';
import { InboxClient } from '@/app/(protected)/inbox/InboxClient';

export default async function InboxPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/login');

  const [announcements, crises] = await Promise.all([
    getAnnouncements(),
    getActiveCrises(),
  ]);

  return (
    <InboxClient
      announcements={announcements}
      crises={crises}
      userRole={profile.role}
    />
  );
}