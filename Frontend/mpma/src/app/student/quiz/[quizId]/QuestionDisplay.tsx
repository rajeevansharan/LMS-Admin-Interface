// src/app/student/quiz/[quizId]/QuestionDisplay.tsx
'use client';

import { QuestionInfo } from '@/types/Quiz';
import { StudentAnswer } from '@/types/QuizAttempt';

interface QuestionDisplayProps {
  question: QuestionInfo;
  answer: StudentAnswer | undefined;
  onAnswerChange: (answer: StudentAnswer) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, answer, onAnswerChange }) => {
  
  const handleSingleChoiceChange = (optionId: number) => {
    onAnswerChange({ questionId: question.id, selectedOptionIds: [optionId] });
  };

  const handleMultiChoiceChange = (optionId: number) => {
    const currentSelection = answer?.selectedOptionIds || [];
    const newSelection = currentSelection.includes(optionId)
      ? currentSelection.filter(id => id !== optionId)
      : [...currentSelection, optionId];
    onAnswerChange({ questionId: question.id, selectedOptionIds: newSelection });
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onAnswerChange({ questionId: question.id, textAnswer: e.target.value });
  };

  const renderOptions = () => {
    if (!question.options) return null;

    switch (question.questionType) {
      case 'SINGLE_CHOICE':
      case 'TRUE_FALSE':
        return question.options.map(opt => (
          <div key={opt.id} className="p-2 my-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={answer?.selectedOptionIds?.includes(opt.id) || false}
                onChange={() => handleSingleChoiceChange(opt.id)}
                className="form-radio h-5 w-5"
              />
              <span>{opt.text}</span>
            </label>
          </div>
        ));

      case 'MULTIPLE_CHOICE':
        return question.options.map(opt => (
          <div key={opt.id} className="p-2 my-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name={`question-${question.id}`}
                checked={answer?.selectedOptionIds?.includes(opt.id) || false}
                onChange={() => handleMultiChoiceChange(opt.id)}
                className="form-checkbox h-5 w-5 rounded"
              />
              <span>{opt.text}</span>
            </label>
          </div>
        ));

      default:
        return null;
    }
  };

  const renderInput = () => {
    switch(question.questionType) {
        case 'SHORT_ANSWER':
            return <input 
                        type="text" 
                        value={answer?.textAnswer || ''} 
                        onChange={handleTextChange}
                        className="w-full p-2 border rounded-md mt-4 dark:bg-gray-800"
                        placeholder="Type your answer here"
                    />
        case 'ESSAY':
            return <textarea 
                        value={answer?.textAnswer || ''} 
                        onChange={handleTextChange}
                        className="w-full p-2 border rounded-md mt-4 h-40 dark:bg-gray-800"
                        placeholder="Type your essay here"
                    />
        default:
            return null;
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <p className="text-sm text-gray-500">Question {question.marks} marks</p>
      <h3 className="text-xl font-semibold my-4">{question.questionText}</h3>
      <div>{renderOptions()}</div>
      <div>{renderInput()}</div>
    </div>
  );
};

export default QuestionDisplay;