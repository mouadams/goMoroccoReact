import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";

export function ThemeSwitcher() {
  // Add error boundary logic
  try {
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
      try {
        setTheme(newTheme);
      } catch (error) {
        console.error('Error setting theme:', error);
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>{t('Thème clair')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>{t('Thème sombre')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>
            <Laptop className="mr-2 h-4 w-4" />
            <span>{t('System')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } catch (error) {
    console.error('ThemeSwitcher error:', error);
    
    // Fallback UI when there's an error
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className="border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground"
        disabled
        aria-label="Theme switcher unavailable"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }
}

export default ThemeSwitcher;