import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Provider } from 'react-redux';
import { store } from './store';
import Index from "./pages/Index";
import Matches from "./pages/Matches";
import Stades from "./pages/Stades";
import Equipes from "./pages/Equipes";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CompetitionBanner from "./components/CompetitionBanner";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CompetitionBanner />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/stades" element={<Stades />} />
              <Route path="/stades/:id" element={<Stades />} />
              <Route path="/equipes" element={<Equipes />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
