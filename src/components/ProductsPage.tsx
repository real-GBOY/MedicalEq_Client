/** @format */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	Search,
	Filter,
	Star,
	ArrowRight,
	Heart,
	Eye,
	ShoppingCart,
} from "lucide-react";
import { Product } from "../types";
import { loadProducts } from "../utils/productsLoader";

const ProductsPage: React.FC = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [sortBy, setSortBy] = useState("name");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	// Load products data
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const data = await loadProducts();
				setProducts(data.products);
				setLoading(false);
			} catch (error) {
				console.error("Error loading products:", error);
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	const categories = [
		"All",
		...Array.from(new Set(products.map((p) => p.category))),
	];

	const filteredProducts = useMemo(() => {
		let filtered = products.filter((product) => {
			const matchesSearch =
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.description.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory =
				selectedCategory === "All" || product.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});

		// Sort products
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "price-low":
					return a.price - b.price;
				case "price-high":
					return b.price - a.price;
				case "rating":
					return b.rating - a.rating;
				default:
					return a.name.localeCompare(b.name);
			}
		});

		return filtered;
	}, [products, searchTerm, selectedCategory, sortBy]);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};

	const ProductCard = ({
		product,
		index,
	}: {
		product: Product & { price: number; rating: number; features: string[] };
		index: number;
	}) => (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: index * 0.1 }}
			whileHover={{ y: -8, scale: 1.02 }}
			className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 border border-gray-100 ${
				viewMode === "list" ? "flex" : ""
			}`}>
			<div
				className={`relative overflow-hidden ${
					viewMode === "list" ? "w-1/3" : ""
				}`}>
				<div className='absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10'></div>
				<img
					src={product.image}
					alt={product.name}
					onClick={() => navigate(`/product/${product.id}`)}
					className={`object-cover transform hover:scale-110 transition-transform duration-500 cursor-pointer ${
						viewMode === "list" ? "w-full h-full" : "w-full h-56"
					}`}
				/>
				<div className='absolute top-4 right-4 flex space-x-2 z-20'>
					<motion.button
						whileHover={{ scale: 1.1, rotate: 5 }}
						whileTap={{ scale: 0.9 }}
						className='bg-white/95 backdrop-blur-sm rounded-full p-2.5 hover:bg-red-50 hover:text-red-500 transition-all duration-300 shadow-lg'>
						<Heart className='h-4 w-4 text-gray-600' />
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.1, rotate: -5 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => navigate(`/product/${product.id}`)}
						className='bg-white/95 backdrop-blur-sm rounded-full p-2.5 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300 shadow-lg'>
						<Eye className='h-4 w-4 text-gray-600' />
					</motion.button>
				</div>
				<div className='absolute bottom-4 left-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg'>
					{product.category}
				</div>
				<div className='absolute top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg'>
					⭐ {product.rating}
				</div>
			</div>

			<div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
				<div className='flex items-center justify-between mb-3'>
					<h3
						onClick={() => navigate(`/product/${product.id}`)}
						className='text-xl font-bold text-gray-900 leading-tight cursor-pointer hover:text-teal-600 transition-colors'>
						{product.name}
					</h3>
				</div>

				<p className='text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3'>
					{product.description}
				</p>

				<div className='mb-5'>
					<div className='flex flex-wrap gap-2'>
						{product.features.slice(0, 3).map((feature, idx) => (
							<span
								key={idx}
								className='bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 px-3 py-1.5 rounded-full text-xs font-medium border border-teal-200'>
								{feature}
							</span>
						))}
						{product.features.length > 3 && (
							<span className='text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full'>
								+{product.features.length - 3} more
							</span>
						)}
					</div>
				</div>

				<div className='flex flex-col space-y-4'>
					<div className='flex items-center justify-between'>
						<div className='text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent'>
							{formatPrice(product.price)}
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => navigate(`/product/${product.id}`)}
							className='bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg text-base'>
							<span>Details</span>
							<ArrowRight className='h-5 w-5' />
						</motion.button>
					</div>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='group relative w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2 font-medium border border-gray-200 overflow-hidden'>
						{/* Hover fill effect */}
						<div className='absolute inset-0 bg-teal-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out'></div>

						{/* Button content */}
						<div className='relative z-10 flex items-center justify-center text-gray-700 group-hover:text-white transition-colors duration-1000'>
							<ShoppingCart className='h-5 w-5' />
							<span>Add Order</span>
						</div>
					</motion.button>
				</div>
			</div>
		</motion.div>
	);

	// Loading state
	if (loading || products.length === 0) {
		return (
			<div className='min-h-screen bg-gray-50 pt-20'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='text-center py-20'>
						<div className='animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4'></div>
						<p className='text-gray-600'>Loading products...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 pt-20'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='text-center mb-12'>
					<h1 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-4'>
						Medical Equipment Catalog
					</h1>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
						Explore our comprehensive range of advanced medical equipment
						designed to enhance healthcare delivery and improve patient
						outcomes.
					</p>
				</motion.div>

				{/* Filters and Search */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='bg-white p-6 rounded-2xl shadow-lg mb-8'>
					<div className='grid md:grid-cols-4 gap-4'>
						{/* Search */}
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
							<input
								type='text'
								placeholder='Search products...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							/>
						</div>

						{/* Category Filter */}
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className='px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>

						{/* Sort */}
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className='px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
							<option value='name'>Sort by Name</option>
							<option value='price-low'>Price: Low to High</option>
							<option value='price-high'>Price: High to Low</option>
							<option value='rating'>Highest Rated</option>
						</select>

						{/* View Mode */}
						<div className='flex border border-gray-300 rounded-lg overflow-hidden'>
							<button
								onClick={() => setViewMode("grid")}
								className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
									viewMode === "grid"
										? "bg-teal-600 text-white"
										: "bg-white text-gray-700 hover:bg-gray-50"
								}`}>
								Grid
							</button>
							<button
								onClick={() => setViewMode("list")}
								className={`hidden sm:flex flex-1 py-3 px-4 text-sm font-medium transition-colors justify-center items-center ${
									viewMode === "list"
										? "bg-teal-600 text-white"
										: "bg-white text-gray-700 hover:bg-gray-50"
								}`}>
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
					className='mb-6'>
					<p className='text-gray-600'>
						Showing {filteredProducts.length} of {products.length} products
					</p>
				</motion.div>

				{/* Products Grid/List */}
				<AnimatePresence mode='wait'>
					<motion.div
						key={`${viewMode}-${selectedCategory}-${sortBy}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className={
							viewMode === "grid"
								? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
								: "space-y-6"
						}>
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
						className='text-center py-12'>
						<Filter className='h-16 w-16 text-gray-400 mx-auto mb-4' />
						<h3 className='text-xl font-semibold text-gray-900 mb-2'>
							No products found
						</h3>
						<p className='text-gray-600'>
							Try adjusting your search criteria or browse all categories.
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => {
								setSearchTerm("");
								setSelectedCategory("All");
							}}
							className='mt-4 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors'>
							Clear Filters
						</motion.button>
					</motion.div>
				)}

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
					className='text-center mt-16 p-8 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl text-white'>
					<h3 className='text-2xl lg:text-3xl font-bold mb-4'>
						Need Help Choosing the Right Equipment?
					</h3>
					<p className='text-lg mb-6 opacity-90'>
						Our medical equipment specialists are here to help you find the
						perfect solution for your facility.
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors'
						onClick={() =>
							document
								.getElementById("contact")
								?.scrollIntoView({ behavior: "smooth" })
						}>
						Consult Our Experts
					</motion.button>
				</motion.div>
			</div>
		</div>
	);
};

export default ProductsPage;
