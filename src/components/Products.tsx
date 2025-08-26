import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';

const Products: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      name: 'Advanced MRI Scanner',
      description: 'High-resolution magnetic resonance imaging system with AI-enhanced diagnostics.',
      image: 'https://images.pexels.com/photos/7659743/pexels-photo-7659743.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Imaging Equipment'
    },
    {
      id: 2,
      name: 'Digital X-Ray System',
      description: 'State-of-the-art digital radiography with instant imaging and reduced radiation.',
      image: 'https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Diagnostic Tools'
    },
    {
      id: 3,
      name: 'Ultrasound Machine',
      description: 'Portable ultrasound system with crystal-clear imaging for various applications.',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Imaging Equipment'
    },
    {
      id: 4,
      name: 'Patient Monitor',
      description: 'Advanced vital signs monitoring with real-time data and wireless connectivity.',
      image: 'https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Monitoring Systems'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured Medical Equipment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our cutting-edge medical devices designed to enhance patient care 
            and improve healthcare outcomes across all specialties.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                <div className="absolute bottom-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-teal-700 transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-burgundy-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-burgundy-800 transition-colors"
            style={{ backgroundColor: '#8B2635' }}
          >
            View All Products
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;