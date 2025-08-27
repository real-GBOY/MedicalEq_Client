/** @format */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Award, Clock, Users, Zap, Heart } from "lucide-react";

const WhyChooseUs: React.FC = () => {
	const [counters, setCounters] = useState([0, 0, 0, 0]);

	const stats = [
		{ label: "Years Experience", value: 15, suffix: "+", icon: Shield },
		{ label: "Certified Products", value: 500, suffix: "+", icon: Award },
		{ label: "Countries Served", value: 25, suffix: "+", icon: Clock },
		{ label: "Happy Clients", value: 10000, suffix: "+", icon: Users },
	];

	const features = [
		{
			icon: Zap,
			title: "Cutting-Edge Technology",
			description:
				"Latest innovations in medical equipment with AI-powered diagnostics and smart connectivity.",
		},
		{
			icon: Shield,
			title: "FDA Certified",
			description:
				"All our products meet the highest safety and quality standards with full regulatory compliance.",
		},
		{
			icon: Heart,
			title: "24/7 Support",
			description:
				"Round-the-clock technical support and maintenance services to keep your equipment running smoothly.",
		},
	];

	const animateCounters = () => {
		stats.forEach((stat, index) => {
			let current = 0;
			const increment = stat.value / 50;
			const timer = setInterval(() => {
				current += increment;
				if (current >= stat.value) {
					current = stat.value;
					clearInterval(timer);
				}
				setCounters((prev) => {
					const newCounters = [...prev];
					newCounters[index] = Math.floor(current);
					return newCounters;
				});
			}, 40);
		});
	};

	useEffect(() => {
		animateCounters();
	}, []);

	return (
		<section id='about' className='py-20 bg-white relative pt-24'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='text-center mb-16'>
					<h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
						Why Choose MedEquip Pro?
					</h2>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
						We're committed to delivering exceptional medical equipment
						solutions that enhance healthcare delivery and improve patient
						outcomes worldwide.
					</p>
				</motion.div>

				{/* Stats Counter */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
					{stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							whileHover={{ y: -5, scale: 1.02 }}
							className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100'>
							<div className='text-center'>
								<motion.div
									whileHover={{ rotate: 360 }}
									transition={{ duration: 0.6 }}
									className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-xl mb-4 shadow-lg'>
									<stat.icon className='h-8 w-8' />
								</motion.div>
								<div className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
									{counters[index]}
									{stat.suffix}
								</div>
								<div className='text-gray-600 font-medium text-sm'>
									{stat.label}
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Features Grid */}
				<div className='grid lg:grid-cols-3 gap-8'>
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.2 }}
							whileHover={{ y: -8, scale: 1.02 }}
							className='bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group'>
							<div className='text-center'>
								<motion.div
									whileHover={{ rotate: 360 }}
									transition={{ duration: 0.6 }}
									className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300'>
									<feature.icon className='h-10 w-10' />
								</motion.div>
								<h3 className='text-xl font-semibold text-gray-900 mb-4'>
									{feature.title}
								</h3>
								<p className='text-gray-600 leading-relaxed'>
									{feature.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className='text-center mt-20'>
					<div className='bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-12 text-white shadow-xl'>
						<h3 className='text-2xl lg:text-3xl font-bold mb-4'>
							Ready to Transform Your Healthcare Facility?
						</h3>
						<p className='text-lg mb-8 opacity-90 max-w-2xl mx-auto'>
							Get in touch with our experts to find the perfect medical
							equipment solutions for your needs.
						</p>
						<motion.button
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
							className='bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl'
							onClick={() =>
								document
									.getElementById("contact")
									?.scrollIntoView({ behavior: "smooth" })
							}>
							Get Free Consultation
						</motion.button>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default WhyChooseUs;
