import React from "react";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex space-x-4 border-b pb-2 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`py-2 px-4 ${
            activeTab === tab
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          {tab[0].toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}
