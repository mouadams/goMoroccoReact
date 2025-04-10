
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EquipeCard from '@/components/EquipeCard';
// import { equipes } from '@/data/equipes';
// import { equipes } from '../api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEquipes} from '../features/apiSlice';
import { RootState, AppDispatch } from '../store';
const Equipes = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { equipes, loading, error } = useSelector((state: RootState) => state.api);
  const [filteredEquipes, setFilteredEquipes] = useState(equipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  

    useEffect(() => {
      if (!equipes.length) dispatch(fetchEquipes());
     
    }, [dispatch, equipes.length]);

  useEffect(() => {
    let result = [...equipes];
    
    // Filtrer par groupe
    if (activeTab !== 'all') {
      result = result.filter(e => e.groupe === activeTab);
    }
    
    // Filtrer par terme de recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        equipe => 
          equipe.nom.toLowerCase().includes(term) || 
          equipe.entraineur.toLowerCase().includes(term)
      );
    }
    
    setFilteredEquipes(result);
  }, [activeTab, searchTerm, equipes]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="pt-24 pb-8 bg-gradient-to-b from-caf-green/10 to-transparent">
        <div className="container mx-auto px-6 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Équipes participantes</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              24 équipes africaines s'affrontent pour remporter le prestigieux trophée de la Coupe d'Afrique des Nations.
            </p>
          </div>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Filtre et Recherche */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-subtle p-6 mb-10"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Rechercher une équipe ou un entraîneur..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-4 md:flex md:flex-wrap">
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="A">Groupe A</TabsTrigger>
                    <TabsTrigger value="B">Groupe B</TabsTrigger>
                    <TabsTrigger value="C">Groupe C</TabsTrigger>
                    <TabsTrigger value="D">Groupe D</TabsTrigger>
                    <TabsTrigger value="E">Groupe E</TabsTrigger>
                    <TabsTrigger value="F">Groupe F</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {filteredEquipes.length === 0 && (
              <div className="mt-6 text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Aucune équipe ne correspond à vos critères de recherche.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('all');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </motion.div>
          
          {/* Liste des équipes */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEquipes.map(equipe => (
                <EquipeCard key={equipe.id} equipe={equipe} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Equipes;
