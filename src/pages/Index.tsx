import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CanCountdown from '@/components/CanCountdown';
import MoroccoMap from '@/components/MoroccoMap';
import RandomStades from '@/components/RandomStades';
import RandomMatches from '@/components/RandomMatches';
import RandomEquipes from '@/components/RandomEquipes';
import GroupSelector from '@/components/GroupSelector';
import StadeHotels from '@/components/StadeHotels';
import StadeRestaurants from '@/components/StadeRestaurants';
//import { useLanguage } from '@/hooks/use-language';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Hotel from '@/components/icons/Hotel';
import Utensils from '@/components/icons/Utensils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchStades, fetchEquipes, fetchMatches, fetchHotels, fetchRestaurants } from '../features/apiSlice';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const Index = () => {
//  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { stades, equipes, matches, hotels, restaurants, loading, error } = useSelector((state: RootState) => state.api);
  const defaultStadeId = String(stades[0]?.id || '');
  
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    if (!stades.length) dispatch(fetchStades());
    if (!equipes.length) dispatch(fetchEquipes());
    if (!matches.length) dispatch(fetchMatches());
    if (!hotels.length) dispatch(fetchHotels());
    if (!restaurants.length) dispatch(fetchRestaurants());
  }, [dispatch, stades.length, equipes.length, matches.length, hotels.length, restaurants.length]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setKey(prevKey => prevKey + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="relative overflow-hidden">
          <Hero />
        </section>
        
        <motion.section 
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          className="relative overflow-hidden"
        >
          <CanCountdown />
        </motion.section>
        
        <section className="py-10 bg-white dark:bg-gray-900">
          <div className="container px-6 mx-auto md:px-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mx-auto max-w-7xl"
            >
              <motion.div variants={fadeInUp} className="mb-8 text-center">
                <span className="inline-block px-3 py-1 mb-3 text-sm font-medium bg-green-100 rounded-full dark:bg-green-900/30 text-caf-green">
                  {('Découvrez le Maroc')}
                </span>
                <h2 className="mb-4 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-caf-green via-emerald-600 to-caf-red bg-clip-text">
                  {('Stades de la CAN 2025')}
                </h2>
                <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                  {('Découvrez les stades marocains qui accueilleront la compétition sur cette carte interactive.')}
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="p-6 overflow-hidden bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
                <MoroccoMap />
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        <section className="py-10 bg-gray-50 dark:bg-gray-800/50">
          <div className="container px-6 mx-auto md:px-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mx-auto max-w-7xl"
            >
              <motion.div variants={fadeInUp} className="mb-10 text-center">
                <span className="inline-block px-3 py-1 mb-3 text-sm font-medium bg-red-100 rounded-full dark:bg-red-900/30 text-caf-red">
                  {('Tout sur la CAN')}
                </span>
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  {('Explorez la CAN 2025')}
                </h2>
              </motion.div>
              
              <h3 className="mb-6 text-2xl font-bold text-center">Stades</h3>
              <RandomStades key={`stades-${key}`} className="mb-16" />
              
              <h3 className="mb-6 text-2xl font-bold text-center">Lieux à proximité des stades</h3>
              <Tabs defaultValue="hotels" className="mb-16">
                <TabsList className="w-full max-w-xl p-1 mx-auto mb-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                  <TabsTrigger 
                    value="hotels" 
                    className="w-full data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <div className="flex items-center justify-center gap-2 py-2">
                      <Hotel className="w-5 h-5" />
                      <span className="font-medium">Hôtels</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="restaurants"
                    className="w-full data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <div className="flex items-center justify-center gap-2 py-2">
                      <Utensils className="w-5 h-5" />
                      <span className="font-medium">Restaurants</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="hotels">
                  <StadeHotels hotels={hotels} stadeId={defaultStadeId} />
                </TabsContent>
                
                <TabsContent value="restaurants">
                  <StadeRestaurants restaurants={restaurants} stadeId={defaultStadeId} />
                </TabsContent>
              </Tabs>
              
              <h3 className="mb-6 text-2xl font-bold text-center">Prochains matchs</h3>
              <RandomMatches key={`matches-${key}`} className="mb-16" />
              
              <h3 className="mb-6 text-2xl font-bold text-center">Équipes participantes</h3>
              <RandomEquipes key={`equipes-${key}`} className="mb-16" />
              
              <GroupSelector className="mb-10" />
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
