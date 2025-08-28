/** @format */

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, User, AtSign, Package, ChevronDown, Layers } from "lucide-react";
import { ContactForm } from "../types";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG, initEmailJS } from "../config/emailjs";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../contexts/ProductsContext";

const Contact: React.FC = () => {
	const { products } = useProducts();
	const [searchParams] = useSearchParams();
	const productIdFromQuery = searchParams.get("productId");
	const preselectedProductId = productIdFromQuery || undefined;

	const [form, setForm] = useState<ContactForm>({
		name: "",
		email: "",
		phone: "",
		message: "",
	});

	const categories = useMemo(
		() => ["All", ...Array.from(new Set(products.map((p) => 
		typeof p.category === 'string' ? p.category : p.category?.name
	)))],
		[products]
	);
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [selectedProductId, setSelectedProductId] = useState<string | undefined>(
		preselectedProductId
	);
	const [quantity, setQuantity] = useState<number>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Initialize EmailJS
	useEffect(() => {
		// Only initialize on client side
		if (typeof window !== "undefined") {
			initEmailJS();
		}
	}, []);

	useEffect(() => {
		if (preselectedProductId && products.length > 0) {
			const product = products.find((p) => p._id === preselectedProductId);
			if (product) {
				setSelectedProductId(product._id);
				setSelectedCategory(typeof product.category === 'string' ? product.category : product.category?.name || "");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preselectedProductId, products.length]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const selectedProduct =
				selectedProductId !== undefined
					? products.find((p) => p._id === selectedProductId)
					: undefined;
			const orderDetails = selectedProduct
				? `\n\nOrder Details:\n- Product: ${selectedProduct.name}\n- Category: ${typeof selectedProduct.category === 'string' ? selectedProduct.category : selectedProduct.category?.name || ""}\n- Quantity: ${quantity}`
				: selectedCategory !== "All"
				? `\n\nOrder Details:\n- Category: ${selectedCategory}\n- Product: (not selected)\n- Quantity: ${quantity}`
				: "";
			// EmailJS service configuration
			const templateParams = {
				from_name: form.name,
				from_email: form.email,
				from_phone: form.phone,
				message: `${form.message}${orderDetails}`,
				to_name: "MedEquip Pro Team",
			};

			// Send email using EmailJS
			await emailjs.send(
				EMAILJS_CONFIG.SERVICE_ID,
				EMAILJS_CONFIG.TEMPLATE_ID,
				templateParams
			);

			setIsSubmitted(true);
			setForm({ name: "", email: "", phone: "", message: "" });
			setSelectedCategory("All");
			setSelectedProductId(undefined);
			setQuantity(1);

			// Reset success message after 5 seconds
			setTimeout(() => {
				setIsSubmitted(false);
			}, 5000);
		} catch (err) {
			console.error("EmailJS Error:", err);
			setError(
				"Failed to send message. Please try again or contact us directly."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const contactInfo = [
		{
			icon: Mail,
			title: "Email Us",
			value: "info@medequippro.com",
			description: "Send us your questions anytime",
		},
		{
			icon: Phone,
			title: "Call Us",
			value: "+1 (555) 123-4567",
			description: "24/7 support hotline",
		},
		{
			icon: MapPin,
			title: "Visit Us",
			value: "123 Healthcare Blvd, Medical District",
			description: "New York, NY 10001",
		},
	];

	return (
		<section id='contact' className='py-20 bg-gray-50 relative pt-24'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='text-center mb-16'>
					<h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
						Get In Touch
					</h2>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
						Ready to upgrade your medical facility? Contact our experts for
						personalized equipment recommendations and competitive pricing.
					</p>
				</motion.div>

				<div className='grid lg:grid-cols-3 gap-8 mb-16'>
					{contactInfo.map((info, index) => (
						<motion.div
							key={info.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							whileHover={{ y: -5 }}
							className='bg-white p-8 rounded-2xl shadow-lg text-center'>
							<motion.div
								whileHover={{ scale: 1.1, rotate: 5 }}
								className='inline-flex items-center justify-center w-16 h-16 bg-teal-600 text-white rounded-full mb-6'>
								<info.icon className='h-8 w-8' />
							</motion.div>
							<h3 className='text-xl font-semibold text-gray-900 mb-2'>
								{info.title}
							</h3>
							<p className='text-lg text-teal-600 font-medium mb-1'>
								{info.value}
							</p>
							<p className='text-gray-600'>{info.description}</p>
						</motion.div>
					))}
				</div>

				<div className='grid lg:grid-cols-2 gap-12'>
					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='bg-white p-8 rounded-2xl shadow-lg'>
						<h3 className='text-2xl font-semibold text-gray-900 mb-6'>
							Send Us a Message
						</h3>

						{isSubmitted ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								className='text-center py-8'>
								<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<Send className='h-8 w-8 text-green-600' />
								</div>
								<h4 className='text-xl font-semibold text-gray-900 mb-2'>
									Message Sent Successfully!
								</h4>
								<p className='text-gray-600'>
									Thank you for contacting us. We'll get back to you within 24
									hours.
								</p>
							</motion.div>
						) : (
							<form onSubmit={handleSubmit} className='space-y-6'>
								<div className='grid sm:grid-cols-2 gap-6'>
									<motion.div whileFocus={{ scale: 1.02 }}>
										<label className='block text-sm font-semibold text-gray-800 mb-2'>
											Full Name *
										</label>
										<div className='relative'>
											<User className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
											<input
												type='text'
												name='name'
												value={form.name}
												onChange={handleChange}
												required
												className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white/60 backdrop-blur-sm'
												placeholder='John Doe'
											/>
										</div>
									</motion.div>

									<motion.div whileFocus={{ scale: 1.02 }}>
										<label className='block text-sm font-semibold text-gray-800 mb-2'>
											Email Address *
										</label>
										<div className='relative'>
											<AtSign className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
											<input
												type='email'
												name='email'
												value={form.email}
												onChange={handleChange}
												required
												className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white/60 backdrop-blur-sm'
												placeholder='john@example.com'
											/>
										</div>
									</motion.div>
								</div>

								<motion.div whileFocus={{ scale: 1.02 }}>
									<label className='block text-sm font-semibold text-gray-800 mb-2'>
										Phone Number
									</label>
									<div className='relative'>
										<Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
										<input
											type='tel'
											name='phone'
											value={form.phone}
											onChange={handleChange}
											className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white/60 backdrop-blur-sm'
											placeholder='+1 (555) 123-4567'
										/>
									</div>
								</motion.div>

					{/* Order Selection */}
					<div className='grid sm:grid-cols-2 gap-6'>
						<motion.div whileFocus={{ scale: 1.02 }}>
							<label className='block text-sm font-semibold text-gray-800 mb-2'>
								Category
							</label>
							<div className='relative'>
								<Layers className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
								<select
									value={selectedCategory}
									onChange={(e) => {
										setSelectedCategory(e.target.value);
										setSelectedProductId(undefined);
									}}
									className='appearance-none w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white/60 backdrop-blur-sm hover:border-gray-300'
								>
									{categories.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
								<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
							</div>
						</motion.div>

						<motion.div whileFocus={{ scale: 1.02 }}>
							<label className='block text-sm font-semibold text-gray-800 mb-2'>
								Product
							</label>
							<div className='relative'>
								<Package className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
								<select
									value={selectedProductId ?? ""}
									onChange={(e) =>
										setSelectedProductId(
											e.target.value || undefined
										)
									}
									className='appearance-none w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white/60 backdrop-blur-sm hover:border-gray-300'
								>
									<option value=''>Select a product (optional)</option>
									{products
										.filter((p) =>
											selectedCategory === "All" ? true : 
											(typeof p.category === 'string' ? p.category === selectedCategory : p.category?.name === selectedCategory)
										)
										.map((p) => (
																			<option key={p._id} value={p._id}>
									{p.name}
								</option>
										))}
								</select>
								<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
							</div>
						</motion.div>
					</div>

								<div className='grid sm:grid-cols-2 gap-6'>
									<motion.div whileFocus={{ scale: 1.02 }}>
										<label className='block text-sm font-semibold text-gray-800 mb-2'>
											Quantity
										</label>
										<div className='flex items-center gap-2'>
											<button type='button' onClick={() => setQuantity(Math.max(1, quantity - 1))} className='px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50'>-</button>
											<input
												type='number'
												min={1}
												value={quantity}
												onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
												className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-center'
											/>
											<button type='button' onClick={() => setQuantity(quantity + 1)} className='px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50'>+</button>
										</div>
									</motion.div>
								</div>

								<motion.div whileFocus={{ scale: 1.02 }}>
									<label className='block text-sm font-semibold text-gray-800 mb-2'>
										Message *
									</label>
									<textarea
										name='message'
										value={form.message}
										onChange={handleChange}
										required
										rows={5}
										className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none bg-white/60 backdrop-blur-sm'
										placeholder='Tell us about your medical equipment needs...'
									/>
									<p className='text-xs text-gray-500 mt-1'>Include delivery location, timeline, and any specs.</p>
								</motion.div>

								<motion.button
									type='submit'
									disabled={isSubmitting}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className='w-full bg-white text-teal-600 py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 hover:text-white disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors relative overflow-hidden group border-2 border-teal-600'>
									{/* Sliding background effect */}
									<div className='absolute inset-0 bg-teal-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out'></div>

									{/* Button content with relative positioning */}
									<div className='relative z-10 flex items-center justify-center space-x-2'>
										{isSubmitting ? (
											<>
												<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
												<span>Sending...</span>
											</>
										) : (
											<>
												<Send className='h-5 w-5' />
												<span>Send Message</span>
											</>
										)}
									</div>
								</motion.button>

								{error && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className='text-red-500 text-center mt-4 p-3 bg-red-50 rounded-lg border border-red-200'>
										{error}
									</motion.div>
								)}
							</form>
						)}
					</motion.div>

					{/* Map/Image */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='bg-white p-8 rounded-2xl shadow-lg'>
						<h3 className='text-2xl font-semibold text-gray-900 mb-6'>
							Order Summary
						</h3>
						<div className='space-y-4 mb-8'>
							<div className='flex items-center gap-3 text-gray-700'>
								<Package className='h-5 w-5 text-teal-600' />
								<span className='font-medium'>
									{selectedProductId ? products.find((p) => p._id === selectedProductId)?.name : "No product selected"}
								</span>
							</div>
							<div className='flex items-center gap-3 text-gray-700'>
								<MapPin className='h-5 w-5 text-teal-600' />
								<span className='font-medium'>Category: {selectedCategory}</span>
							</div>
							<div className='flex items-center gap-3 text-gray-700'>
								<span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-sm'>#</span>
								<span className='font-medium'>Quantity: {quantity}</span>
							</div>
						</div>

						<h3 className='text-2xl font-semibold text-gray-900 mb-6'>
							Our Location
						</h3>
						<div className='relative h-64 bg-gray-100 rounded-lg overflow-hidden'>
							<img
								src='https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg?auto=compress&cs=tinysrgb&w=800'
								alt='Medical facility'
								className='w-full h-full object-cover'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end'>
								<div className='p-4 text-white'>
									<p className='font-semibold'>MedEquip Pro Headquarters</p>
									<p className='text-sm opacity-90'>
										Medical District, New York
									</p>
								</div>
							</div>
						</div>

						<div className='mt-6 space-y-4'>
							<div className='flex items-center space-x-3'>
								<Clock className='h-5 w-5 text-teal-600' />
								<div>
									<p className='font-medium text-gray-900'>Business Hours</p>
									<p className='text-sm text-gray-600'>
										Monday - Friday: 8:00 AM - 6:00 PM
									</p>
								</div>
							</div>
							<div className='flex items-center space-x-3'>
								<Phone className='h-5 w-5 text-teal-600' />
								<div>
									<p className='font-medium text-gray-900'>Emergency Support</p>
									<p className='text-sm text-gray-600'>
										Available 24/7 for urgent issues
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
