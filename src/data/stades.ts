



export interface Stade {
  id: string;
  nom: string;
  ville: string;
  capacite: number;
  image: string;
  description: string;
  coordonnees: {
    lat: number;
    lng: number;
  };
  anneeConstruction: number;
}

export const stades: Stade[] = [
  {
    id: "complexe-mohamed-v",
    nom: "Complexe Sportif Mohammed V",
    ville: "Casablanca",
    capacite: 67000,
    image: "images/mohamed-v.jpg",
    description: "Le Complexe Sportif Mohammed V est le plus grand stade du Maroc, situé au cœur de Casablanca. Rénové pour la CAN 2025, il offre des installations de pointe et une atmosphère électrique.",
    coordonnees: {
      lat: 33.5822,
      lng: -7.6536
    },
    anneeConstruction: 1955
  },
  {
    id: "stade-moulay-abdellah",
    nom: "Stade Moulay Abdellah",
    ville: "Rabat",
    capacite: 52000,
    image: "images/moulay-abdlah.jpg",
    description: "Le Stade Moulay Abdellah est le stade principal de la capitale Rabat, où l'équipe nationale du Maroc dispute la plupart de ses matches. Rénové pour la CAN 2025, il offre une expérience exceptionnelle aux supporters.",
    coordonnees: {
      lat: 33.9716,
      lng: -6.8498
    },
    anneeConstruction: 1983
  },
  {
    id: "stade-ibn-batouta",
    nom: "Stade Ibn Batouta",
    ville: "Tanger",
    capacite: 45000,
    image: "images/grand-stade-tanger.jpg",
    description: "Situé à Tanger, le Stade Ibn Batouta est un stade moderne qui offre une vue imprenable sur le détroit de Gibraltar. Il est célèbre pour son architecture et son ambiance vibrante.",
    coordonnees: {
      lat: 35.7469,
      lng: -5.8036
    },
    anneeConstruction: 2011
  },
  {
    id: "stade-adrar",
    nom: "Stade d'Adrar",
    ville: "Agadir",
    capacite: 45000,
    image: "images/adrar.jpg",
    description: "Le Stade d'Adrar à Agadir est connu pour son design moderne et son architecture inspirée des vallées de l'Atlas. C'est un lieu emblématique du sud marocain.",
    coordonnees: {
      lat: 30.4066,
      lng: -9.5795
    },
    anneeConstruction: 2013
  },
  {
    id: "stade-marrakech",
    nom: "Stade de Marrakech",
    ville: "Marrakech",
    capacite: 45240,
    image: "images/Marakech.jpg",
    description: "Le Stade de Marrakech est un joyau architectural situé dans la ville ocre. Sa structure unique offre une excellente visibilité depuis tous les sièges et une atmosphère inégalée.",
    coordonnees: {
      lat: 31.6294,
      lng: -8.0248
    },
    anneeConstruction: 2011
  },
  {
    id: "stade-fes",
    nom: "Complexe Sportif de Fès",
    ville: "Fès",
    capacite: 45000,
    image: "images/fes.jpg",
    description: "Le Complexe Sportif de Fès est un stade impressionnant dans la ville historique de Fès. Il allie tradition et modernité avec ses équipements de pointe et son design respectueux de l'héritage culturel.",
    coordonnees: {
      lat: 34.0018,
      lng: -5.0093
    },
    anneeConstruction: 2007
  },
  {
    id: "stade-larache",
    nom: "Stade Municipal de Larache",
    ville: "Larache",
    capacite: 30000,
    image: "images/tiran.jpg",
    description: "Rénové spécialement pour la CAN 2025, le Stade Municipal de Larache offre une expérience intime et intense pour les spectateurs. Sa proximité avec la côte atlantique en fait un lieu unique.",
    coordonnees: {
      lat: 35.1917,
      lng: -6.1560
    },
    anneeConstruction: 1966
  }
];
