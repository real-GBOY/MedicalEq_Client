/** @format */

export interface ContactForm {
	name: string;
	email: string;
	phone: string;
	message: string;
}

export interface LoginForm {
	email: string;
	password: string;
}

export interface StatCounter {
	label: string;
	value: number;
	suffix: string;
}

export interface User {
	id: string;
	email: string;
	name: string;
	role: "admin" | "user";
}

export interface Review {
	_id: string;
	user: string;
	rating: number;
	comment: string;
	date: string;
}

export interface Product {
	_id: string;
	name: string;
	description: string;
	longDescription: string;
	image: string;
	images: string[];
	category: string | { _id: string; name: string; description?: string };
	price: number;
	rating: number;
	reviews: Review[];
	features: string[];
	specifications: Record<string, string>;
	inStock: boolean;
	stockQuantity: number;
	shipping: string;
	warranty: string;
	certifications: string[];
}

export interface ProductFormData {
	name: string;
	description: string;
	longDescription: string;
	price: number;
	category: string;
	images: string[];
	rating: number;
	reviews: number;
	features: string[];
	specifications: string;
	inStock: boolean;
	stockQuantity: number;
	shipping: string;
	warranty: string;
	certifications: string[];
}

// Category interfaces
export interface Category {
	_id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCategoryData {
	name: string;
	description?: string;
}

export interface UpdateCategoryData {
	name?: string;
	description?: string;
}
