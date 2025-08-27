/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Package,
	DollarSign,
	Tag,
	Image,
	Box,
	FileText,
	Save,
	X,
	Trash2,
} from "lucide-react";
import { Product, ProductFormData } from "../types";
import { useProducts } from "../contexts/ProductsContext";

interface EditProductFormProps {
	product: Product;
	onClose: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
	product,
	onClose,
}) => {
	const { updateProduct } = useProducts();
	const [form, setForm] = useState<ProductFormData>({
		name: product.name,
		description: product.description,
		longDescription: product.longDescription,
		price: product.price,
		category: product.category,
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

	const categories = [
		"Imaging Equipment",
		"Diagnostic Tools",
		"Monitoring Systems",
		"Surgical Equipment",
	];

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

		if (!validateForm()) return;

		setIsSubmitting(true);

		try {
			// Create updated product object
			const updatedProductData = {
				name: form.name,
				description: form.description,
				longDescription: form.longDescription,
				image: form.images[0] || "",
				images: form.images,
				category: form.category,
				price: form.price,
				rating: form.rating,
				reviews: form.reviews,
				features: form.features,
				specifications: form.specifications
					? { technical: form.specifications }
					: { technical: "" },
				inStock: form.inStock,
				stockQuantity: form.stockQuantity,
				shipping: form.shipping || "Contact for shipping",
				warranty: form.warranty || "Standard warranty",
				certifications: form.certifications,
			};

			// Update product
			updateProduct(product.id, updatedProductData);

			// Success message
			alert(`Product "${form.name}" updated successfully!`);

			// Close form
			onClose();
		} catch (error) {
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

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<motion.div
				initial={{ scale: 0.9, y: 20 }}
				animate={{ scale: 1, y: 0 }}
				className='bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<div className='flex items-center space-x-3'>
						<div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center'>
							<Save className='h-6 w-6 text-white' />
						</div>
						<div>
							<h2 className='text-2xl font-bold text-gray-900'>Edit Product</h2>
							<p className='text-gray-600'>Update product information</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
						<X className='h-6 w-6 text-gray-500' />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className='p-6 space-y-6'>
					{/* Basic Information */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Product Name *
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Package className='h-5 w-5 text-gray-400' />
								</div>
								<input
									type='text'
									name='name'
									value={form.name}
									onChange={handleChange}
									className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
										errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
									}`}
									placeholder='e.g., Digital Stethoscope Pro'
								/>
							</div>
							{errors.name && (
								<p className='mt-1 text-sm text-red-600'>{errors.name}</p>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Category *
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Tag className='h-5 w-5 text-gray-400' />
								</div>
								<select
									name='category'
									value={form.category}
									onChange={handleChange}
									className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
										errors.category
											? "border-red-300 bg-red-50"
											: "border-gray-300"
									}`}>
									<option value=''>Select a category</option>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>
							{errors.category && (
								<p className='mt-1 text-sm text-red-600'>{errors.category}</p>
							)}
						</div>
					</div>

					{/* Description */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Description *
						</label>
						<textarea
							name='description'
							value={form.description}
							onChange={handleChange}
							rows={3}
							className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
								errors.description
									? "border-red-300 bg-red-50"
									: "border-gray-300"
							}`}
							placeholder='Brief description of the product...'
						/>
						{errors.description && (
							<p className='mt-1 text-sm text-red-600'>{errors.description}</p>
						)}
					</div>

					{/* Long Description */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Long Description *
						</label>
						<textarea
							name='longDescription'
							value={form.longDescription}
							onChange={handleChange}
							rows={4}
							className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
								errors.longDescription
									? "border-red-300 bg-red-50"
									: "border-gray-300"
							}`}
							placeholder='Detailed description with features, benefits, and use cases...'
						/>
						{errors.longDescription && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.longDescription}
							</p>
						)}
					</div>

					{/* Price and Stock */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Price (USD) *
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<DollarSign className='h-5 w-5 text-gray-400' />
								</div>
								<input
									type='number'
									name='price'
									value={form.price}
									onChange={handleChange}
									min='0'
									step='0.01'
									className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
										errors.price
											? "border-red-300 bg-red-50"
											: "border-gray-300"
									}`}
									placeholder='0.00'
								/>
							</div>
							{errors.price && (
								<p className='mt-1 text-sm text-red-600'>{errors.price}</p>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Stock Quantity
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Box className='h-5 w-5 text-gray-400' />
								</div>
								<input
									type='number'
									name='stockQuantity'
									value={form.stockQuantity}
									onChange={handleChange}
									min='0'
									className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
										errors.stockQuantity
											? "border-red-300 bg-red-50"
											: "border-gray-300"
									}`}
									placeholder='0'
								/>
							</div>
							{errors.stockQuantity && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.stockQuantity}
								</p>
							)}
						</div>
					</div>

					{/* Multiple Images */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Product Images *
						</label>
						<div className='space-y-3'>
							{/* Add Image Input */}
							<div className='flex gap-2'>
								<div className='flex-1 relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<Image className='h-5 w-5 text-gray-400' />
									</div>
									<input
										type='url'
										placeholder='https://example.com/image.jpg'
										className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
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
									type='button'
									onClick={() => {
										const input = document.querySelector(
											'input[type="url"]'
										) as HTMLInputElement;
										if (input && input.value.trim()) {
											addImage(input.value);
											input.value = "";
										}
									}}
									className='px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'>
									<Save className='h-4 w-4' />
									Add
								</button>
							</div>

							{/* Image List */}
							{form.images.length > 0 && (
								<div className='space-y-2'>
									<p className='text-sm text-gray-600'>
										Current Images ({form.images.length}):
									</p>
									<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
										{form.images.map((imageUrl, index) => (
											<div key={index} className='relative group'>
												<img
													src={imageUrl}
													alt={`Product image ${index + 1}`}
													className='w-full h-24 object-cover rounded-lg border border-gray-200'
													onError={(e) => {
														e.currentTarget.src =
															"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
													}}
												/>
												<button
													type='button'
													onClick={() => removeImage(index)}
													className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'>
													<Trash2 className='h-3 w-3' />
												</button>
											</div>
										))}
									</div>
								</div>
							)}

							<p className='text-sm text-gray-500'>
								Add one or more image URLs. Press Enter or click Add to include
								each image.
							</p>
							{errors.images && (
								<p className='mt-1 text-sm text-red-600'>{errors.images}</p>
							)}
						</div>
					</div>

					{/* Features */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Key Features
						</label>
						<textarea
							name='features'
							value={form.features.join(", ")}
							onChange={(e) => {
								const features = e.target.value
									.split(",")
									.map((f) => f.trim())
									.filter((f) => f);
								setForm((prev) => ({ ...prev, features }));
							}}
							rows={3}
							className='block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
							placeholder='Enter key features separated by commas (e.g., AI Diagnostics, Wireless, Touch Screen)'
						/>
						<p className='mt-1 text-sm text-gray-500'>
							Separate features with commas
						</p>
					</div>

					{/* Shipping & Warranty */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Shipping Information
							</label>
							<input
								type='text'
								name='shipping'
								value={form.shipping}
								onChange={handleChange}
								className='block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
								placeholder='e.g., Free on orders over $50K'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Warranty
							</label>
							<input
								type='text'
								name='warranty'
								value={form.warranty}
								onChange={handleChange}
								className='block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
								placeholder='e.g., 3 years comprehensive'
							/>
						</div>
					</div>

					{/* Specifications */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Technical Specifications
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<FileText className='h-5 w-5 text-gray-400' />
							</div>
							<textarea
								name='specifications'
								value={form.specifications}
								onChange={handleChange}
								rows={4}
								className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
								placeholder='Enter technical specifications, dimensions, power requirements, etc...'
							/>
						</div>
						<p className='mt-1 text-sm text-gray-500'>
							Optional: Add detailed technical specifications
						</p>
					</div>

					{/* Submit Buttons */}
					<div className='flex justify-end space-x-4 pt-6 border-t border-gray-200'>
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'>
							Cancel
						</button>
						<motion.button
							type='submit'
							disabled={isSubmitting}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2'>
							{isSubmitting ? (
								<>
									<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
									<span>Updating...</span>
								</>
							) : (
								<>
									<Save className='h-5 w-5' />
									<span>Update Product</span>
								</>
							)}
						</motion.button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default EditProductForm;
