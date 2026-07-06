import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId, retryCount = 0) => {
    try {
      const data = await api.getMe();
      
      if (data) {
        setProfile(data);
      } else if (retryCount < 2) {
        // Retry after 2 seconds if profile not found
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchProfile(userId, retryCount + 1);
      } else {
        setProfile(null);
      }
    } catch (error) {
      setProfile(null);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Small delay for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email, password, name) => {
    if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name } }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      setUser(null);
      setProfile(null);
      return;
    }
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {}
  };

  const refreshProfile = () => user && fetchProfile(user.id);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
