import { apiGet, apiPatch, apiPost } from "./client";
import type { Category, ProductDetail, ProductListResponse } from "../types";

export const fetchCategories = () => apiGet<Category[]>("/categories");

export interface ProductQuery {
  category?: string;
  tab?: "hot" | "new" | "free";
  search?: string;
  page?: number;
  pageSize?: number;
}

export function fetchProducts(query: ProductQuery) {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.tab) params.set("tab", query.tab);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  return apiGet<ProductListResponse>(`/products?${params.toString()}`);
}

export const fetchProduct = (id: number) => apiGet<ProductDetail>(`/products/${id}`);

export interface CreateProductPayload {
  title: string;
  description?: string;
  categoryId: number;
  condition: "New" | "Used";
  price: number;
  iconKind?: string;
  imageUrl?: string;
}

export const createProduct = (payload: CreateProductPayload) =>
  apiPost<ProductDetail>("/products", payload);

export const updateProductStatus = (id: number, status: "Active" | "Reserved" | "Sold") =>
  apiPatch<{ id: number; status: string }>(`/products/${id}/status`, { status });
