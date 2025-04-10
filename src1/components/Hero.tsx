
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trophy } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-20 min-h-[90vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
        <div className="absolute inset-0 bg-pattern opacity-5" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="mb-4 inline-flex items-center space-x-2 bg-caf-green/10 text-caf-green px-4 py-1.5 rounded-full">
            <Trophy size={16} />
            <span className="text-sm font-medium">Coupe d'Afrique des Nations</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="block">CAN Maroc 2025</span>
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-caf-green via-caf-red to-caf-gold">La fête du football africain</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Préparez-vous pour une compétition exceptionnelle où les meilleures équipes africaines s'affronteront dans des stades marocains pour remporter le titre continental.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Button asChild size="lg" className="rounded-full font-medium bg-caf-green hover:bg-caf-green/90 text-white">
              <Link to="/matches">
                Voir les matchs
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full font-medium border-caf-dark/20 hover:bg-caf-dark/5">
              <Link to="/stades">
                Découvrir les stades
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-16 relative"
          >
            <div className="relative mx-auto w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                  Chargement de l'image...
                </div>
                <img 
                  src="/images/moulay-abdlah.jpg" 
                  alt="" 
                  className="w-full h-full object-cover transition-opacity duration-500 opacity-0"
                  onLoad={(e) => {
                    e.currentTarget.classList.remove('opacity-0');
                    e.currentTarget.classList.add('opacity-100');
                    e.currentTarget.parentElement?.classList.add('bg-transparent');
                    const loadingDiv = e.currentTarget.previousElementSibling;
                    if (loadingDiv) loadingDiv.classList.add('hidden');
                  }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Le Maroc accueille la CAN 2025</h3>
                <p className="text-white/80 text-sm">24 équipes, 6 stades, des millions de fans.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
