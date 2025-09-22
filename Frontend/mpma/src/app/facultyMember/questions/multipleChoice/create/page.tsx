"use client";

import React, { useState, FormEvent, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/app/facultyMember/components/Layout";
import MultipleChoiceQuestionForm, {
  MultipleChoiceQuestionFormRef,
  QuestionApiPayload,
} from "../MultipleChoiceQuestionForm";

const MultipleChoiceQuestionCreatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<MultipleChoiceQuestionFormRef>(null);

  // Get the courseId FROM THE URL, if it exists. This represents the "context".
  const courseIdParam = searchParams.get("courseId");
  const initialCourseId = courseIdParam ? parseInt(courseIdParam, 10) : null;

  // --- NEW STATE TO CONTROL THE CHOICE ---
  const [isCourseSpecific, setIsCourseSpecific] = useState(!!initialCourseId);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (
    submittedQuestionData: QuestionApiPayload | null,
  ) => {
    if (!submittedQuestionData) {
      // Validation failed in the form component, error is handled there
      return;
    }

    // --- NEW LOGIC: Determine the courseId based on the checkbox ---
    const finalCourseId = isCourseSpecific ? initialCourseId : null;

    const questionDataWithCourse = {
      ...submittedQuestionData,
      courseId: finalCourseId, // This is now a conscious choice!
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
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(questionDataWithCourse),
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
      setSuccessMessage("Question created successfully!");
      formRef.current?.reset(); // Reset form fields via ref
    } catch (err) {
      console.error("Error creating question:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to create question: ${errorMessage}`);
      // Clear success message if an error occurs during submission
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleFormSubmitAction = async (action: "addMore" | "finish") => {
    const questionData = formRef.current?.submit(); // Get data from form
    if (questionData) {
      await handleSubmit(questionData); // Submit data to backend
      if (action === "finish" && !error && successMessage) {
        // only navigate if submission was successful
        router.push(
          `/facultyMember/questions/view?courseId=${initialCourseId || ""}`,
        );
      }
      // If 'addMore', form is reset by handleSubmit on success
    }
    // If questionData is null, it means validation failed in the child form, error is shown there.
  };

  const handleAddMore = (e: FormEvent) => {
    e.preventDefault();
    handleFormSubmitAction("addMore");
  };

  const handleFinish = (e: FormEvent) => {
    e.preventDefault();
    handleFormSubmitAction("finish");
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
          <div className="bg-primary p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Create Multiple Answer Question
            </h2>

            {/* --- NEW UI ELEMENT: THE CHECKBOX --- */}
            {initialCourseId && ( // Only show this option if creating from a course context
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
                    : "This question will be saved to the global question bank and can be used in any course."}
                </p>
              </div>
            )}

            <MultipleChoiceQuestionForm
              ref={formRef}
              externalIsLoading={isLoading}
              externalError={error} // Pass the error state from the parent
              externalSuccessMessage={successMessage} // Pass the success message state
            />

            {/* Buttons remain in the parent page as they control navigation etc. */}
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
                Save and Add Another
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-md w-full"
                disabled={isLoading}
              >
                Save and Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MultipleChoiceQuestionCreatePage;
