export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price?: number;
  rating?: number;
  features?: string[];
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