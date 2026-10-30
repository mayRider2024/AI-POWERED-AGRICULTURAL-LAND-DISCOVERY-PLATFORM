-- ==============================================================================
-- LandLens AI — STEP 5: Persistent AI Chat History & Conversation Management
-- Idempotent Supabase PostgreSQL Schema & Hardened Row Level Security (RLS)
-- ==============================================================================

-- 1. Create table: ai_conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes on ai_conversations
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_updated_at ON public.ai_conversations(updated_at DESC);

-- Automatically manage updated_at on ai_conversations (Harden search_path)
CREATE OR REPLACE FUNCTION public.handle_ai_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS tr_ai_conversations_updated_at ON public.ai_conversations;
CREATE TRIGGER tr_ai_conversations_updated_at
    BEFORE UPDATE ON public.ai_conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_ai_conversation_updated_at();


-- 2. Create table: ai_messages
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes on ai_messages
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON public.ai_messages(created_at ASC);


-- 3. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;


-- 4. Policies for public.ai_conversations
DROP POLICY IF EXISTS "Users can read own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON public.ai_conversations;

CREATE POLICY "Users can read own conversations"
    ON public.ai_conversations
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
    ON public.ai_conversations
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
    ON public.ai_conversations
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
    ON public.ai_conversations
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);


-- 5. Hardened Policies for public.ai_messages
-- Message ownership MUST be verified through the parent conversation's user_id.
-- Never allow one user to read another user's messages.
-- Prevent client-side impersonation: Authenticated clients can ONLY insert messages where role = 'user'.
-- Direct client UPDATE and DELETE on ai_messages are REVOKED / EXCLUDED.
-- Conversation deletion cascades automatically via foreign key ON DELETE CASCADE.
DROP POLICY IF EXISTS "Users can read messages in own conversations" ON public.ai_messages;
DROP POLICY IF EXISTS "Users can insert user messages in own conversations" ON public.ai_messages;
DROP POLICY IF EXISTS "Users can update messages in own conversations" ON public.ai_messages;
DROP POLICY IF EXISTS "Users can delete messages in own conversations" ON public.ai_messages;

CREATE POLICY "Users can read messages in own conversations"
    ON public.ai_messages
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.ai_conversations c
            WHERE c.id = ai_messages.conversation_id
            AND c.user_id = auth.uid()
        )
    );

-- Only messages with role = 'user' may be inserted by authenticated client sessions.
-- Assistant messages must originate from trusted backend server execution.
CREATE POLICY "Users can insert user messages in own conversations"
    ON public.ai_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        role = 'user'
        AND EXISTS (
            SELECT 1 FROM public.ai_conversations c
            WHERE c.id = ai_messages.conversation_id
            AND c.user_id = auth.uid()
        )
    );

-- 6. Trigger to touch parent conversation's updated_at when a new message is inserted (Hardened search_path)
CREATE OR REPLACE FUNCTION public.handle_ai_message_inserted()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.ai_conversations
    SET updated_at = timezone('utc'::text, now())
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS tr_ai_message_touch_conversation ON public.ai_messages;
CREATE TRIGGER tr_ai_message_touch_conversation
    AFTER INSERT ON public.ai_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_ai_message_inserted();
