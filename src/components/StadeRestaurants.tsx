import React from 'react';
import { motion } from 'framer-motion';
//import { Restaurant } from '@/data/restaurants';
import { Restaurant } from '@/types/restaurant';
import { RestaurantCard } from './RestaurantCard';
import { Utensils } from 'lucide-react';

interface StadeRestaurantsProps {
  restaurants: Restaurant[];
  stadeId: string;
}

const StadeRestaurants: React.FC<StadeRestaurantsProps> = ({ restaurants, stadeId }) => {
  const filteredRestaurants = restaurants.filter(restaurant => String(restaurant.stadeId) === stadeId);

  if (filteredRestaurants.length === 0) {
    return (
      <div className="py-12 text-center bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500">Aucun restaurant disponible pour ce stade.</p>
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
        <Utensils className="mr-2 text-caf-red" />
        <h2 className="text-2xl font-bold">Restaurants à proximité</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredRestaurants.map(restaurant => (
          <div key={restaurant.id} className="group">
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StadeRestaurants;