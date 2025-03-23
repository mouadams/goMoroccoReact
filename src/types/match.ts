

export interface Match {
    id: number;
    equipe1: number;
    equipe2: number;
    stadeId: number;
    date: string; // Stored as a string in YYYY-MM-DD format
    heure: string; // Stored as a string in HH:MM:SS format
    phase: 'Groupe' | 'Huitièmes' | 'Quarts' | 'Demi-finales' | 'Match pour la 3e place' | 'Finale';
    groupe: string;
    score1: number;
    score2: number;
    termine: number;
  }