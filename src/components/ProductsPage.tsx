import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, ArrowRight, Heart, Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const products: Product[] = [
    {
      id: 1,
      name: 'Advanced MRI Scanner Pro',
      description: 'High-resolution 3T magnetic resonance imaging system with AI-enhanced diagnostics and advanced pulse sequences.',
      image: 'https://images.pexels.com/photos/7659743/pexels-photo-7659743.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Imaging Equipment',
      price: 2500000,
      rating: 4.9,
      features: ['3T Magnetic Field', 'AI Diagnostics', 'Advanced Pulse Sequences', '24/7 Support']
    },
    {
      id: 2,
      name: 'Digital X-Ray System Elite',
      description: 'State-of-the-art digital radiography with instant imaging, reduced radiation exposure, and wireless connectivity.',
      image: 'https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Diagnostic Tools',
      price: 150000,
      rating: 4.8,
      features: ['Digital Imaging', 'Low Radiation', 'Wireless Connectivity', 'Instant Results']
    },
    {
      id: 3,
      name: 'Portable Ultrasound Pro',
      description: 'Compact ultrasound system with crystal-clear imaging, multiple transducers, and cloud connectivity.',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Imaging Equipment',
      price: 85000,
      rating: 4.7,
      features: ['Portable Design', 'Multiple Transducers', 'Cloud Storage', 'HD Display']
    },
    {
      id: 4,
      name: 'Patient Monitor Advanced',
      description: 'Multi-parameter patient monitoring system with real-time data analytics and wireless connectivity.',
      image: 'https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Monitoring Systems',
      price: 45000,
      rating: 4.6,
      features: ['Multi-Parameter', 'Real-time Analytics', 'Wireless', 'Touch Screen']
    },
    {
      id: 5,
      name: 'Surgical Robot Assistant',
      description: 'Precision robotic surgical system with haptic feedback and 4K visualization for minimally invasive procedures.',
      image: 'https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Surgical Equipment',
      price: 1800000,
      rating: 4.9,
      features: ['Robotic Precision', 'Haptic Feedback', '4K Visualization', 'Minimally Invasive']
    },
    {
      id: 6,
      name: 'CT Scanner Premium',
      description: 'High-speed computed tomography scanner with low-dose protocols and advanced reconstruction algorithms.',
      image: 'https://images.pexels.com/photos/7659750/pexels-photo-7659750.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Imaging Equipment',
      price: 1200000,
      rating: 4.8,
      features: ['High-Speed Scanning', 'Low-Dose Protocol', 'Advanced Reconstruction', 'Multi-Slice']
    },
    {
      id: 7,
      name: 'Ventilator ICU Pro',
      description: 'Advanced mechanical ventilator with multiple ventilation modes and integrated monitoring capabilities.',
      image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Life Support',
      price: 65000,
      rating: 4.7,
      features: ['Multiple Modes', 'Integrated Monitoring', 'Touch Interface', 'Alarm System']
    },
    {
      id: 8,
      name: 'Defibrillator Emergency',
      description: 'Automated external defibrillator with voice prompts, ECG monitoring, and data recording capabilities.',
      image: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Emergency Equipment',
      price: 25000,
      rating: 4.8,
      features: ['Voice Prompts', 'ECG Monitoring', 'Data Recording', 'Portable Design']
    }
  ];

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const ProductCard = ({ product, index }: { product: Product & { price: number; rating: number; features: string[] }, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : ''}`}>
        <img
          src={product.image}
          alt={product.name}
          className={`object-cover transform hover:scale-110 transition-transform duration-300 ${
            viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
          }`}
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </motion.button>
        </div>
        <div className="absolute bottom-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
          {product.category}
        </div>
      </div>
      
      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {product.description}
        </p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {product.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
            {product.features.length > 3 && (
              <span className="text-gray-500 text-xs">+{product.features.length - 3} more</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-teal-600">
            {formatPrice(product.price)}
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Quote</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-1"
            >
              <span>Details</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Medical Equipment Catalog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive range of advanced medical equipment designed to enhance 
            healthcare delivery and improve patient outcomes.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </motion.div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${selectedCategory}-${sortBy}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={
              viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                : 'space-y-6'
            }
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all categories.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl text-white"
        >
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Need Help Choosing the Right Equipment?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Our medical equipment specialists are here to help you find the perfect solution for your facility.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Consult Our Experts
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductsPage;