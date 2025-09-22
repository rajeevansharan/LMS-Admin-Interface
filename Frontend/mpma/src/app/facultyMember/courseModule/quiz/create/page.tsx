// e.g., src/app/facultyMember/create-quiz/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { QuizService } from "@/services/QuizService";
import { QuestionBankService } from "@/services/QuestionBankService";
import { QuestionDTO } from "@/types/QuestionDTO";
import Layout from "../../../components/Layout"; // Adjusted path
import { QuizForm } from "../components/QuizForm"; // Adjusted path

type DisplayQuestion = QuestionDTO & { source: "course" | "global" };

export default function CreateQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const courseIdParam = searchParams.get("id");
  const courseId = courseIdParam ? parseInt(courseIdParam, 10) : null;

  // State management is kept in the page component
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);
  const [maxMarks, setMaxMarks] = useState(100);
  const [passMark, setPassMark] = useState(50);
  const [weight, setWeight] = useState(10.0);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);

  const [availableQuestions, setAvailableQuestions] = useState<
    DisplayQuestion[]
  >([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data fetching logic remains in the page component
  useEffect(() => {
    if (!token || !courseId) {
      setIsFetchingQuestions(false);
      return;
    }
    const fetchAllAvailableQuestions = async () => {
      try {
        const [courseQuestions, globalQuestions] = await Promise.all([
          QuestionBankService.getQuestionsByCourseId(courseId, token),
          QuestionBankService.getGlobalQuestions(token),
        ]);
        const allQuestionsMap = new Map<number, DisplayQuestion>();
        courseQuestions.forEach((q) => {
          if (q.id) allQuestionsMap.set(q.id, { ...q, source: "course" });
        });
        globalQuestions.forEach((q) => {
          if (q.id && !allQuestionsMap.has(q.id))
            allQuestionsMap.set(q.id, { ...q, source: "global" });
        });
        setAvailableQuestions(Array.from(allQuestionsMap.values()));
      } catch (err) {
        setError("Failed to load questions from the bank.");
        console.error(err);
      } finally {
        setIsFetchingQuestions(false);
      }
    };
    fetchAllAvailableQuestions();
  }, [token, courseId]);

  const handleSelectQuestion = (questionId: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId || !token) {
      setError("Missing required information. Please refresh and try again.");
      return;
    }
    if (selectedQuestionIds.length === 0) {
      setError("You must select at least one question for the quiz.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await QuizService.createQuiz(
        courseId,
        {
          courseId,
          title,
          description,
          visible,
          maxMarks,
          passMark,
          weight,
          maxAttempts,
          shuffleQuestions,
          questionIds: selectedQuestionIds,
        },
        token,
      );
      alert("Quiz created successfully!");
      router.push(`/facultyMember/courseModule?id=${courseId}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to create quiz: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!courseId) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: Course ID not found in URL.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-primary border-2 border-borderColor p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-foreground">
            Create New Quiz
          </h1>

          {isFetchingQuestions ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
              <p className="mt-2 text-foreground">Loading questions...</p>
            </div>
          ) : (
            <QuizForm
              // Pass all state and handlers to the reusable form component
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              visible={visible}
              setVisible={setVisible}
              maxMarks={maxMarks}
              setMaxMarks={setMaxMarks}
              passMark={passMark}
              setPassMark={setPassMark}
              weight={weight}
              setWeight={setWeight}
              maxAttempts={maxAttempts}
              setMaxAttempts={setMaxAttempts}
              shuffleQuestions={shuffleQuestions}
              setShuffleQuestions={setShuffleQuestions}
              availableQuestions={availableQuestions}
              selectedQuestionIds={selectedQuestionIds}
              handleSelectQuestion={handleSelectQuestion}
              isSubmitting={isLoading}
              error={error}
              submitButtonText="Create Quiz"
              handleSubmit={handleSubmit}
              handleCancel={() => router.back()}
              courseId={courseId}
              router={router}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
