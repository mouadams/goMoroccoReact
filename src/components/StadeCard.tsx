
import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { Stade } from '@/data/stades';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface StadeCardProps {
  stade: Stade;
}

const StadeCard: React.FC<StadeCardProps> = ({ stade }) => {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-subtle hover:shadow-hover transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="aspect-video relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          Chargement de l'image...
        </div>
        <img 
          src={stade.image} 
          alt={stade.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          onLoad={(e) => {
            e.currentTarget.classList.remove('opacity-0');
            e.currentTarget.classList.add('opacity-100');
            const loadingDiv = e.currentTarget.previousElementSibling;
            if (loadingDiv) loadingDiv.classList.add('hidden');
          }}
        />
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full py-1 px-3 text-xs font-semibold shadow-md">
          <div className="flex items-center space-x-1">
            <Users size={12} />
            <span>{stade.capacite.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{stade.nom}</h3>
        
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <MapPin size={16} className="mr-2 text-caf-red" />
          <span>{stade.ville}</span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
          {stade.description}
        </p>
        
        <Button asChild variant="outline" className="w-full rounded-lg">
          <Link to={`/stades/${stade.id}`}>
            Voir les matchs
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default StadeCard;
