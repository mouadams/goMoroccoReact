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