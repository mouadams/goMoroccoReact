
import React from 'react';
import { Hotel as HotelIcon } from 'lucide-react';

interface HotelProps {
  className?: string;
}

const Hotel: React.FC<HotelProps> = ({ className }) => {
  return <HotelIcon className={className} />;
};

export default Hotel;
