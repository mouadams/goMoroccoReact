
export interface Hotel {
  id: string;
  nom: string;
  description: string;
  etoiles: number;
  image: string;
  prix: string;
  distance: string;
  stadeId: string;
}

export const hotels: Hotel[] = [
  // Hôtels près du Complexe Mohammed V (Casablanca)
  {
    id: "movenpick-casablanca",
    nom: "Mövenpick Hotel Casablanca",
    description: "Hôtel 5 étoiles avec vue panoramique sur la ville, terrasse sur le toit et piscine extérieure. Offre un accès facile au stade et au centre-ville.",
    etoiles: 5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    prix: "1500 DH",
    distance: "2.5 km",
    stadeId: "complexe-mohamed-v"
  },
  {
    id: "kenzi-tower-casablanca",
    nom: "Kenzi Tower Hotel",
    description: "Hôtel de luxe situé dans les Twin Center, offrant une vue imprenable sur Casablanca. Chambres spacieuses, spa et restaurants gastronomiques.",
    etoiles: 5,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
    prix: "1800 DH",
    distance: "3 km",
    stadeId: "complexe-mohamed-v"
  },
  
  // Hôtels près du Stade Moulay Abdellah (Rabat)
  {
    id: "sofitel-rabat",
    nom: "Sofitel Rabat Jardin des Roses",
    description: "Situé dans un jardin luxuriant, cet hôtel 5 étoiles offre élégance et confort. Piscine extérieure, spa et restaurants gastronomiques.",
    etoiles: 5,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
    prix: "1600 DH",
    distance: "4 km",
    stadeId: "stade-moulay-abdellah"
  },
  {
    id: "riad-dar-el-kebira",
    nom: "Riad Dar El Kébira",
    description: "Riad traditionnel situé dans la médina de Rabat, offrant une expérience authentique. Chambres décorées avec soin, patio central et cuisine marocaine.",
    etoiles: 4,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    prix: "1200 DH",
    distance: "5.5 km",
    stadeId: "stade-moulay-abdellah"
  },
  
  // Hôtels près du Stade Ibn Batouta (Tanger)
  {
    id: "hilton-tanger",
    nom: "Hilton Tanger City Center",
    description: "Hôtel moderne avec vue sur le détroit de Gibraltar. Chambres élégantes, piscine sur le toit et plusieurs options de restauration.",
    etoiles: 5,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049&auto=format&fit=crop",
    prix: "1400 DH",
    distance: "3.2 km",
    stadeId: "stade-ibn-batouta"
  },
  {
    id: "fairmont-tanger",
    nom: "Fairmont Tanger",
    description: "Hôtel de luxe offrant une vue imprenable sur l'océan. Design élégant, spa complet et service personnalisé.",
    etoiles: 5,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    prix: "2000 DH",
    distance: "4 km",
    stadeId: "stade-ibn-batouta"
  },
  
  // Hôtels près du Stade d'Adrar (Agadir)
  {
    id: "hyatt-place-agadir",
    nom: "Hyatt Place Agadir",
    description: "Hôtel moderne et confortable à proximité de la plage et du stade. Chambres spacieuses, piscine extérieure et options de restauration.",
    etoiles: 4,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop",
    prix: "1200 DH",
    distance: "2 km",
    stadeId: "stade-adrar"
  },
  {
    id: "atlantic-palace-agadir",
    nom: "Atlantic Palace Agadir",
    description: "Resort de luxe avec architecture marocaine traditionnelle. Grand jardin, piscine, casino et accès à la plage privée.",
    etoiles: 5,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2073&auto=format&fit=crop",
    prix: "1700 DH",
    distance: "3.5 km",
    stadeId: "stade-adrar"
  },
  
  // Hôtels près du Stade de Marrakech
  {
    id: "four-seasons-marrakech",
    nom: "Four Seasons Resort Marrakech",
    description: "Luxueux resort avec jardins magnifiques, deux piscines et vues sur l'Atlas. Service impeccable et chambres élégantes.",
    etoiles: 5,
    image: "https://images.unsplash.com/photo-1550141016-5d4cc7f1e7c9?q=80&w=2070&auto=format&fit=crop",
    prix: "2500 DH",
    distance: "3 km",
    stadeId: "stade-marrakech"
  },
  {
    id: "les-jardins-de-la-koutoubia",
    nom: "Les Jardins de la Koutoubia",
    description: "Hôtel 5 étoiles situé au cœur de Marrakech, avec piscine sur le toit, spa et restaurants gastronomiques.",
    etoiles: 5,
    image: "https://images.unsplash.com/photo-1617870952348-7524edfb61b7?q=80&w=2070&auto=format&fit=crop",
    prix: "2200 DH",
    distance: "4.5 km",
    stadeId: "stade-marrakech"
  },
  
  // Hôtels près du Complexe Sportif de Fès
  {
    id: "palais-faraj-fes",
    nom: "Palais Faraj Suites & Spa",
    description: "Ancien palais rénové offrant une vue magnifique sur la médina. Architecture traditionnelle, spa et restaurant panoramique.",
    etoiles: 5,
    image: "https://images.unsplash.com/photo-1548386135-b70b1d4e144d?q=80&w=2063&auto=format&fit=crop",
    prix: "1900 DH",
    distance: "4 km",
    stadeId: "stade-fes"
  },
  {
    id: "riad-fes",
    nom: "Riad Fès - Relais & Châteaux",
    description: "Magnifique riad de luxe alliant architecture traditionnelle et confort moderne. Patio, piscine, spa et restaurant raffiné.",
    etoiles: 5,
    image: "https://images.unsplash.com/photo-1604528089203-6d0f82bd54f8?q=80&w=2070&auto=format&fit=crop",
    prix: "2100 DH",
    distance: "5 km",
    stadeId: "stade-fes"
  },
  
  // Hôtels près du Stade Municipal de Larache
  {
    id: "hotel-larache-plaza",
    nom: "Hôtel Larache Plaza",
    description: "Hôtel moderne au centre de Larache offrant confort et commodités. Proximité du stade et des attractions de la ville.",
    etoiles: 4,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop",
    prix: "950 DH",
    distance: "1.5 km",
    stadeId: "stade-larache"
  },
  {
    id: "marina-bay-larache",
    nom: "Marina Bay Larache",
    description: "Hôtel en bord de mer avec vue sur l'Atlantique. Chambres confortables, restaurant de fruits de mer et atmosphère détendue.",
    etoiles: 4,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop",
    prix: "1100 DH",
    distance: "2 km",
    stadeId: "stade-larache"
  }
];
