import React from "react";
import Layout from "../lecturePage";

const LectureSchedule = () => {
  return (
    <Layout>
      <div className="p-6 justify-between items-center flex flex-col md:flex-row w-full mx-auto max-w-4xl gap-4">
        {["Cancel", "Create"].map((label) => (
          <button
            key={label}
            className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-md btn-wide"
          >
            {label}
          </button>
        ))}
      </div>
    </Layout>
  );
};

export default LectureSchedule;
