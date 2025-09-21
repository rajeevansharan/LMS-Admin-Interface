"use client";

import React, { useState, FormEvent, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/app/facultyMember/components/Layout";
import MultipleChoiceQuestionForm, {
  MultipleChoiceQuestionFormRef,
  QuestionApiPayload,
} from "../MultipleChoiceQuestionForm";

// Interface for the question data received from the API
interface QuestionApiResponse {
  questionId: number;
  questionText: string;
  questionType: string;
  difficultyLevel: string;
  marks: number;
  courseId: string | null;
  optionsSCMC: string[];
  correctOptionIndicesMC: number[];
  correctOptionIndexSC: number;
  createdDate?: string;
  modifiedDate?: string;
}

const MultipleChoiceQuestionModifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionId = searchParams.get("questionId");
  const courseId = searchParams.get("courseId");
  const formRef = useRef<MultipleChoiceQuestionFormRef>(null);

  // States for API operations
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for initial question data
  const [initialQuestionData, setInitialQuestionData] =
    useState<QuestionApiResponse | null>(null);

  // Fetch question data on component mount
  useEffect(() => {
    const fetchQuestionData = async () => {
      if (!questionId) {
        setError("Question ID is required for modification");
        setIsLoadingQuestion(false);
        return;
      }

      try {
        setIsLoadingQuestion(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please login again.");
          setIsLoadingQuestion(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/questions/${questionId}`,
          {
            method: "GET",
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

        const questionData: QuestionApiResponse = await response.json();

        // Validate that this is a multiple choice question
        if (questionData.questionType !== "MULTIPLE_CHOICE") {
          setError("Invalid question type. Expected multiple choice question.");
          setIsLoadingQuestion(false);
          return;
        }

        setInitialQuestionData(questionData);
      } catch (err) {
        console.error("Error fetching question:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to load question: ${errorMessage}`);
      } finally {
        setIsLoadingQuestion(false);
      }
    };

    fetchQuestionData();
  }, [questionId]);

  const handleUpdate = async (
    updatedQuestionData: QuestionApiPayload | null,
  ) => {
    if (!updatedQuestionData) {
      // Validation failed in the form component, error is handled there
      return;
    }

    if (!questionId) {
      setError("Question ID is missing");
      return;
    }

    // Prepare update payload, preserving question ID and other metadata
    const updatePayload = {
      ...updatedQuestionData,
      questionId: Number(questionId), // Include the question ID for update
      courseId: courseId, // Use the courseId from URL params or keep the existing one
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
          method: "PUT", // Using PUT for update
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Error: ${response.status} ${response.statusText}`,
        );
      }

      await response.json();
      setSuccessMessage("Question updated successfully!");
    } catch (err) {
      console.error("Error updating question:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to update question: ${errorMessage}`);
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const questionData = formRef.current?.submit();
    if (questionData) {
      handleUpdate(questionData);
    }
  };

  const handleSaveAndFinish = async (e: FormEvent) => {
    e.preventDefault();
    const questionData = formRef.current?.submit();
    if (questionData) {
      await handleUpdate(questionData);
      // Navigate away only if the update was successful
      if (!error && successMessage) {
        router.push(`/facultyMember/questions/view?courseId=${courseId || ""}`);
      }
    }
  };

  // Loading state while fetching question data
  if (isLoadingQuestion) {
    return (
      <Layout>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
            <div className="bg-primary p-4 md:p-6 rounded-lg shadow-md">
              <div className="text-center p-8">
                <div className="loading loading-spinner loading-lg"></div>
                <p className="mt-4">Loading question data...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state if question couldn't be loaded
  if (error && !initialQuestionData) {
    return (
      <Layout>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
            <div className="bg-primary p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                Modify Multiple Answer Question
              </h2>
              <div className="alert alert-error">
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
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-md"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
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
              Modify Multiple Answer Question
            </h2>

            <MultipleChoiceQuestionForm
              ref={formRef}
              initialData={{
                questionText: initialQuestionData?.questionText || "",
                options: initialQuestionData?.optionsSCMC || ["", "", "", ""],
                correctOptionIndices:
                  initialQuestionData?.correctOptionIndicesMC || [],
                difficultyLevel:
                  initialQuestionData?.difficultyLevel || "Medium",
                marks: initialQuestionData?.marks || "",
              }}
              externalIsLoading={isLoading}
              externalError={error}
              externalSuccessMessage={successMessage}
            />

            {/* Action buttons */}
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
                onClick={handleSave}
                className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-md w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={handleSaveAndFinish}
                className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-md w-full"
                disabled={isLoading}
              >
                Save & Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MultipleChoiceQuestionModifyPage;
