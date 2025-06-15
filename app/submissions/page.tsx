"use client";

import { useEffect, useState } from "react";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { supabase } from "../lib/supabase"; // Import the existing Supabase client
import Link from "next/link"; // Import Link for navigation

// Define the interface for your submission data
interface Submission {
  id: string;
  company_name: string;
  hr_name: string | null;
  hr_email: string;
  position_applied_for: string;
  resume_type: string;
  created_at: string;
}

export default function SubmissionsPage() {
  const { isAuthenticated, user, isLoading, signOut } = useSupabaseAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      // If not authenticated or still loading auth state, don't proceed with fetching
      if (!isAuthenticated || !user) {
        setLoadingSubmissions(false);
        return;
      }

      setLoadingSubmissions(true);
      setError(null); // Clear any previous errors

      // Fetch data from the 'submissions' table
      const { data, error: fetchError } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false }); // Order by creation date, newest first

      if (fetchError) {
        console.error("Error fetching submissions:", fetchError);
        setError("Failed to load submissions. Please try again.");
      } else {
        setSubmissions(data || []); // Set submissions data, defaulting to an empty array if null
      }
      setLoadingSubmissions(false); // Done loading
    }

    // Only attempt to fetch if authenticated and the authentication state has finished loading
    if (isAuthenticated && !isLoading) {
      fetchSubmissions();
    }
  }, [isAuthenticated, user, isLoading]); // Re-run effect if these dependencies change

  const handleLogout = async () => {
    await signOut();
  };

  // Show a loading spinner while authentication status is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, prompt the user to log in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-700 mb-6">
            Please log in to view submitted forms.
          </p>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  // Main content for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 w-full">
          {/* Header with page title and logout button */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Submitted Forms
            </h1>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                Go to Form
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">Welcome, {user?.email}</p>

          {/* Conditional rendering based on loading, error, or data presence */}
          {loadingSubmissions ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    Error: {error}
                  </p>
                </div>
              </div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">
                    No submissions found.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Display submissions in a responsive table
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Company Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      HR Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      HR Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Resume Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Submitted At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {submission.company_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.hr_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.hr_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.position_applied_for}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.resume_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
