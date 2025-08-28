/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Activity,
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
	Mail,
	Phone,
	MapPin,
} from "lucide-react";
import { loadProducts } from "../utils/productsLoader";

const Footer: React.FC = () => {
	const [products, setProducts] = useState<
		Array<{ name: string; href: string }>
	>([]);

	const quickLinks = [
		{ name: "Home", href: "#home" },
		{ name: "Products", href: "/products" },
		{ name: "About Us", href: "/about" },
		{ name: "Contact", href: "/contact" },
	];

	// Load products data for footer
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const data = await loadProducts();
				// Get unique categories and create footer links
				const uniqueCategories = [
					...new Set(data.products.map((p) => p.category)),
				];
				const footerProducts = uniqueCategories.slice(0, 4).map((category) => ({
					name: category,
					href: `/products?category=${category}`,
				}));
				setProducts(footerProducts);
			} catch (error) {
				console.error("Error loading products for footer:", error);
				// Fallback to default products
				setProducts([
					{ name: "Imaging Equipment", href: "/products" },
					{ name: "Diagnostic Tools", href: "/products" },
					{ name: "Monitoring Systems", href: "/products" },
					{ name: "Surgical Equipment", href: "/products" },
				]);
			}
		};
		fetchProducts();
	}, []);

	const socialLinks = [
		{ icon: Facebook, href: "#", label: "Facebook" },
		{ icon: Twitter, href: "#", label: "Twitter" },
		{ icon: Linkedin, href: "#", label: "LinkedIn" },
		{ icon: Instagram, href: "#", label: "Instagram" },
	];

	return (
		<footer className='bg-gray-900 text-white'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='grid lg:grid-cols-5 gap-8'>
					{/* Vertical Logo Section */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='flex flex-col items-center justify-start'>
						<button
							type='button'
							aria-label='Scroll to top'
							className='group'
							onClick={() => {
								const home = document.querySelector('#home');
								if (home) {
									home.scrollIntoView({ behavior: 'smooth' });
								} else {
									window.scrollTo({ top: 0, behavior: 'smooth' });
								}
							}}>
							<img
								src='/logo.png'
								alt='MedEquip Pro Logo'
								className='h-40 w-40 lg:h-56 lg:w-56 object-cover rounded-xl shadow-xl transition-transform duration-200 group-hover:scale-[1.02]'
							/>
						</button>
					</motion.div>
					{/* Company Info */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}>
						<div className='flex items-center space-x-2 mb-6'>
							<Activity className='h-8 w-8 text-teal-400' />
							<span className='text-xl font-bold'>MedEquip Pro</span>
						</div>
						<p className='text-gray-400 mb-6 leading-relaxed'>
							Leading provider of advanced medical equipment solutions,
							empowering healthcare professionals worldwide with cutting-edge
							technology.
						</p>
						<div className='space-y-3'>
							<div className='flex items-center space-x-3'>
								<Mail className='h-5 w-5 text-teal-400' />
								<span className='text-gray-300'>info@medequippro.com</span>
							</div>
							<div className='flex items-center space-x-3'>
								<Phone className='h-5 w-5 text-teal-400' />
								<span className='text-gray-300'>+1 (555) 123-4567</span>
							</div>
							<div className='flex items-center space-x-3'>
								<MapPin className='h-5 w-5 text-teal-400' />
								<span className='text-gray-300'>
									123 Healthcare Blvd, NY 10001
								</span>
							</div>
						</div>
					</motion.div>

					{/* Quick Links */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}>
						<h3 className='text-lg font-semibold mb-6'>Quick Links</h3>
						<ul className='space-y-3'>
							{quickLinks.map((link) => (
								<li key={link.name}>
									<motion.a
										href={link.href}
										whileHover={{ x: 5 }}
										className='text-gray-400 hover:text-teal-400 transition-colors'>
										{link.name}
									</motion.a>
								</li>
							))}
						</ul>
					</motion.div>

					{/* Products */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}>
						<h3 className='text-lg font-semibold mb-6'>Products</h3>
						<ul className='space-y-3'>
							{products.map((product) => (
								<li key={product.name}>
									<motion.a
										href={product.href}
										whileHover={{ x: 5 }}
										className='text-gray-400 hover:text-teal-400 transition-colors'>
										{product.name}
									</motion.a>
								</li>
							))}
						</ul>
					</motion.div>

					{/* Newsletter & Social */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}>
						<h3 className='text-lg font-semibold mb-6'>Stay Connected</h3>
						<p className='text-gray-400 mb-4'>
							Subscribe to our newsletter for the latest updates on medical
							equipment and healthcare innovations.
						</p>
						<div className='flex mb-6'>
							<input
								type='email'
								placeholder='Enter your email'
								className='flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white'
							/>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className='bg-teal-600 px-4 py-2 rounded-r-lg hover:bg-teal-700 transition-colors'>
								<Mail className='h-5 w-5' />
							</motion.button>
						</div>

						<div className='flex space-x-4'>
							{socialLinks.map((social) => (
								<motion.a
									key={social.label}
									href={social.href}
									whileHover={{ scale: 1.1, y: -2 }}
									className='w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-400 hover:bg-gray-700 transition-colors'
									aria-label={social.label}>
									<social.icon className='h-5 w-5' />
								</motion.a>
							))}
						</div>
					</motion.div>
				</div>

				{/* Bottom Bar */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className='border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
					<p className='text-gray-400 text-sm'>
						© 2024 MedEquip Pro. All rights reserved.
					</p>
					<div className='flex space-x-6 text-sm'>
						<motion.a
							href='#'
							whileHover={{ scale: 1.05 }}
							className='text-gray-400 hover:text-teal-400 transition-colors'>
							Privacy Policy
						</motion.a>
						<motion.a
							href='#'
							whileHover={{ scale: 1.05 }}
							className='text-gray-400 hover:text-teal-400 transition-colors'>
							Terms of Service
						</motion.a>
						<motion.a
							href='#'
							whileHover={{ scale: 1.05 }}
							className='text-gray-400 hover:text-teal-400 transition-colors'>
							Cookie Policy
						</motion.a>
					</div>
				</motion.div>
			</div>
		</footer>
	);
};

export default Footer;
