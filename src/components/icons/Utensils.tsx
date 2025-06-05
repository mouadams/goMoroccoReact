
import React from 'react';
import { Utensils as UtensilsIcon } from 'lucide-react';

interface UtensilsProps {
  className?: string;
}

const Utensils: React.FC<UtensilsProps> = ({ className }) => {
  return <UtensilsIcon className={className} />;
};

export default Utensils;
