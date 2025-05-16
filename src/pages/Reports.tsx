
import PageHeader from '@/components/PageHeader';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const Reports = () => {
  const { preferences } = useUserPreferences();
  
  return (
    <div className="pb-16">
      <PageHeader title="Reports" />
      
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Reports coming soon</h2>
        <p className="text-gray-500 dark:text-gray-400">Distance unit: {preferences.distanceUnit}</p>
      </div>
    </div>
  );
};

export default Reports;
