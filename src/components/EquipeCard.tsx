import React from 'react';
import { Trophy, Flag } from 'lucide-react';
import { Equipe } from '@/types/equipe';
import { cn } from '@/lib/utils';

interface EquipeCardProps {
  equipe: Equipe;
  className?: string;
  onClick?: () => void;
}

const EquipeCard: React.FC<EquipeCardProps> = ({ equipe, className = '', onClick }) => {
  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 ${className}`}
      onClick={onClick}
    >
      {/* Image du drapeau avec overlay */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-gray-900/10 via-gray-900/30 to-gray-900/70" />
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
          <span className="text-sm text-gray-500">Chargement</span>
        </div>
        <img 
          src={equipe.drapeau || 'https://via.placeholder.com/400x300?text=Drapeau+non+disponible'} 
          alt={equipe.nom}
          className="object-cover w-full h-full transition-transform duration-700 ease-out transform group-hover:scale-110"
          onLoad={(e) => {
            e.currentTarget.classList.remove('opacity-0');
            e.currentTarget.classList.add('opacity-100');
            const loadingDiv = e.currentTarget.previousElementSibling;
            if (loadingDiv) loadingDiv.classList.add('hidden');
          }}
        />
        
        {/* Badge du groupe */}
        {equipe.groupe && (
          <div className="absolute px-5 py-2 text-sm font-semibold text-white transition-all duration-300 transform border rounded-full shadow-lg top-4 right-4 bg-black/70 backdrop-blur-md border-white/20 group-hover:scale-105">
            Groupe {equipe.groupe}
          </div>
        )}
      </div>
      
      {/* Contenu de la carte */}
      <div className="p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 dark:text-white group-hover:text-caf-green">
          {equipe.nom}
        </h3>
        
        <div className="flex items-center p-4 space-x-3 transition-all duration-300 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700 group-hover:border-caf-green/20">
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Flag className="text-caf-green" size={20} />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {equipe.confederation || 'CAF'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EquipeCard;
