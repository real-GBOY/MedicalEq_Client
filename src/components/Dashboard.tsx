/** @format */

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
	LayoutDashboard,
	Plus,
	Package,
	Users,
	Settings,
	LogOut,
	Menu,
	X,
	Tag,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../contexts/CategoriesContext";
import AddProductForm from "./AddProductForm";
import ManageProducts from "./ManageProducts";
import ManageCategories from "./ManageCategories";

const Dashboard: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Use the products hook to get real-time data
	const { data: apiProducts = [], isLoading: productsLoading } = useProducts();
	
	// Use the categories context to get real-time data
	const { categories, loading: categoriesLoading } = useCategories();
	
	// Transform API products to local format for display
	const products = apiProducts.map(product => ({
		id: product._id,
		name: product.name,
		price: product.price,
		image: product.image,
		inStock: product.inStock,
		rating: product.rating,
		category: product.category, // This is the category ID
	}));

	// Helper function to get category name by ID or object
	const getCategoryName = (categoryValue: string | { _id: string; name: string; description: string }): string => {
		if (typeof categoryValue === 'string') {
			const category = categories.find(cat => cat._id === categoryValue);
			return category ? category.name : categoryValue;
		}
		return categoryValue.name;
	};

	// Helper function to get product count for a category
	const getProductCountForCategory = (category: { _id: string; name: string }): number => {
		return products.filter(product => product.category === category._id).length;
	};

	// Sync active tab with query string (?tab=...)
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const tab = params.get("tab");
		if (tab && tab !== activeTab) {
			setActiveTab(tab);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.search]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		if (activeTab) {
			params.set("tab", activeTab);
			navigate({ pathname: "/dashboard", search: params.toString() }, { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const sidebarItems = [
		{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ id: "add-product", label: "Add Product", icon: Plus },
		{ id: "products", label: "Manage Products", icon: Package },
		{ id: "categories", label: "Manage Categories", icon: Tag },
	];

	const titleByTab = useMemo<Record<string, string>>(
		() => ({
			dashboard: "Dashboard",
			"add-product": "Add Product",
			products: "Manage Products",
			categories: "Manage Categories",

		}),
		[]
	);

	// Calculate real-time statistics
	const dashboardStats = useMemo(() => {
		const totalProducts = products.length;
		const inStockProducts = products.filter(p => p.inStock).length;
		const totalValue = products.reduce((sum, p) => sum + p.price, 0);
		const avgRating = products.length > 0 
			? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
			: "0.0";
		const totalCategories = categories.length;
		const categoriesWithProducts = categories.filter(category => 
			products.some(product => product.category === category._id)
		).length;

		return [
			{ 
				label: "Total Products", 
				value: totalProducts.toString(), 
				color: "bg-blue-500",
				icon: Package,
				loading: productsLoading
			},
			{ 
				label: "In Stock", 
				value: inStockProducts.toString(), 
				color: "bg-green-500",
				icon: Package,
				loading: productsLoading
			},
			{ 
				label: "Total Categories", 
				value: totalCategories.toString(), 
				color: "bg-teal-500",
				icon: Tag,
				loading: categoriesLoading
			},
			{ 
				label: "Active Categories", 
				value: categoriesWithProducts.toString(), 
				color: "bg-purple-500",
				icon: Tag,
				loading: categoriesLoading
			},
			{ 
				label: "Total Value", 
				value: `$${(totalValue / 1000).toFixed(1)}K`, 
				color: "bg-orange-500",
				icon: Package,
				loading: productsLoading
			},
			{ 
				label: "Avg Rating", 
				value: avgRating, 
				color: "bg-indigo-500",
				icon: Package,
				loading: productsLoading
			},
		];
	}, [products, productsLoading, categories, categoriesLoading]);

	const renderContent = () => {
		switch (activeTab) {
			case "add-product":
				return <AddProductForm />;
			case "products":
				return <ManageProducts />;
			case "categories":
				return <ManageCategories />;
			case "dashboard":
			default:
				return (
					<div className='space-y-6'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='bg-white rounded-xl shadow-sm p-6'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4'>
								Welcome back, {user?.name}!
							</h2>
							<p className='text-gray-600'>
								Here's an overview of your medical equipment business.
							</p>
						</motion.div>

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{dashboardStats.map((stat, index) => (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-gray-600 mb-1'>
												{stat.label}
											</p>
											{stat.loading ? (
												<div className='h-8 w-16 bg-gray-200 rounded animate-pulse'></div>
											) : (
												<p className='text-2xl font-bold text-gray-900'>
													{stat.value}
												</p>
											)}
										</div>
										<div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
											<stat.icon className='h-6 w-6 text-white' />
										</div>
									</div>
								</motion.div>
							))}
						</div>

						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{/* Recent Products */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className='bg-white rounded-xl shadow-sm p-6'>
								<h3 className='text-lg font-semibold text-gray-900 mb-4'>
									Recent Products
								</h3>
								{productsLoading ? (
									<div className='space-y-3'>
										{[...Array(3)].map((_, i) => (
											<div key={i} className='flex items-center space-x-3'>
												<div className='w-10 h-10 bg-gray-200 rounded animate-pulse'></div>
												<div className='flex-1'>
													<div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2'></div>
													<div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse'></div>
												</div>
											</div>
										))}
									</div>
								) : products.length > 0 ? (
									<div className='space-y-3'>
										{products.slice(0, 3).map((product) => (
											<div key={product.id} className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
												<img
													src={product.image}
													alt={product.name}
													className='w-10 h-10 rounded-lg object-cover'
												/>
												<div className='flex-1'>
													<p className='font-medium text-gray-900'>{product.name}</p>
													<p className='text-sm text-gray-500'>${product.price.toLocaleString()}</p>
													<p className='text-xs text-gray-400'>{getCategoryName(product.category)}</p>
												</div>
												<div className={`px-2 py-1 rounded-full text-xs font-medium ${
													product.inStock 
														? 'bg-green-100 text-green-800' 
														: 'bg-red-100 text-red-800'
												}`}>
													{product.inStock ? 'In Stock' : 'Out of Stock'}
												</div>
											</div>
										))}
									</div>
								) : (
									<p className='text-gray-500 text-center py-8'>
										No products yet. Add your first product to get started!
									</p>
								)}
							</motion.div>

							{/* Recent Categories */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className='bg-white rounded-xl shadow-sm p-6'>
								<h3 className='text-lg font-semibold text-gray-900 mb-4'>
									Recent Categories
								</h3>
								{categoriesLoading ? (
									<div className='space-y-3'>
										{[...Array(3)].map((_, i) => (
											<div key={i} className='flex items-center space-x-3'>
												<div className='w-10 h-10 bg-gray-200 rounded animate-pulse'></div>
												<div className='flex-1'>
													<div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2'></div>
													<div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse'></div>
												</div>
											</div>
										))}
									</div>
								) : categories.length > 0 ? (
									<div className='space-y-3'>
										{categories.slice(0, 3).map((category) => {
											const productCount = getProductCountForCategory(category);
											
											return (
												<div key={category._id} className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
													<div className='w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center'>
														<Tag className='h-5 w-5 text-teal-600' />
													</div>
													<div className='flex-1'>
														<p className='font-medium text-gray-900'>{category.name}</p>
														<p className='text-sm text-gray-500'>{productCount} products</p>
													</div>
													<div className='px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800'>
														{productCount > 0 ? 'Active' : 'Empty'}
													</div>
												</div>
											);
										})}
									</div>
								) : (
									<p className='text-gray-500 text-center py-8'>
										No categories yet. Create your first category to organize products!
									</p>
								)}
							</motion.div>
						</div>

						{/* Quick Actions */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className='bg-white rounded-xl shadow-sm p-6'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								Quick Actions
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<button
									onClick={() => setActiveTab("add-product")}
									className='p-4 border-2 border-dashed border-teal-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all duration-200 text-center group'>
									<Plus className='h-8 w-8 text-teal-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
									<p className='font-medium text-teal-700'>Add Product</p>
									<p className='text-sm text-teal-600'>Create a new product listing</p>
								</button>
								
								<button
									onClick={() => setActiveTab("categories")}
									className='p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center group'>
									<Tag className='h-8 w-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
									<p className='font-medium text-blue-700'>Manage Categories</p>
									<p className='text-sm text-blue-600'>Organize your product categories</p>
								</button>
								
								<button
									onClick={() => setActiveTab("products")}
									className='p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-center group'>
									<Package className='h-8 w-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
									<p className='font-medium text-purple-700'>Manage Products</p>
									<p className='text-sm text-purple-600'>Edit and organize your inventory</p>
								</button>
							</div>
						</motion.div>
					</div>
				);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 flex'>
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
				sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
			}`}>
				<div className='flex flex-col h-full'>
					{/* Header */}
					<div className='flex items-center justify-between p-6 border-b border-gray-200'>
						<h1 className='text-xl font-bold text-teal-600'>MedicalEq Pro</h1>
						<button
							onClick={() => setSidebarOpen(false)}
							className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'>
							<X className='h-5 w-5' />
						</button>
					</div>

					{/* User Info */}
					<div className='p-6 border-b border-gray-200'>
						<div className='flex items-center space-x-3'>
							<div className='w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center'>
								<span className='text-white font-semibold text-sm'>
									{user?.name?.charAt(0).toUpperCase()}
								</span>
							</div>
							<div>
								<p className='font-medium text-gray-900'>{user?.name}</p>
								<p className='text-sm text-gray-500'>{user?.email}</p>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<nav className='flex-1 p-6 space-y-2'>
						{sidebarItems.map((item) => {
							const Icon = item.icon;
							return (
								<button
									key={item.id}
									onClick={() => {
										setActiveTab(item.id);
										setSidebarOpen(false);
									}}
									className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
										activeTab === item.id
											? "bg-teal-50 text-teal-700 border border-teal-200 shadow-sm"
											: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
									}`}>
									<Icon className={`h-5 w-5 ${activeTab === item.id ? 'text-teal-600' : 'text-gray-500'}`} />
									<span className='font-medium'>{item.label}</span>
								</button>
							);
						})}
					</nav>

					{/* Logout */}
					<div className='p-6 border-t border-gray-200'>
						<button
							onClick={handleLogout}
							className='w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200 hover:shadow-sm'>
							<LogOut className='h-5 w-5' />
							<span className='font-medium'>Logout</span>
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='flex-1 flex flex-col min-w-0'>
				{/* Top Bar */}
				<header className='bg-white shadow-sm border-b border-gray-200 px-6 py-4'>
					<div className='flex items-center justify-between'>
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'>
							<Menu className='h-6 w-6' />
						</button>

						<div className='flex items-center space-x-4'>
							<h1 className='text-xl font-semibold text-gray-900'>
								{titleByTab[activeTab] || "Dashboard"}
							</h1>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className='flex-1 p-6 overflow-auto'>
					{renderContent()}
				</main>
			</div>
		</div>
	);
};

export default Dashboard;
