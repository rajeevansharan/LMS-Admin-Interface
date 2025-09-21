import React from "react";
import Layout from "@/app/facultyMember/components/Layout";

const page = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="border-2 border-borderColor p-4 bg-primary">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-medium p-4 text-foreground">
              Add Student Info
            </div>
            <div className="flex flex-col items-end">
              <label className="label">
                <span className="label-text">Student Photo</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-info w-full max-w-xs"
              />
            </div>
          </div>

          <form className="flex flex-col gap-4 p-4">
            <div className="flex gap-4 w-full">
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Index Number</span>
                </label>
                <input
                  type="text"
                  placeholder="Index Number"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">NIC</span>
                </label>
                <input
                  type="text"
                  placeholder="NIC"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Student Name</span>
              </label>
              <input
                type="text"
                placeholder="Student Name"
                className="input input-bordered w-full"
              />
            </div>

            <button
              type="submit"
              className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-xs sm:btn-xs md:btn-sm lg:btn-md"
            >
              Add Student
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default page;
