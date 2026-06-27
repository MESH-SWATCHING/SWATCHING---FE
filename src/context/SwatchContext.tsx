import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import * as swatchApi from "../api/swatching";
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_SAVED_BRANDS } from "../mocks/brands";

// ─── 타입 ───
export interface Brand {
  id: string;
  name: string;
  description: string;
  story: string;
  keywords: string[];
  thumbnailUrl: string;
  visuals: string[];
  instagramUrl?: string;
  websiteUrl?: string;
  isManual?: boolean;
}

export interface Category {
  id: string;
  name: string;
  brandIds: string[];
  isDefault: boolean;
}

export interface SavedBrand {
  id: string;
  brandId: string;
  categoryIds: string[];
  memo: string;
}

interface SwatchContextType {
  brands: Brand[];
  categories: Category[];
  savedBrands: SavedBrand[];
  loading: boolean;

  refreshCategories: () => Promise<void>;
  refreshSavedBrands: () => Promise<void>;

  isSaved: (brandId: string) => boolean;
  saveBrand: (brandId: string, categoryIds: string[]) => Promise<void>;
  unsaveBrand: (savedBrandId: string) => Promise<void>;

  addCategory: (name: string) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addBrandToCategory: (categoryId: string, savedBrandIds: string[]) => Promise<void>;
  removeBrandFromCategory: (categoryId: string, savedBrandId: string) => Promise<void>;

  updateMemo: (savedBrandId: string, memo: string) => Promise<void>;
  addManualBrand: (brand: { name: string; instagramUrl?: string; websiteUrl?: string; categoryIds: string[]; image?: File }) => Promise<void>;
}

const SwatchContext = createContext<SwatchContextType | null>(null);

// API 사용 여부 (서버 없으면 mock fallback)
const USE_API = Boolean(import.meta.env.VITE_API_URL);

export function SwatchProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>(MOCK_BRANDS as Brand[]);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [savedBrands, setSavedBrands] = useState<SavedBrand[]>(
    MOCK_SAVED_BRANDS.map((s) => ({ ...s, id: s.brandId })),
  );
  const [loading, setLoading] = useState(false);

  // ─── API fetch 함수들 ───
  const refreshCategories = useCallback(async () => {
    if (!USE_API) return;
    try {
      const res = await swatchApi.getCategories();
      setCategories(res.data.data ?? res.data);
    } catch { /* fallback to current state */ }
  }, []);

  const refreshSavedBrands = useCallback(async () => {
    if (!USE_API) return;
    try {
      const res = await swatchApi.getCategoryBrands("all");
      setSavedBrands(res.data.data ?? res.data);
    } catch { /* fallback */ }
  }, []);

  const refreshBrands = useCallback(async () => {
    if (!USE_API) return;
    try {
      const res = await swatchApi.getBrands();
      const raw = res.data.data ?? res.data;
      setBrands(
        (raw as swatchApi.BrandResponseDto[]).map((b) => ({
          id: String(b.brandId),
          name: b.name,
          description: b.summary,
          story: "",
          keywords: b.keywords,
          thumbnailUrl: b.mainImageUrl,
          visuals: [],
          isManual: false,
        })),
      );
    } catch { /* fallback */ }
  }, []);

  // 초기 로드
  useEffect(() => {
    if (!USE_API) return;
    setLoading(true);
    Promise.all([refreshBrands(), refreshCategories(), refreshSavedBrands()])
      .finally(() => setLoading(false));
  }, [refreshBrands, refreshCategories, refreshSavedBrands]);

  // ─── 액션 함수들 ───
  const isSaved = (brandId: string) =>
    savedBrands.some((s) => s.brandId === brandId);

  const saveBrand = async (brandId: string, categoryIds: string[]) => {
    if (USE_API) {
      await swatchApi.saveBrand(brandId, categoryIds);
      await Promise.all([refreshCategories(), refreshSavedBrands()]);
    } else {
      // mock fallback
      const allIds = ["all", ...categoryIds.filter((id) => id !== "all")];
      setSavedBrands((prev) => {
        const exists = prev.find((s) => s.brandId === brandId);
        if (exists) return prev.map((s) => s.brandId === brandId ? { ...s, categoryIds: allIds } : s);
        return [...prev, { id: brandId, brandId, categoryIds: allIds, memo: "" }];
      });
      setCategories((prev) =>
        prev.map((cat) =>
          allIds.includes(cat.id) && !cat.brandIds.includes(brandId)
            ? { ...cat, brandIds: [...cat.brandIds, brandId] } : cat,
        ),
      );
    }
  };

  const unsaveBrand = async (savedBrandId: string) => {
    if (USE_API) {
      await swatchApi.deleteSavedBrand(savedBrandId);
      await Promise.all([refreshCategories(), refreshSavedBrands()]);
    } else {
      setSavedBrands((prev) => prev.filter((s) => s.id !== savedBrandId));
      setCategories((prev) =>
        prev.map((cat) => ({ ...cat, brandIds: cat.brandIds.filter((id) => id !== savedBrandId) })),
      );
    }
  };

  const addCategory = async (name: string) => {
    if (USE_API) {
      await swatchApi.createCategory(name);
      await refreshCategories();
    } else {
      const newCat: Category = { id: Date.now().toString(), name, brandIds: [], isDefault: false };
      setCategories((prev) => [...prev, newCat]);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (USE_API) {
      await swatchApi.deleteCategory(categoryId);
      await refreshCategories();
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    }
  };

  const addBrandToCategory = async (categoryId: string, savedBrandIds: string[]) => {
    if (USE_API) {
      await Promise.all(savedBrandIds.map((id) => swatchApi.addBrandToCategory(categoryId, id)));
      await refreshCategories();
    } else {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, brandIds: [...cat.brandIds, ...savedBrandIds.filter((id) => !cat.brandIds.includes(id))] }
            : cat,
        ),
      );
    }
  };

  const removeBrandFromCategory = async (categoryId: string, savedBrandId: string) => {
    if (USE_API) {
      await swatchApi.removeBrandFromCategory(categoryId, savedBrandId);
      await Promise.all([refreshCategories(), refreshSavedBrands()]);
    } else {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, brandIds: cat.brandIds.filter((id) => id !== savedBrandId) } : cat,
        ),
      );
    }
  };

  const updateMemo = async (savedBrandId: string, memo: string) => {
    if (USE_API) {
      await swatchApi.updateMemo(savedBrandId, memo);
      await refreshSavedBrands();
    } else {
      setSavedBrands((prev) =>
        prev.map((s) => (s.id === savedBrandId ? { ...s, memo } : s)),
      );
    }
  };

  const addManualBrand = async (brand: { name: string; instagramUrl?: string; websiteUrl?: string; categoryIds: string[]; image?: File }) => {
    if (USE_API) {
      await swatchApi.createManualBrand(brand);
      await Promise.all([refreshCategories(), refreshSavedBrands()]);
    } else {
      const newBrand: Brand = {
        id: Date.now().toString(),
        name: brand.name,
        description: "",
        story: "",
        keywords: [],
        thumbnailUrl: brand.image ? URL.createObjectURL(brand.image) : "",
        visuals: [],
        instagramUrl: brand.instagramUrl,
        websiteUrl: brand.websiteUrl,
        isManual: true,
      };
      setBrands((prev) => [...prev, newBrand]);
      await saveBrand(newBrand.id, brand.categoryIds);
    }
  };

  return (
    <SwatchContext.Provider
      value={{
        brands, categories, savedBrands, loading,
        refreshCategories, refreshSavedBrands,
        isSaved, saveBrand, unsaveBrand,
        addCategory, deleteCategory,
        addBrandToCategory, removeBrandFromCategory,
        updateMemo, addManualBrand,
      }}
    >
      {children}
    </SwatchContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useSwatch() {
  const ctx = useContext(SwatchContext);
  if (!ctx) throw new Error("SwatchProvider 안에서 사용해야 합니다");
  return ctx;
}
