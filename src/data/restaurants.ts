export interface Restaurant {
    id: number;
    nom: string;
    cuisine: string;
    description: string;
    adresse: string;
    note: number;
    distance: string;
    prixMoyen: string;
    horaires?: string;
    telephone?: string;
    image: string;
    stadeId: string;
    vegOptions?: boolean;
  }
  
  export const restaurants: Restaurant[] = [
    {
      id: 1,
      nom: "La Sqala",
      description: "Restaurant traditionnel marocain situé dans une ancienne forteresse portugaise avec un magnifique jardin.",
      cuisine: "Marocaine",
      prixMoyen: "200-300 MAD",
      adresse: "Boulevard des Almohades, Casablanca",
      distance: "15 minutes à pied",
      note: 4.7,
      image: "images/La-Sqala.jpg",
      stadeId: "complexe-mohamed-v",
      horaires: "Tous les jours de 12h à 23h",
      telephone: "+212 522 26 09 60"
    },
    {
      id: 2,
      nom: "Rick's Café",
      description: "Café-restaurant inspiré du film Casablanca avec une ambiance des années 1940 et une cuisine internationale.",
      cuisine: "Internationale",
      prixMoyen: "300-500 MAD",
      adresse: "248 Boulevard Sour Jdid, Casablanca",
      distance: "20 minutes en voiture",
      note: 4.5,
      image: "images/ricks-cafe.jpg",
      stadeId: "complexe-mohamed-v",
      horaires: "Tous les jours de 18h à minuit",
      telephone: "+212 522 27 42 07"
    },
    {
      id: 3,
      nom: "Dar Naji",
      description: "Restaurant traditionnel marocain proposant des tagines et couscous dans un cadre authentique.",
      cuisine: "Marocaine",
      prixMoyen: "150-250 MAD",
      adresse: "Avenue Hassan II, Rabat",
      distance: "10 minutes à pied",
      note: 4.6,
      image: "images/darEnnaji.jpg",
      stadeId: "stade-moulay-abdellah",
      horaires: "Tous les jours de 11h à 23h",
      telephone: "+212 537 70 40 24"
    },
    {
      id: 4,
      nom: "Le Dhow",
      description: "Restaurant sur un bateau traditionnel amarré sur le fleuve Bouregreg avec vue panoramique.",
      cuisine: "Fusion",
      prixMoyen: "250-400 MAD",
      adresse: "Marina de Salé, Rabat",
      distance: "15 minutes en voiture",
      note: 4.4,
      image: "images/le-dhow.jpg",
      stadeId: "stade-moulay-abdellah",
      horaires: "Tous les jours de 12h à minuit",
      telephone: "+212 537 78 98 89"
    },
    {
      id: 5,
      nom: "El Morocco Club",
      description: "Restaurant chic dans la médina avec une cuisine raffinée et une terrasse avec vue sur la ville.",
      cuisine: "Marocaine moderne",
      prixMoyen: "300-500 MAD",
      adresse: "2 Rue Dar El Baroud, Tanger",
      distance: "10 minutes en voiture",
      note: 4.8,
      image: "images/el-morocco-club.jpg",
      stadeId: "stade-ibn-batouta",
      horaires: "Tous les jours de 19h à 1h",
      telephone: "+212 539 33 24 17"
    },
    {
      id: 6,
      nom: "La Saveur de Poisson",
      description: "Restaurant de fruits de mer avec un menu fixe de poissons frais du jour préparés simplement.",
      cuisine: "Fruits de mer",
      prixMoyen: "200-300 MAD",
      adresse: "2 Rue Escalier, Tanger",
      distance: "15 minutes en voiture",
      note: 4.6,
      image: "images/le-saveur-de-poisson.jpg",
      stadeId: "stade-ibn-batouta",
      horaires: "Tous les jours de 12h à 16h et 19h à 22h",
      telephone: "+212 539 33 63 26"
    },
    {
      id: 7,
      nom: "La Chaume",
      description: "Restaurant gastronomique français situé dans un jardin luxuriant proposant des plats raffinés.",
      cuisine: "Française",
      prixMoyen: "300-500 MAD",
      adresse: "Boulevard 20 Août, Agadir",
      distance: "10 minutes à pied",
      note: 4.5,
      image: "https://images.unsplash.com/photo-1515669097368-22e68427d265?q=80&w=2070&auto=format&fit=crop",
      stadeId: "stade-adrar",
      horaires: "Tous les jours de 12h à 15h et 19h à 23h",
      telephone: "+212 528 82 34 59"
    },
    {
      id: 8,
      nom: "Le Jardin d'Eau",
      description: "Restaurant en plein air avec piscine, proposant une cuisine variée et des grillades dans un cadre relaxant.",
      cuisine: "Internationale",
      prixMoyen: "200-300 MAD",
      adresse: "Avenue Mohammed V, Agadir",
      distance: "15 minutes en voiture",
      note: 4.3,
      image: "images/la-terrasse.jpg",
      stadeId: "stade-adrar",
      horaires: "Tous les jours de 11h à 23h",
      telephone: "+212 528 84 02 26"
    },
    {
      id: 9,
      nom: "Al Fassia",
      description: "Restaurant gastronomique marocain réputé, tenu exclusivement par des femmes et offrant des plats traditionnels de Fès.",
      cuisine: "Marocaine",
      prixMoyen: "250-400 MAD",
      adresse: "55 Boulevard Zerktouni, Marrakech",
      distance: "15 minutes en voiture",
      note: 4.7,
      image: "images/al-fassia.jpg",
      stadeId: "stade-marrakech",
      horaires: "Tous les jours de 12h à 14h30 et 19h30 à 22h30, fermé le mardi",
      telephone: "+212 524 43 40 60"
    },
    {
      id: 10,
      nom: "Le Jardin",
      description: "Restaurant-jardin caché au cœur de la médina proposant une cuisine légère dans un cadre verdoyant.",
      cuisine: "Fusion",
      prixMoyen: "200-300 MAD",
      adresse: "32 Rue El Jeld, Marrakech",
      distance: "20 minutes en voiture",
      note: 4.5,
      image: "images/le-jardin.jpg",
      stadeId: "stade-marrakech",
      horaires: "Tous les jours de 10h à 23h",
      telephone: "+212 524 37 82 95"
    },
    {
      id: 11,
      nom: "Dar Hatim",
      description: "Restaurant familial dans une maison traditionnelle, célèbre pour son authentique pastilla et ses tagines.",
      cuisine: "Marocaine",
      prixMoyen: "150-250 MAD",
      adresse: "19 Derb Ezaouia Fandek Lihoudi, Fès",
      distance: "15 minutes en voiture",
      note: 4.8,
      image: "imaes/dar-hatim.jpg",
      stadeId: "stade-fes",
      horaires: "Tous les jours de 12h à 14h30 et 19h à 22h",
      telephone: "+212 535 74 16 50"
    },
    {
      id: 12,
      nom: "Riad Rcif",
      description: "Restaurant sur une terrasse avec vue panoramique sur la médina de Fès, servant des plats locaux et internationaux.",
      cuisine: "Marocaine",
      prixMoyen: "200-300 MAD",
      adresse: "1 Derb Ahl Tadla, Fès",
      distance: "15 minutes en voiture",
      note: 4.5,
      image: "images/riad-rcif.jpg",
      stadeId: "stade-fes",
      horaires: "Tous les jours de 12h à 22h",
      telephone: "+212 535 63 80 42"
    },
    {
      id: 13,
      nom: "La Paella",
      description: "Restaurant de fruits de mer et de spécialités espagnoles avec vue sur le port de pêche.",
      cuisine: "Espagnole",
      prixMoyen: "150-250 MAD",
      adresse: "Boulevard Mohamed V, Larache",
      distance: "10 minutes à pied",
      note: 4.4,
      image: "images/la-paella.jpg",
      stadeId: "stade-larache",
      horaires: "Tous les jours de 12h à 22h",
      telephone: "+212 539 91 33 21"
    },
    {
      id: 14,
      nom: "Cafétéria Miami",
      description: "Restaurant populaire proposant des grillades de poissons frais et des fruits de mer avec vue sur l'océan.",
      cuisine: "Fruits de mer",
      prixMoyen: "100-200 MAD",
      adresse: "Corniche de Larache, Larache",
      distance: "15 minutes à pied",
      note: 4.3,
      image: "images/miami.jpg",
      stadeId: "stade-larache",
      horaires: "Tous les jours de 11h à 23h",
      telephone: "+212 539 91 89 45"
    }
  ];