import React from "react";
import Layout from "@/app/facultyMember/components/Layout";

const page = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="border-2 border-borderColor p-4 bg-primary ">
          <div className="flex-auto">
            <div className="text-2xl font-medium p-4 text-foreground">
              Student Queries
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-lg">Index Number</th>
                  <th className="text-lg">Student Name</th>
                  <th className="text-lg">Query</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 1,
                    indexNumber: "123456A",
                    studentName: "Cy Sam",
                    query: "Quality Control Specialist",
                  },
                  {
                    id: 2,
                    indexNumber: "123456B",
                    studentName: "Hart Alice",
                    query: "Desktop Support Technician",
                  },
                  {
                    id: 3,
                    indexNumber: "123456C",
                    studentName: "Brice Albert",
                    query: "Tax Accountant",
                  },
                ].map((student, index) => (
                  <tr key={student.id} className="hover:bg-quaternary">
                    <th>{index + 1}</th>
                    <td>{student.indexNumber}</td>
                    <td>{student.studentName}</td>
                    <td>{student.query}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="form-control justify-end items-end w-full">
              <label className="label cursor-pointer flex items-center gap-2">
                <span className="label-text">Show Answered</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default page;
