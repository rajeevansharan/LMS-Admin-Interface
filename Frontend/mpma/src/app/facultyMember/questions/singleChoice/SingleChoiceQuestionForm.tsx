"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";

// Payload structure for API (can be moved to a types file)
export interface QuestionApiPayload {
  questionText: string;
  questionType: "SINGLE_CHOICE";
  difficultyLevel: string;
  marks: number;
  courseId: string | null; // Keep consistent with how it might be used
  optionsSCMC: string[];
  optionIds?: number[]; // Include option IDs if they exist for updating
  correctOptionIndexSC: number;
  correctOptionIndicesMC: number[]; // Dummy value or empty array if multiple choice part of payload
}

// Props for the form component
export interface SingleChoiceQuestionFormProps {
  initialData?: {
    questionText?: string;
    options?: string[];
    optionIds?: number[]; // Add option IDs for tracking existing options
    correctOptionIndex?: number;
    difficultyLevel?: string;
    marks?: number | "";
  };
  // For displaying messages/status controlled by the parent (e.g., API call status)
  externalIsLoading?: boolean;
  externalError?: string | null;
  externalSuccessMessage?: string | null;
}

// Ref handle for parent to call methods on the form
export interface SingleChoiceQuestionFormRef {
  submit: () => QuestionApiPayload | null; // Validates and returns payload or null
  reset: () => void;
}

const SingleChoiceQuestionForm = forwardRef<
  SingleChoiceQuestionFormRef,
  SingleChoiceQuestionFormProps
>(
  (
    { initialData, externalIsLoading, externalError, externalSuccessMessage },
    ref,
  ) => {
    const [questionText, setQuestionText] = useState(
      initialData?.questionText || "",
    );
    const [options, setOptions] = useState(
      initialData?.options || ["", "", "", ""],
    );
    const [optionIds, setOptionIds] = useState<number[] | undefined>(
      initialData?.optionIds,
    );
    const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(
      initialData?.correctOptionIndex ?? null,
    );
    const [difficultyLevel, setDifficultyLevel] = useState(
      initialData?.difficultyLevel || "Medium",
    );
    const [marks, setMarks] = useState<number | "">(initialData?.marks || "");

    const [validationError, setValidationError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      submit: () => {
        setValidationError(null); // Clear previous validation errors
        if (!questionText.trim()) {
          setValidationError("Please enter a question");
          return null;
        }
        if (correctOptionIndex === null) {
          setValidationError("Please select a correct answer");
          return null;
        }
        const emptyOptionsIndex = options.findIndex((opt) => opt.trim() === "");
        if (emptyOptionsIndex !== -1) {
          setValidationError(
            `Please enter text for Option ${String.fromCharCode(65 + emptyOptionsIndex)}`,
          );
          return null;
        }
        if (marks === "" || Number(marks) <= 0) {
          setValidationError(
            "Please enter valid marks for this question (must be greater than 0)",
          );
          return null;
        }

        const questionPayload: QuestionApiPayload = {
          questionText,
          questionType: "SINGLE_CHOICE",
          difficultyLevel,
          marks: Number(marks),
          courseId: null, // This might need to be passed in or configured if it's not always null
          optionsSCMC: options,
          // Include option IDs if they exist (for updating existing options)
          ...(optionIds && { optionIds }),
          correctOptionIndexSC: correctOptionIndex,
          correctOptionIndicesMC: [], // Empty array for single choice questions
        };
        return questionPayload;
      },
      reset: () => {
        setQuestionText(initialData?.questionText || "");
        setOptions(initialData?.options || ["", "", "", ""]);
        setOptionIds(initialData?.optionIds);
        setCorrectOptionIndex(initialData?.correctOptionIndex ?? null);
        setDifficultyLevel(initialData?.difficultyLevel || "Medium");
        setMarks(initialData?.marks || "");
        setValidationError(null);
      },
    }));

    const handleOptionChange = (index: number, value: string) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
    };

    const addOption = () => {
      setOptions([...options, ""]);
      // For new options, no need to update optionIds as they don't have IDs yet
    };

    const removeOption = (index: number) => {
      if (options.length <= 2) {
        setValidationError("A minimum of 2 options is required");
        return;
      }

      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);

      // If we have optionIds, remove the corresponding ID as well
      if (optionIds && optionIds.length > index) {
        const newOptionIds = [...optionIds];
        newOptionIds.splice(index, 1);
        setOptionIds(newOptionIds);
      }

      // Update correctOptionIndex if needed
      if (correctOptionIndex === index) {
        setCorrectOptionIndex(null);
      } else if (correctOptionIndex !== null && correctOptionIndex > index) {
        setCorrectOptionIndex(correctOptionIndex - 1);
      }
    };

    return (
      <>
        {(validationError || externalError) && (
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
            <span>{validationError || externalError}</span>
          </div>
        )}

        {externalSuccessMessage && (
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
            <span>{externalSuccessMessage}</span>
          </div>
        )}

        {/* Form elements */}
        <div className="form-control">
          <label className="label">
            <span className="text-xl">Question Text</span>
          </label>
          <textarea
            className="textarea textarea-bordered bg-tertiary h-24"
            placeholder="Enter your question here"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label className="label">
            <span className="text-xl">Options</span>
          </label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="correct-answer"
                className="radio bg-tertiary checked:bg-info"
                checked={correctOptionIndex === index}
                onChange={() => setCorrectOptionIndex(index)}
              />
              <input
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                className="input input-bordered bg-tertiary flex-grow"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="btn btn-sm btn-circle btn-outline btn-error"
                  disabled={externalIsLoading}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="btn btn-sm bg-quaternary hover:bg-tertiary hover:text-foreground mt-2"
            disabled={externalIsLoading}
          >
            Add Option
          </button>
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="text-xl">Difficulty Level</span>
          </label>
          <select
            className="select select-bordered bg-tertiary w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="text-xl">Marks</span>
          </label>
          <input
            type="number"
            placeholder="Enter marks"
            className="input input-bordered bg-tertiary w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            value={marks}
            onChange={(e) =>
              setMarks(e.target.value === "" ? "" : Number(e.target.value))
            }
            min="1"
            required
          />
        </div>
      </>
    );
  },
);

SingleChoiceQuestionForm.displayName = "SingleChoiceQuestionForm";
export default SingleChoiceQuestionForm;
