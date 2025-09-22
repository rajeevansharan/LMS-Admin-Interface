// app/facultyMember/questionBank/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "@/app/facultyMember/components/Layout";
import CustomButton from "@/app/facultyMember/components/CustomButton";
import { CourseService } from "@/services/CourseService";
import { useAuth } from "@/contexts/AuthContext";

// Define types for question options
interface QuestionOption {
  width: string;
  url: string;
}

interface QuestionType {
  type: string;
  options: {
    create: QuestionOption;
    manage: QuestionOption;
  };
}

// Question types with create and manage options
const questionTypes: QuestionType[] = [
  {
    type: "Single Choice",
    options: {
      create: {
        width: "w-32",
        url: "/facultyMember/questions/singleChoice/create",
      },
      manage: {
        width: "w-32",
        url: "/facultyMember/questions/singleChoice/manage",
      },
    },
  },
  {
    type: "Multiple Choice",
    options: {
      create: {
        width: "w-32",
        url: "/facultyMember/questions/multipleChoice/create",
      },
      manage: {
        width: "w-32",
        url: "/facultyMember/questions/multipleChoice/manage",
      },
    },
  },
  {
    type: "True False",
    options: {
      create: {
        width: "w-32",
        url: "/facultyMember/questions/trueFalse/create",
      },
      manage: {
        width: "w-32",
        url: "/facultyMember/questions/trueFalse/manage",
      },
    },
  },
  {
    type: "Short Answer",
    options: {
      create: {
        width: "w-32",
        url: "/facultyMember/questions/shortAnswer/create",
      },
      manage: {
        width: "w-32",
        url: "/facultyMember/questions/shortAnswer/manage",
      },
    },
  },
];

const QuestionBankPage = () => {
  const searchParams = useSearchParams();
  const { token } = useAuth(); // Get token from auth context
  const courseIdParam = searchParams.get("courseId");
  const courseId = courseIdParam ? parseInt(courseIdParam, 10) : null;

  // State for course name and loading status
  const [courseName, setCourseName] = useState<string | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);

  // Effect to fetch course name when component mounts or courseId/token changes
  useEffect(() => {
    if (courseId && token) {
      setIsLoadingCourse(true); // Start loading
      CourseService.getCourseById(courseId, token)
        .then((course) => {
          setCourseName(course.name);
        })
        .catch((err) => {
          console.error("Failed to fetch course name:", err);
          setCourseName("Unknown Course"); // Set a fallback name on error
        })
        .finally(() => {
          setIsLoadingCourse(false); // Stop loading
        });
    } else {
      setIsLoadingCourse(false); // No courseId, so not loading
    }
  }, [courseId, token]);

  const constructUrl = (baseUrl: string): string => {
    if (courseId) {
      return `${baseUrl}?courseId=${courseId}`;
    }
    return baseUrl;
  };

  return (
    <Layout>
      <div className="p-6 flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center w-full">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Question Bank
          </h1>

          {/* Upgraded context display */}
          <div className="mb-8 text-center">
            {isLoadingCourse ? (
              <p className="text-info">Loading context...</p>
            ) : courseId && courseName ? (
              <p className="text-success">
                Managing questions for:{" "}
                <span className="font-bold">{courseName}</span>
              </p>
            ) : (
              <p className="text-info">You are in the Global Question Bank.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
            {questionTypes.map(
              (questionType: QuestionType, typeIndex: number) => (
                <div
                  key={`type-${typeIndex}`}
                  className="bg-primary p-6 rounded-lg shadow-md flex flex-col items-center border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-semibold mb-4 text-foreground">
                    {questionType.type}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                    <CustomButton
                      key={`${typeIndex}-create`}
                      label="Create"
                      width={questionType.options.create.width}
                      url={constructUrl(questionType.options.create.url)}
                    />
                    <CustomButton
                      key={`${typeIndex}-manage`}
                      label="Manage"
                      width={questionType.options.manage.width}
                      url={constructUrl(questionType.options.manage.url)}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuestionBankPage;
