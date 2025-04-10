import axios from "axios";
import { Stade } from "@/types/stade";
import { Hotel } from "@/types/hotel";
import { Match } from "@/types/match";
import { Equipe } from "@/types/equipe";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;

export let stades: Stade[] = JSON.parse(localStorage.getItem("stades") || "[]");
export let hotels: Hotel[] = JSON.parse(localStorage.getItem("hotels") || "[]");
export let matches: Match[] = JSON.parse(localStorage.getItem("matches") || "[]");
export let equipes: Equipe[] = JSON.parse(localStorage.getItem("equipes") || "[]");

const fetchStades = async () => {
  try {
    const response = await API.get("/stades");
    stades = response.data;
    localStorage.setItem("stades", JSON.stringify(stades)); // Sauvegarder dans localStorage
  } catch (error) {
    console.error("Error fetching stadiums:", error);
    stades = [];
  }
};

export const fetchEquipes = async () => {
  try {
    const response = await API.get("/equipes");
    equipes = response.data;
    localStorage.setItem("equipes", JSON.stringify(equipes));
  } catch (error) {
    console.error("Error fetching teams:", error);
    equipes = [];
  }
};

export const fetchMatches = async () => {
  try {
    const response = await API.get("/matches");
    matches = response.data;
    localStorage.setItem("matches", JSON.stringify(matches));
  } catch (error) {
    console.error("Error fetching matches:", error);
    matches = [];
  }
};

export const fetchHotels = async () => {
  try {
    const response = await API.get("/hotels");
    hotels = response.data;
    localStorage.setItem("hotels", JSON.stringify(hotels));
  } catch (error) {
    console.error("Error fetching hotels:", error);
    hotels = [];
  }
};

// Charger les données au démarrage de l'application
fetchStades();
fetchEquipes();
fetchMatches();
fetchHotels();
