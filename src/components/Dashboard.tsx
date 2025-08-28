/** @format */

import React, { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AddProductForm from "./AddProductForm";
import ManageProducts from "./ManageProducts";

const Dashboard: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const sidebarItems = [
		{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ id: "add-product", label: "Add Product", icon: Plus },
		{ id: "products", label: "Manage Products", icon: Package },
		{ id: "users", label: "Users", icon: Users },
		{ id: "settings", label: "Settings", icon: Settings },
	]; 

	const renderContent = () => {
		switch (activeTab) {
			case "add-product":
				return <AddProductForm />;
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

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
							{[
								{ label: "Total Products", value: "156", color: "bg-blue-500" },
								{ label: "Active Orders", value: "23", color: "bg-green-500" },
								{ label: "Revenue", value: "$45.2K", color: "bg-purple-500" },
								{ label: "Customers", value: "89", color: "bg-orange-500" },
							].map((stat, index) => (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className='bg-white rounded-xl shadow-sm p-6'>
									<div
										className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
										<Package className='h-6 w-6 text-white' />
									</div>
									<h3 className='text-2xl font-bold text-gray-900 mb-1'>
										{stat.value}
									</h3>
									<p className='text-gray-600 text-sm'>{stat.label}</p>
								</motion.div>
							))}
						</div>
					</div>
				);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<motion.div
				initial={{ x: -280 }}
				animate={{ x: sidebarOpen ? 0 : -280 }}
				className={`fixed inset-y-0 left-0 z-50 w-70 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
					sidebarOpen ? "translate-x-0" : "lg:translate-x-0 -translate-x-full"
				}`}>
				<div className='flex flex-col h-full'>
					{/* Header */}
					<div className='flex items-center justify-between p-6 border-b border-gray-200'>
						<h1 className='text-xl font-bold text-teal-600'>MedicalEq Pro</h1>
						<button
							onClick={() => setSidebarOpen(false)}
							className='lg:hidden p-2 rounded-lg hover:bg-gray-100'>
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
									className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
										activeTab === item.id
											? "bg-teal-50 text-teal-700 border border-teal-200"
											: "text-gray-700 hover:bg-gray-50"
									}`}>
									<Icon className='h-5 w-5' />
									<span className='font-medium'>{item.label}</span>
								</button>
							);
						})}
					</nav>

					{/* Logout */}
					<div className='p-6 border-t border-gray-200'>
						<button
							onClick={handleLogout}
							className='w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors'>
							<LogOut className='h-5 w-5' />
							<span className='font-medium'>Logout</span>
						</button>
					</div>
				</div>
			</motion.div>

			{/* Main Content */}
			<div
				className={`transition-all duration-300 ${
					sidebarOpen ? "lg:ml-70" : "lg:ml-0"
				}`}>
				{/* Top Bar */}
				<div className='bg-white shadow-sm border-b border-gray-200 px-6 py-4'>
					<div className='flex items-center justify-between'>
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className='p-2 rounded-lg hover:bg-gray-100'>
							<Menu className='h-6 w-6' />
						</button>

						<div className='flex items-center space-x-4'>
							<h1 className='text-xl font-semibold text-gray-900 capitalize'>
								{activeTab === "add-product" ? "Add Product" : activeTab}
							</h1>
						</div>
					</div>
				</div>

				{/* Page Content */}
				<div className='p-6'>{renderContent()}</div>
			</div>
		</div>
	);
};

export default Dashboard;
