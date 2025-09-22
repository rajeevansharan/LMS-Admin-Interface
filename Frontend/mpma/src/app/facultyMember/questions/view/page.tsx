"use client";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";

type QuestionType =
  | "MultipleChoice"
  | "SingleChoice"
  | "TrueFalse"
  | "ShortAnswer";

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // For MultipleChoice and SingleChoice
  correctAnswer?: string | string[] | boolean; // Correct answer(s)
  // Add other relevant fields for a question, e.g., author, createdAt, etc.
}

const ViewQuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      // Mock data for now:
      const mockQuestions: Question[] = [
        {
          id: "1",
          text: "What is the capital of France?",
          type: "SingleChoice",
          options: ["London", "Paris", "Berlin", "Madrid"],
          correctAnswer: "Paris",
        },
        {
          id: "2",
          text: "Explain the theory of relativity.",
          type: "ShortAnswer",
          correctAnswer:
            "A theory regarding the relationship between space and time.",
        },
        {
          id: "3",
          text: "Select all prime numbers.",
          type: "MultipleChoice",
          options: ["2", "4", "7", "9", "11"],
          correctAnswer: ["2", "7", "11"],
        },
        {
          id: "4",
          text: "The Earth is flat.",
          type: "TrueFalse",
          correctAnswer: false,
        },
        {
          id: "5",
          text: "What are the main components of a cell?",
          type: "ShortAnswer",
          correctAnswer:
            "Cell membrane, cytoplasm, and nucleus (in eukaryotic cells).",
        },
      ];
      setQuestions(mockQuestions);
    };

    fetchQuestions();
  }, []);

  const renderQuestionDetails = (question: Question) => {
    const isCorrect = (option: string) => {
      if (
        question.type === "MultipleChoice" &&
        Array.isArray(question.correctAnswer)
      ) {
        return question.correctAnswer.includes(option);
      }
      return question.correctAnswer === option;
    };

    switch (question.type) {
      case "MultipleChoice":
      case "SingleChoice":
        return (
          <ul className="list-disc list-inside mt-2 space-y-1">
            {question.options?.map((option, index) => (
              <li
                key={index}
                className={`${isCorrect(option) ? "text-green-600 font-semibold" : ""}`}
              >
                {option}
                {isCorrect(option) && (
                  <span className="ml-2 text-green-600">(Correct)</span>
                )}
              </li>
            ))}
          </ul>
        );
      case "TrueFalse":
        return (
          <div className="mt-2">
            <p className="text-sm text-foreground">
              Correct Answer:
              <span
                className={`font-semibold ${question.correctAnswer ? "text-green-600" : "text-red-600"}`}
              >
                {String(question.correctAnswer)}
              </span>
            </p>
          </div>
        );
      case "ShortAnswer":
        return (
          <div className="mt-2">
            <p className="text-sm text-foreground">
              Correct Answer:
              <span className="font-semibold text-foreground">
                {" "}
                {question.correctAnswer}
              </span>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-primary min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-foreground">
          All Questions
        </h1>
        {questions.length === 0 ? (
          <p className="text-center text-foreground">No questions found.</p>
        ) : (
          <ul className="space-y-6">
            {questions.map((question) => (
              <li
                key={question.id}
                className="p-6 bg-tertiary shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <p className="text-xl font-semibold text-foreground mb-2">
                  {question.text}
                </p>
                <p className="text-xs text-foreground bg-background inline-block px-2 py-1 mb-3">
                  Type: {question.type}
                </p>
                {renderQuestionDetails(question)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default ViewQuestionsPage;
