"use client";
import React, { useState, ChangeEvent, FormEvent, JSX } from "react";

interface FormState {
  userName: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePassword(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    userName: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (form.newPassword !== form.confirmNewPassword) {
      alert("New passwords do not match.");
      // Reset form to initial values
      setForm({
        userName: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      return;
    }

    console.log("Submitted form:", form);

    // Reset form after submission (optional)
    setForm({
      userName: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  return (
    <main className="flex-1 p-6 flex items-center justify-center">
      <section className="bg-gray-800 p-8 text-black bg-white rounded-lg w-full max-w-2xl border-2">
        <h2 className="text-2xl mb-6 font-bold border-b pb-3 text-center">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-5 gap-4 items-center">
            <label className="col-span-2 text-right mr-8">Username:</label>
            <input
              type="text"
              name="userName"
              placeholder="Enter your username"
              value={form.userName}
              onChange={handleChange}
              className="col-span-3 p-3 bg-gray-100 rounded w-full"
            />
          </div>

          <div className="grid grid-cols-5 gap-4 items-center">
            <label className="col-span-2 text-right mr-8">
              Current Password:
            </label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={handleChange}
              className="col-span-3 p-3 bg-gray-100 rounded w-full"
            />
          </div>

          <div className="grid grid-cols-5 gap-4 items-center">
            <label className="col-span-2 text-right mr-8">New Password:</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              className="col-span-3 p-3 bg-gray-100 rounded w-full"
            />
          </div>

          <div className="grid grid-cols-5 gap-4 items-center">
            <label className="col-span-2 text-right mr-8">
              Confirm Password:
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              value={form.confirmNewPassword}
              onChange={handleChange}
              className="col-span-3 p-3 bg-gray-100 rounded w-full"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="w-40 ml-auto bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-medium transition-colors"
            >
              Change Password
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
