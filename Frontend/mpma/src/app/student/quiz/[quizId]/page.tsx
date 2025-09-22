'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { QuizService } from '@/services/QuizService';
import { SubmissionService } from '@/services/SubmissionService';
import { Quiz, QuestionInfo } from '@/types/Quiz';
import { StudentAnswer } from '@/types/QuizAttempt';

import QuestionDisplay from './QuestionDisplay';
import QuizTimer from './QuizTimer';

export default function QuizAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.quizId);

  const { token, user } = useAuth();

  // This log is for debugging the user's role
  console.log("Current user from context:", user);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, StudentAnswer>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId || !token) {
      return; 
    }

    const fetchQuiz = async () => {
      try {
        const data = await QuizService.getQuizById(quizId, token);
        setQuiz(data);
      } catch (err) {
        setError('Failed to load the quiz. Your session might have expired or you may not have permission. Please try logging in again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, token]);

  const handleAnswerChange = (answer: StudentAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [answer.questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz || !token) return;
    
    if (!confirm('Are you sure you want to submit your answers?')) {
        return;
    }

    setIsLoading(true);
    try {
      const submissionData = { answers: Object.values(answers) };
      await SubmissionService.submitQuizAttempt(quiz.id, submissionData, token);
      alert('Quiz submitted successfully!');
      router.push(`/student/course`);
    } catch (err) { // <--- THIS IS THE FIX
      alert('There was an error submitting your quiz. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token && !error) {
        setIsLoading(true);
    }
  }, [token, error]);

  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!quiz) return <div className="text-center p-10">Quiz not found or you do not have permission.</div>;

  const currentQuestion: QuestionInfo = quiz.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <QuizTimer onTimeUp={handleSubmit} />
      </header>
      
      <main>
        <p className="mb-4 text-gray-600 dark:text-gray-300">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
        <QuestionDisplay 
          key={currentQuestion.id}
          question={currentQuestion} 
          answer={answers[currentQuestion.id]}
          onAnswerChange={handleAnswerChange} 
        />
      </main>

      <footer className="mt-8 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0 || isLoading}
          className="px-6 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </footer>
    </div>
  );
}