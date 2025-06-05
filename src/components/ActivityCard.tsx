
import React from 'react';
import { MapPin, Clock, Bike } from 'lucide-react';
import { Activity } from '@/data/activities';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  // Convert external image URLs to local paths
  const imagePath = activity.image.replace('https://images.unsplash.com', '/images/activities');
  
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={`/${activity.image}`} 
          alt={activity.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
          loading="eager"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white text-black dark:bg-black dark:text-white">
            {activity.price}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{activity.name}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Bike size={12} />
            <span>{activity.category}</span>
          </Badge>
        </div>
        <CardDescription className="flex items-center">
          <span className="text-sm">À {activity.address ? activity.address.split(',')[0] : 'proximité'} du stade</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {activity.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex flex-col items-start gap-2">
        {activity.address && (
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(activity.address)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-start gap-2 hover:text-caf-green transition-colors"
          >
            <MapPin size={16} className="text-green-600 mt-0.5 shrink-0" />
            <span className="text-sm">{activity.address}</span>
          </a>
        )}
        
        {activity.website && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-green-600 shrink-0" />
            <a 
              href={activity.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium hover:text-caf-green transition-colors"
            >
              Site web
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
