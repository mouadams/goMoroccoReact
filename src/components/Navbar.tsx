
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Matchs', path: '/matches' },
    { name: 'Stades', path: '/stades' },
    { name: 'Équipes', path: '/equipes' }
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-subtle dark:bg-black/80' : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold text-caf-green">CAN</span>
            <span className="text-sm font-medium tracking-wider -mt-1 text-caf-dark">MAROC 2025</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-all duration-200 hover:text-caf-green relative py-2',
                  location.pathname === link.path ? 
                    'text-caf-green after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-caf-green after:rounded-full' : 
                    'text-gray-600 dark:text-gray-300'
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600 dark:text-gray-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-black shadow-md py-4 px-6 animate-fade-in">
          <ul className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    'block text-sm font-medium transition-all duration-200',
                    location.pathname === link.path ? 
                      'text-caf-green' : 
                      'text-gray-600 dark:text-gray-300'
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
