import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Equipe {
  id: number;
  nom: string;
  drapeau: string;
  groupe: string;
  points: number;
  joues: number;
  gagnes: number;
  nuls: number;
  perdus: number;
  buts_marques: number;
  buts_encaisses: number;
  difference_buts: number;
}

interface EquipesState {
  equipes: Equipe[];
  selectedEquipe: Equipe | null;
  loading: boolean;
  error: string | null;
}

const initialState: EquipesState = {
  equipes: [],
  selectedEquipe: null,
  loading: false,
  error: null,
};

const equipesSlice = createSlice({
  name: 'equipes',
  initialState,
  reducers: {
    setEquipes: (state, action: PayloadAction<Equipe[]>) => {
      state.equipes = action.payload;
    },
    setSelectedEquipe: (state, action: PayloadAction<Equipe | null>) => {
      state.selectedEquipe = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addEquipe: (state, action: PayloadAction<Equipe>) => {
      state.equipes.push(action.payload);
    },
    updateEquipe: (state, action: PayloadAction<Equipe>) => {
      const index = state.equipes.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.equipes[index] = action.payload;
      }
    },
    deleteEquipe: (state, action: PayloadAction<number>) => {
      state.equipes = state.equipes.filter(e => e.id !== action.payload);
    },
  },
});

export const {
  setEquipes,
  setSelectedEquipe,
  setLoading,
  setError,
  addEquipe,
  updateEquipe,
  deleteEquipe,
} = equipesSlice.actions;

export default equipesSlice.reducer; 