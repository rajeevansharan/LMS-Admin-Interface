"use client";

import React, { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/app/facultyMember/components/Layout";
import ShortAnswerForm, {
  ShortAnswerData,
} from "@/app/facultyMember/questions/shortAnswer/ShortAnswerForm";

const ShortAnswerQuestionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get("courseId");

  // State management for form fields
  const [formData, setFormData] = useState<ShortAnswerData>({
    questionText: "",
    correctAnswer: "",
    caseSensitive: false,
    wordLimit: "",
    difficultyLevel: "Medium",
    marks: "",
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCourseSpecific, setIsCourseSpecific] = useState(!!initialCourseId);

  const handleFormChange = (updates: Partial<ShortAnswerData>) => {
    setFormData((prevData) => ({ ...prevData, ...updates }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
      questionType: "SHORT_ANSWER",
      difficultyLevel: formData.difficultyLevel,
      marks: Number(formData.marks),
      courseId: isCourseSpecific ? initialCourseId : null,
      correctAnswerSA: formData.correctAnswer,
      caseSensitiveSA: formData.caseSensitive,
      wordLimitES: formData.wordLimit ? Number(formData.wordLimit) : null,
      // Add dummy value for correct_option_index to satisfy DB constraint
      correctOptionIndexSC: 0,
    };

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null); // Clear previous success message

      // Get the auth token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        setIsLoading(false);
        return;
      }

      // Make API call to create the question
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/questions`,
        {
          method: "POST",
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

      setSuccessMessage("Question created successfully!");
      // Reset form fields
      setFormData({
        questionText: "",
        correctAnswer: "",
        caseSensitive: false,
        wordLimit: "",
        difficultyLevel: "Medium",
        marks: "",
      });
    } catch (error) {
      console.error("Error creating question:", error);
      setError(
        `Failed to create question: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleAddMore = async (e: FormEvent) => {
    e.preventDefault();
    // Save the current question then reset the form
    await handleSubmit(e);
    // Don't navigate away - let them create another question
  };

  const handleFinish = async (e: FormEvent) => {
    e.preventDefault();
    // Save the question
    await handleSubmit(e);
    // Navigate to questions view page
    if (!error) {
      router.push(
        `/facultyMember/questions/view?courseId=${initialCourseId || ""}`,
      );
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
          <div className="bg-primary p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Create Short Answer Question
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
              {initialCourseId && (
                <div className="form-control mb-4 p-4 bg-base-100 rounded-lg">
                  <label className="label cursor-pointer">
                    <span className="label-text font-semibold">
                      Associate this question with the current course (
                      {`ID: ${initialCourseId}`})
                    </span>
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={isCourseSpecific}
                      onChange={(e) => setIsCourseSpecific(e.target.checked)}
                    />
                  </label>

                  <p className="text-xs text-base-content/70 mt-1">
                    {isCourseSpecific
                      ? "This question will only be available for this course."
                      : "This question will be saved to the Global Question Bank and can be used by any lecturer in any course."}
                  </p>
                </div>
              )}

              <div className="w-full">
                <ShortAnswerForm
                  data={formData}
                  onDataChange={handleFormChange}
                  disabled={isLoading}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-md w-full"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMore}
                  className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-md w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Add More Questions"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-md w-full"
                  disabled={isLoading}
                >
                  Finish Adding
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShortAnswerQuestionPage;
