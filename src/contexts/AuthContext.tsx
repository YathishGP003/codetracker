import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signUp: (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
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

  const signIn = async (identifier: string, password: string) => {
    // If identifier contains '@', treat as email, else as username
    if (identifier.includes("@")) {
      // Email login
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });
        if (error) {
          return { error };
        }
        return { error: null };
      } catch (error) {
        return { error };
      }
    } else {
      // Username login
      try {
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", identifier)
          .single();
        if (profileError || !data?.email) {
          return { error: { message: "Invalid username or password." } };
        }
        const { data: signInData, error } =
          await supabase.auth.signInWithPassword({
            email: data.email,
            password,
          });
        if (error) {
          return { error };
        }
        return { error: null };
      } catch (error) {
        return { error };
      }
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      if (error) {
        return { error };
      }
      return { error: null };
    } catch (error) {
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
