import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSwatch } from "../context/SwatchContext";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import SavedBrandCard from "../components/swatch/SavedBrandCard";
import DeleteCategoryModal from "../components/swatch/DeleteCategoryModal";
import AddBrandToCategory from "../components/swatch/AddBrandToCategory";
import AddBrandManuallyModal from "../components/swatch/AddBrandManuallyModal";
import mySwatchLogo from "../assets/mySwatchLogo.svg";

export default function MySwatchPage() {
  const navigate = useNavigate();
  const { brands, categories, savedBrands, addCategory, deleteCategory } =
    useSwatch();

  const [activeCatId, setActiveCatId] = useState("all");
  const [newCatName, setNewCatName] = useState("");
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
  const [addingBrandCatId, setAddingBrandCatId] = useState<string | null>(null);
  const [showManualAdd, setShowManualAdd] = useState(false);

  const activeCategory = categories.find((c) => c.id === activeCatId);

  const activeBrands = useMemo(() => {
    const ids = activeCategory?.brandIds ?? [];
    return brands.filter((b) => ids.includes(b.id));
  }, [activeCategory, brands]);

  const { displayedData, hasMore, loaderRef } = useInfiniteScroll({
    data: activeBrands,
    pageSize: 5,
  });

  const handleCreateCategory = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    toast(`"${newCatName.trim()}" 카테고리가 생성되었습니다.`);
    setNewCatName("");
    setShowNewCatInput(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingCatId) return;
    deleteCategory(deletingCatId);
    setActiveCatId("all");
    setDeletingCatId(null);
  };

  const deletingCategory = categories.find((c) => c.id === deletingCatId);
  const addingBrandCategory = categories.find((c) => c.id === addingBrandCatId);

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-28">
      <div className="px-5 pt-8">
        {/* 헤더 */}
        <div className="mb-5">
          <img src={mySwatchLogo} alt="My Swatch" className="h-12  -ml-4" />
        </div>

        {/* 카테고리 탭 */}
        <p className="text-[10px] font-semibold text-[#aaa] tracking-widest mb-3">
          MY CATEGORIES
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setActiveCatId(cat.id);
                setShowNewCatInput(false);
              }}
              className={`relative flex-shrink-0 w-28 rounded-2xl px-3 py-3 text-left transition-colors cursor-pointer
                ${
                  activeCatId === cat.id
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-white text-[#1a1a1a] border border-[#e0ddd8]"
                }`}
            >
              {!cat.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingCatId(cat.id);
                  }}
                  className={`absolute top-2 right-2 ${activeCatId === cat.id ? "text-white/50 hover:text-white" : "text-[#bbb]"}`}
                >
                  <Trash2 size={12} />
                </button>
              )}
              <FolderOpen
                size={16}
                className={`mb-2 ${activeCatId === cat.id ? "text-white" : "text-[#aaa]"}`}
              />
              <p className="text-xs font-semibold truncate">{cat.name}</p>
              <p
                className={`text-[10px] mt-0.5 ${activeCatId === cat.id ? "text-white/70" : "text-[#aaa]"}`}
              >
                {cat.brandIds.length} brands
              </p>
              {cat.isDefault && (
                <p
                  className={`text-[10px] ${activeCatId === cat.id ? "text-white/50" : "text-[#ccc]"}`}
                >
                  기본
                </p>
              )}
            </div>
          ))}

          {/* 새 카테고리 버튼 */}
          <button
            onClick={() => setShowNewCatInput((prev) => !prev)}
            className="flex-shrink-0 w-28 rounded-2xl border border-dashed border-[#ccc] flex flex-col items-center justify-center py-5 text-[#bbb] hover:border-[#1a1a1a] transition-colors"
          >
            <Plus size={16} className="mb-1" />
            <span className="text-xs">새 카테고리</span>
          </button>
        </div>

        {/* 새 카테고리 입력 — 탭 바로 아래 인라인 */}
        {showNewCatInput && (
          <div className="flex gap-2 mt-3">
            <input
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="카테고리 이름 입력"
              onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
              className="flex-1 border border-[#e0ddd8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a1a1a] transition-colors bg-white"
            />
            <button
              onClick={handleCreateCategory}
              className="px-4 py-2.5 bg-[#1a1a1a] text-white text-sm rounded-xl font-medium"
            >
              만들기
            </button>
          </div>
        )}

        {/* 카테고리 헤더 */}
        <div className="flex items-center justify-between mt-6 mb-3">
          <div>
            <h2 className="text-base font-bold text-[#1a1a1a]">
              {activeCategory?.name}
            </h2>
            <p className="text-xs text-[#aaa]">
              이 카테고리에 담긴 브랜드 {activeBrands.length}개
            </p>
          </div>
          {/* 전체 카테고리에도 브랜드 추가 / 직접 추가 버튼 표시 */}
          <div className="flex gap-2">
            <button
              onClick={() => setAddingBrandCatId(activeCatId)}
              className="text-xs text-[#1a1a1a] font-medium flex items-center gap-1 border border-[#e0ddd8] rounded-xl px-3 py-2 bg-white"
            >
              <Plus size={12} /> 브랜드 추가
            </button>
            <button
              onClick={() => setShowManualAdd(true)}
              className="text-xs text-[#1a1a1a] font-medium flex items-center gap-1 border border-[#e0ddd8] rounded-xl px-3 py-2 bg-white"
            >
              <Plus size={12} /> 직접 추가
            </button>
          </div>
        </div>

        {/* 브랜드 목록 */}
        {activeBrands.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-[#bbb] mb-3">
              이 카테고리에 브랜드를 추가해보세요
            </p>
            <button
              onClick={() => setShowManualAdd(true)}
              className="text-sm text-[#1a1a1a] underline underline-offset-2"
            >
              찾는 브랜드가 없나요? 직접 추가하기
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {displayedData.map((brand) => {
                const saved = savedBrands.find((s) => s.brandId === brand.id);
                return (
                  <SavedBrandCard
                    key={brand.id}
                    brand={brand}
                    categoryId={activeCatId}
                    memo={saved?.memo ?? ""}
                    onNavigate={(id) => navigate(`/brand/${id}`)}
                  />
                );
              })}
            </div>

            <div ref={loaderRef} className="py-6 flex justify-center">
              {hasMore ? (
                <div className="flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-[#ccc] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-[#ccc] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-[#ccc] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              ) : (
                <p className="text-xs text-[#ccc]">모든 브랜드를 확인했어요</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* 모달 */}
      {deletingCatId && deletingCategory && (
        <DeleteCategoryModal
          categoryName={deletingCategory.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCatId(null)}
        />
      )}
      {addingBrandCatId && addingBrandCategory && (
        <AddBrandToCategory
          categoryId={addingBrandCatId}
          categoryName={addingBrandCategory.name}
          onClose={() => setAddingBrandCatId(null)}
        />
      )}
      {showManualAdd && (
        <AddBrandManuallyModal
          defaultCategoryId={activeCatId}
          onClose={() => setShowManualAdd(false)}
        />
      )}
    </div>
  );
}
