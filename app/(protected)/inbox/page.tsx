import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';

export default async function StakeholderInboxPage() {
  redirect(routes.stakeholder.inbox);
}
