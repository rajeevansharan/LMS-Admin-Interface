"use client";

import React from "react";

export interface ShortAnswerData {
  questionText: string;
  correctAnswer: string;
  caseSensitive: boolean;
  wordLimit: number | "";
  difficultyLevel: string;
  marks: number | "";
}

export interface ShortAnswerFormProps {
  data: ShortAnswerData;
  onDataChange: (updates: Partial<ShortAnswerData>) => void;
  disabled?: boolean;
}

const ShortAnswerForm: React.FC<ShortAnswerFormProps> = ({
  data,
  onDataChange,
  disabled = false,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean = value;

    if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      processedValue = value === "" ? "" : Number(value);
    }
    onDataChange({ [name]: processedValue });
  };

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="text-xl">Question</span>
        </label>
        <textarea
          name="questionText"
          className="textarea textarea-bordered bg-tertiary h-24 w-full"
          placeholder="Type your question here"
          value={data.questionText}
          onChange={handleInputChange}
          required
          disabled={disabled}
        ></textarea>
      </div>

      <div className="form-control mt-4">
        <label className="label">
          <span className="text-xl">Model Answer</span>
        </label>
        <textarea
          name="correctAnswer"
          className="textarea textarea-bordered bg-tertiary h-32 w-full"
          placeholder="Type the expected answer or key points here"
          value={data.correctAnswer}
          onChange={handleInputChange}
          required
          disabled={disabled}
        ></textarea>
      </div>

      <div className="form-control mt-2">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            name="caseSensitive"
            className="checkbox checkbox-info"
            checked={data.caseSensitive}
            onChange={handleInputChange}
            disabled={disabled}
          />
          <span className="label-text">Case sensitive matching</span>
        </label>
      </div>

      <div className="form-control mt-4">
        <label className="label">
          <span className="text-xl">Word Limit (Optional)</span>
        </label>
        <input
          type="number"
          name="wordLimit"
          placeholder="Enter word limit"
          className="input input-bordered bg-tertiary w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          value={data.wordLimit}
          onChange={handleInputChange}
          min="1"
          disabled={disabled}
        />
      </div>

      <div className="form-control mt-4">
        <label className="label">
          <span className="text-xl">Difficulty Level</span>
        </label>
        <select
          name="difficultyLevel"
          className="select select-bordered bg-tertiary w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          value={data.difficultyLevel}
          onChange={handleInputChange}
          disabled={disabled}
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
          name="marks"
          placeholder="Enter marks"
          className="input input-bordered bg-tertiary w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          value={data.marks}
          onChange={handleInputChange}
          min="1"
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ShortAnswerForm;
