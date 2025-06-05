import { Restaurant } from '@/types/restaurant';
import { MapPin, Phone, Globe, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="overflow-hidden transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-xl hover:shadow-xl"
    >
      <div className="relative h-48">
        <img
          src={restaurant.image}
          alt={restaurant.nom}
          className="object-cover w-full h-full"
        />
        <div className="absolute px-3 py-1 text-sm font-medium text-white rounded-full top-4 right-4 bg-caf-red">
          {restaurant.cuisine}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{restaurant.nom}</h3>
        
        <div className="space-y-3 text-gray-600 dark:text-gray-300">
          <div className="flex items-start">
            <MapPin className="flex-shrink-0 w-5 h-5 mt-1 mr-2 text-caf-red" />
            <p className="text-sm">{restaurant.adresse}</p>
          </div>
          
          {restaurant.telephone && (
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-caf-red" />
              <p className="text-sm">{restaurant.telephone}</p>
            </div>
          )}
          
          {restaurant.horaires && (
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-caf-red" />
              <p className="text-sm">{restaurant.horaires}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}