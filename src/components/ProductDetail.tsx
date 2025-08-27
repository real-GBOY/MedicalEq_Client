/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	ShoppingCart,
	Star,
	Zap,
	Shield,
	Truck,
	RotateCcw,
} from "lucide-react";
import { Product } from "../types";
import { getProductById, getRelatedProducts } from "../utils/productsLoader";

const ProductDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [product, setProduct] = useState<Product | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedImage, setSelectedImage] = useState(0);

	// Load product data
	useEffect(() => {
		const fetchProduct = async () => {
			if (!id) return;

			try {
				const productData = await getProductById(Number(id));
				if (productData) {
					setProduct(productData);
					// Load related products
					const related = await getRelatedProducts(
						productData.category,
						productData.id
					);
					setRelatedProducts(related);
				}
				setLoading(false);
			} catch (error) {
				console.error("Error loading product:", error);
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	// Loading state
	if (loading) {
		return (
			<div className='container mx-auto px-6 py-20 text-center'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='mb-4'>
					<div className='animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading product...</p>
				</motion.div>
			</div>
		);
	}

	// Product not found state
	if (!product) {
		return (
			<div className='container mx-auto px-6 py-20 text-center'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='mb-4'>
					<h2 className='text-3xl md:text-4xl font-light text-gray-900 mb-4'>
						Product Not Found
					</h2>
					<p className='text-gray-600 mb-6'>
						The product you're looking for doesn't exist.
					</p>
					<button
						onClick={() => navigate("/products")}
						className='inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors'>
						<ArrowLeft className='w-4 h-4' />
						<span>Return to Products</span>
					</button>
				</motion.div>
			</div>
		);
	}

	const handleAddToCart = () => {
		// TODO: Implement cart functionality
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
			<div className='container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12 pt-16 sm:pt-20 lg:pt-24'>
				{/* Back Button */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					className='mb-6 sm:mb-8'>
					<button
						onClick={() => navigate(-1)}
						className='inline-flex items-center space-x-2 bg-white text-gray-700 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 hover:border-teal-300 hover:text-teal-700 transition-colors shadow-sm text-sm sm:text-base'>
						<ArrowLeft className='w-4 h-4' />
						<span>Back</span>
					</button>
				</motion.div>

				<div className='grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12'>
					{/* Product Images */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className='space-y-3 sm:space-y-4 lg:space-y-6'>
						{/* Main Image */}
						<div className='relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl'>
							<img
								src={product.images[selectedImage]}
								alt={product.name}
								className='w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover transition-transform duration-300 hover:scale-105'
							/>
							{/* Category Badge */}
							<div className='absolute top-2 sm:top-4 left-2 sm:left-4'>
								<span className='inline-flex items-center space-x-1 sm:space-x-2 bg-white/95 backdrop-blur-sm text-gray-800 px-2 sm:px-3 py-1.5 rounded-lg font-medium border border-white/20 shadow-lg text-xs sm:text-sm'>
									<Zap className='w-3 h-3 sm:w-4 sm:h-4 text-teal-600' />
									<span className='hidden sm:inline'>{product.category}</span>
									<span className='sm:hidden'>
										{product.category.split(" ")[0]}
									</span>
								</span>
							</div>
						</div>

						{/* Thumbnail Images */}
						<div className='grid grid-cols-4 gap-2 sm:gap-4'>
							{product.images.map((image, index) => (
								<button
									key={index}
									onClick={() => setSelectedImage(index)}
									className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
										selectedImage === index
											? "border-teal-500 shadow-lg"
											: "border-gray-200 hover:border-teal-300"
									}`}>
									<img
										src={image}
										alt={`${product.name} ${index + 1}`}
										className='w-full h-16 sm:h-20 object-cover'
									/>
								</button>
							))}
						</div>
					</motion.div>

					{/* Product Info */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className='space-y-4 sm:space-y-6 lg:space-y-8'>
						{/* Product Header */}
						<div>
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className='inline-flex items-center space-x-1 sm:space-x-2 bg-teal-50 px-2 sm:px-3 py-1.5 rounded-full border border-teal-200 mb-2 sm:mb-3 lg:mb-4'>
								<Zap className='w-3 h-3 sm:w-4 sm:h-4 text-teal-600' />
								<span className='text-teal-700 font-medium text-xs sm:text-sm'>
									Premium Medical Equipment
								</span>
							</motion.div>

							<motion.h1
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight'>
								{product.name}
							</motion.h1>

							{/* Rating */}
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className='flex items-center space-x-2 mb-2 sm:mb-3 lg:mb-4'>
								<div className='flex items-center space-x-1'>
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 sm:w-5 sm:h-5 ${
												i < Math.floor(product.rating)
													? "text-yellow-400 fill-current"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<span className='text-gray-600 text-xs sm:text-sm'>
									{product.rating} ({product.reviews} reviews)
								</span>
							</motion.div>

							{/* Price */}
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6 }}
								className='mb-3 sm:mb-4 lg:mb-6'>
								<div className='text-3xl sm:text-4xl md:text-5xl font-bold text-teal-600'>
									${product.price.toLocaleString()}
								</div>
								<div className='text-xs sm:text-sm text-gray-500 mt-1'>
									Financing available • Bulk pricing available
								</div>
							</motion.div>
						</div>

						{/* Description */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
							className='space-y-2 sm:space-y-3 lg:space-y-4'>
							<h3 className='text-base sm:text-lg font-semibold text-gray-900'>
								Description
							</h3>
							<p className='text-gray-600 leading-relaxed text-sm sm:text-base'>
								{product.longDescription}
							</p>
						</motion.div>

						{/* Specifications */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
							className='space-y-2 sm:space-y-3 lg:space-y-4'>
							<h3 className='text-base sm:text-lg font-semibold text-gray-900'>
								Specifications
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
								{Object.entries(product.specifications).map(([key, value]) => (
									<div key={key} className='flex items-center space-x-3'>
										<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
										<span className='text-gray-700 capitalize'>
											{key.replace(/([A-Z])/g, " $1").trim()}: {value}
										</span>
									</div>
								))}
							</div>
						</motion.div>

						{/* Action Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.9 }}
							className='space-y-3 sm:space-y-4'>
							<button
								onClick={handleAddToCart}
								disabled={!product.inStock}
								className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
									product.inStock
										? "bg-teal-600 text-white hover:bg-teal-700"
										: "bg-gray-400 text-gray-200 cursor-not-allowed"
								}`}>
								<ShoppingCart className='w-4 h-4 sm:w-5 sm:h-5' />
								<span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
							</button>
						</motion.div>

						{/* Additional Info */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.0 }}
							className='pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200 space-y-3 sm:space-y-4 lg:space-y-6'>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6'>
								<div className='text-center'>
									<div className='w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3'>
										<Truck className='w-6 h-6 text-teal-600' />
									</div>
									<h4 className='font-semibold text-gray-900 mb-1'>Shipping</h4>
									<p className='text-sm text-gray-600'>{product.shipping}</p>
								</div>

								<div className='text-center'>
									<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
										<Shield className='w-6 h-6 text-blue-600' />
									</div>
									<h4 className='font-semibold text-gray-900 mb-1'>Warranty</h4>
									<p className='text-sm text-gray-600'>{product.warranty}</p>
								</div>

								<div className='text-center'>
									<div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3'>
										<RotateCcw className='w-6 h-6 text-emerald-600' />
									</div>
									<h4 className='font-semibold text-gray-900 mb-1'>
										Certifications
									</h4>
									<p className='text-sm text-gray-600'>
										{product.certifications.join(", ")}
									</p>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</div>

				{/* Related Products Section */}
				{relatedProducts.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 1.1 }}
						className='mt-8 sm:mt-12 lg:mt-16 xl:mt-20'>
						<div className='text-center mb-6 sm:mb-8 lg:mb-12'>
							<h2 className='text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-2 sm:mb-3 lg:mb-4'>
								Related
								<span className='block font-semibold text-teal-600 mt-1'>
									Products
								</span>
							</h2>
							<p className='text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4'>
								Explore more medical equipment from our comprehensive collection
							</p>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
							{relatedProducts.map((relatedProduct) => (
								<motion.div
									key={relatedProduct.id}
									whileHover={{ y: -5 }}
									className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer'
									onClick={() => navigate(`/product/${relatedProduct.id}`)}>
									<div className='relative overflow-hidden rounded-t-xl'>
										<img
											src={relatedProduct.image}
											alt={relatedProduct.name}
											className='w-full h-32 sm:h-40 lg:h-48 object-cover transition-transform duration-300 hover:scale-105'
										/>
										<div className='absolute top-2 left-2'>
											<span className='inline-flex items-center space-x-1 bg-white/95 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-lg text-xs font-medium'>
												<Zap className='w-3 h-3 text-teal-600' />
												<span className='hidden sm:inline'>
													{relatedProduct.category}
												</span>
												<span className='sm:hidden'>
													{relatedProduct.category.split(" ")[0]}
												</span>
											</span>
										</div>
									</div>
									<div className='p-2.5 sm:p-3 lg:p-4'>
										<h3 className='font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 text-sm sm:text-base'>
											{relatedProduct.name}
										</h3>
										<div className='flex items-center justify-between'>
											<span className='text-teal-600 font-bold text-sm sm:text-base'>
												${relatedProduct.price.toLocaleString()}
											</span>
											<div className='flex items-center space-x-1'>
												<Star className='w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current' />
												<span className='text-xs sm:text-sm text-gray-600'>
													{relatedProduct.rating}
												</span>
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default ProductDetail;
