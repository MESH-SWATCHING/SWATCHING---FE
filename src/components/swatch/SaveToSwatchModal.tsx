import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useSwatch, type Brand } from "../../context/SwatchContext";

interface SaveToSwatchModalProps {
  brand: Brand;
  onClose: () => void;
  onSaved: () => void;
}

export default function SaveToSwatchModal({
  brand,
  onClose,
  onSaved,
}: SaveToSwatchModalProps) {
  const { categories, saveBrand, addCategory } = useSwatch();
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>(["all"]);
  const [newCatName, setNewCatName] = useState("");
  const [showNewCatInput, setShowNewCatInput] = useState(false);

  const toggle = (catId: string) => {
    if (catId === "all") return;
    setSelectedCatIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId],
    );
  };

  const handleCreateCategory = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName("");
    setShowNewCatInput(false);
  };

  const handleSave = () => {
    saveBrand(brand.id, selectedCatIds);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl z-10 px-6 pt-8 pb-6 animate-slide-up">
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">내 스와치에 담기</h2>
        <p className="text-xs text-[#888] mb-5">어떤 카테고리에 추가할까요?</p>

        {/* 브랜드 정보 */}
        <div className="flex items-center gap-3 bg-[#f7f5f2] rounded-2xl p-3 mb-5">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <img src={brand.thumbnailUrl} alt={brand.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-semibold text-[#1a1a1a]">{brand.name}</span>
        </div>

        {/* 카테고리 목록 */}
        <div className="flex flex-col gap-1 mb-5 max-h-48 overflow-y-auto scrollbar-hide">
          {categories.map((cat) => {
            const isSelected = selectedCatIds.includes(cat.id);
            const isAll = cat.id === "all";
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors
                  ${isSelected ? "bg-[#f7f5f2]" : ""}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${isSelected ? "bg-[#1a1a1a] border-[#1a1a1a]" : "border-[#ddd]"}`}>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
                <span className="text-sm font-medium text-[#1a1a1a]">
                  {cat.name}
                  {isAll && <span className="text-[#aaa] text-xs ml-1">(필수)</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* 새 카테고리 */}
        {showNewCatInput ? (
          <div className="flex gap-2 mb-5">
            <input
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
              placeholder="카테고리 이름"
              className="flex-1 border border-[#e0ddd8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a1a1a]"
            />
            <button onClick={handleCreateCategory} className="px-4 py-2.5 bg-[#1a1a1a] text-white text-sm rounded-xl">
              추가
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewCatInput(true)}
            className="flex items-center gap-2 text-sm text-[#888] mb-5 px-4 py-3"
          >
            <Plus size={14} /> 새 카테고리 만들기
          </button>
        )}

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-[#1a1a1a] text-white text-sm font-semibold rounded-2xl active:scale-[0.98] transition-transform"
        >
          저장 완료
        </button>
      </div>
    </div>
  );
}
