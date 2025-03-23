
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StadeCard from '@/components/StadeCard';
import MatchCard from '@/components/MatchCard';
// import { stades } from '@/data/stades';
import {stades} from '../api';
// import { matches } from '@/data/matches';
// import { hotels } from '@/data/hotels';

import { hotels } from '../api';
import { matches } from '../api';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import StadeHotels from '@/components/StadeHotels';

const StadeDetail = () => {
  const { id } = useParams<{ id: string }>();

  const stade = stades.find(s => s.nom.toLowerCase().replace(/\s+/g, "-") === id);
  const stadeId = stade ? stade.id : null;
  const stadeMatches = stadeId ? matches.filter(m => m.stadeId === stadeId) : [];
  const stadeHotels = stadeId ? hotels.filter(h => h.stadeId === stadeId) : [];
  
  if (!stade) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Stade non trouvé</h1>
        <Link to="/stades" className="text-caf-green">
          Retour à la liste des stades
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-6 md:px-10">
          <div className="mb-8">
            <Link to="/stades" className="inline-flex items-center text-gray-600 hover:text-caf-green transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Retour aux stades
            </Link>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-subtle mb-10"
            >
              <div className="relative h-80">
                <img 
                  src={stade.image} 
                  alt={stade.nom}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-8">
                    <h1 className="text-4xl font-bold text-white mb-2">{stade.nom}</h1>
                    <p className="text-white/80 text-lg">{stade.ville}, Maroc</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-bold mb-4">À propos du stade</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {stade.description}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Informations</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Capacité</div>
                        <div className="font-medium">{stade.capacite.toLocaleString()} spectateurs</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Année de construction</div>
                        <div className="font-medium">{stade.annee_construction}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Nombre de matchs</div>
                        <div className="font-medium">{stadeMatches.length} matchs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Tabs for Matches and Hotels */}
            <Tabs defaultValue="matches" className="mb-12">
              <TabsList className="mb-6">
                <TabsTrigger value="matches">Matchs</TabsTrigger>
                <TabsTrigger value="hotels">Hôtels à proximité</TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches">
                <h2 className="text-2xl font-bold mb-6">Matchs joués dans ce stade</h2>
                
                {stadeMatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stadeMatches.map(match => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-gray-500">Aucun match prévu dans ce stade pour le moment.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="hotels">
                <StadeHotels hotels={stadeHotels} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const StadesList = () => {
  const [filteredStades, setFilteredStades] = useState(stades);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      setFilteredStades(
        stades.filter(
          stade => 
            stade.nom.toLowerCase().includes(term) || 
            stade.ville.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredStades(stades);
    }
  }, [searchTerm]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="pt-24 pb-8 bg-gradient-to-b from-caf-green/10 to-transparent">
        <div className="container mx-auto px-6 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Stades de la compétition</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Découvrez les magnifiques stades marocains qui accueilleront les matchs de la CAN 2025.
            </p>
          </div>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Recherche */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-subtle p-6 mb-10"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Rechercher par nom ou ville..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredStades.length === 0 && (
              <div className="mt-6 text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Aucun stade ne correspond à votre recherche.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Réinitialiser la recherche
                </Button>
              </div>
            )}
          </motion.div>
          
          {/* Liste des stades */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredStades.map(stade => (
                <StadeCard key={stade.id} stade={stade} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const Stades = () => {
  const { id } = useParams<{ id: string }>();
  
  if (id) {
    return <StadeDetail />;
  }
  
  return <StadesList />;
};

export default Stades;
