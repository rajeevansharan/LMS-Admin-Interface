"use client";
import React from "react";
import Layout from "../components/Layout";

const StudentQueries = () => {
  // Placeholder data for student queries
  const queries = [
    "Query about Assignment 1",
    "Question regarding Quiz 2",
    "Clarification needed for Lecture 5",
  ];

  // Placeholder functions for button clicks
  const handleAnswer = (index: number) => {
    console.log(`Answer query ${index}`);
    // Add logic to handle answering the query
  };

  const handleDismiss = (index: number) => {
    console.log(`Dismiss query ${index}`);
    // Add logic to handle dismissing the query
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="border-2 border-borderColor p-4 bg-primary w-11/12 mx-auto">
          <div className="flex-auto">
            <div className="text-2xl font-medium p-4 text-foreground">
              Student Queries
            </div>
          </div>
          {queries.map((query, index) => (
            <div
              key={index}
              className="border-2 border-borderColor p-4 bg-tertiary hover:bg-quaternary mb-4 flex justify-between items-center" // Use flexbox to align items
            >
              <span>{query}</span> {/* Wrap query text in a span */}
              <div className="space-x-2">
                {" "}
                {/* Container for buttons */}
                <button
                  onClick={() => handleAnswer(index)}
                  className="btn btn-info font-bold py-1 px-3 rounded text-sm" // Basic styling for Answer button
                >
                  Answer
                </button>
                <button
                  onClick={() => handleDismiss(index)}
                  className="btn btn-error text-white font-bold py-1 px-3 rounded text-sm" // Basic styling for Dismiss button
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default StudentQueries;
