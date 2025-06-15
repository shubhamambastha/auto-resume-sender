"use client";

import { useState, useEffect } from "react";
import { supabase, AuthUser } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
}

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    session: null,
    isLoading: true,
  });

  // Function to sign in with email and password
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        setAuthState({
          isAuthenticated: true,
          user: data.user as AuthUser,
          session: data.session,
          isLoading: false,
        });
        return { success: true };
      }

      return { success: false, error: "Authentication failed" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  // Function to sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<{
    success: boolean;
    error?: string;
    needsConfirmation?: boolean;
  }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        return {
          success: true,
          needsConfirmation: true,
        };
      }

      if (data.user && data.session) {
        setAuthState({
          isAuthenticated: true,
          user: data.user as AuthUser,
          session: data.session,
          isLoading: false,
        });
        return { success: true };
      }

      return { success: false, error: "Sign up failed" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  // Function to sign out
  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        isAuthenticated: false,
        user: null,
        session: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Force logout even if there's an error
      setAuthState({
        isAuthenticated: false,
        user: null,
        session: null,
        isLoading: false,
      });
    }
  };

  // Function to reset password
  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setAuthState({
          isAuthenticated: true,
          user: session.user as AuthUser,
          session: session,
          isLoading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          session: null,
          isLoading: false,
        });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setAuthState({
          isAuthenticated: true,
          user: session.user as AuthUser,
          session: session,
          isLoading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          session: null,
          isLoading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
