import React from "react";
import Link from "next/link";

interface CustomButtonProps {
  label: string;
  url?: string;
  width?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, url, width }) => {
  const commonClasses = `bg-quaternary hover:bg-tertiary text-foreground font-bold py-2 px-4 rounded-xl btn-md text-center duration-300 ease-in-out ${width ?? ""}`;

  if (url) {
    return (
      <Link href={url}>
        <button className={commonClasses}>{label}</button>
      </Link>
    );
  }

  return <button className={commonClasses}>{label}</button>;
};

export default CustomButton;
