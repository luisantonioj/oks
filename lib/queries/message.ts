//lib/queries/message.ts
import { createClient } from '@/lib/supabase/server';

export interface Message {
  id: string;
  help_request_id: string;
  sender_id: string;
  sender_role: 'stakeholder' | 'office';
  sender_name?: string;
  content: string;
  created_at: string;
}

export async function getMessages(helpRequestId: string): Promise<Message[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('message')
    .select('*')
    .eq('help_request_id', helpRequestId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}

export async function getInboxThreads(userId: string, role: 'stakeholder' | 'office') {
  const supabase = await createClient();

  // Start the base query
  let query = supabase
    .from('help_request')
    .select('*, message(id, content, created_at, sender_role, sender_id)')
    .order('created_at', { ascending: false });

  // If it's a stakeholder, strictly show their own requests.
  // If it's an office, we DO NOT filter by office_id so they can see all incoming requests.
  if (role === 'stakeholder') {
    query = query.eq('stakeholder_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching inbox threads:', error);
    return [];
  }

  const messages: Message[] = data || [];
  const officeIds = [...new Set(messages.filter(m => m.sender_role === 'office').map(m => m.sender_id))];

  if (officeIds.length > 0) {
    const { data: offices } = await supabase
      .from('office')
      .select('id, office_name')
      .in('id', officeIds);
    if (offices) {
      const nameMap = new Map(offices.map(o => [o.id, o.office_name as string]));
      return messages.map(m =>
        m.sender_role === 'office'
          ? { ...m, sender_name: nameMap.get(m.sender_id) ?? 'Office' }
          : m
      );
    }
  }

  return messages;
}
