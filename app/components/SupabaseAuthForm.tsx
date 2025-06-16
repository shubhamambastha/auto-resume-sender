"use client";

import { useState } from "react";
import FormContainer from "./ui/FormContainer";
import FormField from "./ui/FormField";
import StatusMessage from "./ui/StatusMessage";
import Button from "./ui/Button";

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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

  const getTitle = () => {
    switch (authMode) {
      case "signin":
        return "Sign In to Your Account";
      case "signup":
        return "Create New Account";
      case "reset":
        return "Reset Your Password";
      default:
        return "";
    }
  };

  const getDescription = () => {
    switch (authMode) {
      case "signin":
        return "Enter your credentials to access the application.";
      case "signup":
        return "Create a new account to get started.";
      case "reset":
        return "Enter your email to receive a password reset link.";
      default:
        return "";
    }
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      switch (authMode) {
        case "signin":
          return "Signing In...";
        case "signup":
          return "Creating Account...";
        case "reset":
          return "Sending Reset Link...";
        default:
          return "Loading...";
      }
    } else {
      switch (authMode) {
        case "signin":
          return "Sign In";
        case "signup":
          return "Create Account";
        case "reset":
          return "Send Reset Link";
        default:
          return "Submit";
      }
    }
  };

  return (
    <FormContainer
      subtitle="Authentication"
      title={getTitle()}
      description={getDescription()}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {authMode === "signup" && (
          <FormField
            id="fullName"
            name="fullName"
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
          />
        )}

        <FormField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />

        {authMode !== "reset" && (
          <FormField
            id="password"
            name="password"
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            minLength={6}
          />
        )}

        {/* Status Messages */}
        {authStatus === "error" && (
          <StatusMessage type="error" message={errorMessage} />
        )}

        {(authStatus === "confirmation" || authStatus === "resetSent") && (
          <StatusMessage type="success" message={successMessage} />
        )}

        <Button type="submit" isLoading={isSubmitting} fullWidth>
          {getSubmitButtonText()}
        </Button>

        {/* Mode switching buttons */}
        <div className="space-y-2">
          {authMode === "signin" && (
            <>
              <Button
                type="button"
                onClick={() => switchMode("signup")}
                variant="secondary"
                fullWidth
                size="sm"
              >
                Don&apos;t have an account? Sign up
              </Button>
              <Button
                type="button"
                onClick={() => switchMode("reset")}
                variant="secondary"
                fullWidth
                size="sm"
              >
                Forgot your password?
              </Button>
            </>
          )}

          {authMode === "signup" && (
            <Button
              type="button"
              onClick={() => switchMode("signin")}
              variant="secondary"
              fullWidth
              size="sm"
            >
              Already have an account? Sign in
            </Button>
          )}

          {authMode === "reset" && (
            <Button
              type="button"
              onClick={() => switchMode("signin")}
              variant="secondary"
              fullWidth
              size="sm"
            >
              Back to sign in
            </Button>
          )}
        </div>
      </form>
    </FormContainer>
  );
}
