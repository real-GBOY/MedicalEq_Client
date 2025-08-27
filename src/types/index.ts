/** @format */

export interface Product {
<<<<<<< HEAD
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
=======
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price?: number;
  rating?: number;
  features?: string[];
>>>>>>> 6ad121e75c49e9dc220e380cf7563d682cc0642f
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
