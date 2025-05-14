
import { ChevronRight } from "lucide-react";

type SettingsItemProps = {
  title: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
};

const SettingsItem = ({ title, onClick, rightElement }: SettingsItemProps) => {
  return (
    <div 
      className={`py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <span className="text-base">{title}</span>
      {rightElement ? (
        rightElement
      ) : onClick ? (
        <ChevronRight className="text-gray-400" size={20} />
      ) : null}
    </div>
  );
};

export default SettingsItem;
