/** @format */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Save,
	X,
	Plus,
} from "lucide-react";
import { Product, ProductFormData } from "../types";
import { useProducts } from "../contexts/ProductsContext";
import { useCategories } from "../hooks/useCategories";

interface EditProductFormProps {
	product: Product;
	onClose: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
	product,
	onClose,
}) => {
	const { updateProduct } = useProducts();
	const { data: apiCategories = [] } = useCategories();
	const modalRef = useRef<HTMLDivElement>(null);
	
	const [form, setForm] = useState<ProductFormData>({
		name: product.name,
		description: product.description,
		longDescription: product.longDescription,
		price: product.price,
		category: typeof product.category === 'string' ? product.category : product.category._id,
		images: product.images,
		rating: product.rating,
		reviews: product.reviews,
		features: product.features,
		specifications:
			typeof product.specifications === "string"
				? product.specifications
				: Object.values(product.specifications).join(", "),
		inStock: product.inStock,
		stockQuantity: product.stockQuantity,
		shipping: product.shipping,
		warranty: product.warranty,
		certifications: product.certifications,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<
		Partial<Record<keyof ProductFormData, string>>
	>({});

	const categoriesList = apiCategories.map(cat => ({ id: cat._id, name: cat.name }));

	// Handle click outside modal
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		// Handle escape key
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleEscapeKey);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [onClose]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));

		// Clear error when user starts typing
		if (errors[name as keyof ProductFormData]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

		if (!form.name.trim()) {
			newErrors.name = "Product name is required";
		}

		if (!form.description.trim()) {
			newErrors.description = "Description is required";
		}

		if (!form.longDescription.trim()) {
			newErrors.longDescription = "Long description is required";
		}

		if (form.price <= 0) {
			newErrors.price = "Price must be greater than 0";
		}

		if (!form.category) {
			newErrors.category = "Category is required";
		}

		if (form.stockQuantity < 0) {
			newErrors.stockQuantity = "Stock quantity cannot be negative";
		}

		if (form.images.length === 0) {
			newErrors.images = "At least one product image is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			// Convert specifications string to object
			const specificationsObj: Record<string, string> = {};
			if (form.specifications) {
				form.specifications.split(",").forEach((spec) => {
					const [key, value] = spec.split(":").map((s) => s.trim());
					if (key && value) {
						specificationsObj[key] = value;
					}
				});
			}

			const updatedProduct = {
				...form,
				specifications: specificationsObj,
			};

			// Update product via context
			updateProduct(product._id, updatedProduct);
			console.log("Product updated successfully");
			onClose();
		} catch (error) {
			console.error("Error updating product:", error);
			alert("Error updating product. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const removeImage = (index: number) => {
		setForm((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const addImage = (imageUrl: string) => {
		if (imageUrl.trim()) {
			setForm((prev) => ({
				...prev,
				images: [...prev.images, imageUrl.trim()],
			}));
		}
	};

	const [featuresInput, setFeaturesInput] = useState("");
	const [certificationsInput, setCertificationsInput] = useState("");

	const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFeaturesInput(e.target.value);
	};

	const handleAddFeature = () => {
		if (featuresInput.trim()) {
			setForm((prev) => ({
				...prev,
				features: [...prev.features, featuresInput.trim()],
			}));
			setFeaturesInput("");
		}
	};

	const handleRemoveFeature = (index: number) => {
		setForm((prev) => ({
			...prev,
			features: prev.features.filter((_, i) => i !== index),
		}));
	};

	const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCertificationsInput(e.target.value);
	};

	const handleAddCertification = () => {
		if (certificationsInput.trim()) {
			setForm((prev) => ({
				...prev,
				certifications: [...prev.certifications, certificationsInput.trim()],
			}));
			setCertificationsInput("");
		}
	};

	const handleRemoveCertification = (index: number) => {
		setForm((prev) => ({
			...prev,
			certifications: prev.certifications.filter((_, i) => i !== index),
		}));
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
			>
				<motion.div
					ref={modalRef}
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					transition={{ duration: 0.2 }}
					className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
				>
					{/* Header with close button */}
					<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
									<Plus className="h-6 w-6 text-white" />
								</div>
								<div>
									<h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
									<p className="text-gray-600">
										Update product information
									</p>
								</div>
							</div>
							<button
								onClick={onClose}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								aria-label="Close modal"
							>
								<X className="h-6 w-6 text-gray-500" />
							</button>
						</div>
					</div>

					{/* Form Content */}
					<div className="p-6">
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Basic Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Product Name *
									</label>
									<input
										type="text"
										name="name"
										value={form.name}
										onChange={handleChange}
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
											errors.name ? "border-red-500" : "border-gray-300"
										}`}
										placeholder="Enter product name"
									/>
									{errors.name && (
										<p className="text-red-500 text-sm mt-1">{errors.name}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Category *
									</label>
									<select
										name="category"
										value={form.category}
										onChange={handleChange}
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
											errors.category ? "border-red-500" : "border-gray-300"
										}`}
									>
										<option value="">Select a category</option>
										{categoriesList.map((category) => (
											<option key={category.id} value={category.id}>
												{category.name}
											</option>
										))}
									</select>
									{errors.category && (
										<p className="text-red-500 text-sm mt-1">{errors.category}</p>
									)}
								</div>
							</div>

							{/* Description */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Short Description *
								</label>
								<textarea
									name="description"
									value={form.description}
									onChange={handleChange}
									rows={3}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
										errors.description ? "border-red-500" : "border-gray-300"
									}`}
									placeholder="Brief product description"
								/>
								{errors.description && (
									<p className="text-red-500 text-sm mt-1">{errors.description}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Long Description *
								</label>
								<textarea
									name="longDescription"
									value={form.longDescription}
									onChange={handleChange}
									rows={5}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
										errors.longDescription ? "border-red-500" : "border-gray-300"
									}`}
									placeholder="Detailed product description"
								/>
								{errors.longDescription && (
									<p className="text-red-500 text-sm mt-1">{errors.longDescription}</p>
								)}
							</div>

							{/* Price and Stock */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Price *
									</label>
									<div className="relative">
										<span className="absolute left-3 top-2 text-gray-500">$</span>
										<input
											type="number"
											name="price"
											value={form.price || ""}
											onChange={handleChange}
											step="0.01"
											min="0"
											className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
												errors.price ? "border-red-500" : "border-gray-300"
											}`}
											placeholder="0.00"
										/>
									</div>
									{errors.price && (
										<p className="text-red-500 text-sm mt-1">{errors.price}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Stock Quantity
									</label>
									<input
										type="number"
										name="stockQuantity"
										value={form.stockQuantity || ""}
										onChange={handleChange}
										min="0"
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
											errors.stockQuantity ? "border-red-500" : "border-gray-300"
										}`}
										placeholder="0"
									/>
									{errors.stockQuantity && (
										<p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>
									)}
								</div>

								<div className="flex items-center space-x-3">
									<input
										type="checkbox"
										name="inStock"
										checked={form.inStock}
										onChange={handleChange}
										className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
									/>
									<label className="text-sm font-medium text-gray-700">
										In Stock
									</label>
								</div>
							</div>

							{/* Features */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Features
								</label>
								<div className="flex space-x-2 mb-2">
									<input
										type="text"
										value={featuresInput}
										onChange={handleFeaturesChange}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										placeholder="Add a feature"
									/>
									<button
										type="button"
										onClick={handleAddFeature}
										className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
									>
										Add
									</button>
								</div>
								{form.features.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{form.features.map((feature, index) => (
											<span
												key={index}
												className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
											>
												{feature}
												<button
													type="button"
													onClick={() => handleRemoveFeature(index)}
													className="ml-2 text-teal-600 hover:text-teal-800"
												>
													<X className="h-4 w-4" />
												</button>
											</span>
										))}
									</div>
								)}
							</div>

							{/* Certifications */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Certifications
								</label>
								<div className="flex space-x-2 mb-2">
									<input
										type="text"
										value={certificationsInput}
										onChange={handleCertificationsChange}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										placeholder="Add a certification"
									/>
									<button
										type="button"
										onClick={handleAddCertification}
										className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
									>
										Add
									</button>
								</div>
								{form.certifications.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{form.certifications.map((cert, index) => (
											<span
												key={index}
												className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
											>
												{cert}
												<button
													type="button"
													onClick={() => handleRemoveCertification(index)}
													className="ml-2 text-blue-600 hover:text-blue-800"
												>
													<X className="h-4 w-4" />
												</button>
											</span>
										))}
									</div>
								)}
							</div>

							{/* Additional Details */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Shipping Information
									</label>
									<input
										type="text"
										name="shipping"
										value={form.shipping}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										placeholder="e.g., Free shipping, $10 flat rate"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Warranty
									</label>
									<input
										type="text"
										name="warranty"
										value={form.warranty}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										placeholder="e.g., 1 year warranty"
									/>
								</div>
							</div>

							{/* Specifications */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Specifications
								</label>
								<textarea
									name="specifications"
									value={form.specifications}
									onChange={handleChange}
									rows={4}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									placeholder="Enter specifications in format: Key: Value, Key: Value"
								/>
								<p className="text-sm text-gray-500 mt-1">
									Format: Key: Value, Key: Value (e.g., Weight: 2kg, Dimensions: 10x5x3cm)
								</p>
							</div>

							{/* Product Images */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Product Images *
								</label>
								<div className="space-y-3">
									{/* Add Image Input */}
									<div className="flex gap-2">
										<div className="flex-1 relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
											</div>
											<input
												type="url"
												placeholder="https://example.com/image.jpg"
												className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
												onKeyPress={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														const target = e.target as HTMLInputElement;
														addImage(target.value);
														target.value = "";
													}
												}}
											/>
										</div>
										<button
											type="button"
											onClick={() => {
												const input = document.querySelector(
													'input[type="url"]'
												) as HTMLInputElement;
												if (input && input.value.trim()) {
													addImage(input.value);
													input.value = "";
												}
											}}
											className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
										>
											<Plus className="h-4 w-4" />
											Add
										</button>
									</div>

									{/* Image List */}
									{form.images.length > 0 && (
										<div className="space-y-2">
											<p className="text-sm text-gray-600">
												Current Images ({form.images.length}):
											</p>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
												{form.images.map((imageUrl, index) => (
													<div key={index} className="relative group">
														<img
															src={imageUrl}
															alt={`Product image ${index + 1}`}
															className="w-full h-24 object-cover rounded-lg border border-gray-200"
															onError={(e) => {
																e.currentTarget.src =
																	"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
															}}
														/>
														<button
															type="button"
															onClick={() => removeImage(index)}
															className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
														>
															<X className="h-3 w-3" />
														</button>
													</div>
												))}
											</div>
										</div>
									)}

									<p className="text-sm text-gray-500">
										Add one or more image URLs. Press Enter or click Add to include each image.
									</p>
									{errors.images && (
										<p className="text-red-500 text-sm mt-1">{errors.images}</p>
									)}
								</div>
							</div>

							{/* Submit Button */}
							<div className="flex justify-end space-x-4">
								<button
									type="button"
									onClick={onClose}
									className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className="inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<Save className="h-5 w-5" />
									<span>{isSubmitting ? "Updating..." : "Update Product"}</span>
								</button>
							</div>
						</form>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default EditProductForm;
