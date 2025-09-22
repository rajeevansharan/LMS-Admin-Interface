import React from "react";
import Layout from "@/app/facultyMember/components/Layout";
// import CustomButton from "../../components/CustomButton";

const addNewContent = () => {
  return (
    <Layout>
      This is a older page that is no longer needed, due to UI improvements
      {/* <div className="flex justify-center items-center gap-4 p-6">
        <CustomButton
          label="Content Upload"
          url={"/facultyMember/courseModule/addNewContent/contentUpload"}
          width="w-1/4"
        />
        <CustomButton
          label="Schedule Lecture"
          url={"/facultyMember/courseModule/addNewContent/newLecture"}
          width="w-1/4"
        />
        <CustomButton
          label="Question Set"
          url={"/facultyMember/courseModule/addNewContent/questionSet"}
          width="w-1/4"
        />
      </div> */}
    </Layout>
  );
};

export default addNewContent;
