"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";

// Payload structure for API (can be moved to a types file)
export interface QuestionApiPayload {
  questionText: string;
  questionType: "MULTIPLE_CHOICE";
  difficultyLevel: string;
  marks: number;
  courseId: string | null; // Keep consistent with how it might be used
  optionsSCMC: string[];
  correctOptionIndicesMC: number[];
  correctOptionIndexSC: number; // Dummy value or actual if single choice part of payload
}

// Props for the form component
export interface MultipleChoiceQuestionFormProps {
  initialData?: {
    questionText?: string;
    options?: string[];
    correctOptionIndices?: number[];
    difficultyLevel?: string;
    marks?: number | "";
  };
  // For displaying messages/status controlled by the parent (e.g., API call status)
  externalIsLoading?: boolean;
  externalError?: string | null;
  externalSuccessMessage?: string | null;
}

// Ref handle for parent to call methods on the form
export interface MultipleChoiceQuestionFormRef {
  submit: () => QuestionApiPayload | null; // Validates and returns payload or null
  reset: () => void;
}

const MultipleChoiceQuestionForm = forwardRef<
  MultipleChoiceQuestionFormRef,
  MultipleChoiceQuestionFormProps
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
    const [correctOptionIndices, setCorrectOptionIndices] = useState<number[]>(
      initialData?.correctOptionIndices || [],
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
        if (correctOptionIndices.length === 0) {
          setValidationError("Please select at least one correct answer");
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
          questionType: "MULTIPLE_CHOICE",
          difficultyLevel,
          marks: Number(marks),
          courseId: null, // This might need to be passed in or configured if it's not always null
          optionsSCMC: options,
          correctOptionIndicesMC: correctOptionIndices,
          correctOptionIndexSC: 0, // Dummy value as in original
        };
        return questionPayload;
      },
      reset: () => {
        setQuestionText(initialData?.questionText || "");
        setOptions(initialData?.options || ["", "", "", ""]);
        setCorrectOptionIndices(initialData?.correctOptionIndices || []);
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

    const toggleCorrectOption = (index: number) => {
      setCorrectOptionIndices((prevIndices) => {
        if (prevIndices.includes(index)) {
          return prevIndices.filter((i) => i !== index);
        } else {
          return [...prevIndices, index];
        }
      });
    };

    const addOption = () => {
      setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
      if (options.length <= 2) {
        setValidationError("A minimum of 2 options is required");
        return;
      }
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
      setCorrectOptionIndices((prevIndices) => {
        const newIndices = prevIndices.filter((i) => i !== index);
        return newIndices.map((i) => (i > index ? i - 1 : i));
      });
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
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                className="input input-bordered bg-tertiary flex-grow"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={correctOptionIndices.includes(index)}
                onChange={() => toggleCorrectOption(index)}
              />
              <label className="label cursor-pointer">
                <span className="label-text">Correct</span>
              </label>
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

MultipleChoiceQuestionForm.displayName = "MultipleChoiceQuestionForm";
export default MultipleChoiceQuestionForm;
