
import React from 'react';
import { Star, MapPin, Clock, Phone, Utensils } from 'lucide-react';
//import { Restaurant } from '@/data/restaurants';
import { Restaurant } from '@/types/restaurant';
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
import { STORAGE_LINK } from '@/api';
// 
const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden aspect-video">
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          Chargement de l'image..
        </div>
        <img 
        loading='lazy'
          src={restaurant.image.includes("https://") ?  restaurant.image : STORAGE_LINK + restaurant.image}
          alt={restaurant.nom}
          className="object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-105"
          onLoad={(e) => {
            e.currentTarget.classList.remove('opacity-0');
            e.currentTarget.classList.add('opacity-100');
            const loadingDiv = e.currentTarget.previousElementSibling;
            if (loadingDiv) loadingDiv.classList.add('hidden');
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge className="text-black bg-white dark:bg-black dark:text-white">
            {restaurant.prixMoyen}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{restaurant.nom}</CardTitle>
          <div className="flex items-center">
            <Star size={14} className="mr-1 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">{restaurant.note}</span>
          </div>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Utensils size={14} className="text-gray-500" />
          <span className="text-sm">{restaurant.cuisine}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {restaurant.description}
        </p>
        
        <div className="space-y-2 text-sm">
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.adresse)}`}
            target="_blank"
            rel="noopener noreferrer" 
            className="flex items-center text-gray-600 transition-colors dark:text-gray-300 hover:text-caf-red"
          >
            <MapPin size={14} className="mr-2 text-caf-red shrink-0" />
            <span className="line-clamp-1">{restaurant.adresse}</span>
          </a>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock size={14} className="mr-2 text-caf-green shrink-0" />
            <span className="line-clamp-1">{restaurant.horaires}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-caf-red">
            À {restaurant.distance}
          </span>
          <a 
            href={`tel:${restaurant.telephone.replace(/\s+/g, '')}`} 
            className="flex items-center text-sm font-medium text-caf-green hover:underline"
          >
            <Phone size={14} className="mr-1" />
            Appeler
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;