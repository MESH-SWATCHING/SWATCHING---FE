import { useState } from "react";
import { X } from "lucide-react";
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

  const savedBrandIds = savedBrands.map((s) => s.brandId);
  const availableBrands = brands.filter((b) => savedBrandIds.includes(b.id));
  const currentCat = categories.find((c) => c.id === categoryId);
  const alreadyInCategory = currentCat?.brandIds ?? [];

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleAdd = () => {
    if (selected.length === 0) return;
    addBrandToCategory(categoryId, selected);
    toast("브랜드가 내 스와치에 추가되었습니다.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[340px] max-h-[70vh] flex flex-col z-10 shadow-xl">
        <div className="px-5 pt-5 pb-3 border-b border-[#f0ede8]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[#1a1a1a]">
              카테고리에 추가할 브랜드 선택
            </h2>
            <button onClick={onClose} className="text-[#aaa]">
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-[#888]">
            <span className="text-[#1a1a1a] font-medium">"{categoryName}"</span>{" "}
            카테고리에 추가합니다
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3">
          {availableBrands.length === 0 ? (
            <p className="text-sm text-[#bbb] text-center py-8">
              저장된 브랜드가 없어요
            </p>
          ) : (
            availableBrands.map((brand) => {
              const isSelected = selected.includes(brand.id);
              const isAlready = alreadyInCategory.includes(brand.id);
              return (
                <label
                  key={brand.id}
                  className={`flex items-center gap-3 rounded-xl p-2 transition-colors
                    ${isSelected ? "bg-[#f7f5f2]" : ""}
                     ${isAlready ? "opacity-40 cursor-default" : "cursor-pointer"}`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    {brand.thumbnailUrl ? (
                      <img
                        src={brand.thumbnailUrl}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#e0ddd8] flex items-center justify-center">
                        <span className="text-sm font-bold text-[#aaa]">
                          {brand.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium text-[#1a1a1a]">
                    {brand.name}
                    {isAlready && (
                      <span className="ml-2 text-[10px] text-[#bbb] font-normal">
                        이미 추가됨
                      </span>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isAlready}
                    onChange={() => !isAlready && toggle(brand.id)}
                    className="w-5 h-5 accent-black flex-shrink-0"
                  />
                </label>
              );
            })
          )}
        </div>

        <div className="px-5 pb-5 pt-3 border-t border-[#f0ede8]">
          <button
            onClick={handleAdd}
            disabled={selected.length === 0}
            className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-colors
              ${selected.length > 0 ? "bg-[#1a1a1a] text-white" : "bg-[#e0ddd8] text-[#aaa]"}`}
          >
            선택한 브랜드 추가 {selected.length > 0 && `(${selected.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
