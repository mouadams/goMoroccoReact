

export interface Hotel {
    id: number;
    nom: string;
    description: string;
    etoiles: number;
    image: string;
    prix: string; // Assuming you convert it from VARCHAR to INT
    distance: string;
    stadeId: number;
  }