//lib/queries/message.ts
import { createClient } from '@/lib/supabase/server';

export interface Message {
  id: string;
  help_request_id: string;
  sender_id: string;
  sender_role: 'stakeholder' | 'office';
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

  const column = role === 'stakeholder' ? 'stakeholder_id' : 'office_id';

  const { data, error } = await supabase
    .from('help_request')
    .select('*, message(content, created_at, sender_role)')
    .eq(column, userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inbox threads:', error);
    return [];
  }

  return data || [];
}