"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface StudentData {
  userName: string;
  password: string;
  emailAddress: string;
  country: string;
  fullName: string;
  contactNo: string;
  department: string;
  course: string;
  year: string;
  gender: string;
  dateOfBirth: string;
  indexNo: string;
  registrationNo: string;
  permanentAddress: string;
  currentAddress: string;
}

const StudentProfile: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const studentId = "12";

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/studentProfile/${studentId}`)
      .then((res) => {
        setStudentData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!studentData) return <div>No student data available.</div>;

  return (
    <main className="flex-1 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex">
          {/* Profile Information */}
          <div className="flex-1 p-6 text-gray-800">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              Student Profile
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Each field follows the same pattern */}
              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Username:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.userName}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Password:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.password}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Email Address:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.emailAddress}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Country:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.country}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Full Name:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.fullName}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Contact Number:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.contactNo}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Department:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.department}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Course:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.course}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Year:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.year}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Gender:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.gender}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Date of Birth:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.dateOfBirth}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Index Number:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.indexNo}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Registration Number:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.registrationNo}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Permanent Address:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.permanentAddress}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-center">
                <label className="col-span-2 font-semibold text-right">
                  Current Address:
                </label>
                <div className="col-span-3 bg-gray-100 p-2 rounded">
                  {studentData.currentAddress}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Photo Section */}
          <div className="w-72 bg-gray-50 p-6 flex flex-col items-center justify-center border-l">
            <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 flex items-center justify-center" />
            <h3 className="text-lg font-semibold text-gray-800">
              {studentData.fullName}
            </h3>
            <p className="text-gray-600">{studentData.indexNo}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudentProfile;
