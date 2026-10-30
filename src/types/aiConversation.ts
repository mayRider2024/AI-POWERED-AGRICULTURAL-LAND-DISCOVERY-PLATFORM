export interface AIConversation {
  id: string;
  user_id?: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessageItem {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    source?: 'gemini' | 'local';
    explanation?: string;
    unmetConstraints?: string[];
    unsupported?: string[];
    results?: any[];
  };
  created_at: string;
}

/**
 * Derives a clean, concise title from the user's first query without needing an AI call.
 */
export function generateConversationTitle(query: string): string {
  const trimmed = query.trim().replace(/^["']|["']$/g, '');
  if (!trimmed) return 'New Conversation';
  
  // Truncate cleanly at word boundary if over 40 characters
  if (trimmed.length <= 40) return trimmed;
  const sliced = trimmed.slice(0, 40);
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > 15 ? sliced.slice(0, lastSpace) : sliced) + '…';
}

