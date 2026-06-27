import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bookmark, ExternalLink } from "lucide-react";
import { useSwatch, type Brand } from "../context/SwatchContext";
import { getBrandsDeck } from "../api/swatching";
import { EN_TO_MOOD } from "../constants/Moods";
import swatchDeckLogo from "../assets/swatchDeckLogo.svg";
import SaveToSwatchModal from "../components/swatch/SaveToSwatchModal";

export default function DeckPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { brands: contextBrands, isSaved } = useSwatch();

  const moodsParam = searchParams.get("moods") || "";

  const [deckBrands, setDeckBrands] = useState<Brand[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // API에서 덱 브랜드 가져오기, 실패 시 context 브랜드에서 필터
  useEffect(() => {
    if (!moodsParam) {
      setDeckBrands(contextBrands);
      setLoading(false);
      return;
    }
    setLoading(true);
    getBrandsDeck(moodsParam)
      .then(({ data }) => {
        const raw = data.data ?? data;
        const cards = (raw as any).brandCards ?? raw;
        setDeckBrands(
          (cards as { brandId: number; name: string; summary: string; storySummary: string; mainImageUrl: string; instagramUrl: string | null; websiteUrl: string | null; keywords: string[]; visualPreviews: string[] }[]).map((c) => ({
            id: String(c.brandId),
            name: c.name,
            description: c.summary,
            story: c.storySummary ?? "",
            keywords: c.keywords,
            thumbnailUrl: c.mainImageUrl,
            visuals: c.visualPreviews ?? [],
            instagramUrl: c.instagramUrl ?? undefined,
            websiteUrl: c.websiteUrl ?? undefined,
          })),
        );
      })
      .catch(() => {
        // fallback: context 브랜드에서 키워드 필터
        const keywords = moodsParam.split(",");
        const filtered = contextBrands.filter((b) =>
          b.keywords.some((k) => keywords.includes(k) || keywords.includes(EN_TO_MOOD[k] || "")),
        );
        setDeckBrands(filtered.length ? filtered : contextBrands);
      })
      .finally(() => setLoading(false));
  }, [moodsParam, contextBrands]);

  const brand = deckBrands[currentIndex];

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 1500);
  }, []);

  const handleNext = () => {
    if (currentIndex < deckBrands.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      showToast("모든 브랜드를 확인했어요!");
      setTimeout(() => navigate("/board"), 1000);
    }
  };

  const handleSave = () => {
    if (!brand) return;
    if (isSaved(brand.id)) {
      showToast("이미 저장된 브랜드에요.");
      return;
    }
    setShowSaveModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
        <p className="text-sm text-[#888]">브랜드를 불러오는 중...</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[#888] mb-4">해당 무드의 브랜드가 없어요</p>
          <button onClick={() => navigate("/board")} className="text-sm underline text-[#1a1a1a]">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-28">
      <div className="max-w-md mx-auto px-5 pt-2">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <img src={swatchDeckLogo} alt="Swatch Deck" className="h-14 block" />
          <button onClick={() => navigate("/board")} className="text-xs text-[#888]">
            초기화
          </button>
        </div>

        {/* 브랜드 카드 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <img src={brand.thumbnailUrl} alt={brand.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
              <h2 className="text-2xl font-bold text-white">{brand.name}</h2>
              <p className="text-sm text-white/80 mt-1">{brand.description}</p>
            </div>
          </div>

          <div className="p-5">
            {/* 무드 태그 */}
            <div className="flex gap-1.5 mb-4">
              {brand.keywords.map((kw, i) => (
                <span key={kw}>
                  {i > 0 && <span className="text-xs text-[#ccc] mr-1.5">·</span>}
                  <span className="text-xs text-[#555]">{EN_TO_MOOD[kw] || kw}</span>
                </span>
              ))}
            </div>

            {/* 소개 */}
            <blockquote className="text-sm text-[#333] italic leading-relaxed border-l-2 border-[#e0ddd8] pl-4 mb-5">
              "{brand.story}"
            </blockquote>

            {/* BRAND VISUALS */}
            {brand.visuals.length > 0 && (
              <>
                <p className="text-[10px] font-semibold text-[#aaa] tracking-widest mb-3">BRAND VISUALS</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5">
                  {brand.visuals.map((url, i) => (
                    <div key={i} className="flex-shrink-0 w-36 aspect-square rounded-xl overflow-hidden">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 링크 */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                {brand.instagramUrl && (
                  <a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#555]">
                    <ExternalLink size={12} /> Instagram
                  </a>
                )}
                {brand.websiteUrl && (
                  <a href={brand.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#555]">
                    <ExternalLink size={12} /> Website
                  </a>
                )}
              </div>
              <button onClick={() => navigate(`/brand/${brand.id}`)} className="text-xs font-semibold text-[#1a1a1a] flex items-center gap-1">
                브랜드 노트 보기 <span>›</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-5">
        <div className="flex gap-3">
          <button onClick={handleNext} className="flex-1 py-4 rounded-2xl bg-white border border-[#e0ddd8] text-sm font-semibold text-[#1a1a1a] active:scale-95 transition-transform">
            다음 스와치
          </button>
          <button onClick={handleSave} className="flex-1 py-4 rounded-2xl bg-[#1a1a1a] text-white text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <Bookmark size={16} /> 내 스와치에 담기
          </button>
        </div>
      </div>

      {/* 토스트 */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[#1a1a1a] text-white text-sm font-medium px-5 py-3.5 rounded-full shadow-lg whitespace-nowrap">{toastMsg}</div>
        </div>
      )}

      {/* 저장 모달 */}
      {showSaveModal && brand && (
        <SaveToSwatchModal
          brand={brand}
          onClose={() => setShowSaveModal(false)}
          onSaved={() => {
            setShowSaveModal(false);
            showToast(`${brand.name}을(를) 내 스와치에 담았어요!`);
          }}
        />
      )}
    </div>
  );
}
