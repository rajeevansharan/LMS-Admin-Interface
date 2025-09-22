import React from "react";
import STHeader from "../../components/STHeader";
import STFooter from "../../components/STFooter";
import FileViewer from "./components/FileViewer";
import CustomButton from "../../components/CustomButton";

const StudentSubmission = () => {
  const file = "/sample.pdf";
  const marks = 100;

  return (
    <div>
      <STHeader />
      <div className="h-20 text-foreground bg-quinary flex items-center justify-center">
        <div className="text-lg p-6">Set Marks</div>
        <div className="p-6 text-lg">
          <input className="bg-tertiary w-40 h-10 text-right" type="text" /> out
          of {marks}
        </div>
        <div className="p-3">
          <CustomButton label="Set" />
        </div>
      </div>
      <FileViewer viewFile={file} />
      <STFooter />
    </div>
  );
};

export default StudentSubmission;
