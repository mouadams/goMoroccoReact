
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';
type TranslationKey = string;
type TranslationValue = { [key in Language]: string };

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<TranslationKey, TranslationValue> = {
  // Navigation
  'Accueil': { en: 'Home', fr: 'Accueil' },
  'Matches': { en: 'Matches', fr: 'Matches' },
  'Stades': { en: 'Stadiums', fr: 'Stades' },
  'Équipes': { en: 'Teams', fr: 'Équipes' },
  'Contact': { en: 'Contact', fr: 'Contact' },
  
  // Hero
  'Coupe d\'Afrique des Nations': { en: 'Africa Cup of Nations', fr: 'Coupe d\'Afrique des Nations' },
  '21 juin - 19 juillet 2025': { en: 'June 21 - July 19, 2025', fr: '21 juin - 19 juillet 2025' },
  'Maroc 2025': { en: 'Morocco 2025', fr: 'Maroc 2025' },
  'Découvrir les stades': { en: 'Discover the stadiums', fr: 'Découvrir les stades' },
  'Voir les équipes': { en: 'View teams', fr: 'Voir les équipes' },
  
  // Stadium Section
  'Les stades hôtes': { en: 'Host stadiums', fr: 'Les stades hôtes' },
  'Découvrez les magnifiques stades': { en: 'Discover the magnificent stadiums', fr: 'Découvrez les magnifiques stades' },
  'qui accueilleront les matchs de la CAN 2025.': { en: 'that will host AFCON 2025 matches.', fr: 'qui accueilleront les matchs de la CAN 2025.' },
  'Voir tous les stades': { en: 'View all stadiums', fr: 'Voir tous les stades' },
  
  // Teams Section
  'Les équipes qualifiées': { en: 'Qualified teams', fr: 'Les équipes qualifiées' },
  '24 équipes africaines s\'affrontent pour remporter le prestigieux trophée de la Coupe d\'Afrique des Nations.': 
  { en: '24 African teams compete to win the prestigious Africa Cup of Nations trophy.', fr: '24 équipes africaines s\'affrontent pour remporter le prestigieux trophée de la Coupe d\'Afrique des Nations.' },
  'Voir toutes les équipes': { en: 'View all teams', fr: 'Voir toutes les équipes' },
  
  // Matches Section
  'Prochains matches': { en: 'Upcoming matches', fr: 'Prochains matches' },
  'Calendrier complet': { en: 'Full schedule', fr: 'Calendrier complet' },
  'Match d\'ouverture': { en: 'Opening match', fr: 'Match d\'ouverture' },
  
  // Stadium Details
  'Capacité:': { en: 'Capacity:', fr: 'Capacité:' },
  'Ville:': { en: 'City:', fr: 'Ville:' },
  'Année de construction:': { en: 'Year built:', fr: 'Année de construction:' },
  'Détails du stade': { en: 'Stadium details', fr: 'Détails du stade' },
  'Hôtels à proximité': { en: 'Nearby hotels', fr: 'Hôtels à proximité' },
  'Restaurants à proximité': { en: 'Nearby restaurants', fr: 'Restaurants à proximité' },
  'Activités à proximité': { en: 'Nearby activities', fr: 'Activités à proximité' },
  
  // Teams
  'joueurs': { en: 'players', fr: 'joueurs' },
  'titres': { en: 'titles', fr: 'titres' },
  'Voir les détails': { en: 'View details', fr: 'Voir les détails' },
  'Chargement de l\'image...': { en: 'Loading image...', fr: 'Chargement de l\'image...' },
  
  // Map
  'Sélectionner un stade': { en: 'Select a stadium', fr: 'Sélectionner un stade' },
  'System': { en: 'System', fr: 'Système' },
  'spectateurs': { en: 'spectators', fr: 'spectateurs' },
  
  // Footer
  'Tous droits réservés': { en: 'All rights reserved', fr: 'Tous droits réservés' },
  
  // Theme
  'Thème clair': { en: 'Light theme', fr: 'Thème clair' },
  'Thème sombre': { en: 'Dark theme', fr: 'Thème sombre' },
  
  // Language
  'Français': { en: 'French', fr: 'Français' },
  'English': { en: 'English', fr: 'Anglais' },
  
  // Assistant AI
  'Assistant CAN 2025': { en: 'AFCON 2025 Assistant', fr: 'Assistant CAN 2025' },
  'Posez vos questions sur la Coupe d\'Afrique des Nations 2025': { en: 'Ask your questions about the 2025 Africa Cup of Nations', fr: 'Posez vos questions sur la Coupe d\'Afrique des Nations 2025' },
  'Posez votre question sur la CAN 2025...': { en: 'Ask your question about AFCON 2025...', fr: 'Posez votre question sur la CAN 2025...' },
  'Envoyer': { en: 'Send', fr: 'Envoyer' },
  'Traitement en cours...': { en: 'Processing...', fr: 'Traitement en cours...' },
  'Vous': { en: 'You', fr: 'Vous' },
  'Questions suggérées': { en: 'Suggested questions', fr: 'Questions suggérées' },
  'Nouvelle conversation': { en: 'New conversation', fr: 'Nouvelle conversation' },
  'Groupe': { en: 'Group', fr: 'Groupe' },
  
  // User Form
  'Nom complet': { en: 'Full name', fr: 'Nom complet' },
  'Nom de l\'utilisateur': { en: 'User name', fr: 'Nom de l\'utilisateur' },
  'Mot de passe': { en: 'Password', fr: 'Mot de passe' },
  'Minimum 6 caractères, utilisez des lettres, chiffres et symboles': { en: 'Minimum 6 characters, use letters, numbers and symbols', fr: 'Minimum 6 caractères, utilisez des lettres, chiffres et symboles' },
  'Rôle': { en: 'Role', fr: 'Rôle' },
  'Sélectionner un rôle': { en: 'Select a role', fr: 'Sélectionner un rôle' },
  'Administrateur': { en: 'Administrator', fr: 'Administrateur' },
  'Éditeur': { en: 'Editor', fr: 'Éditeur' },
  'Utilisateur': { en: 'User', fr: 'Utilisateur' },
  'Admin: tous les droits / Éditeur: peut modifier / Utilisateur: lecture seule': { en: 'Admin: all rights / Editor: can modify / User: read only', fr: 'Admin: tous les droits / Éditeur: peut modifier / Utilisateur: lecture seule' },
  'Compte actif': { en: 'Active account', fr: 'Compte actif' },
  'Désactivez pour suspendre temporairement l\'accès de l\'utilisateur': { en: 'Disable to temporarily suspend user access', fr: 'Désactivez pour suspendre temporairement l\'accès de l\'utilisateur' },
  'Annuler': { en: 'Cancel', fr: 'Annuler' },
};

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const translate = (key: TranslationKey, params?: Record<string, string>): string => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    let text = translations[key][language];

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, paramValue);
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
