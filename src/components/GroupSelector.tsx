
import React, { useState } from 'react';
import { equipes } from '@/data/equipes';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GroupSelectorProps {
  className?: string;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({ className = '' }) => {
  // Liste des groupes disponibles
  const groups = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  return (
    <div className={`${className}`}>
      <h3 className="text-2xl font-bold mb-6 text-center">Groupes de la CAN 2025</h3>
      <Tabs defaultValue="A" className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          {groups.map(group => (
            <TabsTrigger key={group} value={group}>
              Groupe {group}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {groups.map(group => (
          <TabsContent key={group} value={group}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {equipes
                .filter(equipe => equipe.groupe === group)
                .map(equipe => (
                  <motion.div
                    key={equipe.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/equipes/${equipe.id}`}>
                      <Card className="hover:shadow-md transition-all duration-300 cursor-pointer">
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-white">
                            <img
                              src={equipe.drapeau}
                              alt={`Drapeau ${equipe.nom}`}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold truncate">{equipe.nom}</h3>
                            <p className="text-sm text-gray-500">Rang FIFA: {equipe.rang}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GroupSelector;
