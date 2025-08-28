import { apiRepo } from "../config/apiRepo";

// Base URL for products API
const PRODUCTS_BASE_URL = "/products";

// Product interface based on the API documentation
export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  category: {
    _id: string;
    name: string;
    description: string;
  } | string;
  price: number;
  rating: number;
  reviews: Array<{
    _id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockQuantity: number;
  shipping: string;
  warranty: string;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
}

// Product creation interface
export interface CreateProductData {
  name?: string;
  description?: string;
  longDescription?: string;
  image?: string;
  images?: string[];
  category?: string;
  price?: number;
  features?: string[];
  specifications?: Record<string, string>;
  inStock?: boolean;
  stockQuantity?: number;
  shipping?: string;
  warranty?: string;
  certifications?: string[];
}

// Product update interface
export type UpdateProductData = Partial<CreateProductData>;

// Review interface
export interface ReviewData {
  user: string;
  rating: number;
  comment: string;
}

// Product API service
export const productApi = {
  // Get all products
  async getAllProducts(): Promise<ApiProduct[]> {
    try {
      const response = await apiRepo.GET(PRODUCTS_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get product by ID
  async getProductById(id: string): Promise<ApiProduct> {
    try {
      const response = await apiRepo.GET(`${PRODUCTS_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Create new product
  async createProduct(productData: CreateProductData): Promise<ApiProduct> {
    try {
      const response = await apiRepo.POST(PRODUCTS_BASE_URL, productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id: string, productData: UpdateProductData): Promise<ApiProduct> {
    try {
      const response = await apiRepo.PATCH(`${PRODUCTS_BASE_URL}/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<{ message: string }> {
    try {
      const response = await apiRepo.DELETE(`${PRODUCTS_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Add review to product
  async addReview(productId: string, reviewData: ReviewData): Promise<ApiProduct> {
    try {
      const response = await apiRepo.POST(`${PRODUCTS_BASE_URL}/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  // Get product reviews
  async getProductReviews(productId: string): Promise<{
    reviews: Array<{
      _id: string;
      user: string;
      rating: number;
      comment: string;
      date: string;
    }>;
    averageRating: number;
    totalReviews: number;
  }> {
    try {
      const response = await apiRepo.GET(`${PRODUCTS_BASE_URL}/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }
};

export default productApi;
