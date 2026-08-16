-- Revoke EXECUTE from PUBLIC on handle_new_user (it was still callable via PUBLIC role)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
