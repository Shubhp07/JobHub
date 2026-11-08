import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 font-serif text-3xl font-bold text-white tracking-wide">
            JobHub<span className="text-spenceSecondary">.</span>
          </Link>

          {/* Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 text-white hover:text-spenceSecondary transition-colors focus:outline-none"
          >
            <span className="font-serif text-lg font-medium">Menu</span>
            <span className="w-2.5 h-2.5 rounded-full bg-spenceSecondary animate-pulse"></span>
          </button>
        </div>

        {/* Fullscreen Overlay Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-[#0E232D]/95 backdrop-blur-md z-[9999] flex flex-col justify-between p-8 md:p-16 animate-fade-in">
            {/* Overlay Header */}
            <div className="flex justify-between items-center">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl font-bold text-white">
                JobHub<span className="text-spenceSecondary">.</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-white hover:text-spenceSecondary transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col gap-6 md:gap-8 my-auto text-left">
              <Link
                to="/dashboard/jobseeker"
                onClick={() => setIsMenuOpen(false)}
                className="font-serif text-4xl md:text-6xl text-white hover:text-spenceSecondary transition-colors font-bold"
              >
                Find Jobs
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="font-serif text-4xl md:text-6xl text-white hover:text-spenceSecondary transition-colors font-bold"
              >
                Sign In
              </Link>
              <Link
                to="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="font-serif text-4xl md:text-6xl text-white hover:text-spenceSecondary transition-colors font-bold"
              >
                Sign Up
              </Link>
            </nav>

            {/* Footer inside menu */}
            <div className="border-t border-[#1e3d4c] pt-8 flex flex-col md:flex-row justify-between gap-4 text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} JobHub. Inspired by Spence.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;