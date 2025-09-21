import React from "react";
import Layout from "@/app/facultyMember/components/Layout";

const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <div className="p-6">
        <div className="border-2 border-borderColor p-4 bg-primary">
          <div className="flex text-foreground flex-row justify-between">
            <div className="text-xl align-middle">Material</div>
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
          <div className="mt-4 space-y-4">
            <div className="border-2 border-borderColor p-4 bg-tertiary rounded-md">
              <div className="flex justify-between mb-4">
                <h3 className="font-medium">Course Content</h3>
              </div>

              <div className="space-y-3">
                {/* Content items - these would typically come from a database */}
                <div className="flex items-center p-3 bg-background/80 rounded">
                  <div className="mr-3">📄</div>
                  <div className="flex-1">Course Syllabus.pdf</div>
                  <div className="flex space-x-2">
                    <button className="btn btn-xs btn-warning">Remove</button>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-background/80 rounded">
                  <div className="mr-3">📝</div>
                  <div className="flex-1">Week 1: Introduction</div>
                  <div className="flex space-x-2">
                    <button className="btn btn-xs btn-warning">Remove</button>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-background/80 rounded">
                  <div className="mr-3">🔗</div>
                  <div className="flex-1">Recommended Reading</div>
                  <div className="flex space-x-2">
                    <button className="btn btn-xs btn-warning">Remove</button>
                  </div>
                </div>
              </div>

              {/* Upload section */}
              <div className="mt-4 border-2 border-dashed border-borderColor p-4 rounded-md text-center">
                <p className="opacity-70">Drag files here or click to upload</p>
                <button className="btn btn-sm mt-2">Upload Files</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </Layout>
  );
};

export default Content;
