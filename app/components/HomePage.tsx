"use client";

import { useState } from "react";
import SupabaseAuthForm from "./SupabaseAuthForm";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { useResumeTypes } from "../hooks/useResumeTypes";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            {/* User info and logout button */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
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
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              Contact Form
            </div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
              Get in Touch With Us
            </h1>
            <p className="mt-2 text-gray-500">
              Fill out the form below and we&apos;ll get back to you as soon as
              possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label
                  htmlFor="hrName"
                  className="block text-sm font-medium text-gray-700"
                >
                  HR Name
                </label>
                <input
                  type="text"
                  id="hrName"
                  name="hrName"
                  value={formData.hrName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter HR's name"
                />
              </div>

              <div>
                <label
                  htmlFor="hrEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  HR or Company Email *
                </label>
                <input
                  type="email"
                  id="hrEmail"
                  name="hrEmail"
                  required
                  value={formData.hrEmail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter HR or company email"
                />
              </div>

              <div>
                <label
                  htmlFor="positionAppliedFor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Position Applied For *
                </label>
                <input
                  type="text"
                  id="positionAppliedFor"
                  name="positionAppliedFor"
                  required
                  value={formData.positionAppliedFor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter position applied for"
                />
              </div>

              <div>
                <label
                  htmlFor="resumeType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Resume Type *
                </label>
                {resumeTypesError && (
                  <div className="mb-2 text-sm text-red-600">
                    Error loading resume types: {resumeTypesError}
                  </div>
                )}
                <select
                  id="resumeType"
                  name="resumeType"
                  required
                  value={formData.resumeType}
                  onChange={handleInputChange}
                  disabled={resumeTypesLoading}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    {resumeTypesLoading
                      ? "Loading resume types..."
                      : "Select a resume type"}
                  </option>
                  {resumeTypes.map((resumeType) => (
                    <option
                      key={resumeType.id}
                      value={resumeType.name}
                      title={resumeType.description || undefined}
                    >
                      {resumeType.display_name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Success! {responseMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        Error: {responseMessage}
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
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
