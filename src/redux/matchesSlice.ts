import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Match type
interface Match {
  id?: string;
  equipe1: string;
  equipe2: string;
  date: string;
  heure: string;
  stadeId: string;
  phase: string;
  groupe?: string;
  score1?: number;
  score2?: number;
  termine: boolean;
}

// Define the state interface
interface MatchesState {
  matches: Match[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: MatchesState = {
  matches: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/matches');
    return response.data.data || response.data;
  }
);

export const createMatch = createAsyncThunk(
  'matches/createMatch',
  async (matchData: Omit<Match, 'id'>) => {
    const response = await axios.post('http://127.0.0.1:8000/api/matches', matchData);
    return response.data;
  }
);

export const updateMatch = createAsyncThunk(
  'matches/updateMatch',
  async ({ id, matchData }: { id: string; matchData: Partial<Match> }) => {
    const response = await axios.put(`http://127.0.0.1:8000/api/matches/${id}`, matchData);
    return response.data;
  }
);

export const deleteMatch = createAsyncThunk(
  'matches/deleteMatch',
  async (id: string) => {
    await axios.delete(`http://127.0.0.1:8000/api/matches/${id}`);
    return id;
  }
);

// Create the slice
const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch matches
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch matches';
      })
      // Create match
      .addCase(createMatch.fulfilled, (state, action) => {
        state.matches.push(action.payload);
      })
      // Update match
      .addCase(updateMatch.fulfilled, (state, action) => {
        const index = state.matches.findIndex(match => match.id === action.payload.id);
        if (index !== -1) {
          state.matches[index] = action.payload;
        }
      })
      // Delete match
      .addCase(deleteMatch.fulfilled, (state, action) => {
        state.matches = state.matches.filter(match => match.id !== action.payload);
      });
  },
});

export default matchesSlice.reducer;
