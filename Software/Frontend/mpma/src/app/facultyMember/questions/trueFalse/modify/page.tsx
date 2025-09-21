"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/app/facultyMember/components/Layout";
import TrueFalseForm, {
  TrueFalseData,
} from "@/app/facultyMember/components/TrueFalseForm";
import { QuestionBankService } from "@/services/QuestionBankService"; // Assuming you have this service
import { useAuth } from "@/contexts/AuthContext"; // Assuming you use this for auth
import { QuestionType } from "@/types/QuestionDTO"; // Import QuestionType

const ModifyTrueFalseQuestionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionId = searchParams.get("questionId");
  const courseId = searchParams.get("courseId"); // For navigation back
  const { token } = useAuth();

  const [formData, setFormData] = useState<TrueFalseData>({
    questionText: "",
    correctAnswer: null,
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
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setIsFetching(false);
      return;
    }

    const fetchQuestionData = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const data = await QuestionBankService.getQuestionById(
          parseInt(questionId, 10),
          token,
        );

        if (data.questionType !== "TRUE_FALSE") {
          setError("This page is for modifying True/False questions only.");
          // Consider redirecting if wrong type, e.g.:
          // router.push("/facultyMember/questions/view");
          return;
        }

        setFormData({
          questionText: data.questionText || "",
          correctAnswer:
            data.correctAnswerTF === undefined || data.correctAnswerTF === null
              ? null
              : data.correctAnswerTF,
          difficultyLevel: data.difficultyLevel || "Medium",
          marks:
            data.marks === undefined || data.marks === null ? "" : data.marks,
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
  }, [questionId, token, router]);

  const handleFormChange = (updates: Partial<TrueFalseData>) => {
    setFormData((prevData) => ({ ...prevData, ...updates }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!questionId || !token) {
      setError("Cannot update question: Missing ID or authentication.");
      return;
    }

    if (!formData.questionText.trim()) {
      setError("Please enter a question");
      return;
    }
    if (formData.correctAnswer === null) {
      setError("Please select the correct answer");
      return;
    }
    if (!formData.marks) {
      setError("Please enter marks for this question");
      return;
    }

    const questionDataToUpdate = {
      questionText: formData.questionText,
      questionType: QuestionType.TRUE_FALSE, // Use imported Enum
      difficultyLevel: formData.difficultyLevel,
      marks: Number(formData.marks),
      correctAnswerTF: formData.correctAnswer as boolean, // Ensure boolean, not null
      // Ensure other fields required by backend for PUT are included if necessary
      // e.g., courseId might be needed, or other dummy fields for constraints
      id: parseInt(questionId, 10),
      courseId: courseId ? parseInt(courseId, 10) : undefined,
    };

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      await QuestionBankService.updateQuestion(
        parseInt(questionId, 10),
        questionDataToUpdate,
        token,
      );

      setSuccessMessage("Question updated successfully!");
      // Optionally, redirect or offer further actions
      // setTimeout(() => router.push(`/facultyMember/questions/view?courseId=${courseId || ""}`), 2000);
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
    router.push(`/facultyMember/questions/view?courseId=${courseId || ""}`);
  };

  if (isFetching) {
    return (
      <Layout>
        <div className="p-4 md:p-6 lg:p-8 text-center">
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
              Modify True/False Question
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
                <TrueFalseForm
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
                  type="submit"
                  className="btn bg-accent hover:bg-accent-focus text-accent-content btn-md w-full"
                  disabled={isLoading || isFetching}
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

export default ModifyTrueFalseQuestionPage;
