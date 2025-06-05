import React from 'react';
import StadeCard from '@/components/StadeCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface RandomStadesProps {
  count?: number;
  className?: string;
}

const RandomStades: React.FC<RandomStadesProps> = ({ count = 3, className = '' }) => {
  const navigate = useNavigate();
  const { stades } = useSelector((state: RootState) => state.api);
  
  // Récupérer des stades aléatoires
  const randomStades = [...stades]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  
  const handleStadeCardClick = (stadeId: string) => {
    navigate(`/stades/${stadeId}`);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {randomStades.map((stade, index) => (
        <motion.div
          key={stade.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: index * 0.3 }}
          viewport={{ once: true }}
        >
          <StadeCard 
            stade={stade} 
            onClick={() => handleStadeCardClick(stade.id)}
            className="h-full transition-shadow duration-300 cursor-pointer hover:shadow-lg"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default RandomStades;
