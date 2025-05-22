
import React from 'react';
import { MapPin, Users } from 'lucide-react';
// import { Stade } from '@/data/stades';
import { Stade } from '../types/stade';

import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface StadeCardProps {
  stade: Stade;
}

import { STORAGE_LINK } from '@/api';

const StadeCard: React.FC<StadeCardProps> = ({ stade }) => {
  return (
    <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 group dark:bg-gray-800 rounded-xl shadow-subtle hover:shadow-hover dark:border-gray-700">
      <div className="relative overflow-hidden aspect-video">
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          Chargement de l'image...
        </div>
        <img 
          src={stade.image.includes("images/") ?  stade.image : STORAGE_LINK + stade.image} 
          alt={stade.nom}
          className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
          onLoad={(e) => {
            e.currentTarget.classList.remove('opacity-0');
            e.currentTarget.classList.add('opacity-100');
            const loadingDiv = e.currentTarget.previousElementSibling;
            if (loadingDiv) loadingDiv.classList.add('hidden');
          }}
        />
        <div className="absolute px-3 py-1 text-xs font-semibold bg-white rounded-full shadow-md top-4 right-4 dark:bg-gray-800">
          <div className="flex items-center space-x-1">
            <Users size={12} />
            <span>{stade.capacite.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold">{stade.nom}</h3>
        
        <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
          <MapPin size={16} className="mr-2 text-caf-red" />
          <span>{stade.ville}</span>
        </div>
        
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {stade.description}
        </p>
        
        <Button asChild variant="outline" className="w-full rounded-lg">
          <Link to={`/stades/${stade.nom.toLocaleLowerCase().replace(/\s+/g, "-")}`}>
            Voir les matchs
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default StadeCard;
