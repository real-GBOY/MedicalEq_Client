/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Menu,
	X,
	Home,
	Package,
	Info,
	Phone,
	User,
	Star,
	Zap,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
	isLoginPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoginPage = false }) => {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const closeMenu = () => setIsMenuOpen(false);

	// Navigation items with icons
	const navItems = [
		{
			path: "/",
			label: "Home",
			icon: Home,
			isActive: location.pathname === "/",
		},
		{ path: "#products", label: "Featured", icon: Star, isActive: false },
		{
			path: "/products",
			label: "Products",
			icon: Package,
			isActive: location.pathname === "/products",
		},
		{ path: "#about", label: "About", icon: Info, isActive: false },
		{ path: "#contact", label: "Contact", icon: Phone, isActive: false },
	];

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6 }}
				className='fixed top-0 left-0 right-0 z-50'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-20'>
						{/* Logo */}
						<motion.div
							className='flex items-center space-x-2'
							whileHover={{ scale: 1.05 }}>
							<Link to='/'>
								<img
									src='/logo.jpeg'
									alt='MedEquip Pro Logo'
									className='h-10 w-10 object-cover rounded-lg'
								/>
							</Link>
						</motion.div>

						{/* Desktop Navigation - Glassy pill-shaped navbar */}
						<nav className='hidden md:flex items-center'>
							{!isLoginPage && (
								<div className='bg-white/60  rounded-full px-2 py-2 border border-white/30 shadow-xl'>
									<div className='flex items-center space-x-1'>
										{navItems.map((item) => {
											const IconComponent = item.icon;
											const isActive = item.isActive;

											return (
												<React.Fragment key={item.label}>
													{item.path.startsWith("#") ? (
														// Anchor link
														<a
															href={item.path}
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
														</a>
													) : (
														// Router link
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
															{isActive && (
																<Zap className='h-4 w-4 text-yellow-400 ml-1' />
															)}
														</Link>
													)}
												</React.Fragment>
											);
										})}
									</div>
								</div>
							)}

							{/* Login Button */}
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => navigate(isLoginPage ? "/" : "/login")}
								className='ml-6 bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-colors shadow-lg'>
								{isLoginPage ? "Back to Home" : "Login"}
							</motion.button>
						</nav>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='md:hidden p-2 text-gray-700 hover:text-teal-600 transition-colors'>
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
							className='fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden'
						/>

						{/* Sidebar */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
							className='fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl z-50 md:hidden border-l border-gray-700'>
							{/* Sidebar Header */}
							<div className='bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 shadow-lg'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-white/20 rounded-lg'>
											<img
												src='/logo.jpeg'
												alt='MedEquip Pro Logo'
												className='h-8 w-8 object-cover rounded'
											/>
										</div>
										<div>
											<h2 className='text-xl font-bold'>MedEquip Pro</h2>
											<p className='text-teal-100 text-sm'>
												Medical Equipment Solutions
											</p>
										</div>
									</div>
									<button
										onClick={closeMenu}
										className='p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200'>
										<X className='h-5 w-5' />
									</button>
								</div>
							</div>

							{/* Sidebar Navigation */}
							<nav className='flex flex-col p-6 space-y-2'>
								{!isLoginPage && (
									<>
										{navItems.map((item) => {
											const IconComponent = item.icon;
											const isActive = item.isActive;

											return (
												<React.Fragment key={item.label}>
													{item.path.startsWith("#") ? (
														// Anchor link
														<a
															href={item.path}
															onClick={closeMenu}
															className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 group ${
																isActive
																	? "bg-teal-600 text-white shadow-lg"
																	: "text-gray-300 hover:text-white hover:bg-gray-700/50"
															}`}>
															<div
																className={`p-2 rounded-lg transition-colors ${
																	isActive
																		? "bg-white/20"
																		: "bg-gray-700 group-hover:bg-gray-600"
																}`}>
																<IconComponent
																	className={`h-5 w-5 ${
																		isActive
																			? "text-white"
																			: "text-gray-400 group-hover:text-white"
																	}`}
																/>
															</div>
															<span className='font-medium'>{item.label}</span>
															{isActive && (
																<Zap className='h-5 w-5 text-yellow-400 ml-auto' />
															)}
														</a>
													) : (
														// Router link
														<Link
															to={item.path}
															onClick={closeMenu}
															className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 group ${
																isActive
																	? "bg-teal-600 text-white shadow-lg"
																	: "text-gray-300 hover:text-white hover:bg-gray-700/50"
															}`}>
															<div
																className={`p-2 rounded-lg transition-colors ${
																	isActive
																		? "bg-white/20"
																		: "bg-gray-700 group-hover:bg-gray-600"
																}`}>
																<IconComponent
																	className={`h-5 w-5 ${
																		isActive
																			? "text-white"
																			: "text-gray-400 group-hover:text-white"
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
									</>
								)}

								{/* Divider */}
								<div className='my-4 border-t border-gray-700'></div>

								{/* Login/Home Button */}
								<div className='pt-2'>
									<button
										onClick={() => {
											closeMenu();
											navigate(isLoginPage ? "/" : "/login");
										}}
										className='w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2'>
										<User className='h-5 w-5' />
										<span>{isLoginPage ? "Back to Home" : "Login"}</span>
									</button>
								</div>

								{/* Footer */}
								<div className='mt-auto pt-6 text-center'>
									<p className='text-xs text-gray-500'>
										Professional Medical Equipment
									</p>
								</div>
							</nav>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default Header;
