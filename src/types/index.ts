/** @format */

export interface Product {
	id: number;
	name: string;
	description: string;
	longDescription: string;
	image: string;
	images: string[];
	category: string;
	price: number;
	rating: number;
	reviews: number;
	features: string[];
	specifications: Record<string, string>;
	inStock: boolean;
	stockQuantity: number;
	shipping: string;
	warranty: string;
	certifications: string[];
}

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

export interface ProductsData {
	products: Product[];
	categories: string[];
}
