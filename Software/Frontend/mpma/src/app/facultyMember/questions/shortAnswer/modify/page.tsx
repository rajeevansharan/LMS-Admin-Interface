"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/app/facultyMember/components/Layout";
import ShortAnswerForm, {
  ShortAnswerData,
} from "@/app/facultyMember/questions/shortAnswer/ShortAnswerForm";

const ModifyShortAnswerQuestionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionId = searchParams.get("questionId");
  const courseId = searchParams.get("courseId"); // Keep courseId for navigation

  const [formData, setFormData] = useState<ShortAnswerData>({
    questionText: "",
    correctAnswer: "",
    caseSensitive: false,
    wordLimit: "",
    difficultyLevel: "Medium",
    marks: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!questionId) {
      setError("Question ID is missing.");
      setIsFetching(false);
      return;
    }

    const fetchQuestionData = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please login again.");
          setIsFetching(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/questions/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              `Error: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        if (data.questionType !== "SHORT_ANSWER") {
          setError("This page is for modifying short answer questions only.");
          // router.push("/facultyMember/questions/view"); // Or some other appropriate redirect
          return;
        }

        setFormData({
          questionText: data.questionText || "",
          correctAnswer: data.correctAnswerSA || "",
          caseSensitive: data.caseSensitiveSA || false,
          wordLimit: data.wordLimitES === null ? "" : data.wordLimitES, // Handle null from DB
          difficultyLevel: data.difficultyLevel || "Medium",
          marks: data.marks === null ? "" : data.marks, // Handle null from DB
        });
      } catch (err) {
        console.error("Error fetching question data:", err);
        setError(
          `Failed to fetch question data: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchQuestionData();
  }, [questionId, router]); // Added router to dependency array due to potential usage in error handling

  const handleFormChange = (updates: Partial<ShortAnswerData>) => {
    setFormData((prevData) => ({ ...prevData, ...updates }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!questionId) {
      setError("Question ID is missing.");
      return;
    }

    // Validate form
    if (!formData.questionText.trim()) {
      setError("Please enter a question");
      return;
    }

    if (!formData.correctAnswer.trim()) {
      setError("Please enter a model answer");
      return;
    }

    if (!formData.marks) {
      setError("Please enter marks for this question");
      return;
    }

    // Prepare the question data based on the backend DTO
    const questionData = {
      questionText: formData.questionText,
      questionType: "SHORT_ANSWER", // Ensure this is always set for updates
      difficultyLevel: formData.difficultyLevel,
      marks: Number(formData.marks),
      // courseId: courseId, // Include courseId if backend expects it for updates, otherwise remove or set to null
      correctAnswerSA: formData.correctAnswer,
      caseSensitiveSA: formData.caseSensitive,
      wordLimitES: formData.wordLimit ? Number(formData.wordLimit) : null,
      // Add dummy value for correct_option_index to satisfy DB constraint if needed for PUT
      // correctOptionIndexSC: 0
    };

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/questions/${questionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(questionData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Error: ${response.status} ${response.statusText}`,
        );
      }

      await response.json(); // Process response if needed
      setSuccessMessage("Question updated successfully!");
      // Optionally, redirect after a delay or keep the user on the page
      // setTimeout(() => {
      //   router.push(`/facultyMember/questions/view?courseId=${courseId || ""}`);
      // }, 2000); // 2 seconds delay
    } catch (error) {
      console.error("Error updating question:", error);
      setError(
        `Failed to update question: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to the questions view page, ensuring courseId is passed if available
    router.push(`/facultyMember/questions/view?courseId=${courseId || ""}`);
  };

  if (isFetching) {
    return (
      <Layout>
        <div className="p-4 md:p-6 lg:p-8 text-center">
          {/* Using DaisyUI spinner for loading state */}
          <span className="loading loading-lg loading-spinner text-primary"></span>
          <p>Loading question data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
          <div className="bg-primary p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Modify Short Answer Question
            </h2>

            {error && (
              <div className="alert alert-error mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="w-full">
                {/* Use the new ShortAnswerForm component */}
                <ShortAnswerForm
                  data={formData}
                  onDataChange={handleFormChange}
                  disabled={isLoading || isFetching}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-md w-full"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit" // Changed to submit for the main action button
                  className="btn bg-accent hover:bg-accent-focus text-accent-content btn-md w-full"
                  disabled={isLoading || isFetching} // Disable if loading or fetching
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ModifyShortAnswerQuestionPage;
