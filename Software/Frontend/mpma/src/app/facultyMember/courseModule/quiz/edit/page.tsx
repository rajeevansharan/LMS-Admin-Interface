// e.g., src/app/facultyMember/edit-quiz/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { QuizService } from "@/services/QuizService";
import { QuestionBankService } from "@/services/QuestionBankService";
import { Quiz, QuizCreatePayload } from "@/types/Quiz";
import { QuestionDTO } from "@/types/QuestionDTO";
import Layout from "../../../components/Layout";
import { QuizForm } from "../components/QuizForm";

type DisplayQuestion = QuestionDTO & { source: "course" | "global" };

export default function EditQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const quizIdParam = searchParams.get("quizId");
  const courseIdParam = searchParams.get("courseId");
  const quizId = quizIdParam ? parseInt(quizIdParam, 10) : null;
  const courseId = courseIdParam ? parseInt(courseIdParam, 10) : null;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(true);
  const [maxMarks, setMaxMarks] = useState(100);
  const [passMark, setPassMark] = useState(50);
  const [weight, setWeight] = useState(10.0);
  const [timeLimit, setTimeLimit] = useState<string | null>(null);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);

  // Data and selection state
  const [availableQuestions, setAvailableQuestions] = useState<
    DisplayQuestion[]
  >([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [originalQuiz, setOriginalQuiz] = useState<Quiz | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!token || !quizId || !courseId) {
      setIsFetchingData(false);
      return;
    }
    const fetchQuizAndQuestions = async () => {
      try {
        const [quiz, courseQuestions, globalQuestions] = await Promise.all([
          QuizService.getQuizById(quizId, token),
          QuestionBankService.getQuestionsByCourseId(courseId, token),
          QuestionBankService.getGlobalQuestions(token),
        ]);

        setOriginalQuiz(quiz);
        setTitle(quiz.title);
        setDescription(quiz.description);
        setVisible(quiz.visible ?? false);
        setMaxMarks(quiz.maxMarks ?? 100);
        setPassMark(quiz.passMark ?? 35);
        setWeight(quiz.weight ?? 10.0);
        setTimeLimit(quiz.timeLimit);
        setMaxAttempts(quiz.maxAttempts);
        setShuffleQuestions(quiz.shuffleQuestions);
        setSelectedQuestionIds(quiz.questions.map((q) => q.id));

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
        setError("Failed to load quiz data.");
        console.error(err);
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchQuizAndQuestions();
  }, [token, quizId, courseId]);

  const handleSelectQuestion = (questionId: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId || !quizId || !token) {
      setError("Missing required information. Please refresh and try again.");
      return;
    }
    if (selectedQuestionIds.length === 0) {
      setError("A quiz must have at least one question.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const payload: QuizCreatePayload = {
        courseId,
        title,
        description,
        visible,
        maxMarks,
        passMark,
        weight,
        timeLimit,
        maxAttempts,
        shuffleQuestions,
        questionIds: selectedQuestionIds,
      };
      await QuizService.updateQuiz(quizId, payload, token);
      alert("Quiz updated successfully!");
      router.push(`/facultyMember/courseModule?id=${courseId}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to update quiz: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!quizId || !token || !courseId) return;
    setIsDeleting(true);
    setError(null);
    try {
      await QuizService.deleteQuiz(quizId, token);
      alert("Quiz deleted successfully!");
      router.push(`/facultyMember/courseModule?id=${courseId}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to delete quiz: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-primary border-2 border-borderColor p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-borderColor">
            <h1 className="text-2xl font-bold text-foreground">Edit Quiz</h1>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-md text-red-500 font-semibold border border-red-500 hover:bg-red-500/10 disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting && (
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
              )}
              Delete Quiz
            </button>
          </div>

          {isFetchingData ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
              <p className="mt-2 text-foreground">Loading quiz data...</p>
            </div>
          ) : !originalQuiz ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">
                {error || "Quiz not found."}
              </span>
            </div>
          ) : (
            <QuizForm
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
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit} // Pass the optional timeLimit props
              availableQuestions={availableQuestions}
              selectedQuestionIds={selectedQuestionIds}
              handleSelectQuestion={handleSelectQuestion}
              isSubmitting={isLoading}
              error={error}
              submitButtonText="Update Quiz"
              handleSubmit={handleSubmit}
              handleCancel={() => router.back()}
              courseId={courseId}
              router={router}
            />
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-primary rounded-lg shadow-xl p-6 w-full max-w-md border-2 border-borderColor">
            <h3 className="font-bold text-lg text-foreground">
              Confirm Deletion
            </h3>
            <p className="py-4 text-foreground/80">
              Are you sure you want to delete the quiz &quot;{title}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 rounded-md text-foreground font-semibold hover:bg-quaternary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 disabled:bg-red-400 flex items-center gap-2"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && (
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
