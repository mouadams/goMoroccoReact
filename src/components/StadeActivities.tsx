
import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from '@/data/activities';
import ActivityCard from './ActivityCard';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface StadeActivitiesProps {
  activities: Activity[];
  stadeId: string;
}

const StadeActivities: React.FC<StadeActivitiesProps> = ({ activities, stadeId }) => {
  const { t } = useLanguage();
  const stadeActivities = activities.filter(activity => activity.stadeId === stadeId);
  
  if (stadeActivities.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500">{t('Aucune activité disponible pour ce stade.')}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <MapPin className="mr-2 text-caf-red" />
        <h2 className="text-2xl font-bold">{t('Activités à proximité')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stadeActivities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </motion.div>
  );
};

export default StadeActivities;
