import React from "react";

type GradeType = {
  submit: number;
  pass: number;
  A: number;
  B: number;
  C: number;
  D: number;
  I: number;
};

interface GradeDistributionChartProps {
  grades: GradeType[];
}

const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({
  grades,
}) => {
  return (
    <div className="font-semibold">
      <h3 className="mb-4 text-base sm:text-lg">Grade Distribution</h3>
      <div className="flex items-end h-32 sm:h-48 gap-3 sm:gap-4 justify-center lg:justify-center">
        {[
          { key: "A", color: "bg-green-500" },
          { key: "B", color: "bg-blue-400" },
          { key: "C", color: "bg-yellow-400" },
          { key: "D", color: "bg-orange-400" },
          { key: "I", color: "bg-red-400" },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 sm:w-10 lg:w-12 ${item.color} rounded-t-md transition-all duration-300`}
              style={{
                height:
                  grades[0][item.key as keyof GradeType] === 0
                    ? "4px"
                    : `${Math.max(grades[0][item.key as keyof GradeType] * 2, 10)}px`,
              }}
            ></div>
            <div className="mt-1 text-xs sm:text-sm">{item.key}</div>
            <div className="text-[10px] sm:text-xs">
              {grades[0][item.key as keyof GradeType]}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeDistributionChart;
