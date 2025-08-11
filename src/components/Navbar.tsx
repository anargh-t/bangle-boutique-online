import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Menu, X, Search, User, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 bg-background z-50 transition-all duration-300", 
        scrolled ? "shadow-md py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/logo_symbol.png"
            alt="Kuppivala Logo Symbol"
            className="h-8 w-auto object-contain"
            style={{ background: 'transparent' }}
          />
          <span className="text-2xl font-serif font-bold text-primary">Kuppivala</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/catalog" className="font-medium hover:text-primary transition-colors">
            Shop
          </Link>
          <Link to="/about" className="font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Cart and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/search" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/cart" aria-label="Shopping cart">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          {/* Auth Links */}
          {user ? (
            <div className="hidden md:flex items-center space-x-2">
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <User className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild className="hidden md:flex">
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          )}
          
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background shadow-lg absolute top-full left-0 w-full">
          <nav className="flex flex-col py-4">
            <Link 
              to="/" 
              className="px-6 py-3 hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/catalog" 
              className="px-6 py-3 hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className="px-6 py-3 hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="px-6 py-3 hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {/* Mobile Auth Links */}
            <div className="border-t border-muted mt-2 pt-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="px-6 py-3 hover:bg-muted transition-colors flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full px-6 py-3 hover:bg-muted transition-colors flex items-center text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="px-6 py-3 hover:bg-muted transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
