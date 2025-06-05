import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Hotel } from '@/types/hotel';
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

interface HotelCardProps {
  hotel: Hotel;
}
import { STORAGE_LINK } from '@/api';

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="overflow-hidden transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-xl hover:shadow-xl"
    >
      <div className="relative h-48">
        <img
          src={hotel.image}
          alt={hotel.nom}
          className="object-cover w-full h-full"
        />
        <div className="absolute px-3 py-1 text-sm font-medium text-white rounded-full top-4 right-4 bg-caf-red">
          {hotel.etoiles} <Star className="inline-block w-4 h-4" />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{hotel.nom}</h3>
        
        <div className="space-y-3 text-gray-600 dark:text-gray-300">
          <p className="text-sm">{hotel.description}</p>
          <div className="flex items-center">
            <MapPin className="flex-shrink-0 w-5 h-5 mt-1 mr-2 text-caf-red" />
            <p className="text-sm">À {hotel.distance} du stade</p>
          </div>
          <p className="text-sm font-medium text-caf-red">{hotel.prix} / nuit</p>
        </div>
      </div>
    </motion.div>
  );
}
