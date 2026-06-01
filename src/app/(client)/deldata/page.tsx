'use client'
import React, { useState } from "react";

const DataDeletionPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    setSubmitted(true);
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Data Deletion Request</h1>
        <p className="text-gray-500">Last Updated: June 1, 2026</p>
      </div>

      <div className="space-y-8">
        <p className="text-gray-700">
          You can request deletion of your personal data from Monsoon Books by
          following the instructions below.
        </p>

        {/* Method 1 - Form */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Option 1: Submit a Request via Form
          </h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                Your request has been submitted. We will process your data
                deletion request within 30 days and send a confirmation to your
                email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
              >
                Submit Data Deletion Request
              </button>
            </form>
          )}
        </div>

        {/* Method 2 - Email */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Option 2: Send an Email Request
          </h2>
          <p className="text-gray-700 mb-2">
            Send an email to our support team with the subject line:
            <strong className="ml-1">"Data Deletion Request"</strong>
          </p>
          <p className="text-gray-700 mb-2">Include the following details:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Your full name</li>
            <li>Your registered email address</li>
            <li>Your phone number (optional)</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Email us at:{" "}
            <a
              href="mailto:privacy@monsoonbooks.com.np"
              className="text-blue-600 underline"
            >
              privacy@monsoonbooks.com.np
            </a>
          </p>
        </div>

        {/* What gets deleted */}
        <div>
          <h2 className="text-xl font-semibold mb-3">What Will Be Deleted</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Your account profile and personal information</li>
            <li>Order history and purchase records</li>
            <li>Saved addresses and contact details</li>
            <li>Reviews and comments you posted</li>
            <li>Login data from Google or Facebook</li>
          </ul>
        </div>

        {/* Processing info */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Processing Time</h2>
          <p className="text-gray-700">
            We will verify your identity and process your request within 30 days.
            You will receive a confirmation email once your data has been deleted.
          </p>
        </div>

        {/* Important notes */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Important Notes</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Data deletion is permanent and cannot be undone</li>
            <li>Your account will be permanently closed</li>
            <li>Cancel any pending orders before requesting deletion</li>
            <li>We may retain anonymized data or data required by law</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default DataDeletionPage;