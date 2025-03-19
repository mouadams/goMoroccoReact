import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import MatchCard from '@/components/MatchCard';
import StadeCard from '@/components/StadeCard';
import EquipeCard from '@/components/EquipeCard';
import { matches } from '@/data/matches';
import { stades } from '@/data/stades';
import { equipes } from '@/data/equipes';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const Index = () => {
  // Récupérer les 3 prochains matchs
  const prochainsMatchs = [...matches]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Récupérer 3 stades aléatoirement
  const stadesAffichés = [...stades].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  // Récupérer 6 équipes aléatoirement
  const equipesAffichées = [...equipes].sort(() => 0.5 - Math.random()).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Section Prochains Matchs */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-6 md:px-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={container}
              className="max-w-7xl mx-auto"
            >
              <motion.div variants={item} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Prochains Matchs</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Retrouvez les prochains matchs de la Coupe d'Afrique des Nations 2025 qui se tiendra au Maroc.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {prochainsMatchs.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </motion.div>
              
              <motion.div variants={item} className="mt-12 text-center">
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/matches">
                    Voir tous les matchs
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Section Stades */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={container}
              className="max-w-7xl mx-auto"
            >
              <motion.div variants={item} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Stades de la compétition</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Découvrez les magnifiques stades marocains qui accueilleront les matchs de la CAN 2025.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stadesAffichés.map(stade => (
                  <StadeCard key={stade.id} stade={stade} />
                ))}
              </motion.div>
              
              <motion.div variants={item} className="mt-12 text-center">
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/stades">
                    Découvrir tous les stades
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Section Équipes */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-6 md:px-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={container}
              className="max-w-7xl mx-auto"
            >
              <motion.div variants={item} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Équipes participantes</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  24 équipes africaines s'affrontent pour remporter le prestigieux trophée de la Coupe d'Afrique des Nations.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipesAffichées.map(equipe => (
                  <EquipeCard key={equipe.id} equipe={equipe} />
                ))}
              </motion.div>
              
              <motion.div variants={item} className="mt-12 text-center">
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/equipes">
                    Voir toutes les équipes
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
