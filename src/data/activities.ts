
import { stades } from "./stades";

export interface Activity {
  id: string;
  name: string;
  description: string;
  image: string;
  stadeId: string;
  category: 'culture' | 'sport' | 'nature' | 'divertissement';
  price: string;
  address: string;
  rating: number;
  website?: string;
}

export const activities: Activity[] = [
  // Casablanca - Complexe Sportif Mohammed V
  {
    id: "casablanca-medina",
    name: "Médina de Casablanca",
    description: "Explorez l'ancienne médina de Casablanca avec ses marchés traditionnels et son architecture fascinante.",
    image: "images/activities/casablanca-medina.jpg",
    stadeId: "complexe-mohamed-v",
    category: "culture",
    price: "Gratuit",
    address: "Ancienne Médina, Casablanca",
    rating: 4.3
  },
  {
    id: "mosquee-hassan-2",
    name: "Mosquée Hassan II",
    description: "Visitez l'une des plus grandes mosquées du monde avec son minaret impressionnant de 210 mètres.",
    image: "images/activities/mosquee-hassan-2.jpg",
    stadeId: "complexe-mohamed-v",
    category: "culture",
    price: "120 MAD",
    address: "Boulevard de la Corniche, Casablanca",
    rating: 4.8,
    website: "https://www.mosqueehassan2.com"
  },
  {
    id: "corniche-casablanca",
    name: "La Corniche",
    description: "Profitez d'une promenade au bord de l'océan avec de nombreux cafés et restaurants.",
    image: "images/activities/corniche-casablanca.jpg",
    stadeId: "complexe-mohamed-v",
    category: "divertissement",
    price: "Gratuit",
    address: "Ain Diab, Casablanca",
    rating: 4.2
  },
  
  // Rabat - Stade Moulay Abdellah
  {
    id: "kasbah-oudayas",
    name: "Kasbah des Oudayas",
    description: "Découvrez cette forteresse historique offrant une vue imprenable sur l'océan Atlantique et le fleuve Bouregreg.",
    image: "images/activities/kasbah-oudayas.jpg",
    stadeId: "stade-moulay-abdellah",
    category: "culture",
    price: "Gratuit",
    address: "Kasbah des Oudayas, Rabat",
    rating: 4.6
  },
  {
    id: "tour-hassan",
    name: "Tour Hassan",
    description: "Visitez ce monument historique inachevé et le mausolée de Mohammed V à proximité.",
    image: "images/activities/tour-hassan.jpg",
    stadeId: "stade-moulay-abdellah",
    category: "culture",
    price: "Gratuit",
    address: "Boulevard Mohamed Lyazidi, Rabat",
    rating: 4.7
  },
  {
    id: "jardin-exotique",
    name: "Jardin Exotique de Bouknadel",
    description: "Explorez ce jardin botanique avec des plantes du monde entier dans un cadre paisible.",
    image: "images/activities/jardin-exotique.jpg",
    stadeId: "stade-moulay-abdellah",
    category: "nature",
    price: "40 MAD",
    address: "Km 14, Route de Kénitra, Salé",
    rating: 4.2
  },
  
  // Tanger - Stade Ibn Batouta
  {
    id: "grotte-hercule",
    name: "Grottes d'Hercule",
    description: "Visitez ces grottes mythiques avec leur ouverture en forme de carte de l'Afrique.",
    image: "images/activities/grotte-hercule.jpg",
    stadeId: "stade-ibn-batouta",
    category: "nature",
    price: "20 MAD",
    address: "Cap Spartel, Tanger",
    rating: 4.4
  },
  {
    id: "cap-spartel",
    name: "Cap Spartel",
    description: "Point où la Méditerranée rencontre l'Atlantique, avec un phare historique et des vues panoramiques.",
    image: "images/activities/cap-spartel.jpg",
    stadeId: "stade-ibn-batouta",
    category: "nature",
    price: "Gratuit",
    address: "Cap Spartel, Tanger",
    rating: 4.5
  },
  {
    id: "medina-tanger",
    name: "Médina de Tanger",
    description: "Explorez les ruelles sinueuses de cette ancienne médina pleine d'histoire et de culture.",
    image: "images/activities/medina-tanger.jpg",
    stadeId: "stade-ibn-batouta",
    category: "culture",
    price: "Gratuit",
    address: "Médina, Tanger",
    rating: 4.3
  },
  
  // Agadir - Stade d'Adrar
  {
    id: "plage-agadir",
    name: "Plage d'Agadir",
    description: "Profitez de l'une des plus belles plages du Maroc avec son sable fin et ses activités nautiques.",
    image: "images/activities/plage-agadir.jpg",
    stadeId: "stade-adrar",
    category: "nature",
    price: "Gratuit",
    address: "Boulevard Mohammed V, Agadir",
    rating: 4.7
  },
  {
    id: "vallee-paradis",
    name: "Vallée du Paradis",
    description: "Découvrez ce magnifique canyon avec ses piscines naturelles et ses paysages spectaculaires.",
    image: "images/activities/vallee-paradis.jpg",
    stadeId: "stade-adrar",
    category: "nature",
    price: "30-150 MAD (selon l'excursion)",
    address: "Imouzzer Ida Outanane, 80 km d'Agadir",
    rating: 4.6
  },
  {
    id: "kasbah-agadir",
    name: "Kasbah d'Agadir Oufella",
    description: "Visitez les vestiges de cette ancienne forteresse offrant une vue panoramique sur la ville et la baie.",
    image: "images/activities/kasbah-agadir.jpg",
    stadeId: "stade-adrar",
    category: "culture",
    price: "Gratuit",
    address: "Mont Agadir Oufella, Agadir",
    rating: 4.5
  },
  
  // Pour les autres stades
  {
    id: "jardins-majorelle",
    name: "Jardins Majorelle",
    description: "Explorez ce magnifique jardin botanique créé par Jacques Majorelle et restauré par Yves Saint Laurent.",
    image: "images/activities/jardins-majorelle.jpg",
    stadeId: "stade-marrakech",
    category: "nature",
    price: "70-150 MAD",
    address: "Rue Yves St Laurent, Marrakech",
    rating: 4.7,
    website: "https://jardinmajorelle.com"
  },
  {
    id: "place-jemaa-el-fna",
    name: "Place Jemaa el-Fna",
    description: "Visitez cette place iconique, cœur vibrant de Marrakech avec ses artistes de rue et son marché animé.",
    image: "images/activities/place-jemaa-el-fna.jpg",
    stadeId: "stade-marrakech",
    category: "culture",
    price: "Gratuit",
    address: "Place Jemaa el-Fna, Marrakech",
    rating: 4.6
  },
  {
    id: "medina-fes",
    name: "Médina de Fès",
    description: "Explorez l'une des médinas les plus grandes et anciennes du monde, un véritable labyrinthe d'histoire.",
    image: "images/activities/medina-fes.jpg",
    stadeId: "stade-fes",
    category: "culture",
    price: "Gratuit (guides: 150-300 MAD)",
    address: "Médina de Fès, Fès",
    rating: 4.8
  },
  {
    id: "tanneries-fes",
    name: "Tanneries Chouara",
    description: "Découvrez les célèbres tanneries de cuir traditionnelles, l'une des attractions les plus photographiées de Fès.",
    image: "images/activities/tanneries-fes.jpg",
    stadeId: "stade-fes",
    category: "culture",
    price: "10-20 MAD",
    address: "Quartier des Tanneurs, Fès",
    rating: 4.4
  },
  {
    id: "plage-larache",
    name: "Plage de Larache",
    description: "Détendez-vous sur cette belle plage atlantique peu fréquentée par les touristes.",
    image: "images/activities/plage-larache.jpg",
    stadeId: "stade-larache",
    category: "nature",
    price: "Gratuit",
    address: "Larache, Maroc",
    rating: 4.2
  }
];
