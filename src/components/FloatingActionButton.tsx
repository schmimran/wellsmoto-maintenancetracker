
import { Plus } from 'lucide-react';

type FloatingActionButtonProps = {
  onClick: () => void;
};

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-wells-red text-white flex items-center justify-center shadow-lg"
      aria-label="Add"
    >
      <Plus size={28} />
    </button>
  );
};

export default FloatingActionButton;
