import React from "react";
import { format } from "date-fns";

export interface Activity {
  id: number;
  title: string;
  date: Date;
  priority: "high" | "medium" | "low";
  module: string;
}

interface UpcomingActivitiesProps {
  activities?: Activity[];
  isLoading?: boolean;
}

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-green-100 text-green-800 border-green-300",
};

const UpcomingActivities: React.FC<UpcomingActivitiesProps> = ({
  activities = [],
  isLoading = false,
}) => {
  // Sort activities by date
  const sortedActivities = [...activities].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold mb-4 text-primary">
          Upcoming Activities
        </h2>
        <div className="py-8 text-center text-gray-500">
          Loading activities...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-primary">
        Upcoming Activities
      </h2>

      <div className="space-y-3">
        {sortedActivities.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            No upcoming activities found
          </div>
        ) : (
          sortedActivities.map((activity) => (
            <div
              key={activity.id}
              className="p-3 border rounded-md flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-md flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold">
                  {format(activity.date, "d")}
                </span>
                <span className="text-xs uppercase">
                  {format(activity.date, "MMM")}
                </span>
              </div>

              <div className="flex-grow">
                <h3 className="font-semibold">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.module}</p>
              </div>

              <div
                className={`px-2 py-1 text-xs rounded-full border ${priorityColors[activity.priority]}`}
              >
                {activity.priority}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Sample activities data for demonstration
export const sampleActivities: Activity[] = [
  {
    id: 1,
    title: "Grade Submission Deadline",
    date: new Date(2025, 2, 7),
    priority: "high",
    module: "Module 1",
  },
  {
    id: 2,
    title: "Course Committee Meeting",
    date: new Date(2025, 2, 12),
    priority: "medium",
    module: "All Modules",
  },
  {
    id: 3,
    title: "Exam Paper Submission",
    date: new Date(2025, 2, 18),
    priority: "high",
    module: "Module 2",
  },
  {
    id: 4,
    title: "Module Review Session",
    date: new Date(2025, 2, 22),
    priority: "low",
    module: "Module 1",
  },
];

export default UpcomingActivities;
