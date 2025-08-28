/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Package, Info, Phone, Zap, Heart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCategories } from "../contexts/CategoriesContext";

interface HeaderProps {
	isLoginPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoginPage = false }) => {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const [showProductsMenu, setShowProductsMenu] = React.useState(false);
	const [isScrolled, setIsScrolled] = React.useState(false);
	const { categories } = useCategories();
	const categoriesList = categories.map((cat) => cat.name);
	const location = useLocation();
	const navigate = useNavigate();

	// Add scroll effect for mobile header
	React.useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const closeMenu = () => setIsMenuOpen(false);

	// Navigation items with icons
	const navItems = [
		{
			path: "/",
			label: "Home",
			icon: Home,
			isActive: location.pathname === "/",
		},
		{
			path: "/products",
			label: "Products",
			icon: Package,
			isActive: location.pathname === "/products",
		},
		{
			path: "/about",
			label: "About",
			icon: Info,
			isActive: location.pathname === "/about",
		},
		{
			path: "/favorites",
			label: "Favorites",
			icon: Heart,
			isActive: location.pathname === "/favorites",
		},
		{
			path: "/contact",
			label: "Contact",
			icon: Phone,
			isActive: location.pathname === "/contact",
		},
	];

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6 }}
				className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
					isScrolled
						? "bg-white/95 shadow-lg md:bg-white/95"
						: "bg-white/95 md:bg-transparent"
				} shadow-sm`}>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-center h-16 md:h-20 md:mt-10 w-full relative px-16 md:px-0'>
						{/* Desktop Navigation - Glassy pill-shaped navbar with integrated logo */}
						<nav className='hidden md:flex items-center'>
							{!isLoginPage && (
								<div className='bg-white/60 rounded-full px-2 py-2 border border-white/30 shadow-xl'>
									<div className='flex items-center space-x-1'>
										{/* Logo integrated into navbar */}
										<motion.div
											className='flex items-center px-3 py-1'
											whileHover={{ scale: 1.05 }}>
											<Link to='/'>
												<img
													src='https://i.postimg.cc/x1bkFGQh/logo.png'
													alt='MedEquip Pro Logo'
													className='h-7 w-7 object-cover rounded mr-3'
												/>
											</Link>
										</motion.div>

										{navItems.map((item) => {
											const IconComponent = item.icon;
											const isActive = item.isActive;

											const isProducts = item.path === "/products";
											return (
												<React.Fragment key={item.label}>
													{item.path.startsWith("#") ? (
														// Anchor link with smooth scrolling
														<button
															onClick={() => {
																const element = document.querySelector(
																	item.path
																);
																if (element) {
																	element.scrollIntoView({
																		behavior: "smooth",
																	});
																}
															}}
															className={`relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
																isActive
																	? "bg-teal-600 text-white shadow-lg"
																	: "text-gray-700 hover:text-teal-600 hover:bg-white/40 backdrop-blur-sm"
															}`}>
															<IconComponent className='h-4 w-4' />
															<span className='text-sm font-medium'>
																{item.label}
															</span>
															{isActive && (
																<Zap className='h-4 w-4 text-yellow-400 ml-1' />
															)}
														</button>
													) : (
														// Router link with optional dropdown for Products
														<div
															className='relative'
															onMouseEnter={() =>
																isProducts && setShowProductsMenu(true)
															}
															onMouseLeave={() =>
																isProducts && setShowProductsMenu(false)
															}>
															<Link
																to={item.path}
																className={`relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
																	isActive
																		? "bg-teal-600 text-white shadow-lg"
																		: "text-gray-700 hover:text-teal-600 hover:bg-white/40 backdrop-blur-sm"
																}`}>
																<IconComponent className='h-4 w-4' />
																<span className='text-sm font-medium'>
																	{item.label}
																</span>
																{isProducts && (
																	<svg
																		className={`h-4 w-4 transition-transform ${
																			showProductsMenu
																				? "rotate-180"
																				: "rotate-0"
																		}`}
																		viewBox='0 0 20 20'
																		fill='currentColor'
																		aria-hidden='true'>
																		<path
																			fillRule='evenodd'
																			d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z'
																			clipRule='evenodd'
																		/>
																	</svg>
																)}
																{isActive && (
																	<Zap className='h-4 w-4 text-yellow-400 ml-1' />
																)}
															</Link>
															{isProducts && showProductsMenu && (
																<div
																	className='absolute left-0 mt-2 w-56 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-2xl p-2'
																	onMouseEnter={() => setShowProductsMenu(true)}
																	onMouseLeave={() =>
																		setShowProductsMenu(false)
																	}>
																	<div className='px-3 py-2 text-xs font-semibold text-teal-700 uppercase tracking-wide'>
																		Categories
																	</div>
																	<ul className='max-h-72 overflow-auto'>
																		{categoriesList.length > 0 ? (
																			categoriesList.map((cat) => (
																				<li key={cat}>
																					<button
																						onClick={(e) => {
																							e.preventDefault();
																							navigate(
																								`/products?category=${encodeURIComponent(
																									cat
																								)}`
																							);
																							setShowProductsMenu(false);
																						}}
																						className='w-full text-left px-3 py-2 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700'>
																						{cat}
																					</button>
																				</li>
																			))
																		) : (
																			<li className='px-3 py-2 text-gray-500 text-sm'>
																				No categories available
																			</li>
																		)}
																	</ul>
																</div>
															)}
														</div>
													)}
												</React.Fragment>
											);
										})}
									</div>
								</div>
							)}
						</nav>

						{/* Mobile left logo */}
						<Link
							to='/'
							className='md:hidden absolute left-4 flex items-center group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-xl'>
							<motion.div
								className='flex items-center space-x-2 p-2 rounded-xl bg-white/60 hover:bg-white/80 focus:bg-white/80 transition-all duration-200 backdrop-blur-sm border border-white/30'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2, duration: 0.5 }}>
								<motion.img
									src='/logo.png'
									alt='MedEquip Pro Logo'
									className='h-8 w-8 object-cover rounded-lg shadow-sm'
									whileHover={{ rotate: 5 }}
									transition={{ duration: 0.2 }}
								/>
								<span className='text-sm font-bold text-gray-800 hidden sm:block'>
									MedEquip Pro
								</span>
							</motion.div>
						</Link>

						{/* Mobile Menu Button - Positioned absolutely on the right */}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='md:hidden absolute right-4 p-2 text-gray-700 hover:text-teal-600 transition-colors'>
							{isMenuOpen ? (
								<X className='h-6 w-6' />
							) : (
								<Menu className='h-6 w-6' />
							)}
						</button>
					</div>
				</div>
			</motion.header>

			{/* Mobile Sidebar Overlay */}
			<AnimatePresence>
				{isMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={closeMenu}
							className='fixed inset-0 bg-black/40 backdrop-blur-md z-40 md:hidden'
						/>

						{/* Sidebar */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
							className='fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl z-50 md:hidden border-l border-white/30'>
							{/* Sidebar Header */}
							<div className='bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 shadow-lg rounded-br-3xl'>
								<div className='flex items-center justify-between'>
									<Link
										to='/'
										onClick={closeMenu}
										className='flex items-center space-x-3 group'>
										<motion.div
											className='p-2 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-200'
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}>
											<img
												src='/logo.png'
												alt='MedEquip Pro Logo'
												className='h-10 w-10 object-cover rounded-lg'
											/>
										</motion.div>
										<div>
											<h2 className='text-xl font-bold group-hover:text-teal-100 transition-colors'>
												MedEquip Pro
											</h2>
											<p className='text-teal-100 text-sm font-medium'>
												Medical Equipment Solutions
											</p>
										</div>
									</Link>
									<button
										onClick={closeMenu}
										className='p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105'>
										<X className='h-5 w-5' />
									</button>
								</div>
							</div>

							{/* Sidebar Navigation */}
							<nav className='flex flex-col p-6 space-y-3'>
								{!isLoginPage && (
									<>
										{navItems.map((item) => {
											const IconComponent = item.icon;
											const isActive = item.isActive;

											return (
												<React.Fragment key={item.label}>
													{item.path.startsWith("#") ? (
														// Anchor link with smooth scrolling
														<button
															onClick={() => {
																closeMenu();
																const element = document.querySelector(
																	item.path
																);
																if (element) {
																	element.scrollIntoView({
																		behavior: "smooth",
																	});
																}
															}}
															className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 group ${
																isActive
																	? "bg-teal-600 text-white shadow-lg"
																	: "text-teal-700 hover:text-teal-800 hover:bg-teal-50/80 backdrop-blur-sm"
															}`}>
															<div
																className={`p-2 rounded-lg transition-colors ${
																	isActive
																		? "bg-white/20"
																		: "bg-teal-100 group-hover:bg-teal-200"
																}`}>
																<IconComponent
																	className={`h-5 w-5 ${
																		isActive
																			? "text-white"
																			: "text-teal-600 group-hover:text-teal-700"
																	}`}
																/>
															</div>
															<span className='font-medium'>{item.label}</span>
															{isActive && (
																<Zap className='h-5 w-5 text-yellow-400 ml-auto' />
															)}
														</button>
													) : (
														// Router link
														<Link
															to={item.path}
															onClick={closeMenu}
															className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 group ${
																isActive
																	? "bg-teal-600 text-white shadow-lg"
																	: "text-teal-700 hover:text-teal-800 hover:bg-teal-50/80 backdrop-blur-sm"
															}`}>
															<div
																className={`p-2 rounded-lg transition-colors ${
																	isActive
																		? "bg-white/20"
																		: "bg-teal-100 group-hover:bg-teal-200"
																}`}>
																<IconComponent
																	className={`h-5 w-5 ${
																		isActive
																			? "text-white"
																			: "text-teal-600 group-hover:text-teal-700"
																	}`}
																/>
															</div>
															<span className='font-medium'>{item.label}</span>
															{isActive && (
																<Zap className='h-5 w-5 text-yellow-400 ml-auto' />
															)}
														</Link>
													)}
												</React.Fragment>
											);
										})}
										{/* Footer */}
										<div className='mt-auto pt-6 text-center'>
											<div className='bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 border border-teal-100'>
												<p className='text-xs text-teal-700 font-medium'>
													Professional Medical Equipment
												</p>
											</div>
										</div>
									</>
								)}
							</nav>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default Header;
