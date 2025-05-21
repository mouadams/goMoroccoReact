import axios from 'axios';
import { Stade } from '@/types/stade';
import { Hotel } from '@/types/hotel';
import { Match } from '@/types/match';
import { Equipe } from '@/types/equipe';

// Create an Axios instance with the base URL pointing to your Laravel API
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Make sure this points to your Laravel backend
  headers: {
    'Content-Type': 'application/json',
  },
});




export default API;

export let stades: Stade[] = [];
export let hotels: Hotel[] = [];
export let matches: Match[] = [];
export let equipes: Equipe[] = [];
export const STORAGE_LINK = 'http://127.0.0.1:8000/storage/';

const fetchStades = async () => {
  try {
    const response = await API.get("/api/stades"); // Adjust the endpoint as per your Laravel API
    stades = response.data; // Store data in the exported variable
  } catch (error) {
    console.error("Error fetching stadiums:", error);
    stades = [];
  }
};

export const fetchEquipes = async () => {
    try {
      const response = await API.get("/api/equipes"); // Adjust endpoint as needed
      equipes = response.data;
    } catch (error) {
      console.error("Error fetching teams:", error);
      equipes = [];
    }
  };
  
  export const fetchMatches = async () => {
    try {
      const response = await API.get("/api/matches"); // Adjust endpoint as needed
      matches = response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      matches = [];
    }
  };
  
  export const fetchHotels = async () => {
    try {
      const response = await API.get("/api/hotels"); // Adjust endpoint as needed
      hotels = response.data;
    } catch (error) {
      console.error("Error fetching hotels:", error);
      hotels = [];
    }
  };

// Call the function immediately to populate `stades`
fetchStades();
fetchEquipes();
fetchMatches();
fetchHotels();