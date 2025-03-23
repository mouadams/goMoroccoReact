
import React from 'react';
import { Trophy, Flag } from 'lucide-react';
import { Equipe } from '@/types/equipe';
import { cn } from '@/lib/utils';

interface EquipeCardProps {
  equipe: Equipe;
}

const EquipeCard: React.FC<EquipeCardProps> = ({ equipe }) => {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-subtle hover:shadow-hover transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className={cn(
        "h-1.5",
        equipe.groupe === "A" ? "bg-caf-green" :
        equipe.groupe === "B" ? "bg-caf-red" :
        equipe.groupe === "C" ? "bg-caf-gold" :
        equipe.groupe === "D" ? "bg-blue-500" :
        equipe.groupe === "E" ? "bg-purple-500" :
        "bg-orange-500"
      )} />
      
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-12 overflow-hidden rounded-md border border-gray-100 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
            <img 
              src={equipe.drapeau} 
              alt={equipe.nom}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-bold">{equipe.nom}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Groupe {equipe.groupe}</span>
              <span>•</span>
              <span>Rang FIFA: {equipe.rang}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Confédération:</span>
            <span className="font-medium">{equipe.confederation}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Entraîneur:</span>
            <span className="font-medium">{equipe.entraineur}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Code:</span>
            <span className="font-medium">{equipe.abreviation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipeCard;
