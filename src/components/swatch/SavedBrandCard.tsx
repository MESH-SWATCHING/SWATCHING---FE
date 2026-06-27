import { useState } from "react";
import { Bookmark, FileText, ExternalLink } from "lucide-react";
import { useSwatch, type Brand } from "../../context/SwatchContext";
import KeywordBadge from "../common/KeywordBadge";

interface SavedBrandCardProps {
  brand: Brand;
  savedBrandId: string;
  categoryId: string;
  memo: string;
  onNavigate: (brandId: string) => void;
}

export default function SavedBrandCard({
  brand,
  savedBrandId,
  categoryId,
  memo,
  onNavigate,
}: SavedBrandCardProps) {
  const { removeBrandFromCategory, unsaveBrand, updateMemo } = useSwatch();
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoValue, setMemoValue] = useState(memo);

  const isAllCategory = categoryId === "all";

  const handleRemove = () => {
    if (isAllCategory) {
      unsaveBrand(savedBrandId);
    } else {
      removeBrandFromCategory(categoryId, savedBrandId);
    }
  };

  const handleMemoSave = () => {
    updateMemo(savedBrandId, memoValue);
    setIsEditingMemo(false);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* 상단: 이미지 + 브랜드 정보 */}
      <div className="flex gap-3 p-4">
        {/* 썸네일 */}
        <div
          className="w-[90px] h-[90px] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
          onClick={() => onNavigate(brand.id)}
        >
          {brand.thumbnailUrl ? (
            <img
              src={brand.thumbnailUrl}
              alt={brand.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#e0ddd8] flex items-center justify-center">
              <span className="text-xl font-bold text-[#aaa]">
                {brand.name[0]}
              </span>
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-sm font-bold text-[#1a1a1a] tracking-wide">
                  {brand.name}
                </h3>
                {brand.isManual && (
                  <span className="text-[10px] bg-[#f0ede8] text-[#888] px-1.5 py-0.5 rounded-full">
                    직접 추가
                  </span>
                )}
              </div>
              <p className="text-xs text-[#888] mb-2 leading-relaxed line-clamp-2">
                {brand.description}
              </p>
              <KeywordBadge keywords={brand.keywords} />
            </div>
            {/* 저장 해제 버튼 */}
            <button
              onClick={handleRemove}
              className="ml-2 w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0"
            >
              <Bookmark size={14} className="text-white fill-white" />
            </button>
          </div>

          {/* 링크 */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => onNavigate(brand.id)}
              className="text-xs text-[#555] flex items-center gap-0.5 underline underline-offset-2"
            >
              브랜드 노트 보기 →
            </button>
            {brand.instagramUrl && (
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#888] flex items-center gap-0.5"
              >
                Instagram <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 메모 영역 */}
      <div className="border-t border-[#f0ede8] px-4 py-3">
        {isEditingMemo ? (
          <div>
            <textarea
              autoFocus
              value={memoValue}
              onChange={(e) => setMemoValue(e.target.value)}
              rows={2}
              className="w-full text-sm text-[#1a1a1a] outline-none resize-none bg-transparent border-b border-[#ddd] pb-1"
            />
            <div className="flex justify-end mt-1">
              <button
                onClick={handleMemoSave}
                className="text-xs font-medium text-[#1a1a1a]"
              >
                완료
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingMemo(true)}
            className="flex items-start gap-1.5 w-full text-left"
          >
            <FileText size={12} className="text-[#aaa] mt-0.5 flex-shrink-0" />
            <span
              className={`text-xs ${memoValue ? "text-[#555]" : "text-[#bbb]"}`}
            >
              {memoValue || "이 브랜드에 대한 메모를 남겨보세요"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
