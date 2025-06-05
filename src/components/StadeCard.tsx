import React from 'react';
import { MapPin, Users } from 'lucide-react';
// import { Stade } from '@/data/stades';
import { Stade } from '../types/stade';

import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface StadeCardProps {
  stade: Stade;
  className?: string;
  onClick?: () => void;
}

import { STORAGE_LINK } from '@/api';

const StadeCard: React.FC<StadeCardProps> = ({ stade, className = '', onClick }) => {
  const handleExploreAround = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add your explore around logic here
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-subtle h-full transition-transform duration-300 hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={stade.image.includes("images/") ? stade.image : STORAGE_LINK + stade.image}
          alt={stade.nom}
          className="object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-105"
          loading="eager"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-lg font-bold text-white">{stade.nom}</h3>
          <p className="text-sm text-white/80">{stade.ville}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{stade.capacite.toLocaleString()} spectateurs</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {stade.anneeConstruction}
          </div>
        </div>
        
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {stade.description}
        </p>
        
        <Button 
          asChild
          variant="outline" 
          className="w-full gap-2 text-white border-none bg-gradient-to-r from-caf-green/80 to-caf-red/80 hover:from-caf-green hover:to-caf-red"
        >
          <Link to={`/stades/${stade.nom.toLowerCase().replace(/\s+/g, "-")}`}>
            <MapPin size={16} />
            Autour de moi
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default StadeCard;
