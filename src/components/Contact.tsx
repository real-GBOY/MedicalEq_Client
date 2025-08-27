/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { ContactForm } from "../types";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG, initEmailJS } from "../config/emailjs";

const Contact: React.FC = () => {
	const [form, setForm] = useState<ContactForm>({
		name: "",
		email: "",
		phone: "",
		message: "",
	});
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			// EmailJS service configuration
			const templateParams = {
				from_name: form.name,
				from_email: form.email,
				from_phone: form.phone,
				message: form.message,
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
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											Full Name *
										</label>
										<input
											type='text'
											name='name'
											value={form.name}
											onChange={handleChange}
											required
											className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
											placeholder='John Doe'
										/>
									</motion.div>

									<motion.div whileFocus={{ scale: 1.02 }}>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											Email Address *
										</label>
										<input
											type='email'
											name='email'
											value={form.email}
											onChange={handleChange}
											required
											className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
											placeholder='john@example.com'
										/>
									</motion.div>
								</div>

								<motion.div whileFocus={{ scale: 1.02 }}>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Phone Number
									</label>
									<input
										type='tel'
										name='phone'
										value={form.phone}
										onChange={handleChange}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
										placeholder='+1 (555) 123-4567'
									/>
								</motion.div>

								<motion.div whileFocus={{ scale: 1.02 }}>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Message *
									</label>
									<textarea
										name='message'
										value={form.message}
										onChange={handleChange}
										required
										rows={5}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none'
										placeholder='Tell us about your medical equipment needs...'
									/>
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
