import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Stade } from '@/types/stade';
import { Hotel } from '@/types/hotel';
import { Match } from '@/types/match';
import { Equipe } from '@/types/equipe';
import { Restaurant } from '@/types/restaurant';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Create Async Thunks for fetching data
export const fetchStades = createAsyncThunk('api/fetchStades', async () => {
  const response = await API.get<Stade[]>('/api/stades/');
  return response.data;
});

export const fetchHotels = createAsyncThunk('api/fetchHotels', async () => {
  const response = await API.get<Hotel[]>('/api/hotels');
  return response.data;
});

export const fetchMatches = createAsyncThunk('api/fetchMatches', async () => {
  const response = await API.get<Match[]>('/api/matches');
  return response.data;
});

export const fetchEquipes = createAsyncThunk('api/fetchEquipes', async () => {
  const response = await API.get<Equipe[]>('/api/equipes');
  return response.data;
});

export const fetchRestaurants = createAsyncThunk('api/fetchRestaurants', async () => {  
  const response = await API.get<Restaurant[]>('/api/restaurants');
  return response.data;
});

// Create a slice
const apiSlice = createSlice({
  name: 'api',
  initialState: {
    stades: [] as Stade[],
    hotels: [] as Hotel[],
    matches: [] as Match[],
    equipes: [] as Equipe[],
    restaurants: [] as Restaurant[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStades.pending, (state) => { state.loading = true; })
      .addCase(fetchStades.fulfilled, (state, action) => {
        state.loading = false;
        state.stades = action.payload;
      })
      .addCase(fetchStades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load stades';
      })
      
      // Repeat the same for other fetch actions
      .addCase(fetchHotels.pending, (state) => { state.loading = true; })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load hotels';
      })

      .addCase(fetchMatches.pending, (state) => { state.loading = true; })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load matches';
      })

      .addCase(fetchEquipes.pending, (state) => { state.loading = true; })
      .addCase(fetchEquipes.fulfilled, (state, action) => {
        state.loading = false;
        state.equipes = action.payload;
      })
      .addCase(fetchEquipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load equipes';
      })
      .addCase(fetchRestaurants.pending, (state) => { state.loading = true; })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load restaurants';
      });
  },
});

export default apiSlice.reducer;