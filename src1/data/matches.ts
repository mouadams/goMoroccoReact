import { equipes } from "./equipes";
import { stades } from "./stades";

export interface Match {
  id: string;
  equipe1: string;
  equipe2: string;
  stade: string;
  date: string;
  heure: string;
  phase: "Groupe" | "Huitièmes" | "Quarts" | "Demi-finales" | "Match pour la 3e place" | "Finale";
  groupe?: string;
  score1?: number;
  score2?: number;
  termine?: boolean;
}

// Trouver les IDs des équipes et des stades
const getEquipeId = (nom: string) => {
  const equipe = equipes.find(e => e.nom === nom);
  return equipe ? equipe.id : "";
};

const getStadeId = (nom: string) => {
  const stade = stades.find(s => s.nom === nom);
  return stade ? stade.id : "";
};

export const matches: Match[] = [
  // Groupe A
  {
    id: "1",
    equipe1: getEquipeId("Maroc"),
    equipe2: getEquipeId("Angola"),
    stade: getStadeId("Stade Moulay Abdellah"),
    date: "2025-01-10",
    heure: "20:00",
    phase: "Groupe",
    groupe: "A"
  },
  {
    id: "2",
    equipe1: getEquipeId("Sénégal"),
    equipe2: getEquipeId("Burkina Faso"),
    stade: getStadeId("Stade Ibn Batouta"),
    date: "2025-01-11",
    heure: "17:00",
    phase: "Groupe",
    groupe: "A"
  },
  {
    id: "3",
    equipe1: getEquipeId("Maroc"),
    equipe2: getEquipeId("Burkina Faso"),
    stade: getStadeId("Stade Moulay Abdellah"),
    date: "2025-01-14",
    heure: "20:00",
    phase: "Groupe",
    groupe: "A"
  },
  {
    id: "4",
    equipe1: getEquipeId("Angola"),
    equipe2: getEquipeId("Sénégal"),
    stade: getStadeId("Stade de Marrakech"),
    date: "2025-01-15",
    heure: "17:00",
    phase: "Groupe",
    groupe: "A"
  },
  {
    id: "5",
    equipe1: getEquipeId("Angola"),
    equipe2: getEquipeId("Burkina Faso"),
    stade: getStadeId("Stade d'Adrar"),
    date: "2025-01-19",
    heure: "17:00",
    phase: "Groupe",
    groupe: "A"
  },
  {
    id: "6",
    equipe1: getEquipeId("Maroc"),
    equipe2: getEquipeId("Sénégal"),
    stade: getStadeId("Stade Moulay Abdellah"),
    date: "2025-01-19",
    heure: "20:00",
    phase: "Groupe",
    groupe: "A"
  },

  // Groupe B
  {
    id: "7",
    equipe1: getEquipeId("Égypte"),
    equipe2: getEquipeId("Guinée"),
    stade: getStadeId("Stade de Marrakech"),
    date: "2025-01-12",
    heure: "17:00",
    phase: "Groupe",
    groupe: "B"
  },
  {
    id: "8",
    equipe1: getEquipeId("Nigeria"),
    equipe2: getEquipeId("Guinée Équatoriale"),
    stade: getStadeId("Complexe Sportif de Fès"),
    date: "2025-01-12",
    heure: "20:00",
    phase: "Groupe",
    groupe: "B"
  },
  {
    id: "9",
    equipe1: getEquipeId("Égypte"),
    equipe2: getEquipeId("Guinée Équatoriale"),
    stade: getStadeId("Stade d'Adrar"),
    date: "2025-01-16",
    heure: "17:00",
    phase: "Groupe",
    groupe: "B"
  },
  {
    id: "10",
    equipe1: getEquipeId("Guinée"),
    equipe2: getEquipeId("Nigeria"),
    stade: getStadeId("Stade Municipal de Larache"),
    date: "2025-01-16",
    heure: "20:00",
    phase: "Groupe",
    groupe: "B"
  },
  {
    id: "11",
    equipe1: getEquipeId("Guinée"),
    equipe2: getEquipeId("Guinée Équatoriale"),
    stade: getStadeId("Stade Municipal de Larache"),
    date: "2025-01-20",
    heure: "17:00",
    phase: "Groupe",
    groupe: "B"
  },
  {
    id: "12",
    equipe1: getEquipeId("Égypte"),
    equipe2: getEquipeId("Nigeria"),
    stade: getStadeId("Stade de Marrakech"),
    date: "2025-01-20",
    heure: "20:00",
    phase: "Groupe",
    groupe: "B"
  },

  // Groupe C
  {
    id: "13",
    equipe1: getEquipeId("Algérie"),
    equipe2: getEquipeId("Gabon"),
    stade: getStadeId("Stade Ibn Batouta"),
    date: "2025-01-13",
    heure: "17:00",
    phase: "Groupe",
    groupe: "C"
  },
  {
    id: "14",
    equipe1: getEquipeId("Cameroun"),
    equipe2: getEquipeId("Cap-Vert"),
    stade: getStadeId("Stade d'Adrar"),
    date: "2025-01-13",
    heure: "20:00",
    phase: "Groupe",
    groupe: "C"
  },
  {
    id: "15",
    equipe1: getEquipeId("Algérie"),
    equipe2: getEquipeId("Cap-Vert"),
    stade: getStadeId("Complexe Sportif Mohammed V"),
    date: "2025-01-17",
    heure: "17:00",
    phase: "Groupe",
    groupe: "C"
  },
  {
    id: "16",
    equipe1: getEquipeId("Gabon"),
    equipe2: getEquipeId("Cameroun"),
    stade: getStadeId("Complexe Sportif de Fès"),
    date: "2025-01-17",
    heure: "20:00",
    phase: "Groupe",
    groupe: "C"
  },
  {
    id: "17",
    equipe1: getEquipeId("Gabon"),
    equipe2: getEquipeId("Cap-Vert"),
    stade: getStadeId("Stade Municipal de Larache"),
    date: "2025-01-21",
    heure: "17:00",
    phase: "Groupe",
    groupe: "C"
  },
  {
    id: "18",
    equipe1: getEquipeId("Algérie"),
    equipe2: getEquipeId("Cameroun"),
    stade: getStadeId("Stade Ibn Batouta"),
    date: "2025-01-21",
    heure: "20:00",
    phase: "Groupe",
    groupe: "C"
  },

  // Groupe D
  {
    id: "19",
    equipe1: getEquipeId("Tunisie"),
    equipe2: getEquipeId("Bénin"),
    stade: getStadeId("Complexe Sportif de Fès"),
    date: "2025-01-14",
    heure: "17:00",
    phase: "Groupe",
    groupe: "D"
  },
  {
    id: "20",
    equipe1: getEquipeId("Côte d'Ivoire"),
    equipe2: getEquipeId("Tanzanie"),
    stade: getStadeId("Stade d'Adrar"),
    date: "2025-01-14",
    heure: "20:00",
    phase: "Groupe",
    groupe: "D"
  },
  {
    id: "21",
    equipe1: getEquipeId("Tunisie"),
    equipe2: getEquipeId("Tanzanie"),
    stade: getStadeId("Stade Ibn Batouta"),
    date: "2025-01-18",
    heure: "17:00",
    phase: "Groupe",
    groupe: "D"
  },
  {
    id: "22",
    equipe1: getEquipeId("Bénin"),
    equipe2: getEquipeId("Côte d'Ivoire"),
    stade: getStadeId("Stade de Marrakech"),
    date: "2025-01-18",
    heure: "20:00",
    phase: "Groupe",
    groupe: "D"
  },
  {
    id: "23",
    equipe1: getEquipeId("Bénin"),
    equipe2: getEquipeId("Tanzanie"),
    stade: getStadeId("Complexe Sportif de Fès"),
    date: "2025-01-22",
    heure: "17:00",
    phase: "Groupe",
    groupe: "D"
  },
  {
    id: "24",
    equipe1: getEquipeId("Tunisie"),
    equipe2: getEquipeId("Côte d'Ivoire"),
    stade: getStadeId("Complexe Sportif Mohammed V"),
    date: "2025-01-22",
    heure: "20:00",
    phase: "Groupe",
    groupe: "D"
  },

  // Groupe E
  {
    id: "25",
    equipe1: getEquipeId("Mali"),
    equipe2: getEquipeId("Mozambique"),
    stade: getStadeId("Stade Municipal de Larache"),
    date: "2025-01-15",
    heure: "17:00",
    phase: "Groupe",
    groupe: "E"
  },
  {
    id: "26",
    equipe1: getEquipeId("Ghana"),
    equipe2: getEquipeId("Namibie"),
    stade: getStadeId("Stade Ibn Batouta"),
    date: "2025-01-15",
    heure: "20:00",
    phase: "Groupe",
    groupe: "E"
  },
  {
    id: "27",
    equipe1: getEquipeId("Mali"),
    equipe2: getEquipeId("Namibie"),
    stade: getStadeId("Stade de Marrakech"),
    date: "2025-01-19",
    heure: "17:00",
    phase: "Groupe",
    groupe: "E"
  },
  {
    id: "28",
    equipe1: getEquipeId("Mozambique"),
    equipe2: getEquipeId("Ghana"),
    stade: getStadeId("Stade d'Adrar"),
    date: "2025-01-19",
    heure: "20:00",
    phase: "Groupe",
    groupe: "E"
  },
  {
    id: "29",
    equipe1: getEquipeId("Mozambique"),
    equipe2: getEquipeId("Namibie"),
    stade: getStadeId("Stade d'Adrar"),
    date: "2025-01-23",
    heure: "17:00",
    phase: "Groupe",
    groupe: "E"
  },
  {
    id: "30",
    equipe1: getEquipeId("Mali"),
    equipe2: getEquipeId("Ghana"),
    stade: getStadeId("Stade Municipal de Larache"),
    date: "2025-01-23",
    heure: "20:00",
    phase: "Groupe",
    groupe: "E"
  },

  // Groupe F
  {
    id: "31",
    equipe1: getEquipeId("Afrique du Sud"),
    equipe2: getEquipeId("Zambie"),
    stade: getStadeId("Complexe Sportif de Fès"),
    date: "2025-01-16",
    heure: "17:00",
    phase: "Groupe",
    groupe: "F"
  },
  {
    id: "32",
    equipe1: getEquipeId("RD Congo"),
    equipe2: getEquipeId("Soudan"),
    stade: getStadeId("Stade de Marrakech"),
    date: "2025-01-16",
    heure: "20:00",
    phase: "Groupe",
    groupe: "F"
  },
  {
    id: "33",
    equipe1: getEquipeId("Afrique du Sud"),
    equipe2: getEquipeId("Soudan"),
    stade: getStadeId("Stade Municipal de Larache"),
    date: "2025-01-20",
    heure: "17:00",
    phase: "Groupe",
    groupe: "F"
  },
  {
    id: "34",
    equipe1: getEquipeId("Zambie"),
    equipe2: getEquipeId("RD Congo"),
    stade: getStadeId("Complexe Sportif de Fès"),
    date: "2025-01-20",
    heure: "20:00",
    phase: "Groupe",
    groupe: "F"
  },
  {
    id: "35",
    equipe1: getEquipeId("Zambie"),
    equipe2: getEquipeId("Soudan"),
    stade: getStadeId("Stade Ibn Batouta"),
    date: "2025-01-24",
    heure: "17:00",
    phase: "Groupe",
    groupe: "F"
  },
  {
    id: "36",
    equipe1: getEquipeId("Afrique du Sud"),
    equipe2: getEquipeId("RD Congo"),
    stade: getStadeId("Stade de Marrakech"),
    date: "2025-01-24",
    heure: "20:00",
    phase: "Groupe",
    groupe: "F"
  },

  // Huitièmes de finale
  {
    id: "37",
    equipe1: "1er Groupe A",
    equipe2: "3e Groupe C/D/E",
    stade: getStadeId("Stade Moulay Abdellah"),
    date: "2025-01-27",
    heure: "17:00",
    phase: "Huitièmes"
  },
  {
    id: "38",
    equipe1: "2e Groupe B",
    equipe2: "2e Groupe F",
    stade: getStadeId("Stade d'Adrar"),
    date: "2025-01-27",
    heure: "20:00",
    phase: "Huitièmes"
  },
  {
    id: "39",
    equipe1: "1er Groupe B",
    equipe2: "3e Groupe A/C/D",
    stade: getStadeId("Stade Ibn Batouta"),
    date: "2025-01-28",
    heure: "17:00",
    phase: "Huitièmes"
  },
  {
    id: "40",
    equipe1: "1er Groupe D",
    equipe2: "3e Groupe B/E/F",
    stade: getStadeId("Stade de Marrakech"),
    date: "2025-01-28",
    heure: "20:00",
    phase: "Huitièmes"
  },
  {
    id: "41",
    equipe1: "1er Groupe E",
    equipe2: "2e Groupe D",
    stade: getStadeId("Complexe Sportif de Fès"),
    date: "2025-01-29",
    heure: "17:00",
    phase: "Huitièmes"
  },
  {
    id: "42",
    equipe1: "1er Groupe F",
    equipe2: "2e Groupe E",
    stade: getStadeId("Stade Municipal de Larache"),
    date: "2025-01-29",
    heure: "20:00",
    phase: "Huitièmes"
  },
  {
    id: "43",
    equipe1: "1er Groupe C",
    equipe2: "3e Groupe A/B/F",
    stade: getStadeId("Complexe Sportif Mohammed V"),
    date: "2025-01-30",
    heure: "17:00",
    phase: "Huitièmes"
  },
  {
    id: "44",
    equipe1: "2e Groupe A",
    equipe2: "2e Groupe C",
    stade: getStadeId("Stade d'Adrar"),
    date: "2025-01-30",
    heure: "20:00",
    phase: "Huitièmes"
  },

  // Quarts de finale
  {
    id: "45",
    equipe1: "Vainqueur 8ème 1",
    equipe2: "Vainqueur 8ème 2",
    stade: getStadeId("Stade Ibn Batouta"),
    date: "2025-02-02",
    heure: "17:00",
    phase: "Quarts"
  },
  {
    id: "46",
    equipe1: "Vainqueur 8ème 3",
    equipe2: "Vainqueur 8ème 4",
    stade: getStadeId("Stade de Marrakech"),
    date: "2025-02-02",
    heure: "20:00",
    phase: "Quarts"
  },
  {
    id: "47",
    equipe1: "Vainqueur 8ème 5",
    equipe2: "Vainqueur 8ème 6",
    stade: getStadeId("Complexe Sportif de Fès"),
    date: "2025-02-03",
    heure: "17:00",
    phase: "Quarts"
  },
  {
    id: "48",
    equipe1: "Vainqueur 8ème 7",
    equipe2: "Vainqueur 8ème 8",
    stade: getStadeId("Complexe Sportif Mohammed V"),
    date: "2025-02-03",
    heure: "20:00",
    phase: "Quarts"
  },

  // Demi-finales
  {
    id: "49",
    equipe1: "Vainqueur 1/4 1",
    equipe2: "Vainqueur 1/4 2",
    stade: getStadeId("Stade d'Adrar"),
    date: "2025-02-06",
    heure: "17:00",
    phase: "Demi-finales"
  },
  {
    id: "50",
    equipe1: "Vainqueur 1/4 3",
    equipe2: "Vainqueur 1/4 4",
    stade: getStadeId("Complexe Sportif Mohammed V"),
    date: "2025-02-06",
    heure: "20:00",
    phase: "Demi-finales"
  },

  // Match pour la 3e place
  {
    id: "51",
    equipe1: "Perdant 1/2 1",
    equipe2: "Perdant 1/2 2",
    stade: getStadeId("Stade de Marrakech"),
    date: "2025-02-09",
    heure: "17:00",
    phase: "Match pour la 3e place"
  },

  // Finale
  {
    id: "52",
    equipe1: "Vainqueur 1/2 1",
    equipe2: "Vainqueur 1/2 2",
    stade: getStadeId("Stade Moulay Abdellah"),
    date: "2025-02-09",
    heure: "20:00",
    phase: "Finale"
  }
];
