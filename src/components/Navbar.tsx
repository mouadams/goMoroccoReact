import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Trophy } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
//import { LanguageSwitcher } from './LanguageSwitcher';
//import { useLanguage } from '@/hooks/use-language';
import { ThemeProvider } from '@/hooks/use-theme';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: ('Accueil'), path: '/' },
    { name: ('Matchs'), path: '/matches' },
    { name: ('Stades'), path: '/stades' },
    { name: ('Équipes'), path: '/equipes' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <ThemeProvider>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10',
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-subtle dark:bg-black/80' 
            : 'bg-transparent'
        )}
      >
        <nav className="flex items-center justify-between mx-auto max-w-7xl">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-md bg-gradient-to-br from-caf-green via-caf-red to-caf-gold">
              <Trophy size={20} className="text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-caf-green">CAN</span>
              <span className="-mt-1 text-sm font-medium tracking-wider text-caf-dark dark:text-white">
                MAROC 2025
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden space-x-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-all duration-200 hover:text-caf-green relative py-2',
                    location.pathname === link.path 
                      ? 'text-caf-green after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-caf-green after:rounded-full' 
                      : 'text-gray-600 dark:text-gray-300'
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Theme and Language Switcher */}
          <div className="items-center hidden space-x-2 md:flex">
            <ThemeSwitcher />
           
          </div>

          {/* Mobile Menu Button and Switchers */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeSwitcher />
            
            <button 
              className="p-2 text-gray-600 transition-colors rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMobileMenu}
          
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 px-6 py-4 bg-white border-t border-gray-200 shadow-md md:hidden top-full dark:bg-gray-900 animate-fade-in dark:border-gray-700">
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      'block text-sm font-medium transition-all duration-200 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800',
                      location.pathname === link.path 
                        ? 'text-caf-green bg-caf-green/10' 
                        : 'text-gray-600 dark:text-gray-300'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </ThemeProvider>
  );
};

export default Navbar;