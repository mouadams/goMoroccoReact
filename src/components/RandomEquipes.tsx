import React from 'react';
import EquipeCard from '@/components/EquipeCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface RandomEquipesProps {
  count?: number;
  className?: string;
}

const RandomEquipes: React.FC<RandomEquipesProps> = ({ count = 3, className = '' }) => {
  const navigate = useNavigate();
  const { equipes } = useSelector((state: RootState) => state.api);
  
  // Récupérer des équipes aléatoires
  const randomEquipes = [...equipes]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  
  const handleEquipeCardClick = (equipeId: string) => {
    navigate(`/equipes/${equipeId}`);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {randomEquipes.map((equipe, index) => (
        <motion.div
          key={equipe.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: index * 0.3 }}
          viewport={{ once: true }}
        >
          <EquipeCard 
            equipe={equipe} 
            onClick={() => handleEquipeCardClick(equipe.id)}
            className="h-full transition-shadow duration-300 cursor-pointer hover:shadow-lg"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default RandomEquipes;
