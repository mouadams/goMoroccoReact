
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StadeCard from '@/components/StadeCard';
import MatchCard from '@/components/MatchCard';
// import { stades } from '@/data/stades';
// import {stades, hotels, matches} from '../api';
// import { matches } from '@/data/matches';
// import { hotels } from '@/data/hotels';


import StadeRestaurants from '@/components/StadeRestaurants';
import { useParams , Link} from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StadeHotels from '@/components/StadeHotels';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStades , fetchHotels, fetchMatches, fetchRestaurants} from '../features/apiSlice';
import { RootState, AppDispatch } from '../store';
//import { restaurants } from '@/data/restaurants';



const StadeDetail = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { stades, hotels, matches, restaurants , loading, error } = useSelector((state: RootState) => state.api);
  const { id } = useParams<{ id: string }>();


  const stade = stades.find(s => s.nom.toLowerCase().replace(/\s+/g, "-") === id);
  const stadeId = stade ? stade.id : null;
  const stadeMatches = stadeId ? matches.filter(m => m.stadeId === stadeId) : [];
  const stadeHotels = stadeId ? hotels.filter(h => h.stadeId === stadeId) : [];
  const stadeRestaurants = stadeId ? restaurants.filter(r => r.stadeId === stadeId) : [];
  
  useEffect(() => {
    if (!stades.length) dispatch(fetchStades());
    if (!hotels.length) dispatch(fetchHotels());
    if (!matches.length) dispatch(fetchMatches());
    if(!restaurants.length) dispatch(fetchRestaurants());
  }, [dispatch, stades.length, hotels.length, matches.length ,restaurants.length]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!stade) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="mb-4 text-2xl font-bold">Stade non trouvé</h1>
        <Link to="/stades" className="text-caf-green">
          Retour à la liste des stades
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-8">
        <div className="container px-6 mx-auto md:px-10">
          <div className="mb-8">
            <Link to="/stades" className="inline-flex items-center text-gray-600 transition-colors hover:text-caf-green">
              <ArrowLeft size={16} className="mr-2" />
              Retour aux stades
            </Link>
          </div>
          
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-subtle"
            >
              <div className="relative h-80">
                <img 
                  src={stade.image} 
                  alt={stade.nom}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent">
                  <div className="p-8">
                    <h1 className="mb-2 text-4xl font-bold text-white">{stade.nom}</h1>
                    <p className="text-lg text-white/80">{stade.ville}, Maroc</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <h2 className="mb-4 text-xl font-bold">À propos du stade</h2>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">
                      {stade.description}
                    </p>
                  </div>
                  
                  <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <h2 className="mb-4 text-xl font-bold">Informations</h2>
                    
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
                <TabsTrigger value="restaurants">Restaurants à proximité</TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches">
                <h2 className="mb-6 text-2xl font-bold">Matchs joués dans ce stade</h2>
                
                {stadeMatches.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stadeMatches.map(match => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-gray-500">Aucun match prévu dans ce stade pour le moment.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="hotels">
                <StadeHotels hotels={stadeHotels} />
              </TabsContent>

              <TabsContent value="restaurants">
                <StadeRestaurants restaurants={stadeRestaurants} />
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
  const dispatch = useDispatch<AppDispatch>();
  const { stades, loading, error } = useSelector((state: RootState) => state.api);
  
  const [filteredStades, setFilteredStades] = useState(stades);
  const [searchTerm, setSearchTerm] = useState('');
  


  useEffect(() => {
    if (!stades.length) dispatch(fetchStades()); 
  }, [dispatch, stades.length]); // ✅ Prevents unnecessary API calls

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
  }, [searchTerm, stades]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-8 bg-gradient-to-b from-caf-green/10 to-transparent">
        <div className="container px-6 mx-auto md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-4 text-4xl font-bold">Stades de la compétition</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              Découvrez les magnifiques stades marocains qui accueilleront les matchs de la CAN 2025.
            </p>
          </div>
        </div>
      </div>
      
      <main className="container flex-grow px-6 pb-16 mx-auto md:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Recherche */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-subtle"
          >
            <div className="relative">
              <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
              <Input
                placeholder="Rechercher par nom ou ville..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredStades.length === 0 && (
              <div className="py-8 mt-6 text-center">
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
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
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
