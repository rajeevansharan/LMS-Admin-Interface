import React from "react";
import Layout from "@/app/facultyMember/components/Layout";

const LecturePage = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <div className="p-6">
        <div className="border-2 border-borderColor p-4 bg-primary">
          <div className="flex text-foreground flex-row justify-between">
            <div className="text-xl align-middle">Lecture Schedule</div>
            <div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text mr-4">Show to Students</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="border-2 border-borderColor p-4 bg-tertiary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">Title</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">Description</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">Start Time</label>
                <input
                  type="datetime-local"
                  className="input input-bordered input-primary w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">End Time</label>
                <input
                  type="datetime-local"
                  className="input input-bordered input-primary w-full"
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">Venue/Meeting Link</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </Layout>
  );
};

export default LecturePage;
