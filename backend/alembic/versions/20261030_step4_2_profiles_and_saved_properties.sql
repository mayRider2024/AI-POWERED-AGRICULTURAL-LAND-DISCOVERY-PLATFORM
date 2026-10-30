-- ==============================================================================
-- LandLens AI — STEP 4.2: Real User Profiles & Cloud-Synced Saved Properties
-- Idempotent Supabase PostgreSQL Schema & Row Level Security (RLS) Migration
-- ==============================================================================

-- 1. Create table: user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    preferred_district TEXT,
    user_role TEXT NOT NULL DEFAULT 'land_seeker',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on user_profiles id
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON public.user_profiles(id);

-- 2. Create table: saved_properties
CREATE TABLE IF NOT EXISTS public.saved_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_saved_properties_user_property UNIQUE (user_id, property_id)
);

-- Indexes on saved_properties
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON public.saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_property_id ON public.saved_properties(property_id);

-- 3. Automatically manage updated_at timestamps on user_profiles
CREATE OR REPLACE FUNCTION public.handle_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER tr_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_profile_updated_at();

-- 4. Automatic user profile creation trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
DECLARE
    raw_name TEXT;
    raw_lang TEXT;
BEGIN
    -- Extract full name from raw_user_meta_data if available
    raw_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'display_name',
        split_part(NEW.email, '@', 1)
    );
    raw_lang := COALESCE(
        NEW.raw_user_meta_data->>'preferred_language',
        'en'
    );

    INSERT INTO public.user_profiles (id, full_name, preferred_language, user_role)
    VALUES (NEW.id, raw_name, raw_lang, 'land_seeker')
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name
    WHERE public.user_profiles.full_name IS NULL OR public.user_profiles.full_name = '';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_profile();

-- 5. Backfill existing registered users into user_profiles
INSERT INTO public.user_profiles (id, full_name, preferred_language, user_role)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1)),
    COALESCE(u.raw_user_meta_data->>'preferred_language', 'en'),
    'land_seeker'
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- 7. Policies for public.user_profiles
-- Drop existing policies if any to ensure idempotency
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Users can read own profile"
    ON public.user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 8. Policies for public.saved_properties
DROP POLICY IF EXISTS "Users can read own saved properties" ON public.saved_properties;
DROP POLICY IF EXISTS "Users can insert own saved properties" ON public.saved_properties;
DROP POLICY IF EXISTS "Users can delete own saved properties" ON public.saved_properties;

CREATE POLICY "Users can read own saved properties"
    ON public.saved_properties
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved properties"
    ON public.saved_properties
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved properties"
    ON public.saved_properties
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
