/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Package, Info, Phone, User, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
	isLoginPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoginPage = false }) => {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const navigate = useNavigate();

	const closeMenu = () => setIsMenuOpen(false);

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6 }}
				className='fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						<motion.div
							className='flex items-center space-x-2'
							whileHover={{ scale: 1.05 }}>
							<Link to='/'>
								<img 
									src="/logo.jpeg" 
									alt="MedEquip Pro Logo" 
									className='h-8 w-8 object-cover rounded'
								/>
							</Link>
						</motion.div>

						{/* Desktop Navigation */}
						<nav className='hidden md:flex items-center space-x-8'>
							{!isLoginPage && (
								<>
									<Link
										to='/'
										className='text-gray-700 hover:text-teal-600 transition-colors'>
										Home
									</Link>
									<a
										href='#products'
										className='text-gray-700 hover:text-teal-600 transition-colors'>
										Featured
									</a>
									<Link
										to='/products'
										className='text-gray-700 hover:text-teal-600 transition-colors'>
										All Products
									</Link>
									<a
										href='#about'
										className='text-gray-700 hover:text-teal-600 transition-colors'>
										About
									</a>
									<a
										href='#contact'
										className='text-gray-700 hover:text-teal-600 transition-colors'>
										Contact
									</a>
								</>
							)}
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => navigate(isLoginPage ? "/" : "/login")}
								className='bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors'>
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
							className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden'
						/>

						{/* Sidebar */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
							className='fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-2xl z-50 md:hidden border-l border-gray-200'>
							{/* Sidebar Header */}
							<div className='bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 shadow-lg'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-white/20 rounded-lg'>
											<img 
												src="/logo.jpeg" 
												alt="MedEquip Pro Logo" 
												className='h-8 w-8 object-cover rounded'
											/>
										</div>
										<div>
											<h2 className='text-xl font-bold'>MedEquip Pro</h2>
											<p className='text-teal-100 text-sm'>Medical Equipment Solutions</p>
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
										<Link
											to='/'
											onClick={closeMenu}
											className='flex items-center space-x-3 p-4 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 group'>
											<div className='p-2 bg-teal-100 group-hover:bg-teal-200 rounded-lg transition-colors'>
												<Home className='h-5 w-5 text-teal-600' />
											</div>
											<span className='font-medium'>Home</span>
										</Link>
										
										<a
											href='#products'
											onClick={closeMenu}
											className='flex items-center space-x-3 p-4 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 group'>
											<div className='p-2 bg-teal-100 group-hover:bg-teal-200 rounded-lg transition-colors'>
												<Star className='h-5 w-5 text-teal-600' />
											</div>
											<span className='font-medium'>Featured</span>
										</a>
										
										<Link
											to='/products'
											onClick={closeMenu}
											className='flex items-center space-x-3 p-4 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 group'>
											<div className='p-2 bg-teal-100 group-hover:bg-teal-200 rounded-lg transition-colors'>
												<Package className='h-5 w-5 text-teal-600' />
											</div>
											<span className='font-medium'>All Products</span>
										</Link>
										
										<a
											href='#about'
											onClick={closeMenu}
											className='flex items-center space-x-3 p-4 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 group'>
											<div className='p-2 bg-teal-100 group-hover:bg-teal-200 rounded-lg transition-colors'>
												<Info className='h-5 w-5 text-teal-600' />
											</div>
											<span className='font-medium'>About</span>
										</a>
										
										<a
											href='#contact'
											onClick={closeMenu}
											className='flex items-center space-x-3 p-4 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 group'>
											<div className='p-2 bg-teal-100 group-hover:bg-teal-200 rounded-lg transition-colors'>
												<Phone className='h-5 w-5 text-teal-600' />
											</div>
											<span className='font-medium'>Contact</span>
										</a>
									</>
								)}
								
								{/* Divider */}
								<div className='my-4 border-t border-gray-200'></div>
								
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
