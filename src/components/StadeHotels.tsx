import React from 'react';
import { motion } from 'framer-motion';
import { Hotel } from '../types/hotel';
import { HotelCard } from './HotelCard';
import { Bed } from 'lucide-react';

interface StadeHotelsProps {
  hotels: Hotel[];
  stadeId: string;
}

const StadeHotels: React.FC<StadeHotelsProps> = ({ hotels, stadeId }) => {
  const filteredHotels = hotels.filter(hotel => String(hotel.stadeId) === stadeId);

  if (filteredHotels.length === 0) {
    return (
      <div className="py-12 text-center bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500">Aucun hôtel disponible pour ce stade.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <Bed className="mr-2 text-caf-red" />
        <h2 className="text-2xl font-bold">Hôtels à proximité</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredHotels.map(hotel => (
          <div key={hotel.id} className="group">
            <HotelCard hotel={hotel} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StadeHotels;
