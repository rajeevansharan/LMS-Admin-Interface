"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../../../../components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { QuizAttemptDetail, QuestionReview } from "@/types/QuizAttempt";
import { SubmissionService } from "@/services/SubmissionService";

// A component to display a single question's review
const QuestionReviewCard = ({ review }: { review: QuestionReview }) => (
  <div
    className={`p-4 rounded-lg border ${review.isCorrect ? "border-success" : "border-error"}`}
  >
    <p className="font-semibold text-foreground">{review.questionText}</p>
    <div className="mt-3 space-y-2 text-sm">
      <p>
        <span className="font-bold text-neutral-content">
          Student&apos;s Answer:{" "}
        </span>
        {review.studentAnswer}
      </p>
      {/* We can hide the "Correct Answer" if they got it right */}
      {!review.isCorrect && (
        <p>
          <span className="font-bold text-neutral-content">
            Correct Answer:{" "}
          </span>
          {review.correctAnswer}
        </p>
      )}
      <p className="font-bold">
        <span className="text-neutral-content">Marks: </span>
        {review.marksObtained}
      </p>
    </div>
  </div>
);

const QuizReviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const submissionId = params.submissionId as string;

  const [attemptDetails, setAttemptDetails] =
    useState<QuizAttemptDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submissionId && token) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const data = await SubmissionService.getQuizAttemptDetails(
            Number(submissionId),
            token,
          );
          setAttemptDetails(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred.",
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [submissionId, token]);

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-primary border-2 border-borderColor p-4 rounded-lg shadow-md">
          {isLoading ? (
            <div className="text-center py-10">Loading Review...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-10">Error: {error}</div>
          ) : !attemptDetails ? (
            <div className="text-center py-10">
              No details found for this attempt.
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2 text-foreground">
                Reviewing Quiz: &quot;{attemptDetails.quizTitle}&quot;
              </h1>
              <p className="text-lg mb-6 text-neutral-content">
                Student:{" "}
                <span className="font-semibold">
                  {attemptDetails.studentName}
                </span>{" "}
                | Total Score:{" "}
                <span className="font-semibold">
                  {attemptDetails.totalMarks}
                </span>
              </p>

              <div className="space-y-4">
                {attemptDetails.questions.map((review) => (
                  <QuestionReviewCard key={review.questionId} review={review} />
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => router.back()}
                  className="btn btn-neutral"
                >
                  Go Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuizReviewPage;
