import { useState } from "react";
import { toast } from "sonner";
import { useSwatch } from "../../context/SwatchContext";

interface AddBrandToCategoryProps {
  categoryId: string;
  categoryName: string;
  onClose: () => void;
}

export default function AddBrandToCategory({
  categoryId,
  categoryName,
  onClose,
}: AddBrandToCategoryProps) {
  const { brands, savedBrands, categories, addBrandToCategory } = useSwatch();
  const [selected, setSelected] = useState<string[]>([]);

  const currentCat = categories.find((c) => c.id === categoryId);
  const alreadyInCategory = currentCat?.brandIds ?? [];
  const availableBrands = savedBrands
    .map((saved) => {
      const brand = brands.find((b) => b.id === saved.brandId);
      return brand ? { brand, savedBrandId: saved.id } : null;
    })
    .filter((item): item is { brand: (typeof brands)[number]; savedBrandId: string } => item !== null);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;
    await addBrandToCategory(categoryId, selected);
    toast("브랜드가 내 스와치에 추가되었습니다.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl z-10 px-6 pt-8 pb-6 animate-slide-up max-h-[80vh] flex flex-col">
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">
          브랜드 추가
        </h2>
        <p className="text-xs text-[#888] mb-5">
          <span className="text-[#1a1a1a] font-medium">"{categoryName}"</span> 카테고리에 추가합니다
        </p>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {availableBrands.length === 0 ? (
            <p className="text-sm text-[#bbb] text-center py-8">
              저장된 브랜드가 없어요
            </p>
          ) : (
            availableBrands.map(({ brand, savedBrandId }) => {
              const isSelected = selected.includes(savedBrandId);
              const isAlready = alreadyInCategory.includes(brand.id);
              return (
                <button
                  key={savedBrandId}
                  onClick={() => !isAlready && toggle(savedBrandId)}
                  className={`flex items-center gap-3 rounded-xl p-3 transition-colors text-left
                    ${isSelected ? "bg-[#f7f5f2]" : ""}
                    ${isAlready ? "opacity-40 cursor-default" : "cursor-pointer"}`}
                >
                  <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                    {brand.thumbnailUrl ? (
                      <img src={brand.thumbnailUrl} alt={brand.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#e0ddd8] flex items-center justify-center">
                        <span className="text-sm font-bold text-[#aaa]">{brand.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium text-[#1a1a1a]">
                    {brand.name}
                    {isAlready && (
                      <span className="ml-2 text-[10px] text-[#bbb] font-normal">이미 추가됨</span>
                    )}
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected ? "bg-[#1a1a1a] border-[#1a1a1a]" : "border-[#ddd]"}`}>
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={selected.length === 0}
          className={`w-full py-4 rounded-2xl text-sm font-semibold transition-colors
            ${selected.length > 0 ? "bg-[#1a1a1a] text-white" : "bg-[#e0ddd8] text-[#aaa]"}`}
        >
          선택한 브랜드 추가 {selected.length > 0 && `(${selected.length})`}
        </button>
      </div>
    </div>
  );
}
