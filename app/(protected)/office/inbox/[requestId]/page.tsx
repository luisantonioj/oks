//app/(protected)/office/inbox/[requestId]/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getMessages } from '@/lib/queries/message';
import { redirect } from 'next/navigation';
import { MessageBubble } from '@/components/MessageBubble';
import { ChatInput } from '@/components/ChatInput';
import { ArrowLeft, MapPin, AlertTriangle, User, Building2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { OfficeProfile } from '@/types/user';

const CIO_QUICK_ACTIONS = [
  { label: 'Relief en route', text: 'Relief resources have been coordinated and are on their way to your area.' },
  { label: 'Volunteer deployed', text: 'A volunteer team has been deployed to assist you. Please stay at your location.' },
  { label: 'Welfare logged', text: 'Your welfare status has been acknowledged and logged. We will continue to monitor.' },
  { label: 'Donation support', text: 'Donation support has been arranged and is en route to your location.' },
  { label: 'Resolved', text: 'Your request has been resolved. Please let us know if you need further assistance.' },
];

const ISSESO_QUICK_ACTIONS = [
  { label: 'SOS received', text: 'SOS received. Rescue team is being dispatched to your location immediately.' },
  { label: 'Tactical response', text: 'Tactical response initiated. Ground command is en route to your area.' },
  { label: 'Threat assessment', text: 'Threat assessment is underway. Please stay in a secure location until further notice.' },
  { label: 'Area secured', text: 'Your area is being secured. Do not move until you receive clearance from our team.' },
  { label: 'Resolved', text: 'The situation has been resolved and secured. Contact us immediately if the threat returns.' },
];

function getQuickActions(officeName: string) {
  const name = officeName.toUpperCase();
  if (name.includes('CIO') || name.includes('COMMUNITY')) return CIO_QUICK_ACTIONS;
  if (name.includes('ISSESO') || name.includes('SAFETY') || name.includes('SECURITY')) return ISSESO_QUICK_ACTIONS;
  return [
    { label: 'Help on the way', text: 'Help is on the way. Please stay calm and remain at your location.' },
    { label: 'Resolved', text: 'Your request has been resolved. Please let us know if you need further assistance.' },
  ];
}

interface PageProps {
  params: Promise<{ requestId: string }>;
}

export default async function OfficeChatPage({ params }: PageProps) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'office') redirect('/login-office');
  const officeProfile = profile as OfficeProfile;

  const { requestId } = await params;

  const supabase = await createClient();
  const { data: request } = await supabase
    .from('help_request')
    .select('*')
    .eq('id', requestId)
    .single();

  if (!request) redirect('/office/inbox');

  const { data: stakeholder } = await supabase
    .from('stakeholder')
    .select('name, contact')
    .eq('id', request.stakeholder_id)
    .single();

  const messages = await getMessages(requestId);
  const quickActions = getQuickActions(officeProfile.office_name ?? '');
  
  const statusColor = {
    pending: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    resolved: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20',
  }[request.status as string] ?? 'bg-muted text-muted-foreground border-border';

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-80px)]">

      {/* Header */}
      <div className="px-4 py-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/office/inbox" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {stakeholder?.name ?? 'Unknown Stakeholder'}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {officeProfile.office_name}
              {stakeholder?.contact ? ` · ${stakeholder.contact}` : ''}
            </p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>
            {request.status}
          </span>
        </div>

        {/* Request details */}
        <div className="flex flex-col gap-1.5 bg-muted/40 rounded-xl px-3 py-2.5 border border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{request.location}</span>
          </div>
          {request.notes && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
              <span>{request.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-sm text-muted-foreground">No messages yet.</p>
            <p className="text-xs text-muted-foreground">
              Send an update to let the stakeholder know help is on the way.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === profile.id}
            />
          ))
        )}
      </div>

      {/* Input */}
      <ChatInput helpRequestId={requestId} senderRole="office" quickActions={quickActions} />
    </div>
  );
}