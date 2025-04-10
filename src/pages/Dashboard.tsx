
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { matches } from '@/data/matches';
import { stades } from '@/data/stades';
import { equipes } from '@/data/equipes';
import { hotels } from '@/data/hotels';
import { Sidebar, SidebarContent, SidebarProvider, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Calendar, Home, BarChart3, MapPin, Shield, Users, Hotel, LogOut, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from '@/components/AdminLogin';

// Define a type for different admin sections
type AdminSection = 'dashboard' | 'matches' | 'stades' | 'equipes' | 'utilisateurs' | 'hotels';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const { toast } = useToast();
  
  // Data for the pie chart
  const data = [
    { name: 'Casablanca', value: matches.filter(match => match.stade === 'Complexe Sportif Mohammed V').length },
    { name: 'Rabat', value: matches.filter(match => match.stade === 'Stade Moulay Abdellah').length },
    { name: 'Marrakech', value: matches.filter(match => match.stade === 'Stade de Marrakech').length },
    { name: 'Tanger', value: matches.filter(match => match.stade === 'Stade Ibn Batouta').length },
    { name: 'Autres', value: matches.filter(match => !['Complexe Sportif Mohammed V', 'Stade Moulay Abdellah', 'Stade de Marrakech', 'Stade Ibn Batouta'].includes(match.stade)).length },
  ];
  
  const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#8884d8'];
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Déconnecté",
      description: "Vous êtes maintenant déconnecté du tableau de bord.",
    });
  };
  
  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
    if (success) {
      toast({
        title: "Connecté",
        description: "Bienvenue dans le tableau de bord administrateur.",
      });
    }
  };

  const handleAddItem = (section: AdminSection) => {
    toast({
      title: `Ajouter ${section}`,
      description: `Fonctionnalité d'ajout de ${section} à venir`,
    });
  };
  
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Dashboard main content
  const renderDashboardContent = () => (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur le dashboard d'administration CAN 2025</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matches.length}</div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Total des matches programmés
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stades.length}</div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Nombre de stades
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipes.length}</div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Équipes qualifiées
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Administrateurs actifs
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Répartition des Matches par Stade</CardTitle>
            <CardDescription>Distribution des matches dans chaque stade</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Prochains Matches</CardTitle>
            <CardDescription>Matches à venir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matches.slice(0, 5).map((match) => (
                <div key={match.id} className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">
                      {match.equipe1} vs {match.equipe2}
                    </div>
                  </div>
                  <Badge>{new Date(match.date).toLocaleDateString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Affichage des 5 prochains matches
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  // Matches section content
  const renderMatchesContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
          <p className="text-muted-foreground">Gestion des matches de la CAN 2025</p>
        </div>
        <Button onClick={() => handleAddItem('matches')}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un match
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Matches</CardTitle>
          <CardDescription>Total: {matches.length} matches programmés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center space-x-3">
                  <div className="font-medium">
                    {match.equipe1} vs {match.equipe2}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>{new Date(match.date).toLocaleDateString()}</Badge>
                  <Badge variant="secondary">{match.stade}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Stades section content
  const renderStadesContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stades</h1>
          <p className="text-muted-foreground">Gestion des stades de la CAN 2025</p>
        </div>
        <Button onClick={() => handleAddItem('stades')}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un stade
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Stades</CardTitle>
          <CardDescription>Total: {stades.length} stades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stades.map((stade) => (
              <div key={stade.id} className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center space-x-3">
                  <div className="font-medium">
                    {stade.nom}
                  </div>
                </div>
                <div>
                  <Badge variant="secondary">{stade.ville}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Equipes section content
  const renderEquipesContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Équipes</h1>
          <p className="text-muted-foreground">Gestion des équipes de la CAN 2025</p>
        </div>
        <Button onClick={() => handleAddItem('equipes')}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter une équipe
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Équipes</CardTitle>
          <CardDescription>Total: {equipes.length} équipes qualifiées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {equipes.map((equipe) => (
              <div key={equipe.id} className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center space-x-3">
                  <div className="font-medium">
                    {equipe.nom}
                  </div>
                </div>
                <div>
                  <Badge variant="secondary">Groupe {equipe.groupe}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Utilisateurs section content
  const renderUtilisateursContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">Gestion des utilisateurs administrateurs</p>
        </div>
        <Button onClick={() => handleAddItem('utilisateurs')}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un utilisateur
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>Total: 1 administrateur</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center space-x-3">
                <div className="font-medium">
                  admin
                </div>
              </div>
              <div>
                <Badge variant="success">Administrateur</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Hotels section content
  const renderHotelsContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hôtels</h1>
          <p className="text-muted-foreground">Gestion des hôtels partenaires</p>
        </div>
        <Button onClick={() => handleAddItem('hotels')}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un hôtel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Hôtels</CardTitle>
          <CardDescription>Total: {hotels.length} hôtels partenaires</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center space-x-3">
                  <div className="font-medium">
                    {hotel.nom}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge>{hotel.ville}</Badge>
                  <Badge variant="outline">{hotel.etoiles} étoiles</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardContent();
      case 'matches':
        return renderMatchesContent();
      case 'stades':
        return renderStadesContent();
      case 'equipes':
        return renderEquipesContent();
      case 'utilisateurs':
        return renderUtilisateursContent();
      case 'hotels':
        return renderHotelsContent();
      default:
        return renderDashboardContent();
    }
  };
  
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="px-2 py-2">
              <h2 className="text-xl font-bold tracking-tight">CAN 2025</h2>
              <p className="text-sm text-muted-foreground">Dashboard Admin</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Tableau de bord" 
                  isActive={activeSection === 'dashboard'}
                  onClick={() => setActiveSection('dashboard')}
                >
                  <Home className="w-4 h-4" />
                  <span>Tableau de bord</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Matches" 
                  isActive={activeSection === 'matches'}
                  onClick={() => setActiveSection('matches')}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Matches</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Stades" 
                  isActive={activeSection === 'stades'}
                  onClick={() => setActiveSection('stades')}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Stades</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Équipes" 
                  isActive={activeSection === 'equipes'}
                  onClick={() => setActiveSection('equipes')}
                >
                  <Shield className="w-4 h-4" />
                  <span>Équipes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Utilisateurs" 
                  isActive={activeSection === 'utilisateurs'}
                  onClick={() => setActiveSection('utilisateurs')}
                >
                  <Users className="w-4 h-4" />
                  <span>Utilisateurs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Hotels" 
                  isActive={activeSection === 'hotels'}
                  onClick={() => setActiveSection('hotels')}
                >
                  <Hotel className="w-4 h-4" />
                  <span>Hotels</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Déconnexion">
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <motion.div 
          className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          key={activeSection}
        >
          {renderContent()}
        </motion.div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
