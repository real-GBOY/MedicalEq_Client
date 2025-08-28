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
	User,
	Calendar,
	Plus,
} from "lucide-react";
import { Product, Review } from "../types";
import { productApi } from "../services/productApi";

const ProductDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [product, setProduct] = useState<Product | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState(0);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [averageRating, setAverageRating] = useState(0);
	const [totalReviews, setTotalReviews] = useState(0);
	const [newReview, setNewReview] = useState({
		rating: 5,
		comment: "",
		user: "Anonymous User"
	});

	// Load product data
	useEffect(() => {
		if (!id) return;

		const loadProduct = async () => {
			setLoading(true);
			try {
				const productData = await productApi.getProductById(id);
				setProduct(productData);
				
				// Load reviews
				const reviewsData = await productApi.getProductReviews(id);
				setReviews(reviewsData.reviews);
				setAverageRating(reviewsData.averageRating);
				setTotalReviews(reviewsData.totalReviews);
				
				// Reset selected image to 0 when product changes
				setSelectedImage(0);
				
				// Get related products from the same category
				const allProducts = await productApi.getAllProducts();
				const categoryName = typeof productData.category === 'string' 
					? productData.category 
					: productData.category.name;
				const related = allProducts
					.filter(
						(p) => {
							const pCategory = typeof p.category === 'string' ? p.category : p.category.name;
							return pCategory === categoryName && p._id !== productData._id;
						}
					)
					.slice(0, 4);
				setRelatedProducts(related);
			} catch (error) {
				console.error("Error loading product:", error);
			} finally {
				setLoading(false);
			}
		};

		loadProduct();
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
		alert("Add to cart functionality coming soon!");
	};

	// Helper function to get category name
	const getCategoryName = (category: string | { _id: string; name: string; description?: string }) => {
		return typeof category === 'string' ? category : category.name;
	};

	// Helper function to get category display text
	const getCategoryDisplayText = (category: string | { _id: string; name: string; description?: string }) => {
		const categoryName = getCategoryName(category);
		return categoryName.split(" ")[0];
	};

	const handleAddReview = async () => {
		if (!newReview.comment.trim()) return;

		try {
			await productApi.addReview(id!, {
				user: newReview.user,
				rating: newReview.rating,
				comment: newReview.comment
			});

			// Reload reviews
			const reviewsData = await productApi.getProductReviews(id!);
			setReviews(reviewsData.reviews);
			setAverageRating(reviewsData.averageRating);
			setTotalReviews(reviewsData.totalReviews);

			// Reset form
			setNewReview({
				rating: 5,
				comment: "",
				user: "Anonymous User"
			});
		} catch (error) {
			console.error("Error adding review:", error);
			alert("Error adding review. Please try again.");
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
			<div className='container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12 pt-16 sm:pt-20 lg:pt-24'>
				{/* Back Button */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='mb-6 sm:mb-8'>
					<button
						onClick={() => navigate(-1)}
						className='inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'>
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
								src={product.images[selectedImage] || product.image}
								alt={product.name}
								className='w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover transition-transform duration-300 hover:scale-105'
								onError={(e) => {
									e.currentTarget.src =
										"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
								}}
							/>
							{/* Category Badge */}
							<div className='absolute top-2 sm:top-4 left-2 sm:left-4'>
								<span className='inline-flex items-center space-x-1 sm:space-x-2 bg-white/95 backdrop-blur-sm text-gray-800 px-2 sm:px-3 py-1.5 rounded-lg font-medium border border-white/20 shadow-lg text-xs sm:text-sm'>
									<Zap className='w-3 h-3 sm:w-4 sm:h-4 text-teal-600' />
									<span className='hidden sm:inline'>{getCategoryName(product.category)}</span>
									<span className='sm:hidden'>
										{getCategoryDisplayText(product.category)}
									</span>
								</span>
							</div>
						</div>

						{/* Thumbnail Images */}
						{product.images && product.images.length > 0 ? (
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
											onError={(e) => {
												e.currentTarget.src =
													"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
											}}
										/>
									</button>
								))}
							</div>
						) : (
							<div className='text-center py-4 text-gray-500 text-sm'>
								No additional images available
							</div>
						)}
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
												i < Math.floor(averageRating)
													? "text-yellow-400 fill-current"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<span className='text-gray-600 text-xs sm:text-sm'>
									{averageRating.toFixed(1)} ({totalReviews} reviews)
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

						{/* Reviews Section */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.9 }}
							className='space-y-2 sm:space-y-3 lg:space-y-4'>
							<h3 className='text-base sm:text-lg font-semibold text-gray-900'>
								Customer Reviews ({totalReviews})
							</h3>
							{reviews.length === 0 ? (
								<p className='text-gray-600 text-sm'>No reviews yet. Be the first to leave one!</p>
							) : (
								<div className='space-y-3'>
									{reviews.slice(0, 3).map((review, index) => (
										<div key={index} className='bg-gray-50 p-3 rounded-lg'>
											<div className='flex items-center space-x-2 mb-2'>
												<User className='w-4 h-4 text-gray-600' />
												<span className='font-semibold text-gray-800 text-sm'>{review.user}</span>
												<span className='text-gray-500 text-xs'>
													<Calendar className='w-3 h-3 inline-block mr-1' />
													{new Date(review.date).toLocaleDateString()}
												</span>
											</div>
											<div className='flex items-center space-x-2 mb-2'>
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`w-3 h-3 ${
															i < review.rating
																? "text-yellow-400 fill-current"
																: "text-gray-300"
														}`}
													/>
												))}
												<span className='text-gray-600 text-xs'>
													{review.rating}
												</span>
											</div>
											<p className='text-gray-700 text-sm leading-relaxed'>
												{review.comment}
											</p>
										</div>
									))}
									{reviews.length > 3 && (
										<p className='text-center text-sm text-gray-600'>
											Showing 3 of {reviews.length} reviews
										</p>
									)}
								</div>
							)}

							{/* Add Review Form */}
							<div className='pt-4 border-t border-gray-200'>
								<h4 className='text-base font-semibold text-gray-900 mb-3'>Leave a Review</h4>
								<div className='flex items-center space-x-2 mb-3'>
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-5 h-5 cursor-pointer ${
												newReview.rating > i
													? "text-yellow-400 fill-current"
													: "text-gray-300"
											}`}
											onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
										/>
									))}
								</div>
								<textarea
									rows={3}
									className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm'
									placeholder='Write your review here...'
									value={newReview.comment}
									onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
								/>
								<button
									onClick={handleAddReview}
									className='mt-3 inline-flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm'>
									<Plus className='w-4 h-4' />
									<span>Submit Review</span>
								</button>
							</div>
						</motion.div>

						{/* Action Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.0 }}
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
							transition={{ delay: 1.1 }}
							className='pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200 space-y-3 sm:space-y-4 lg:space-y-6'>
							<h3 className='text-base sm:text-lg font-semibold text-gray-900'>
								Additional Information
							</h3>

							<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
								<div className='text-center'>
									<div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3'>
										<Truck className='w-6 h-6 text-orange-600' />
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
						transition={{ duration: 0.8, delay: 1.2 }}
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
									key={relatedProduct._id}
									whileHover={{ y: -5 }}
									className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer'
									onClick={() => navigate(`/product/${relatedProduct._id}`)}>
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
													{getCategoryName(relatedProduct.category)}
												</span>
												<span className='sm:hidden'>
													{getCategoryDisplayText(relatedProduct.category)}
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
