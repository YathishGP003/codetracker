import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener...");
    
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider: Auth state changed:", event, {
          user: session?.user?.email,
          hasSession: !!session,
        expiresAt: session?.expires_at,
        });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
    });

    // Check for existing session
    const getInitialSession = async () => {
      try {
        console.log("AuthProvider: Checking for existing session...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("AuthProvider: Error getting session:", error);
        } else {
          console.log("AuthProvider: Initial session check:", {
            user: session?.user?.email,
            hasSession: !!session,
            expiresAt: session?.expires_at,
          });
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("AuthProvider: Error in getInitialSession:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log("AuthProvider: Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("AuthProvider: Attempting to sign in with email:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (error) {
        console.error("AuthProvider: Sign in error:", error);
        return { error };
      }
      
      console.log("AuthProvider: Sign in successful:", data.user?.email);
      return { error: null };
    } catch (error) {
      console.error("AuthProvider: Unexpected sign in error:", error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log("AuthProvider: Attempting to sign up with email:", email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: import.meta.env.VITE_SITE_URL,
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        console.error("AuthProvider: Sign up error:", error);
        return { error };
      }
      
      console.log("AuthProvider: Sign up successful:", data.user?.email);
      return { error: null };
    } catch (error) {
      console.error("AuthProvider: Unexpected sign up error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log("AuthProvider: Signing out...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AuthProvider: Sign out error:", error);
      } else {
        console.log("AuthProvider: Sign out successful");
      }
    } catch (error) {
      console.error("AuthProvider: Unexpected sign out error:", error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  console.log("AuthProvider: Current state:", {
    user: user?.email,
    hasSession: !!session,
    loading,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
