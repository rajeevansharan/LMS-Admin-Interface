import React from "react";
import Layout from "@/app/facultyMember/components/Layout";
import GradeDistributionChart from "./components/gradeDistributionChart";

type grades = {
  submit: number;
  pass: number;
  A: number;
  B: number;
  C: number;
  D: number;
  I: number;
};

const grades = [{ submit: 85, pass: 72, A: 20, B: 30, C: 40, D: 10, I: 0 }];

const page = () => {
  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <div className="border-2 border-borderColor p-3 sm:p-4 bg-primary">
          <div className="flex-auto">
            <div className="text-xl sm:text-2xl font-medium p-2 sm:p-4 text-foreground">
              Grading Analysis
            </div>
          </div>
          <div className="border-2 border-borderColor p-3 sm:p-4 bg-tertiary mt-4 flex flex-col lg:flex-row gap-6 justify-between">
            <div className="lg:flex-1 overflow-x-auto">
              <table className="min-w-[250px] w-full">
                <tbody>
                  {[
                    { label: "Submit Percentage", key: "submit" },
                    { label: "Pass Percentage", key: "pass" },
                  ].map((item, index) => (
                    <tr key={index}>
                      <td className="pr-4">{item.label}</td>
                      <td>{grades[0][item.key as keyof grades]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-[250px] w-full">
                  <thead>
                    <tr>
                      <th className="text-left pr-4">Grade Distribution</th>
                      {[
                        { label: "A", key: "A" },
                        { label: "B", key: "B" },
                        { label: "C", key: "C" },
                        { label: "D", key: "D" },
                        { label: "I", key: "I" },
                      ].map((item, index) => (
                        <th key={index} className="px-2 sm:px-3 text-center">
                          {item.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-left pr-4">Percentage</td>
                      {[
                        { key: "A" },
                        { key: "B" },
                        { key: "C" },
                        { key: "D" },
                        { key: "I" },
                      ].map((item, index) => (
                        <td key={index} className="px-2 sm:px-3 text-center">
                          {grades[0][item.key as keyof grades]}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="lg:flex-1 mt-6 lg:mt-0">
              <GradeDistributionChart grades={grades} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default page;
