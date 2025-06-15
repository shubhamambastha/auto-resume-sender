"use client";

import { useState } from "react";

interface SupabaseAuthFormProps {
  onAuthSuccess: () => void;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{
    success: boolean;
    error?: string;
    needsConfirmation?: boolean;
  }>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function SupabaseAuthForm({
  onAuthSuccess,
  signIn,
  signUp,
  resetPassword,
}: SupabaseAuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    "idle" | "success" | "error" | "confirmation" | "resetSent"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "reset">(
    "signin"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      let result;

      if (authMode === "signin") {
        result = await signIn(formData.email, formData.password);
      } else if (authMode === "signup") {
        result = await signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
      } else if (authMode === "reset") {
        result = await resetPassword(formData.email);
      }

      if (result?.success) {
        if (authMode === "signin") {
          setAuthStatus("success");
          onAuthSuccess();
        } else if (authMode === "signup") {
          if ("needsConfirmation" in result && result.needsConfirmation) {
            setAuthStatus("confirmation");
            setSuccessMessage(
              "Please check your email to confirm your account."
            );
          } else {
            setAuthStatus("success");
            onAuthSuccess();
          }
        } else if (authMode === "reset") {
          setAuthStatus("resetSent");
          setSuccessMessage("Password reset link sent to your email.");
        }
      } else {
        setAuthStatus("error");
        setErrorMessage(result?.error || "Authentication failed");
      }
    } catch {
      setAuthStatus("error");
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (mode: "signin" | "signup" | "reset") => {
    setAuthMode(mode);
    setAuthStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
    setFormData({
      email: "",
      password: "",
      fullName: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
            Authentication
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            {authMode === "signin" && "Sign In to Your Account"}
            {authMode === "signup" && "Create New Account"}
            {authMode === "reset" && "Reset Your Password"}
          </h1>
          <p className="mt-2 text-gray-500">
            {authMode === "signin" &&
              "Enter your credentials to access the application."}
            {authMode === "signup" && "Create a new account to get started."}
            {authMode === "reset" &&
              "Enter your email to receive a password reset link."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {authMode === "signup" && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            {authMode !== "reset" && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                  minLength={6}
                />
              </div>
            )}

            {/* Status Messages */}
            {authStatus === "error" && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      Error: {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(authStatus === "confirmation" || authStatus === "resetSent") && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && authMode === "signin" && "Signing In..."}
                {isSubmitting && authMode === "signup" && "Creating Account..."}
                {isSubmitting &&
                  authMode === "reset" &&
                  "Sending Reset Link..."}
                {!isSubmitting && authMode === "signin" && "Sign In"}
                {!isSubmitting && authMode === "signup" && "Create Account"}
                {!isSubmitting && authMode === "reset" && "Send Reset Link"}
              </button>
            </div>

            {/* Mode switching buttons */}
            <div className="mt-6 space-y-2">
              {authMode === "signin" && (
                <>
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Don&apos;t have an account? Sign up
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("reset")}
                    className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Forgot your password?
                  </button>
                </>
              )}

              {authMode === "signup" && (
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  Already have an account? Sign in
                </button>
              )}

              {authMode === "reset" && (
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
