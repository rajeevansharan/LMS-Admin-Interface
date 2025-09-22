import React from "react";

const FileViewer = ({ viewFile }: { viewFile: string }) => {
  return (
    <div>
      <div className="flex justify-center" style={{ height: "90vh" }}>
        <object
          data={viewFile}
          type="application/pdf"
          style={{ flex: 1 }}
        ></object>
      </div>
    </div>
  );
};

export default FileViewer;
