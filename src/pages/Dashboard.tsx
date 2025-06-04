import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { matches, Match } from '@/data/matches';
import { stades, Stade } from '@/data/stades';
import { equipes, Equipe } from '@/data/equipes';
import { hotels } from '@/data/hotels';
import { restaurants } from '@/data/restaurants';
import { Sidebar, SidebarContent, SidebarProvider, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Calendar, Home, BarChart3, MapPin, Shield, Users, Hotel as HotelIcon, LogOut, Plus, Utensils, Edit, Trash2, Clock, Pencil, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminLogin from '../components/admine/AdminLogin';
import { HotelFormDialog } from '../components/admine/HotelFormDialog';
import RestaurantFormDialog from '../components/admine/RestaurantFormDialog';
import { MatchFormDialog } from "../components/admine/MatchFormDialog";
import { StadeFormDialog } from '../components/admine/StadeFormDialog';
import { EquipeFormDialog } from '../components/admine/EquipeFormDialog';
import { UserFormDialog } from '../components/admine/UserFormDialog';
import ActivityManagement from '@/components/admin/ActivityManagement';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels, fetchRestaurants, fetchStades, fetchMatches, fetchEquipes } from '@/features/apiSlice';
import { AppDispatch } from '@/store';
import { STORAGE_LINK } from '@/api';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createMatch } from '@/redux/matchesSlice';

type AdminSection = 'dashboard' | 'matches' | 'stades' | 'equipes' | 'utilisateurs' | 'hotels' | 'restaurants' | 'activities';

type NewHotelData = {
  nom: string;
  description: string;
  etoiles: number;
  image: File | string;
  prix: string;
  ville: string;
  distance: string;
  stadeId: string;
  adresse?: string;
  telephone?: string;
};

type NewMatchData = {
  equipe1: string;
  equipe2: string;
  date: string;
  heure: string;
  stadeId: string;
  phase: "Groupe" | "Huitièmes" | "Quarts" | "Demi-finales" | "Match pour la 3e place" | "Finale";
  groupe?: string;
  score1?: number;
  score2?: number;
  termine: boolean;
};

interface NewStadeData {
  nom: string;
  ville: string;
  capacite: number;
  image: File | string;
  description: string;
  anneeConstruction: number;
  lat: number;
  lng: number;
}

type NewEquipeData = {
  nom: string;
  drapeau: string;
  groupe: string;
  confederation: string;
  abreviation?: string;
  entraineur?: string;
  rang?: number;
};

type NewUserData = {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
};

type NewRestaurantData = {
  nom: string;
  description: string;
  cuisine: string;
  prixMoyen: string;
  adresse: string;
  distance: string;
  note: number;
  image: File | string;
  stadeId: string;
  horaires: string;
  telephone: string;
};

interface DashboardRestaurant {
  id: string;
  nom: string;
  description: string;
  cuisine: string;
  prixMoyen: string;
  adresse: string;
  distance: string;
  note: number;
  image: File | string;
  stadeId: string;
  horaires?: string;
  telephone?: string;
  vegOptions?: boolean;
}

interface ImportedHotel {
  id: number;
  nom: string;
  description: string;
  etoiles: number;
  image: string;
  prix: string;
  distance: string;
  stadeId: number;
}

interface DashboardHotel {
  id: string;
  nom: string;
  description: string;
  etoiles: number;
  image: string | File;
  prix: string;
  ville: string;
  distance: string;
  stadeId: number;
  adresse?: string;
  telephone?: string;
  wifi?: boolean;
  parking?: boolean;
  piscine?: boolean;
}

interface DashboardStade extends Omit<Stade, 'image'> {
  image: string | File;
}

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [showStadeForm, setShowStadeForm] = useState(false);
  const [showEquipeForm, setShowEquipeForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [hotelsList, setHotelsList] = useState<DashboardHotel[]>([]);
  const [matches, setMatches] = useState([]);
  const [stadesList, setStadesList] = useState<Stade[]>(stades);
  const [equipesList, setEquipesList] = useState(equipes);
  const [restaurantsList, setRestaurantsList] = useState<DashboardRestaurant[]>(
    restaurants.map(r => ({
      ...r,
      id: String(r.id),
      stadeId: String(r.stadeId),
      horaires: r.horaires || "",
      telephone: r.telephone || "",
      vegOptions: r.vegOptions || false
    } as DashboardRestaurant))
  );
  const [usersList, setUsersList] = useState([
    { id: 'admin', name: 'Administrateur', email: 'admin@can2025.ma', role: 'admin', isActive: true },
    { id: 'demo', name: 'Utilisateur Démo', email: 'demo@can2025.ma', role: 'viewer', isActive: true }
  ]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingStade, setEditingStade] = useState<Stade | null>(null);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { 
    hotels: hotelsListRedux, 
    restaurants: restaurantsListRedux,
    stades: stadesListRedux,
    matches: matchesListRedux,
    equipes: equipesListRedux,
    loading: apiLoading 
  } = useSelector((state: any) => state.api);
  
  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchHotels());
    dispatch(fetchRestaurants());
    dispatch(fetchStades());
    dispatch(fetchMatches());
    dispatch(fetchEquipes());
  }, [dispatch]);
  
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/matches').then(res => {
      setMatches(res.data.data || res.data);
    });
  }, []);
  
  const data = [
    { name: 'Casablanca', value: matchesListRedux.filter(match => stades.find(s => s.id === match.stade)?.ville === 'Casablanca').length },
    { name: 'Rabat', value: matchesListRedux.filter(match => stades.find(s => s.id === match.stade)?.ville === 'Rabat').length },
    { name: 'Marrakech', value: matchesListRedux.filter(match => stades.find(s => s.id === match.stade)?.ville === 'Marrakech').length },
    { name: 'Tanger', value: matchesListRedux.filter(match => stades.find(s => s.id === match.stade)?.ville === 'Tanger').length },
    { name: 'Autres', value: matchesListRedux.filter(match => {
      const ville = stades.find(s => s.id === match.stade)?.ville;
      return ville && !['Casablanca', 'Rabat', 'Marrakech', 'Tanger'].includes(ville);
    }).length },
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

  const handleDelete = async (type: string, id: string) => {
    try {
      let endpoint = '';
      switch (type) {
        case 'restaurant':
          endpoint = `http://127.0.0.1:8000/api/restaurants/${id}`;
          break;
        case 'stade':
          endpoint = `http://127.0.0.1:8000/api/stades/${id}`;
          break;
        case 'equipe':
          endpoint = `http://127.0.0.1:8000/api/equipes/${id}`;
          break;
        case 'match':
          endpoint = `http://127.0.0.1:8000/api/matches/${id}`;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      // Refresh appropriate list
      switch (type) {
        case 'restaurant':
          dispatch(fetchRestaurants());
          break;
        case 'stade':
          dispatch(fetchStades());
          break;
        case 'equipe':
          dispatch(fetchEquipes());
          break;
        case 'match':
          dispatch(fetchMatches());
          break;
      }
      
      toast({
        title: "Supprimé avec succès",
        description: `L'élément a été supprimé avec succès.`,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (type: string, id: string) => {
    if (type === 'stade') {
      const stadeToEdit = stadesListRedux.find(s => String(s.id) === String(id));
      setEditingStade(stadeToEdit || null);
      setShowStadeForm(true);
    }
    setEditingItemId(id);
    
    switch (type) {
      case 'match':
        setShowMatchForm(true);
        break;
      case 'equipe':
        setShowEquipeForm(true);
        break;
      case 'hotel':
        setShowHotelForm(true);
        break;
      case 'restaurant':
        setShowRestaurantForm(true);
        break;
      case 'user':
        setShowUserForm(true);
        break;
    }
    
    toast({
      title: "Édition en cours",
      description: `Vous êtes en train d'éditer ${id}.`,
    });
  };

  const handleHotelUpdate = async (updatedHotel: DashboardHotel | null) => {
    try {
      if (updatedHotel === null) {
        // Handle deletion
        if (editingItemId) {
          const response = await axios.delete(`http://127.0.0.1:8000/api/hotels/${editingItemId}`);

          if (response.data.success) {
            // Refresh hotels list
            dispatch(fetchHotels());
            
            toast({
              title: "Hôtel supprimé",
              description: "L'hôtel a été supprimé avec succès.",
            });
          } else {
            throw new Error('Failed to delete hotel');
          }
        }
      } else {
        // Update the local state immediately with the new data
        const updatedHotels = hotelsListRedux.map(hotel => 
          hotel.id === updatedHotel.id ? updatedHotel : hotel
        );
        
        // If it's a new hotel, add it to the list
        if (!hotelsListRedux.find(hotel => hotel.id === updatedHotel.id)) {
          updatedHotels.push(updatedHotel);
        }
        
        // Update the Redux state
        dispatch({ type: 'api/setHotels', payload: updatedHotels });
        
        // Also fetch from the server to ensure we have the latest data
        dispatch(fetchHotels());
        
        setShowHotelForm(false);
        setEditingItemId(null);
      }
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        toast({
          title: "Erreur de validation",
          description: "Veuillez vérifier les informations saisies.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de l'opération.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteHotel = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/hotels/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete hotel');
      }

      // Refresh hotels list
      dispatch(fetchHotels());
      
      toast({
        title: "Hôtel supprimé",
        description: "L'hôtel a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  const handleEditHotel = (id: string) => {
    setEditingItemId(id);
    setShowHotelForm(true);
  };

  const handleAddRestaurant = async (restaurantData: NewRestaurantData) => {
    try {
      if (editingItemId) {
        // Update existing restaurant
        const response = await fetch(`http://127.0.0.1:8000/api/restaurants/${editingItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(restaurantData),
        });

        if (!response.ok) {
          throw new Error('Failed to update restaurant');
        }

        dispatch(fetchRestaurants());
        
        toast({
          title: "Restaurant modifié",
          description: `Le restaurant ${restaurantData.nom} a été modifié avec succès.`,
        });
      } else {
        // Create new restaurant
        const response = await fetch('http://127.0.0.1:8000/api/restaurants/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(restaurantData),
        });

        if (!response.ok) {
          throw new Error('Failed to create restaurant');
        }

        dispatch(fetchRestaurants());
        
        toast({
          title: "Restaurant ajouté",
          description: `Le restaurant ${restaurantData.nom} a été ajouté avec succès.`,
        });
      }
      
      setShowRestaurantForm(false);
      setEditingItemId(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'opération.",
        variant: "destructive",
      });
    }
  };

  const handleAddMatch = async (matchData: NewMatchData) => {
    try {
      if (editingItemId) {
        setMatches(prev => prev.map(match => 
          match.id === editingItemId ? { ...match, ...matchData, id: editingItemId } as Match : match
        ));
        
        toast({
          title: "Match modifié",
          description: `Le match a été modifié avec succès.`,
        });
        
        setEditingItemId(null);
      } else {
        const resultAction = await dispatch(createMatch(matchData));
        if (createMatch.fulfilled.match(resultAction)) {
        toast({
          title: "Match ajouté",
          description: `Le match a été ajouté avec succès.`,
        });
        } else {
          console.error('Create match error:', resultAction);
        }
      }
      
      setShowMatchForm(false);
    } catch (err) {
      console.error('Dispatch error:', err);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'opération.",
        variant: "destructive",
      });
    }
  };

  const handleAddStade = async (values: Partial<NewStadeData>) => {
    if (!values.nom || !values.ville || !values.capacite || !values.description || !values.anneeConstruction || !values.lat || !values.lng) {
      // Optionally show an error or return early
      return;
    }
    try {
      if (editingItemId) {
        // Update existing stade
        const response = await fetch(`http://127.0.0.1:8000/api/stades/${editingItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to update stade');
        }

        dispatch(fetchStades());
        
        toast({
          title: "Stade modifié",
          description: `Le stade ${values.nom} a été modifié avec succès.`,
        });
      } else {
        // Create new stade
        const response = await fetch('http://127.0.0.1:8000/api/stades/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create stade');
        }

        dispatch(fetchStades());
        
        toast({
          title: "Stade ajouté",
          description: `Le stade ${values.nom} a été ajouté avec succès.`,
        });
      }
      
      setShowStadeForm(false);
      setEditingItemId(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'opération.",
        variant: "destructive",
      });
    }
  };

  const handleAddEquipe = (equipeData: NewEquipeData) => {
    try {
      if (editingItemId) {
        setEquipesList(prev => prev.map(equipe => 
          equipe.id === editingItemId ? { ...equipe, ...equipeData, id: editingItemId } as Equipe : equipe
        ));
        
        toast({
          title: "Équipe modifiée",
          description: `L'équipe ${equipeData.nom} a été modifiée avec succès.`,
        });
        
        setEditingItemId(null);
      } else {
        const newEquipe: Equipe = {
          id: equipeData.nom.toLowerCase().replace(/\s+/g, '-'),
          nom: equipeData.nom,
          drapeau: equipeData.drapeau,
          groupe: equipeData.groupe,
          confederation: equipeData.confederation,
          abreviation: equipeData.abreviation || equipeData.nom.substring(0, 3).toUpperCase(),
          entraineur: equipeData.entraineur || "",
          rang: equipeData.rang || 0
        };
        
        setEquipesList(prev => [...prev, newEquipe]);
        
        toast({
          title: "Équipe ajoutée",
          description: `L'équipe ${equipeData.nom} a été ajoutée avec succès.`,
        });
      }
      
      setShowEquipeForm(false);
    } catch (error) {
      console.error('Error updating equipes list:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'opération.",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = (userData: NewUserData) => {
    try {
      if (editingItemId) {
        setUsersList(prev => prev.map(user => 
          user.id === editingItemId ? { 
            ...user, 
            name: userData.name,
            email: userData.email,
            role: userData.role,
            isActive: userData.isActive
          } : user
        ));
        
        toast({
          title: "Utilisateur modifié",
          description: `L'utilisateur ${userData.name} a été modifié avec succès.`,
        });
        
        setEditingItemId(null);
      } else {
        const newUser = {
          id: userData.email.split('@')[0],
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isActive: userData.isActive
        };
        
        setUsersList(prev => [...prev, newUser]);
        
        toast({
          title: "Utilisateur ajouté",
          description: `L'utilisateur ${userData.name} a été ajouté avec succès.`,
        });
      }
      
      setShowUserForm(false);
    } catch (error) {
      console.error('Error updating users list:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'opération.",
        variant: "destructive",
      });
    }
  };

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
            <div className="text-2xl font-bold">{matchesListRedux.length}</div>
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
              {matchesListRedux.slice(0, 5).map((match) => (
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

  const renderMatchesContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
          <p className="text-muted-foreground">Gestion des matches de la CAN 2025</p>
        </div>
        <Button onClick={() => {
          setEditingItemId(null);
          setShowMatchForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un match
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Matches</CardTitle>
          <CardDescription>Total: {matchesListRedux.length} matches programmés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matchesListRedux.map((match) => (
              <div key={match.id} className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center space-x-3">
                  <div className="font-medium">
                    {equipesListRedux.find(e => String(e.id) === String(match.equipe1))?.nom || match.equipe1} vs {equipesListRedux.find(e => String(e.id) === String(match.equipe2))?.nom || match.equipe2}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>{new Date(match.date).toLocaleDateString()}</Badge>
                  <Badge variant="secondary">
                    {stadesListRedux.find(s => String(s.id) === String(match.stade))?.nom || match.stade}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('match', match.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Voulez-vous vraiment supprimer ce match ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete('match', match.id)}>
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStadesContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stades</h1>
          <p className="text-muted-foreground">Gestion des stades de la CAN 2025</p>
        </div>
        <Button onClick={() => {
          setEditingItemId(null);
          setShowStadeForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un stade
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Stades</CardTitle>
          <CardDescription>
            {apiLoading ? "Chargement..." : `Total: ${stadesListRedux.length} stades`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            </div>
          ) : (
          <div className="space-y-4">
              {stadesListRedux.map((stade) => (
              <div key={stade.id} className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center space-x-3">
                    {stade.image && (
                      <img 
                        src={stade.image.includes("images/") ? stade.image : STORAGE_LINK + stade.image} 
                        alt={stade.nom}
                        className="object-cover w-12 h-12 rounded-md"
                      />
                    )}
                  <div className="font-medium">
                    {stade.nom}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{stade.ville}</Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('stade', stade.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Voulez-vous vraiment supprimer ce stade ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete('stade', stade.id)}>
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderEquipesContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Équipes</h1>
          <p className="text-muted-foreground">Gestion des équipes de la CAN 2025</p>
        </div>
        <Button onClick={() => {
          setEditingItemId(null);
          setShowEquipeForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter une équipe
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Équipes</CardTitle>
          <CardDescription>Total: {equipesListRedux?.length || 0} équipes qualifiées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {equipesListRedux?.map((equipe) => (
              <div key={equipe.id} className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center space-x-3">
                  <div className="font-medium">
                    {equipe.nom}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Groupe {equipe.groupe}</Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('equipe', equipe.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Voulez-vous vraiment supprimer cette équipe ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete('equipe', equipe.id)}>
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showEquipeForm && (
        <EquipeFormDialog
          open={showEquipeForm}
          onOpenChange={setShowEquipeForm}
          onSubmit={handleAddEquipe}
          editingEquipe={editingItemId ? equipesListRedux?.find(e => e.id === editingItemId) : null}
          dialogTitle={editingItemId ? "Modifier une équipe" : "Ajouter une équipe"}
          submitButtonText={editingItemId ? "Modifier" : "Ajouter"}
        />
      )}
    </div>
  );

  const renderUtilisateursContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">Gestion des utilisateurs administrateurs</p>
        </div>
        <Button onClick={() => {
          setEditingItemId(null);
          setShowUserForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un utilisateur
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>Total: {usersList.length} utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usersList.map((user) => (
              <div key={user.id} className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.role === 'admin' ? 'default' : user.role === 'editor' ? 'secondary' : 'outline'}>
                    {user.role === 'admin' ? 'Administrateur' : user.role === 'editor' ? 'Éditeur' : 'Utilisateur'}
                  </Badge>
                  {!user.isActive && <Badge variant="destructive">Inactif</Badge>}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('user', user.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Voulez-vous vraiment supprimer cet utilisateur ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete('user', user.id)}>
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHotelsContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hôtels</h1>
          <p className="text-muted-foreground">Gestion des hôtels partenaires</p>
        </div>
        <Button onClick={() => {
          setEditingItemId(null);
          setShowHotelForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un hôtel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Hôtels</CardTitle>
          <CardDescription>
            {apiLoading ? "Chargement..." : `Total: ${hotelsListRedux.length} hôtels partenaires`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            </div>
          ) : (
          <div className="space-y-4">
              {hotelsListRedux.map((hotel: DashboardHotel) => (
                <div key={hotel.id} className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    {hotel.image && typeof hotel.image === 'string' && (
                      <img 
                        src={hotel.image.includes("https://") ?  hotel.image : STORAGE_LINK + hotel.image}
                        alt={hotel.nom} 
                        className="object-cover w-12 h-12 rounded-md"
                      />
                    )}
                    <div>
                      <div className="font-medium">{hotel.nom}</div>
                      <div className="text-sm text-muted-foreground">
                        {hotel.ville} • {hotel.etoiles} étoiles • {hotel.prix}
                      </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditHotel(hotel.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteHotel(hotel.id)}
                    >
                      <Trash className="w-4 h-4" />
                        </Button>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>

      <HotelFormDialog
        open={showHotelForm}
        onOpenChange={setShowHotelForm}
        editingHotel={editingItemId ? hotelsListRedux.find(h => h.id === editingItemId) : null}
        onHotelUpdated={handleHotelUpdate}
      />
    </div>
  );

  const renderRestaurantsContent = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
          <p className="text-muted-foreground">Gestion des restaurants partenaires</p>
        </div>
        <Button onClick={() => {
          setEditingItemId(null);
          setShowRestaurantForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un restaurant
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Restaurants</CardTitle>
          <CardDescription>
            {apiLoading ? "Chargement..." : `Total: ${restaurantsListRedux.length} restaurants partenaires`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            </div>
          ) : (
          <div className="space-y-4">
              {restaurantsListRedux.map((restaurant) => (
              <div key={restaurant.id} className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center space-x-3">
                    {restaurant.image && (
                      <img 
                        src={restaurant.image.includes("https://") ? restaurant.image : STORAGE_LINK + restaurant.image} 
                        alt={restaurant.nom}
                        className="object-cover w-12 h-12 rounded-md"
                      />
                    )}
                  <div className="font-medium">
                    {restaurant.nom}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>{restaurant.cuisine}</Badge>
                  <Badge variant="outline">{restaurant.stadeId}</Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('restaurant', restaurant.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Voulez-vous vraiment supprimer ce restaurant ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete('restaurant', restaurant.id)}>
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderActivitiesContent = () => (
    <ActivityManagement />
  );

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
      case 'restaurants':
        return renderRestaurantsContent();
      case 'activities':
        return renderActivitiesContent();
      default:
        return renderDashboardContent();
    }
  };
  
  const editingHotel = editingItemId 
    ? hotelsListRedux.find(hotel => hotel.id === editingItemId) 
    : null;
  
  const editingRestaurant = editingItemId 
    ? restaurantsListRedux.find(restaurant => restaurant.id === editingItemId) 
    : null;

  const editingMatch = editingItemId
    ? matchesListRedux.find(match => match.id === editingItemId)
    : null;

  const editingStadeData = editingItemId
    ? stadesListRedux.find(stade => stade.id === editingItemId)
    : null;

  // If your stade object uses latitude/longitude:
  const editingStadeWithLatLng = editingStadeData
    ? {
        ...editingStadeData,
        lat: (editingStadeData as any).lat ?? (editingStadeData as any).latitude ?? 0,
        lng: (editingStadeData as any).lng ?? (editingStadeData as any).longitude ?? 0,
      }
    : null;
    
  const editingEquipe = editingItemId
    ? equipesListRedux.find(equipe => equipe.id === editingItemId)
    : null;
    
  const editingUser = editingItemId
    ? usersList.find(user => user.id === editingItemId)
    : null;
  
  return (
    <>
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
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
                      tooltip="Dashboard" 
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
                      <HotelIcon className="w-4 h-4" />
                      <span>Hotels</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip="Restaurants" 
                      isActive={activeSection === 'restaurants'}
                      onClick={() => setActiveSection('restaurants')}
                    >
                      <Utensils className="w-4 h-4" />
                      <span>Restaurants</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip="Activités" 
                      isActive={activeSection === 'activities'}
                      onClick={() => setActiveSection('activities')}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Activités</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <Button 
                  variant="outline" 
                  className="justify-start w-full gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </Button>
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-8">
              {renderContent()}
            </div>
          </div>
        </SidebarProvider>
      )}
      
      {showHotelForm && (
        <HotelFormDialog 
          open={showHotelForm}
          onOpenChange={setShowHotelForm}
          editingHotel={editingHotel}
          onHotelUpdated={handleHotelUpdate}
        />
      )}
      
      {showRestaurantForm && (
        <RestaurantFormDialog 
          open={showRestaurantForm}
          onOpenChange={setShowRestaurantForm}
          onSubmit={(data: any) => {
            const restaurantData: NewRestaurantData = {
              nom: data.nom,
              description: data.description,
              cuisine: data.cuisine,
              prixMoyen: data.prixMoyen,
              adresse: data.adresse,
              distance: data.distance,
              note: data.note,
              image: data.image instanceof File ? data.image : "",
              stadeId: String(data.stadeId),
              horaires: data.horaires || "",
              telephone: data.telephone || ""
            };
            handleAddRestaurant(restaurantData);
          }}
          editingRestaurant={editingRestaurant ? {
            ...editingRestaurant,
            stadeId: String(editingRestaurant.stadeId)
          } as any : null}
        />
      )}

      {showMatchForm && (
        <MatchFormDialog
          isOpen={showMatchForm}
          onClose={() => setShowMatchForm(false)}
          defaultValues={editingMatch ? {
            equipe1: editingMatch.equipe1,
            equipe2: editingMatch.equipe2,
            stadeId: editingMatch.stadeId,
            date: editingMatch.date,
            heure: editingMatch.heure,
            phase: editingMatch.phase,
            groupe: editingMatch.groupe,
            score1: editingMatch.score1,
            score2: editingMatch.score2,
            termine: editingMatch.termine,
          } : undefined}
          dialogTitle={editingMatch ? "Modifier un match" : "Ajouter un match"}
          submitButtonText={editingMatch ? "Modifier" : "Ajouter"}
          editingMatchId={editingMatch ? editingMatch.id : undefined}
        />
      )}

      {showStadeForm && (
        <StadeFormDialog
          isOpen={showStadeForm}
          onClose={() => setShowStadeForm(false)}
          onSubmit={handleAddStade as any}
          editingStade={editingStadeWithLatLng}
          dialogTitle={editingStadeWithLatLng ? "Modifier un stade" : "Ajouter un stade"}
          submitButtonText={editingStadeWithLatLng ? "Modifier" : "Ajouter"}
        />
      )}

      {showUserForm && (
        <UserFormDialog
          isOpen={showUserForm}
          onClose={() => setShowUserForm(false)}
          onSubmit={(values) => {
            const userData: NewUserData = {
              name: values.name || "",
              email: values.email || "",
              password: values.password || "",
              role: values.role || "viewer",
              isActive: values.isActive !== undefined ? values.isActive : true
            };
            handleAddUser(userData);
          }}
          defaultValues={editingUser ? {
            name: editingUser.name,
            email: editingUser.email,
            password: "",
            role: editingUser.role as any,
            isActive: editingUser.isActive
          } : undefined}
          dialogTitle={editingUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
          submitButtonText={editingUser ? "Modifier" : "Ajouter"}
        />
      )}
    </>
  );
};

export default Dashboard;
