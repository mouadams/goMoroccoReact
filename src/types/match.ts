export interface Match {
    id: string;
    equipe1: string;
    equipe2: string;
    stade: string;
    date: string;
    heure: string;
    phase: 'Groupe' | 'Huitièmes' | 'Quarts' | 'Demi-finales' | 'Match pour la 3e place' | 'Finale';
    groupe?: string;
    score1?: number;
    score2?: number;
    termine?: boolean;
  }