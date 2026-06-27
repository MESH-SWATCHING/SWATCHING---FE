import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [selectedCats, setSelectedCats] = useState<string[]>(
    defaultCategoryId && defaultCategoryId !== "all" ? [defaultCategoryId] : [],
  );

  const userCategories = categories.filter((c) => !c.isDefault);

  const toggleCat = (id: string) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const normalizeUrl = (raw: string): string | undefined => {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || submitting) return;
    const normalizedUrl = normalizeUrl(url);
    setSubmitting(true);
    try {
      await addManualBrand({
        name: name.trim(),
        instagramUrl: normalizedUrl?.includes("instagram") ? normalizedUrl : undefined,
        websiteUrl: normalizedUrl && !normalizedUrl.includes("instagram") ? normalizedUrl : undefined,
        categoryIds: selectedCats,
        image: image ?? undefined,
      });
      toast("브랜드가 내 스와치에 추가되었습니다.");
      onClose();
    } catch (e) {
      toast.error("브랜드 추가에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-md px-5 pt-3 pb-10 max-h-[90vh] overflow-y-auto scrollbar-hide z-10 animate-slide-up [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

        {/* 대표이미지 업로드 */}
        <div className="mb-4">
          <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">
            대표이미지
          </label>
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#f3f1ec]">
              <img src={imagePreview} alt="" className="w-full h-full object-contain" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-full h-32 border border-dashed border-[#ccc] rounded-xl flex flex-col items-center justify-center gap-2 bg-white hover:border-[#1a1a1a] transition-colors"
            >
              <Upload size={20} className="text-[#bbb]" />
              <p className="text-xs text-[#aaa]">클릭해서 이미지 업로드</p>
            </button>
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
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
          disabled={!isValid || submitting}
          className={`w-full py-4 rounded-2xl text-sm font-semibold transition-colors
            ${isValid && !submitting ? "bg-[#1a1a1a] text-white" : "bg-[#e0ddd8] text-[#aaa]"}`}
        >
          {submitting ? "추가 중..." : "내 스와치에 추가"}
        </button>
      </div>
    </div>
  );
}
