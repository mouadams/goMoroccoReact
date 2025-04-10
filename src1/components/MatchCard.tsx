
import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trophy, Calendar, MapPin } from 'lucide-react';

import { Match } from '../types/match';


import {stades} from '../api';
import { equipes } from '../api';


import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, compact = false }) => {
 
 
  const equipe1 = equipes?.find(e => String(e.id) === String(match.equipe1));
  const equipe2 = equipes?.find(e => String(e.id) === String(match.equipe2));
  const stade = stades?.find(s => String(s.id) === String(match.stadeId));



  if (!equipe1 || !equipe2 || !stade) {
    console.error("Equipe(s) ou stade introuvable(s) !");
  }

  const matchDate = parseISO(match.date);
  const formattedDate = format(matchDate, 'dd MMMM yyyy', { locale: fr });
  const jour = format(matchDate, 'EEEE', { locale: fr });

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-subtle hover:shadow-hover transition-all duration-300 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="bg-caf-green/10 p-1 rounded-md">
                <Calendar size={14} className="text-caf-green" />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300 capitalize">{jour}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{match.heure}</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {equipe1 && (
                <img 
                  src={equipe1.drapeau} 
                  alt={equipe1.nom}
                  className="w-6 h-4 object-cover rounded"
                />
              )}
              <span className="font-medium text-sm">{equipe1 ? equipe1.nom : match.equipe1}</span>
            </div>
            <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">VS</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{equipe2 ? equipe2.nom : match.equipe2}</span>
              {equipe2 && (
                <img 
                  src={equipe2.drapeau} 
                  alt={equipe2.nom}
                  className="w-6 h-4 object-cover rounded"
                />
              )}
            </div>
          </div>
          
          {stade && (
            <div className="mt-3 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
              <MapPin size={12} className="mr-1" />
              <span>{stade.nom}, {stade.ville}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-subtle hover:shadow-hover transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className={cn(
        "p-2 text-center text-white text-xs font-medium",
        match.phase === "Groupe" ? "bg-caf-green" :
        match.phase === "Huitièmes" ? "bg-caf-gold" :
        match.phase === "Quarts" ? "bg-caf-red" :
        match.phase === "Demi-finales" ? "bg-purple-500" :
        match.phase === "Match pour la 3e place" ? "bg-amber-600" :
        "bg-gradient-to-r from-caf-gold via-caf-red to-caf-green"
      )}>
        {match.phase} {match.groupe ? `- Groupe ${match.groupe}` : ""}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-caf-green" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">{jour}, {formattedDate}</span>
          </div>
          <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{match.heure}</div>
        </div>
        
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 flex flex-col items-center text-center space-y-3">
            {equipe1 ? (
              <>
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                  <img 
                    src={equipe1.drapeau} 
                    alt={equipe1.nom}
                    className="w-16 h-10 object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold">{equipe1.nom}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{equipe1.abreviation}</div>
                </div>
              </>
            ) : (
              <div className="font-bold">{match.equipe1}</div>
            )}
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Match {match.id}</div>
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <span className="font-bold text-lg">VS</span>
            </div>
            {match.termine !== 0 && (
              <div className="flex space-x-2 text-lg font-bold">
                <span>{match.score1}</span>
                <span>-</span>
                <span>{match.score2}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col items-center text-center space-y-3">
            {equipe2 ? (
              <>
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                  <img 
                    src={equipe2.drapeau} 
                    alt={equipe2.nom}
                    className="w-16 h-10 object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold">{equipe2.nom}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{equipe2.abreviation}</div>
                </div>
              </>
            ) : (
              <div className="font-bold">{match.equipe2}</div>
            )}
          </div>
        </div>
        
        {stade && (
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-4">
            <MapPin size={16} className="text-caf-red" />
            <span>{stade.nom}, {stade.ville}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
