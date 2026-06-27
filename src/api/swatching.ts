import api from "./client";

// ─── Auth ───
export const signup = (body: { email: string; password: string; nickname: string }) =>
  api.post("/api/v1/auth/signup", body);

export const login = (body: { email: string; password: string }) =>
  api.post<{ accessToken: string }>("/api/v1/auth/login", body);

export const getMe = () =>
  api.get("/api/v1/users/me");

// ─── Keywords (무드) ───
export const getKeywords = () =>
  api.get<{ keywords: { id: number; name: string }[] }>("/api/v1/keywords");

// ─── Brands ───
export const getBrands = (keywords?: string) =>
  api.get("/api/v1/brands", { params: keywords ? { keywords } : undefined });

export const getBrandsDeck = (keywords: string) =>
  api.get("/api/v1/brands/deck", { params: { keywords } });

export const getBrandDetail = (brandId: string) =>
  api.get(`/api/v1/brands/${brandId}`);

export const getBrandRecommend = (brandId: string) =>
  api.get(`/api/v1/brands/${brandId}/recommend`);

// ─── Saved Brands ───
export const getSavedBrands = (params?: { categoryId?: string; keyword?: string; page?: number; size?: number }) =>
  api.get("/api/v1/saved-brands", { params });

export const saveBrand = (body: { brandId: string; categoryIds: string[] }) =>
  api.post("/api/v1/saved-brands", body);

export const deleteSavedBrand = (savedBrandId: string) =>
  api.delete(`/api/v1/saved-brands/${savedBrandId}`);

export const updateMemo = (savedBrandId: string, memo: string) =>
  api.patch(`/api/v1/saved-brands/${savedBrandId}/memo`, { memo });

// ─── Categories ───
export const getCategories = () =>
  api.get("/api/v1/categories");

export const createCategory = (name: string) =>
  api.post("/api/v1/categories", { name });

export const deleteCategory = (categoryId: string) =>
  api.delete(`/api/v1/categories/${categoryId}`);

export const addBrandToCategory = (categoryId: string, savedBrandId: string) =>
  api.post(`/api/v1/categories/${categoryId}/saved-brands`, { savedBrandId });

export const removeBrandFromCategory = (categoryId: string, savedBrandId: string) =>
  api.delete(`/api/v1/categories/${categoryId}/saved-brands/${savedBrandId}`);

// ─── Manual Brand ───
export const createManualBrand = (body: { name: string; instagramUrl?: string; websiteUrl?: string; categoryIds: string[] }) =>
  api.post("/api/v1/manual-brands", body);
