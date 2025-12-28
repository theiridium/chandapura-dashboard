import React from "react";

type ChartTabProps = {
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
};

const ChartTab: React.FC<ChartTabProps> = ({
  years,
  selectedYear,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onChange(year)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition
            ${
              selectedYear === year
                ? "bg-white text-gray-900 shadow dark:bg-gray-800 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
            }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
};

export default ChartTab;
