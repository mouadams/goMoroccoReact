import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MatchCard from '@/components/MatchCard';
// import { matches } from '@/data/matches';
// import { stades } from '@/data/stades';
// import {matches,stades, equipes} from '../api';

import { Button } from '@/components/ui/button';
import { Match } from '../types/match';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Calendar} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchStades , fetchEquipes, fetchMatches} from '../features/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';




const groupeMatchesByDate = (matchesList: Match[]) => {
  const grouped: Record<string, Match[]> = {};
  
  matchesList.forEach(match => {
    const dateKey = match.date;
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(match);
  });
  
  return Object.entries(grouped)
    .map(([date, matchs]) => ({
      date,
      formattedDate: format(parseISO(date), 'dd MMMM yyyy', { locale: fr }),
      jour: format(parseISO(date), 'EEEE', { locale: fr }),
      matchs
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const Matches = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { matches, stades, equipes, loading } = useSelector((state: RootState) => state.api);

  const [filteredMatches, setFilteredMatches] = useState(matches);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedGroupe, setSelectedGroupe] = useState('all');
  const [selectedStade, setSelectedStade] = useState('all');
  const [groupedMatches, setGroupedMatches] = useState(groupeMatchesByDate(matches));
  
  const phases = ['Groupe', 'Huitièmes', 'Quarts', 'Demi-finales', 'Match pour la 3e place', 'Finale'];
  const groupes = ['A', 'B', 'C', 'D', 'E', 'F'];

  const stadesSelect = [
    "Tous les stades",
    "Complexe Sportif Mohammed V",
    "Stade d'Adrar",
    "Complexe Sportif de Fès",
    "Stade Ibn Batouta",
    "Stade Olympique",
    "Stade de Marrakech",
    "Stade Moulay Abdellah",
    "Stade El Barid",
    "Stade Moulay Hassan"
  ]
  
  useEffect(() => {
    dispatch(fetchMatches());
    dispatch(fetchStades());
    dispatch(fetchEquipes());
  }, [dispatch]);

  useEffect(() => {
    if (!matches.length) return;
    let result = [...matches];
    
    // Filtrer par phase
    if (selectedPhase !== 'all') {
      result = result.filter(m => m.phase === selectedPhase);
    }
    
    // Filtrer par groupe
    if (selectedGroupe !== 'all') {
      result = result.filter(m => m.groupe === selectedGroupe);
    }
    

    // Filtrer par stade
    if (selectedStade !== 'all') {
      result = result.filter(m => m.stade === selectedStade);
    }
    
    // Filtrer par terme de recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(match => {
        const stade = stades.find(s => s.nom === match.stade);
        const equipe1 = equipes.find(e => e.id === match.equipe1);
        const equipe2 = equipes.find(e => e.id === match.equipe2);
      console.log(stade);
        return (
          (stade?.nom?.toLowerCase() ?? "").includes(term) ||
          (stade?.ville?.toLowerCase() ?? "").includes(term) ||
          (equipe1?.nom?.toLowerCase() ?? "").includes(term) ||
          (equipe2?.nom?.toLowerCase() ?? "").includes(term)
        );
      });
    }
    
    setFilteredMatches(result);
    setGroupedMatches(groupeMatchesByDate(result));
  }, [matches, stades, equipes, selectedPhase, selectedGroupe, selectedStade, searchTerm]);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-8 bg-gradient-to-b from-caf-green/10 to-transparent">
        <div className="container px-6 mx-auto md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-4 text-4xl font-bold">Calendrier des Matchs</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              Consultez tous les matchs de la Coupe d'Afrique des Nations 2025 qui se tiendra au Maroc.
            </p>
          </div>
        </div>
      </div>
      
      <main className="container flex-grow px-6 pb-16 mx-auto md:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Filtre et Recherche */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-subtle"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
                <Input
                  placeholder="Rechercher par équipe, stade, ville..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Select
                    value={selectedPhase}
                    onValueChange={setSelectedPhase}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les phases</SelectItem>
                      {phases.map(phase => (
                        <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select
                    value={selectedGroupe}
                    onValueChange={setSelectedGroupe}
                    disabled={selectedPhase !== 'all' && selectedPhase !== 'Groupe'}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Groupe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les groupes</SelectItem>
                      {groupes.map(groupe => (
                        <SelectItem key={groupe} value={groupe}>Groupe {groupe}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select
                    value={selectedStade}
                    onValueChange={setSelectedStade}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Stade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les stades</SelectItem>
                      {stades.map(stade => (
                        <SelectItem key={stade.id} value={stade.nom}>{stade.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {filteredMatches.length === 0 && (
              <div className="py-8 mt-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">Aucun match ne correspond à vos critères de recherche.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPhase('all');
                    setSelectedGroupe('all');
                    setSelectedStade('all');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </motion.div>
          
          {/* Affichage des matchs par date */}
          <AnimatePresence>
            {groupedMatches.map(({ date, formattedDate, jour, matchs }) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <div className="flex items-center mb-6">
                  <div className="p-2 mr-3 text-white rounded-full bg-caf-green">
                    <Calendar size={18} />
                  </div>
                  <h2 className="text-xl font-bold capitalize">
                    {jour}, {formattedDate}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {matchs.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Matches;