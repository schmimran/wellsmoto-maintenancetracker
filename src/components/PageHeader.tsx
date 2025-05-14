
import Logo from './Logo';

type PageHeaderProps = {
  title: string;
  showLogo?: boolean;
};

const PageHeader = ({ title, showLogo = true }: PageHeaderProps) => {
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-wells-darkGray">
      {showLogo && <Logo size="sm" />}
      <h1 className="text-xl font-bold ml-3">{title}</h1>
    </div>
  );
};

export default PageHeader;
