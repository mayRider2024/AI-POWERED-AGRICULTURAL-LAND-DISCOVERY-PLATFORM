import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AIConversation, AIMessageItem } from '../types/aiConversation';

export const aiConversationService = {
  /**
   * Fetch all conversations for the authenticated user, ordered by most recently updated.
   */
  async listConversations(userId: string): Promise<{ data: AIConversation[] | null; error: Error | null }> {
    if (!isSupabaseConfigured || !userId) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return { data: (data as AIConversation[]) || [], error: null };
    } catch (err: any) {
      console.warn('Error fetching AI conversations:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Create a new conversation row for the user.
   */
  async createConversation(
    userId: string,
    title: string
  ): Promise<{ data: AIConversation | null; error: Error | null }> {
    if (!isSupabaseConfigured || !userId) {
      return { data: null, error: new Error('Supabase not configured or unauthenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title: title.trim() || 'New Conversation',
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as AIConversation, error: null };
    } catch (err: any) {
      console.warn('Error creating AI conversation:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Rename an existing conversation.
   */
  async renameConversation(
    conversationId: string,
    title: string
  ): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('ai_conversations')
        .update({
          title: title.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.warn('Error renaming conversation:', err);
      return { error: err };
    }
  },

  /**
   * Delete an existing conversation (RLS and foreign keys cascade to messages).
   */
  async deleteConversation(conversationId: string): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.warn('Error deleting conversation:', err);
      return { error: err };
    }
  },

  /**
   * Fetch all messages for a specific conversation, ordered chronologically.
   */
  async getMessages(
    conversationId: string
  ): Promise<{ data: AIMessageItem[] | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { data: (data as AIMessageItem[]) || [], error: null };
    } catch (err: any) {
      console.warn('Error fetching conversation messages:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Save a single message (user or assistant) to Supabase.
   */
  async saveMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: Record<string, any>
  ): Promise<{ data: AIMessageItem | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { data: null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as AIMessageItem, error: null };
    } catch (err: any) {
      console.warn('Error saving AI message:', err);
      return { data: null, error: err };
    }
  },
};

