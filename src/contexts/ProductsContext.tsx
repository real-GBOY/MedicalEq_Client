/** @format */

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { productsData } from "../data/products";
import { Product } from "../types";

interface ProductsContextType {
	products: Product[];
	addProduct: (product: Omit<Product, "id">) => void;
	updateProduct: (id: number, updates: Partial<Product>) => void;
	deleteProduct: (id: number) => void;
	getProductById: (id: number) => Product | undefined;
	resetToInitialProducts: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
	undefined
);

export const useProducts = () => {
	const context = useContext(ProductsContext);
	if (context === undefined) {
		throw new Error("useProducts must be used within a ProductsProvider");
	}
	return context;
};

interface ProductsProviderProps {
	children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({
	children,
}) => {
	const [products, setProducts] = useState<Product[]>([]);

	// Load initial products from products.ts
	useEffect(() => {
		setProducts(productsData.products);
	}, []);

	const addProduct = (productData: Omit<Product, "id">) => {
		const newProduct: Product = {
			...productData,
			id: Date.now(), // Generate unique ID
		};

		setProducts((prev) => [newProduct, ...prev]);

		// Save to localStorage for persistence - only save the new products, not the initial ones
		const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
		const updatedStoredProducts = [newProduct, ...storedProducts];
		localStorage.setItem("products", JSON.stringify(updatedStoredProducts));

		console.log("Product added to context:", newProduct);
	};

	const updateProduct = (id: number, updates: Partial<Product>) => {
		setProducts((prev) =>
			prev.map((product) =>
				product.id === id ? { ...product, ...updates } : product
			)
		);
	};

	const deleteProduct = (id: number) => {
		setProducts((prev) => prev.filter((product) => product.id !== id));
	};

	const getProductById = (id: number) => {
		return products.find((product) => product.id === id);
	};

	const resetToInitialProducts = () => {
		setProducts(productsData.products);
		localStorage.removeItem("products");
		console.log("Reset to initial products");
	};

	// Load products from localStorage on mount
	useEffect(() => {
		const storedProducts = localStorage.getItem("products");
		if (storedProducts) {
			try {
				const parsedProducts = JSON.parse(storedProducts);
				// Merge stored products with initial products, avoiding duplicates by ID
				const initialProductIds = new Set(
					productsData.products.map((p) => p.id)
				);
				const newStoredProducts = parsedProducts.filter(
					(p: Product) => !initialProductIds.has(p.id)
				);
				const mergedProducts = [...productsData.products, ...newStoredProducts];
				setProducts(mergedProducts);
			} catch (error) {
				console.error("Error parsing stored products:", error);
				setProducts(productsData.products);
			}
		}
	}, []);

	const value: ProductsContextType = {
		products,
		addProduct,
		updateProduct,
		deleteProduct,
		getProductById,
		resetToInitialProducts,
	};

	return (
		<ProductsContext.Provider value={value}>
			{children}
		</ProductsContext.Provider>
	);
};
