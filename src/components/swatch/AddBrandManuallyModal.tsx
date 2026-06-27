import { useState } from "react";
import { toast } from "sonner";
import { useSwatch } from "../../context/SwatchContext";

interface AddBrandManuallyModalProps {
  defaultCategoryId?: string;
  onClose: () => void;
}

export default function AddBrandManuallyModal({
  defaultCategoryId,
  onClose,
}: AddBrandManuallyModalProps) {
  const { categories, addManualBrand } = useSwatch();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [memo, setMemo] = useState("");
  // 현재 카테고리가 전체(all)가 아니면 기본 선택으로 넣어줌
  const [selectedCats, setSelectedCats] = useState<string[]>(
    defaultCategoryId && defaultCategoryId !== "all" ? [defaultCategoryId] : [],
  );

  const userCategories = categories.filter((c) => !c.isDefault);

  const toggleCat = (id: string) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    addManualBrand({
      name: name.trim(),
      instagramUrl: url.includes("instagram") ? url : undefined,
      websiteUrl: !url.includes("instagram") ? url : undefined,
      categoryIds: selectedCats,
    });
    toast("브랜드가 내 스와치에 추가되었습니다.");
    onClose();
  };

  const isValid = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-md px-5 pt-3 pb-10 max-h-[90vh] overflow-y-auto scrollbar-hide z-10 animate-slide-up">
        <div className="flex justify-center pb-4">
          <div className="w-10 h-1 bg-[#ddd] rounded-full" />
        </div>

        <h2 className="text-base font-semibold mb-1">직접 브랜드 추가</h2>
        <p className="text-sm text-[#888] mb-6">
          플랫폼에 없는 브랜드도 개인 기록으로 저장할 수 있어요.
        </p>

        <div className="mb-4">
          <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">
            브랜드명 <span className="text-[#e03131]">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="브랜드명 입력"
            className="w-full border border-[#e0ddd8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a1a1a] transition-colors"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">
            Instagram 또는 Website URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL 입력"
            className="w-full border border-[#e0ddd8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a1a1a] transition-colors"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">
            메모
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="왜 이 브랜드를 저장하나요?"
            rows={3}
            className="w-full border border-[#e0ddd8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a1a1a] transition-colors resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-[#1a1a1a] mb-3 block">
            카테고리
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked
              disabled
              className="w-4 h-4 accent-black"
            />
            <span className="text-sm text-[#1a1a1a]">전체</span>
          </label>
          {userCategories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 mb-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCats.includes(cat.id)}
                onChange={() => toggleCat(cat.id)}
                className="w-4 h-4 accent-black"
              />
              <span className="text-sm text-[#1a1a1a]">{cat.name}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl text-sm font-semibold transition-colors
            ${isValid ? "bg-[#1a1a1a] text-white" : "bg-[#e0ddd8] text-[#aaa]"}`}
        >
          내 스와치에 추가
        </button>
      </div>
    </div>
  );
}
