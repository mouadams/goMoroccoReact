import React from 'react';
import MatchCard from '@/components/MatchCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface RandomMatchesProps {
  count?: number;
  className?: string;
}

const RandomMatches: React.FC<RandomMatchesProps> = ({ count = 3, className = '' }) => {
  const navigate = useNavigate();
  const { matches } = useSelector((state: RootState) => state.api);
  
  // Récupérer des matchs aléatoires
  const randomMatches = [...matches].sort(() => 0.5 - Math.random()).slice(0, count);
  
  const handleMatchCardClick = (matchId: string) => {
    navigate(`/matches/${matchId}`);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {randomMatches.map((match, index) => (
        <motion.div
          key={match.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: index * 0.3 }}
          viewport={{ once: true }}
        >
          <MatchCard 
            match={match} 
            className="h-full transition-shadow duration-300 cursor-pointer hover:shadow-lg"
            onClick={() => handleMatchCardClick(match.id)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default RandomMatches;
