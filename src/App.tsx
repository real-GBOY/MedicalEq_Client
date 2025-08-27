/** @format */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import ProductsPage from "./components/ProductsPage";
import ProductDetail from "./components/ProductDetail";
import WhyChooseUs from "./components/WhyChooseUs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SectionDivider from "./components/SectionDivider";
import SectionBridge from "./components/SectionBridge";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductsProvider } from "./contexts/ProductsContext";

function App() {
	const pageVariants = {
		initial: { opacity: 0, x: 100 },
		in: { opacity: 1, x: 0 },
		out: { opacity: 0, x: -100 },
	};

	const pageTransition = {
		type: "tween" as const,
		ease: "anticipate" as const,
		duration: 0.5,
	};

	return (
		<AuthProvider>
			<ProductsProvider>
				<Router>
					<Routes>
						{/* Login Route */}
						<Route
							path='/login'
							element={
								<AnimatePresence mode='wait'>
									<motion.div
										key='login'
										initial='initial'
										animate='in'
										exit='out'
										variants={pageVariants}
										transition={pageTransition}>
										<Login />
									</motion.div>
								</AnimatePresence>
							}
						/>

						{/* Dashboard Route - Protected */}
						<Route
							path='/dashboard'
							element={
								<ProtectedRoute>
									<AnimatePresence mode='wait'>
										<motion.div
											key='dashboard'
											initial='initial'
											animate='in'
											exit='out'
											variants={pageVariants}
											transition={pageTransition}>
											<Dashboard />
										</motion.div>
									</AnimatePresence>
								</ProtectedRoute>
							}
						/>

						{/* Products Page Route */}
						<Route
							path='/products'
							element={
								<AnimatePresence mode='wait'>
									<motion.div
										key='products'
										initial='initial'
										animate='in'
										exit='out'
										variants={pageVariants}
										transition={pageTransition}>
										<Header />
										<ProductsPage />
										<Footer />
									</motion.div>
								</AnimatePresence>
							}
						/>

						{/* Product Detail Route */}
						<Route
							path='/product/:id'
							element={
								<AnimatePresence mode='wait'>
									<motion.div
										key='product-detail'
										initial='initial'
										animate='in'
										exit='out'
										variants={pageVariants}
										transition={pageTransition}>
										<Header />
										<ProductDetail />
										<Footer />
									</motion.div>
								</AnimatePresence>
							}
						/>

						{/* Home Route */}
						<Route
							path='/'
							element={
								<AnimatePresence mode='wait'>
									<motion.div
										key='home'
										initial='initial'
										animate='in'
										exit='out'
										variants={pageVariants}
										transition={pageTransition}
										className='min-h-screen bg-white'>
										<Header />
										<Hero />
										{/* Simple Section Divider */}
										<svg
											viewBox='0 0 1440 60'
											xmlns='http://www.w3.org/2000/svg'
											className='w-full'
											style={{ height: "80px" }}></svg>

										<Products />
										{/* Section Divider after Products */}
										<SectionDivider
											variant='curve-down'
											color='#134e4a'
											height={60}
										/>
										{/* Enhanced Diagonal Divider - Products to WhyChooseUs */}
										<WhyChooseUs />
										{/* Complementary Diagonal Divider - WhyChooseUs to Contact */}
										<SectionDivider
											variant='wave'
											color='url(#gradientWave)'
											height={120}
										/>

										<svg width='0' height='0'>
											<defs>
												<linearGradient
													id='gradientWave'
													x1='0%'
													y1='0%'
													x2='100%'
													y2='0%'>
													<stop offset='0%' stopColor='#134e4a' />
													<stop offset='100%' stopColor='#0f766e' />
												</linearGradient>
											</defs>
										</svg>

										<Contact />
										{/* Simple Bridge */}
										<SectionBridge variant='gradient'>
											<div className='text-center py-6'>
												<div className='flex items-center justify-center space-x-3 mb-3'>
													<div className='w-2 h-2 bg-teal-500 rounded-full' />
													<div className='w-2 h-2 bg-blue-500 rounded-full' />
													<div className='w-2 h-2 bg-purple-500 rounded-full' />
												</div>
												<p className='text-sm text-gray-500'>
													Connecting healthcare professionals worldwide
												</p>
											</div>
										</SectionBridge>
										<Footer />
									</motion.div>
								</AnimatePresence>
							}
						/>
					</Routes>
				</Router>
			</ProductsProvider>
		</AuthProvider>
	);
}

export default App;
