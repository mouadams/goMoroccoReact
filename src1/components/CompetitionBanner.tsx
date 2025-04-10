
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const CompetitionBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-r from-caf-green via-caf-red to-caf-gold py-2 text-white text-center"
    >
      <div className="container mx-auto px-4 flex items-center justify-center space-x-3">
        <Trophy size={18} className="text-white" />
        <span className="font-semibold tracking-wide text-sm">
          Coupe d'Afrique des Nations Maroc 2025 • 10 Janvier - 9 Février
        </span>
      </div>
    </motion.div>
  );
};

export default CompetitionBanner;
