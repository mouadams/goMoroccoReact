
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  className?: string;
}

const CanCountdown: React.FC<CountdownProps> = ({ className = '' }) => {
  // État pour le compte à rebours
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Date de l'événement CAN 2025 (20 décembre 2025)
  const eventDate = new Date('2025-12-20T00:00:00');
  
  // Fonction pour calculer le temps restant
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = eventDate.getTime() - now.getTime();
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }
  };
  
  // Mettre à jour le compte à rebours toutes les secondes
  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`py-8 ${className}`}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-caf-green">
            La CAN 2025 débute dans
          </h2>
          <div className="flex justify-center gap-4 md:gap-8">
            {[
              { value: timeLeft.days, label: 'Jours' },
              { value: timeLeft.hours, label: 'Heures' },
              { value: timeLeft.minutes, label: 'Minutes' },
              { value: timeLeft.seconds, label: 'Secondes' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-white dark:bg-gray-800 text-caf-green dark:text-caf-green text-2xl md:text-4xl font-bold rounded-lg px-4 py-3 md:px-6 md:py-5 shadow-md min-w-[70px] md:min-w-[90px]">
                  {item.value}
                </div>
                <span className="text-xs mt-2 md:text-sm text-gray-600 dark:text-gray-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanCountdown;
