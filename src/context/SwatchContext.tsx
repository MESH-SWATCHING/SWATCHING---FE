import { createContext, useContext, useState, type ReactNode } from "react";
import {
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_SAVED_BRANDS,
} from "../mocks/brands";

// ─── 임시 타입 (서버 연동 후 types/index.ts로 분리 예정) ───
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
  brandId: string;
  categoryIds: string[];
  memo: string;
}

interface SwatchContextType {
  brands: Brand[];
  categories: Category[];
  savedBrands: SavedBrand[];

  // 저장 관련
  isSaved: (brandId: string) => boolean;
  saveBrand: (brandId: string, categoryIds: string[]) => void;
  unsaveBrand: (brandId: string) => void;

  // 카테고리 관련
  addCategory: (name: string) => void;
  deleteCategory: (categoryId: string) => void;
  addBrandToCategory: (categoryId: string, brandIds: string[]) => void;
  removeBrandFromCategory: (categoryId: string, brandId: string) => void;

  // 메모
  updateMemo: (brandId: string, memo: string) => void;

  // 직접 추가
  addManualBrand: (
    brand: Omit<Brand, "id"> & { categoryIds: string[] },
  ) => void;
}

const SwatchContext = createContext<SwatchContextType | null>(null);

export function SwatchProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>(MOCK_BRANDS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [savedBrands, setSavedBrands] =
    useState<SavedBrand[]>(MOCK_SAVED_BRANDS);

  const isSaved = (brandId: string) =>
    savedBrands.some((s) => s.brandId === brandId);

  const saveBrand = (brandId: string, categoryIds: string[]) => {
    const allIds = ["all", ...categoryIds.filter((id) => id !== "all")];
    setSavedBrands((prev) => {
      const exists = prev.find((s) => s.brandId === brandId);
      if (exists) {
        return prev.map((s) =>
          s.brandId === brandId ? { ...s, categoryIds: allIds } : s,
        );
      }
      return [...prev, { brandId, categoryIds: allIds, memo: "" }];
    });
    setCategories((prev) =>
      prev.map((cat) =>
        allIds.includes(cat.id) && !cat.brandIds.includes(brandId)
          ? { ...cat, brandIds: [...cat.brandIds, brandId] }
          : cat,
      ),
    );
  };

  const unsaveBrand = (brandId: string) => {
    setSavedBrands((prev) => prev.filter((s) => s.brandId !== brandId));
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        brandIds: cat.brandIds.filter((id) => id !== brandId),
      })),
    );
  };

  const addCategory = (name: string) => {
    const newCat: Category = {
      id: Date.now().toString(),
      name,
      brandIds: [],
      isDefault: false,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    setSavedBrands((prev) =>
      prev.map((s) => ({
        ...s,
        categoryIds: s.categoryIds.filter((id) => id !== categoryId),
      })),
    );
  };

  const addBrandToCategory = (categoryId: string, brandIds: string[]) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              brandIds: [
                ...cat.brandIds,
                ...brandIds.filter((id) => !cat.brandIds.includes(id)),
              ],
            }
          : cat,
      ),
    );
    setSavedBrands((prev) =>
      prev.map((s) =>
        brandIds.includes(s.brandId) && !s.categoryIds.includes(categoryId)
          ? { ...s, categoryIds: [...s.categoryIds, categoryId] }
          : s,
      ),
    );
  };

  const removeBrandFromCategory = (categoryId: string, brandId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, brandIds: cat.brandIds.filter((id) => id !== brandId) }
          : cat,
      ),
    );
    setSavedBrands((prev) =>
      prev.map((s) =>
        s.brandId === brandId
          ? {
              ...s,
              categoryIds: s.categoryIds.filter((id) => id !== categoryId),
            }
          : s,
      ),
    );
  };

  const updateMemo = (brandId: string, memo: string) => {
    setSavedBrands((prev) =>
      prev.map((s) => (s.brandId === brandId ? { ...s, memo } : s)),
    );
  };

  const addManualBrand = (
    brand: Omit<Brand, "id"> & { categoryIds: string[] },
  ) => {
    const newBrand: Brand = {
      ...brand,
      id: Date.now().toString(),
      isManual: true,
    };
    setBrands((prev) => [...prev, newBrand]);
    saveBrand(newBrand.id, brand.categoryIds);
  };

  return (
    <SwatchContext.Provider
      value={{
        brands,
        categories,
        savedBrands,
        isSaved,
        saveBrand,
        unsaveBrand,
        addCategory,
        deleteCategory,
        addBrandToCategory,
        removeBrandFromCategory,
        updateMemo,
        addManualBrand,
      }}
    >
      {children}
    </SwatchContext.Provider>
  );
}

export function useSwatch() {
  const ctx = useContext(SwatchContext);
  if (!ctx) throw new Error("SwatchProvider 안에서 사용해야 합니다");
  return ctx;
}
