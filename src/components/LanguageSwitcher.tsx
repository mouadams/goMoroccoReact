
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageToggle = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleLanguageToggle}
            className="border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">
              {language === 'fr' ? 'Switch to English' : 'Passer au Français'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{language === 'fr' ? 'Switch to English' : 'Passer au Français'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default LanguageSwitcher;
