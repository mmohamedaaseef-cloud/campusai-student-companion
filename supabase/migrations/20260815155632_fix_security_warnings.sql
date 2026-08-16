-- Fix security advisor warnings:
-- 1. Revoke EXECUTE on handle_new_user from anon and authenticated (it's a trigger function, only called by the trigger)
-- 2. Revoke EXECUTE on set_updated_at from anon and authenticated (trigger function)
-- 3. Set fixed search_path on both functions

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;

ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.set_updated_at() SET search_path = public;
