import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, type Profile } from '@/lib/supabase';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

type SignUpData = {
  email: string;
  password: string;
  fullName: string;
  college: string;
  department: string;
  year: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();
    if (error) {
      console.error('Profile load error', error);
      return;
    }
    setProfile(data as Profile | null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        (async () => {
          await loadProfile(newSession.user.id);
        })();
      } else {
        setProfile(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = async ({ email, password, fullName, college, department, year }: SignUpData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, college, department, year } },
    });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Sign up failed' };

    // Insert/ensure profile row with full details (trigger creates a stub)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        full_name: fullName,
        college,
        department,
        year,
      });
    if (profileError) return { error: profileError.message };

    await loadProfile(data.user.id);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) await loadProfile(data.user.id);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (session?.user) await loadProfile(session.user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
