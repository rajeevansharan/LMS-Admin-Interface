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
            <div className="avatar">
              <div className="w-24 rounded">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Student"
                />
              </div>
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
                  disabled
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
                  disabled
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
                disabled
              />
            </div>

            <button className="btn bg-quaternary hover:bg-tertiary hover:text-foreground btn-xs sm:btn-xs md:btn-sm lg:btn-md">
              Go Back
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default page;
