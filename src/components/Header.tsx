import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Activity } from 'lucide-react';

interface HeaderProps {
  isLoginPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoginPage = false }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Activity className="h-8 w-8 text-teal-600" />
            <span className="text-xl font-bold text-gray-900">MedEquip Pro</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isLoginPage && (
              <>
                <a href="#home" className="text-gray-700 hover:text-teal-600 transition-colors">Home</a>
                <a href="#products" className="text-gray-700 hover:text-teal-600 transition-colors">Products</a>
                <a href="#about" className="text-gray-700 hover:text-teal-600 transition-colors">About</a>
                <a href="#contact" className="text-gray-700 hover:text-teal-600 transition-colors">Contact</a>
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = isLoginPage ? '/' : '#login'}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              {isLoginPage ? 'Back to Home' : 'Login'}
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="flex flex-col space-y-4">
              {!isLoginPage && (
                <>
                  <a href="#home" className="text-gray-700 hover:text-teal-600 transition-colors">Home</a>
                  <a href="#products" className="text-gray-700 hover:text-teal-600 transition-colors">Products</a>
                  <a href="#about" className="text-gray-700 hover:text-teal-600 transition-colors">About</a>
                  <a href="#contact" className="text-gray-700 hover:text-teal-600 transition-colors">Contact</a>
                </>
              )}
              <button
                onClick={() => window.location.href = isLoginPage ? '/' : '#login'}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors w-fit"
              >
                {isLoginPage ? 'Back to Home' : 'Login'}
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;