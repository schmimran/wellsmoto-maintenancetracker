
import { ReactNode } from 'react';
import Logo from './Logo';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  showLogo?: boolean;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  actions?: ReactNode;
};

const PageHeader = ({
  title,
  showLogo = true,
  showBackButton = false,
  onBackButtonClick,
  actions
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-wells-darkGray">
      <div className="flex items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackButtonClick}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        {showLogo && <Logo size="sm" />}
        <h1 className="text-xl font-bold ml-3">{title}</h1>
      </div>
      
      {actions && (
        <div className="flex items-center">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
