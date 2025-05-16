
import { ReactNode } from "react";

type SegmentOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type SegmentedControlProps = {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
};

const SegmentedControl = ({ options, value, onChange }: SegmentedControlProps) => {
  return (
    <div className="flex bg-wells-lightGray p-1 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 py-2 px-4 text-center rounded-md transition-all ${
            value === option.value
              ? "bg-white dark:bg-wells-darkGray text-wells-darkGray dark:text-white shadow-sm"
              : "text-gray-500"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {option.icon}
            <span>{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
