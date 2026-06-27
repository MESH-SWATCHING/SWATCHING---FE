import api from "./client";

// ─── 공통 응답 래퍼 ───
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Auth / User ───
export interface MeResponse {
  userId: number;
  nickname: string;
  email: string;
  role: string;
}

export const signup = (body: { email: string; password: string; nickname: string }) =>
  api.post("/api/v1/auth/signup", body);

export const login = (body: { email: string; password: string }) =>
  api.post<ApiResponse<{ accessToken: string }>>("/api/v1/auth/login", body);

export const getMe = () =>
  api.get<ApiResponse<MeResponse>>("/api/v1/me");

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

// ─── Brand Submit (브랜드 등록 신청) ───
export const submitBrand = (
  body: { name: string; summary: string; story?: string; instagramUrl: string; websiteUrl?: string; keywords: string[]; managerName: string; email: string; phone: string },
  mainImage?: File | null,
  visuals?: File[]
) => {
  const formData = new FormData();
  formData.append(
    "request",
    JSON.stringify({
        name: body.name,
        summary: body.summary,
        story: body.story,
        instagramUrl: body.instagramUrl,
        websiteUrl: body.websiteUrl,
        managerName: body.managerName,
        managerEmail: body.email,
        managerPhone: body.phone,
        keywords: body.keywords,
      }),
  );
  if (mainImage) formData.append("mainImage", mainImage);
  if (visuals) visuals.forEach((f) => formData.append("visuals", f));
  return api.post("/api/v1/brands/submit", formData);
};

// ─── Brand Save (브랜드 저장하기) ───
export const saveBrand = (brandId: string, categoryIds: number[]) =>
  api.post(`/api/v1/brands/${brandId}/save`, { categoryIds });

// ─── My Swatch (Archive) ───
export interface CategoryDTO {
  categoryId: number;
  name: string;
  isDefault: boolean;
  brandCount: number;
}

export interface CategoryListDTO {
  totalSavedBrandCount: number;
  categories: CategoryDTO[];
}

export interface SavedBrandDTO {
  savedBrandId: number;
  brandId: number;
  brandName: string;
  mainImageUrl: string;
  keywords: string[];
  memo: string;
  savedAt: string;
}

export interface SavedBrandListDTO {
  brands: SavedBrandDTO[];
}

export const getMySwatchCategories = () =>
  api.get<ApiResponse<CategoryListDTO>>("/api/v1/my-swatch/categories");

export const getCategoryBrands = (categoryId: string) =>
  api.get<ApiResponse<SavedBrandListDTO>>(`/api/v1/my-swatch/categories/${categoryId}/brands`);

export const addSavedBrandsToCategory = (categoryId: string, savedBrandIds: string[]) =>
  api.post(`/api/v1/my-swatch/categories/${categoryId}/saved-brands`, {
    savedBrandIds: savedBrandIds.map(Number),
  });

// ─── Categories (생성/삭제) ───
export interface CategoryResponse {
  categoryId: number;
  name: string;
  isDefault: boolean;
  createdAt: string;
}

export const createCategory = (name: string) =>
  api.post<ApiResponse<CategoryResponse>>("/api/v1/categories", { name });

export const deleteCategory = (categoryId: string) =>
  api.delete(`/api/v1/categories/${categoryId}`);

// ─── Saved Brands (메모 수정) ───
export const updateMemo = (savedBrandId: string, memo: string) =>
  api.patch(`/api/v1/saved-brands/${savedBrandId}/memo`, { memo });

// ─── Manual Brand ───
export interface ManualBrandResponse {
  savedBrandId: number;
  brandId: number;
  name: string;
  mainImageUrl: string | null;
  imageUrls: string[];
  isManual: boolean;
  categoryIds: number[];
}

type ManualBrandRequest = {
  name: string;
  instagramUrl?: string;
  websiteUrl?: string;
  memo?: string;
  categoryIds: number[];
};

export const createManualBrand = (body: ManualBrandRequest) =>
  api.post<ApiResponse<ManualBrandResponse>>("/api/v1/manual-brands", body);

export const createManualBrandWithImage = (body: ManualBrandRequest, mainImage?: File) => {
  const formData = new FormData();
  formData.append("request", JSON.stringify(body));
  if (mainImage) formData.append("mainImage", mainImage);
  return api.post<ApiResponse<ManualBrandResponse>>("/api/v1/manual-brands", formData);
};
