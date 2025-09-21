// src/app/components/QuizForm.tsx
"use client";

import React from "react";
import { QuestionDTO } from "@/types/QuestionDTO";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type DisplayQuestion = QuestionDTO & { source: "course" | "global" };

/**
 * Props for the reusable QuizForm component.
 * It is a "controlled component," receiving all state and handlers from its parent.
 */
interface QuizFormProps {
  // Form data state and setters
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
  maxMarks: number;
  setMaxMarks: (value: number) => void;
  passMark: number;
  setPassMark: (value: number) => void;
  weight: number;
  setWeight: (value: number) => void;
  maxAttempts: number;
  setMaxAttempts: (value: number) => void;
  shuffleQuestions: boolean;
  setShuffleQuestions: (value: boolean) => void;

  // Optional field for the Edit page
  timeLimit?: string | null;
  setTimeLimit?: (value: string | null) => void;

  // Question selection data and handler
  availableQuestions: DisplayQuestion[];
  selectedQuestionIds: number[];
  handleSelectQuestion: (id: number) => void;

  // UI and submission state
  isSubmitting: boolean;
  error: string | null;
  submitButtonText: string;

  // Form action handlers
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  // Extra for navigation
  courseId: number | null;
  router: AppRouterInstance; // Next.js App Router's router instance
}

/**
 * A reusable form component for creating or editing quizzes.
 * It includes sections for quiz details, settings, and question selection.
 *
 * This component is designed to be controlled by its parent, receiving all state and handlers as props.
 */
export const QuizForm: React.FC<QuizFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  visible,
  setVisible,
  maxMarks,
  setMaxMarks,
  passMark,
  setPassMark,
  weight,
  setWeight,
  maxAttempts,
  setMaxAttempts,
  shuffleQuestions,
  setShuffleQuestions,
  timeLimit,
  setTimeLimit,
  availableQuestions,
  selectedQuestionIds,
  handleSelectQuestion,
  isSubmitting,
  error,
  submitButtonText,
  handleSubmit,
  handleCancel,
  courseId,
  router,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Quiz Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground border-b border-borderColor pb-2">
          1. Quiz Details
        </h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Quiz Title
          </label>
          <input
            type="text"
            placeholder="e.g., Week 1 Knowledge Check"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-tertiary border border-borderColor rounded-md p-2 text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Description (Optional)
          </label>
          <textarea
            placeholder="Provide instructions for students"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-24 bg-tertiary border border-borderColor rounded-md p-2 text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent"
          ></textarea>
        </div>
      </div>

      {/* Section 2: Quiz Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground border-b border-borderColor pb-2">
          2. Quiz Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Max Marks
            </label>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-tertiary border border-borderColor rounded-md p-2 text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Pass Mark
            </label>
            <input
              type="number"
              value={passMark}
              onChange={(e) => setPassMark(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-tertiary border border-borderColor rounded-md p-2 text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Assessment Weight (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-tertiary border border-borderColor rounded-md p-2 text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Max Attempts
            </label>
            <input
              type="number"
              value={maxAttempts}
              onChange={(e) =>
                setMaxAttempts(parseInt(e.target.value, 10) || 1)
              }
              className="w-full bg-tertiary border border-borderColor rounded-md p-2 text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
          {/* Conditionally render timeLimit field only if props are passed (i.e., for Edit page) */}
          {timeLimit !== undefined && setTimeLimit && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Time Limit (HH:mm:ss)
              </label>
              <input
                type="text"
                placeholder="e.g., 01:30:00"
                value={timeLimit || ""}
                onChange={(e) => setTimeLimit(e.target.value || null)}
                className="w-full bg-tertiary border border-borderColor rounded-md p-2 text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center justify-between p-3 bg-tertiary rounded-md cursor-pointer hover:bg-quaternary">
            <span className="text-foreground font-medium">
              Visible to Students
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 rounded text-secondary focus:ring-secondary bg-quaternary border-borderColor"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-tertiary rounded-md cursor-pointer hover:bg-quaternary">
            <span className="text-foreground font-medium">
              Shuffle Questions
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 rounded text-secondary focus:ring-secondary bg-quaternary border-borderColor"
              checked={shuffleQuestions}
              onChange={(e) => setShuffleQuestions(e.target.checked)}
            />
          </label>
        </div>
      </div>

      {/* Section 3: Question Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground border-b border-borderColor pb-2">
          3. Select Questions
        </h2>
        <p className="text-sm text-foreground/80">
          You have selected {selectedQuestionIds.length} question(s).
        </p>
        <div className="max-h-96 overflow-y-auto space-y-2 p-2 rounded-lg bg-tertiary border border-borderColor">
          {availableQuestions.length > 0 ? (
            availableQuestions
              .filter((q) => q.id)
              .map((q) => (
                <label
                  key={q.id}
                  className="flex items-center p-3 rounded-lg transition-colors hover:bg-quaternary cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded text-secondary focus:ring-secondary bg-quaternary border-borderColor mr-4"
                    checked={selectedQuestionIds.includes(q.id!)}
                    onChange={() => handleSelectQuestion(q.id!)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {q.questionText}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-foreground/70 mt-1">
                      <span>
                        {q.questionType.replace("_", " ")} - {q.marks || 0}{" "}
                        Marks
                      </span>
                      {q.source === "global" && (
                        <span className="bg-secondary/20 text-secondary border border-secondary/30 rounded-full px-2 py-0.5 text-xs font-semibold">
                          Global
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))
          ) : (
            <div className="text-center p-8 text-foreground">
              <p>No questions found in the question bank.</p>
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/facultyMember/questionBank?courseId=${courseId}`,
                  )
                }
                className="text-secondary hover:underline mt-2"
              >
                Add Questions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submission Controls */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="flex justify-end gap-4 pt-4 border-t border-borderColor">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 rounded-md text-foreground font-semibold hover:bg-quaternary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-md text-white font-semibold bg-secondary hover:bg-secondary/90 disabled:bg-secondary/50 flex items-center gap-2"
        >
          {isSubmitting && (
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          )}
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};
