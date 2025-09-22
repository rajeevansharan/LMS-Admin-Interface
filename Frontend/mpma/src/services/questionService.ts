// Define the structure for backend question data
export interface BackendQuestion {
  id: number;
  questionText: string;
  questionType: string;
  correctAnswerTF?: boolean;
  optionsSCMC?: string[];
  correctOptionIndexSC?: number;
  correctOptionIndicesMC?: number[];
  correctAnswerSA?: string;
}

// Define the frontend question types
export type QuestionType =
  | "MultipleChoice"
  | "SingleChoice"
  | "TrueFalse"
  | "ShortAnswer";

// Define the frontend question interface
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string | string[] | boolean;
}

/**
 * Maps a backend question type to a frontend question type
 */
const mapQuestionType = (backendType: string): QuestionType => {
  switch (backendType) {
    case "TRUE_FALSE":
      return "TrueFalse";
    case "SINGLE_CHOICE":
      return "SingleChoice";
    case "MULTIPLE_CHOICE":
      return "MultipleChoice";
    case "SHORT_ANSWER":
      return "ShortAnswer";
    default:
      return "ShortAnswer"; // Default case
  }
};

/**
 * Maps a backend question to a frontend question
 */
const mapToFrontendQuestion = (item: BackendQuestion): Question => {
  const question: Question = {
    id: item.id.toString(),
    text: item.questionText,
    type: mapQuestionType(item.questionType),
  };

  // Handle different question types
  switch (item.questionType) {
    case "TRUE_FALSE":
      question.correctAnswer = item.correctAnswerTF;
      break;
    case "SINGLE_CHOICE":
      if (item.optionsSCMC) {
        question.options = item.optionsSCMC;
        if (
          typeof item.correctOptionIndexSC === "number" &&
          item.optionsSCMC[item.correctOptionIndexSC]
        ) {
          question.correctAnswer = item.optionsSCMC[item.correctOptionIndexSC];
        }
      }
      break;
    case "MULTIPLE_CHOICE":
      if (item.optionsSCMC) {
        question.options = item.optionsSCMC;
        if (item.correctOptionIndicesMC) {
          question.correctAnswer = item.correctOptionIndicesMC
            .map((index: number) => item.optionsSCMC?.[index])
            .filter(Boolean) as string[];
        }
      }
      break;
    case "SHORT_ANSWER":
      question.correctAnswer = item.correctAnswerSA;
      break;
  }

  return question;
};

/**
 * Gets mock question data for development or testing
 */
export const getMockQuestions = (): Question[] => {
  return [
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
};

/**
 * Fetches all questions from the backend API
 */
export const fetchQuestions = async (): Promise<Question[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/questions`,
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as BackendQuestion[];
  return data.map(mapToFrontendQuestion);
};

/**
 * Fetches a specific question by ID from the backend API
 */
export const fetchQuestionById = async (id: string): Promise<Question> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/questions/${id}`,
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as BackendQuestion;
  return mapToFrontendQuestion(data);
};

/**
 * Fetches questions for a specific course from the backend API
 */
export const fetchQuestionsByCourse = async (
  courseId: string,
): Promise<Question[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/questions/course/${courseId}`,
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as BackendQuestion[];
  return data.map(mapToFrontendQuestion);
};
