import api from "./client";

// ─── 공통 응답 래퍼 ───
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Auth ───
export const signup = (body: { email: string; password: string; nickname: string }) =>
  api.post("/api/v1/auth/signup", body);

export const login = (body: { email: string; password: string }) =>
  api.post<ApiResponse<{ accessToken: string }>>("/api/v1/auth/login", body);

export const getMe = () =>
  api.get("/api/v1/users/me");

// ─── Keywords (무드) ───
export interface KeywordDto {
  keywordId: number;
  name: string;
}

export const getKeywords = () =>
  api.get<ApiResponse<KeywordDto[]>>("/api/v1/keywords");

// ─── Brands ───
export interface BrandResponseDto {
  brandId: number;
  name: string;
  summary: string;
  mainImageUrl: string;
  keywords: string[];
}

export interface BrandCardDto {
  brandId: number;
  name: string;
  summary: string;
  storySummary: string;
  mainImageUrl: string;
  instagramUrl: string | null;
  websiteUrl: string | null;
  keywords: string[];
  visualPreviews: string[];
}

export interface BrandDeckResponseDto {
  totalCount: number;
  brandCards: BrandCardDto[];
}

export const getBrands = (keywords?: string) =>
  api.get<ApiResponse<BrandResponseDto[]>>("/api/v1/brands", { params: keywords ? { keywords } : undefined });

export const getBrandsDeck = (keywords: string) =>
  api.get<ApiResponse<BrandDeckResponseDto>>("/api/v1/brands/deck", { params: { keywords } });

export const getBrandDetail = (brandId: string) =>
  api.get(`/api/v1/brands/${brandId}`);

export const getBrandRecommend = (brandId: string) =>
  api.get(`/api/v1/brands/${brandId}/recommend`);

// ─── Brand Save (브랜드 저장하기) ───
export const saveBrand = (brandId: string, categoryIds: string[]) =>
  api.post(`/api/v1/brands/${brandId}/save`, { categoryIds });

export const deleteSavedBrand = (savedBrandId: string) =>
  api.delete(`/api/v1/saved-brands/${savedBrandId}`);

export const updateMemo = (savedBrandId: string, memo: string) =>
  api.patch(`/api/v1/saved-brands/${savedBrandId}/memo`, { memo });

// ─── My Swatch Categories ───
export const getCategories = () =>
  api.get("/api/v1/my-swatch/categories");

export const createCategory = (name: string) =>
  api.post("/api/v1/my-swatch/categories", { name });

export const deleteCategory = (categoryId: string) =>
  api.delete(`/api/v1/my-swatch/categories/${categoryId}`);

// ─── My Swatch Category Brands ───
export const getCategoryBrands = (categoryId: string) =>
  api.get(`/api/v1/my-swatch/categories/${categoryId}/brands`);

export const addBrandToCategory = (categoryId: string, savedBrandId: string) =>
  api.post(`/api/v1/my-swatch/categories/${categoryId}/brands`, { savedBrandId });

export const removeBrandFromCategory = (categoryId: string, savedBrandId: string) =>
  api.delete(`/api/v1/my-swatch/categories/${categoryId}/brands/${savedBrandId}`);

// ─── Manual Brand ───
export const createManualBrand = (body: { name: string; instagramUrl?: string; websiteUrl?: string; categoryIds: string[]; image?: File }) => {
  const formData = new FormData();
  formData.append("name", body.name);
  if (body.instagramUrl) formData.append("instagramUrl", body.instagramUrl);
  if (body.websiteUrl) formData.append("websiteUrl", body.websiteUrl);
  body.categoryIds.forEach((id) => formData.append("categoryIds", id));
  if (body.image) formData.append("image", body.image);
  return api.post("/api/v1/manual-brands", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
