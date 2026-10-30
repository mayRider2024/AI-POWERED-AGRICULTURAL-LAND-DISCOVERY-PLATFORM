-- ==============================================================================
-- LandLens AI — STEP 4.3: Secure Account Deletion Function
-- Idempotent Supabase PostgreSQL RPC function for authenticated account deletion
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    current_uid uuid;
BEGIN
    current_uid := auth.uid();
    
    IF current_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Deleting from auth.users automatically cascades to public.user_profiles
    -- and public.saved_properties due to ON DELETE CASCADE foreign keys.
    DELETE FROM auth.users WHERE id = current_uid;

    RETURN json_build_object('success', true, 'deleted_user_id', current_uid);
END;
$$;

-- Secure execution permissions
REVOKE ALL ON FUNCTION public.delete_user_account() FROM public;
REVOKE ALL ON FUNCTION public.delete_user_account() FROM anon;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
