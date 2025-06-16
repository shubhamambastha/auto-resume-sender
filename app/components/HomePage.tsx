"use client";

import { useState } from "react";
import SupabaseAuthForm from "./SupabaseAuthForm";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { useResumeTypes } from "../hooks/useResumeTypes";
import FormContainer from "./ui/FormContainer";
import FormField from "./ui/FormField";
import StatusMessage from "./ui/StatusMessage";
import Button from "./ui/Button";
import Link from "next/link";

interface FormData {
  companyName: string;
  hrName: string;
  hrEmail: string;
  positionAppliedFor: string;
  resumeType: string;
}

export default function HomePage() {
  const {
    isAuthenticated,
    user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isLoading,
  } = useSupabaseAuth();
  const {
    resumeTypes,
    isLoading: resumeTypesLoading,
    error: resumeTypesError,
  } = useResumeTypes();
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    hrName: "",
    hrEmail: "",
    positionAppliedFor: "",
    resumeType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [responseMessage, setResponseMessage] = useState("");

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
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setResponseMessage(result.message);
        // Reset form on success
        setFormData({
          companyName: "",
          hrName: "",
          hrEmail: "",
          positionAppliedFor: "",
          resumeType: "",
        });
      } else {
        setSubmitStatus("error");
        setResponseMessage(result.error || "Something went wrong");
      }
    } catch {
      setSubmitStatus("error");
      setResponseMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = () => {
    // The auth state will be updated automatically by the Supabase auth listener
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <SupabaseAuthForm
        onAuthSuccess={handleAuthSuccess}
        signIn={signIn}
        signUp={signUp}
        resetPassword={resetPassword}
      />
    );
  }

  // Prepare resume type options for the select field
  const resumeTypeOptions = resumeTypes.map((resumeType) => ({
    value: resumeType.name,
    label: resumeType.display_name,
    title: resumeType.description || undefined,
  }));

  return (
    <FormContainer
      maxWidth="2xl"
      subtitle="Contact Form"
      title="Get in Touch With Us"
      description="Fill out the form below and we'll get back to you as soon as possible."
    >
      {/* User info and logout button */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
        <div className="flex space-x-4">
          <Link
            href="/submissions"
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            View Submissions
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="companyName"
          name="companyName"
          label="Company Name"
          type="text"
          required
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="Enter company name"
        />

        <FormField
          id="hrName"
          name="hrName"
          label="HR Name"
          type="text"
          value={formData.hrName}
          onChange={handleInputChange}
          placeholder="Enter HR's name"
        />

        <FormField
          id="hrEmail"
          name="hrEmail"
          label="HR or Company Email"
          type="email"
          required
          value={formData.hrEmail}
          onChange={handleInputChange}
          placeholder="Enter HR or company email"
        />

        <FormField
          id="positionAppliedFor"
          name="positionAppliedFor"
          label="Position Applied For"
          type="text"
          required
          value={formData.positionAppliedFor}
          onChange={handleInputChange}
          placeholder="Enter position applied for"
        />

        <div>
          {resumeTypesError && (
            <StatusMessage
              type="error"
              message={`Error loading resume types: ${resumeTypesError}`}
              className="mb-4"
            />
          )}
          <FormField
            id="resumeType"
            name="resumeType"
            label="Resume Type"
            type="select"
            required
            value={formData.resumeType}
            onChange={handleInputChange}
            disabled={resumeTypesLoading}
            options={resumeTypeOptions}
            loadingText={
              resumeTypesLoading ? "Loading resume types..." : undefined
            }
          />
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <StatusMessage type="success" message={responseMessage} />
        )}

        {submitStatus === "error" && (
          <StatusMessage type="error" message={responseMessage} />
        )}

        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Submitting..."
          fullWidth
        >
          Submit Form
        </Button>
      </form>
    </FormContainer>
  );
}
