"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/app/facultyMember/components/Layout";
import CustomButton from "@/app/facultyMember/components/CustomButton";
import { QuestionBankService } from "@/services/QuestionBankService";
import { CourseService } from "@/services/CourseService";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { QuestionDTO } from "@/types/QuestionDTO";
import { Course } from "@/types/Course";

const TrueFalseManagePage = () => {
  // --- STATE ---
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- STATE for dropdown and context ---
  const [lecturerCourses, setLecturerCourses] = useState<Course[]>([]);
  // --- CHANGE: Start context as null to represent "not yet determined" state ---
  const [selectedContext, setSelectedContext] = useState<string | null>(null);

  const { user, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- CHANGE: Split useEffect hooks for correctness ---
  // --- useEffect to set initial context from URL ---
  useEffect(() => {
    // This effect's only job is to set the context from the URL parameters once they are available.
    const courseIdParam = searchParams.get("courseId");
    setSelectedContext(courseIdParam || "global");
  }, [searchParams]);

  // --- useEffect to fetch lecturer's courses for the dropdown ---
  useEffect(() => {
    // This effect fetches the course list for the dropdown menu.
    if (user?.id && token) {
      CourseService.getCoursesByLecturerId(user.id, token)
        .then(setLecturerCourses)
        .catch((err) => {
          console.error("Failed to fetch lecturer courses:", err);
          toast.error("Could not load course list for dropdown.");
        });
    }
  }, [user, token]);

  // --- useCallback for fetching questions, now driven by selectedContext state ---
  const fetchQuestions = useCallback(async () => {
    // --- CHANGE: Add guard clause to prevent fetching until context is initialized ---
    if (!token || selectedContext === null) {
      // If context is null, it means we're waiting for the useEffect above to read the URL.
      // We don't need to do anything yet.
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let questionDTOs: QuestionDTO[];
      if (selectedContext === "global") {
        const allGlobalQuestions =
          await QuestionBankService.getGlobalQuestions(token);
        questionDTOs = allGlobalQuestions.filter(
          (q) => q.questionType === "TRUE_FALSE",
        );
      } else {
        const courseId = parseInt(selectedContext, 10);
        const allCourseQuestions =
          await QuestionBankService.getQuestionsByCourseId(courseId, token);
        questionDTOs = allCourseQuestions.filter(
          (q) => q.questionType === "TRUE_FALSE",
        );
      }
      setQuestions(questionDTOs);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
      toast.error("Failed to fetch questions.");
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedContext]); // Dependency array is correct

  // This useEffect re-runs whenever the context changes
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleEdit = (questionId: number) => {
    const contextParam =
      selectedContext === "global" ? "" : `&courseId=${selectedContext}`;
    const url = `/facultyMember/questions/trueFalse/modify?questionId=${questionId}${contextParam}`;
    router.push(url);
  };

  const handleDelete = async (questionId: number) => {
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }

    const originalQuestions = [...questions];
    setQuestions(questions.filter((q) => q.id !== questionId));

    const toastId = toast.loading("Deleting question...");

    try {
      await QuestionBankService.deleteQuestion(questionId, token);
      toast.success("Question deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question. Reverting changes.", {
        id: toastId,
      });
      setQuestions(originalQuestions);
    }
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newContext = e.target.value;
    setSelectedContext(newContext);
    const newUrl = `/facultyMember/questions/trueFalse/manage${newContext === "global" ? "" : `?courseId=${newContext}`}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <Layout>
      <div className="p-6 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              True/False Questions
            </h1>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <select
              className="select select-bordered w-full max-w-xs"
              // --- CHANGE: Handle null state for the value prop ---
              value={selectedContext ?? "global"}
              onChange={handleContextChange}
              // --- CHANGE: Disable control until context is determined ---
              disabled={isLoading || selectedContext === null}
              aria-label="Select Question Context"
            >
              <option value="global">Global Question Bank</option>
              {lecturerCourses.map((course) => (
                <option
                  key={course.courseId}
                  value={course.courseId.toString()}
                >
                  Course: {course.name}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              // --- CHANGE: Disable button until context is determined ---
              disabled={selectedContext === null}
              // --- CHANGE: Make onClick safe for null context ---
              onClick={() =>
                selectedContext &&
                router.push(
                  `/facultyMember/questions/trueFalse/create${selectedContext === "global" ? "" : `?courseId=${selectedContext}`}`,
                )
              }
            >
              Add New Question
            </button>
          </div>
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {/* --- CHANGE: The isLoading logic now correctly waits for the context to be set --- */}
        {isLoading || selectedContext === null ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="ml-4 text-lg">Loading questions...</p>
          </div>
        ) : questions.length === 0 && !error ? (
          <div className="bg-primary p-8 rounded-lg shadow text-center">
            <p className="text-lg mb-4">
              No True/False questions found for this context.
            </p>
            <CustomButton
              label="Create Your First Question"
              url={`/facultyMember/questions/trueFalse/create${selectedContext === "global" ? "" : `?courseId=${selectedContext}`}`}
              width="w-auto"
            />
          </div>
        ) : (
          <div className="grid gap-6">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-primary p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {question.questionText}
                  </h2>
                  <p
                    className={`text-lg font-medium ${question.correctAnswerTF ? "text-green-600" : "text-red-600"}`}
                  >
                    Correct Answer:{" "}
                    {question.correctAnswerTF === null ||
                    question.correctAnswerTF === undefined
                      ? "Not Set"
                      : question.correctAnswerTF
                        ? "True"
                        : "False"}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500 flex flex-col md:flex-row">
                    <span>
                      Created:{" "}
                      {question.createdAt
                        ? new Date(question.createdAt).toLocaleString()
                        : "N/A"}
                    </span>
                    <span className="md:ml-4">
                      Updated:{" "}
                      {question.updatedAt
                        ? new Date(question.updatedAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        question.id !== undefined && handleEdit(question.id)
                      }
                      disabled={question.id === undefined}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        question.id !== undefined && handleDelete(question.id)
                      }
                      disabled={question.id === undefined}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TrueFalseManagePage;
