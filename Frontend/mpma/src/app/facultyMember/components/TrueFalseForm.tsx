"use client";

import React from "react";

export interface TrueFalseData {
  questionText: string;
  correctAnswer: boolean | null;
  difficultyLevel: string;
  marks: number | "";
}

export interface TrueFalseFormProps {
  data: TrueFalseData;
  onDataChange: (updates: Partial<TrueFalseData>) => void;
  disabled?: boolean;
}

const TrueFalseForm: React.FC<TrueFalseFormProps> = ({
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
    let processedValue: string | number | boolean | null = value;

    if (name === "correctAnswer") {
      processedValue = value === "true";
    } else if (type === "number") {
      processedValue = value === "" ? "" : Number(value);
    }
    onDataChange({ [name]: processedValue });
  };

  const handleRadioChange = (value: boolean) => {
    onDataChange({ correctAnswer: value });
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

      <div className="mt-4">
        <label className="label">
          <span className="text-xl">Correct Answer</span>
        </label>
        <div className="flex gap-4 items-center mt-2">
          <div className="form-control">
            <label className="label cursor-pointer flex gap-2">
              <input
                type="radio"
                name="correctAnswer"
                className="radio bg-tertiary checked:bg-info"
                value="true"
                checked={data.correctAnswer === true}
                onChange={() => handleRadioChange(true)}
                disabled={disabled}
              />
              <span className="label-text">True</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer flex gap-2">
              <input
                type="radio"
                name="correctAnswer"
                className="radio bg-tertiary checked:bg-info"
                value="false"
                checked={data.correctAnswer === false}
                onChange={() => handleRadioChange(false)}
                disabled={disabled}
              />
              <span className="label-text">False</span>
            </label>
          </div>
        </div>
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

export default TrueFalseForm;
