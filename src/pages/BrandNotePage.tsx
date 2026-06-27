import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Circle,
  ExternalLink,
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSwatch } from "../context/SwatchContext";
import { getBrandDetail } from "../api/swatching";

const KEYWORD_LABELS: Record<string, string> = {
  Minimal: "미니멀",
  Street: "스트릿",
  Vintage: "빈티지",
  Gorpcore: "고프코어",
  Classic: "클래식",
  Feminine: "페미닌",
  Techwear: "테크웨어",
  Workwear: "워크웨어",
  Amekaji: "아메카지",
  Accessories: "액세서리",
};

export default function BrandNotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    brands,
    categories,
    savedBrands,
    isSaved,
    saveBrand,
    addCategory,
  } = useSwatch();
  const baseBrand = brands.find((item) => item.id === id);
  const [detail, setDetail] = useState<{ story: string; visuals: string[] } | null>(null);
  const savedBrand = savedBrands.find((item) => item.brandId === id);

  useEffect(() => {
    if (!id) return;
    getBrandDetail(id)
      .then((res) => {
        const d = res.data?.data ?? res.data;
        setDetail({ story: d.story ?? "", visuals: d.visuals ?? [] });
      })
      .catch(() => setDetail({ story: "", visuals: [] }));
  }, [id]);

  const brand = baseBrand ? { ...baseBrand, story: detail?.story ?? "", visuals: detail?.visuals ?? [] } : undefined;
  const [bookmarkModalOpen, setBookmarkModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const visualScrollerRef = useRef<HTMLDivElement>(null);
  const visualDragRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });

  const visualUrls = brand?.visuals ?? [];

  const similarBrands = brand
    ? brands
        .filter(
          (item) =>
            item.id !== brand.id &&
            item.keywords.some((keyword) => brand.keywords.includes(keyword)),
        )
        .slice(0, 2)
    : [];

  useEffect(() => {
    document.title = brand
      ? `${brand.name} | Swatching`
      : "Brand Note | Swatching";

    return () => {
      document.title = "Swatching - Discover";
    };
  }, [brand]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  if (!brand) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f5] px-5 text-center">
        <h1 className="font-display text-xl font-bold">
          브랜드를 찾을 수 없습니다.
        </h1>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 text-sm underline underline-offset-4"
        >
          홈으로 돌아가기
        </button>
      </main>
    );
  }

  const openBookmarkModal = () => {
    setSelectedCategories(
      savedBrand?.categoryIds.filter((categoryId) => categoryId !== "all") ??
        [],
    );
    setBookmarkModalOpen(true);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  const createCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    addCategory(name);
    setNewCategoryName("");
    setNewCategoryOpen(false);
  };

  const handleSave = () => {
    saveBrand(brand.id, selectedCategories);
    setBookmarkModalOpen(false);
    toast(`${brand.name}을(를) My Swatch에 담았어요.`);
  };

  const startVisualDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = visualScrollerRef.current;
    if (!scroller) return;

    visualDragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
    };
    scroller.setPointerCapture(event.pointerId);
  };

  const moveVisualDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = visualScrollerRef.current;
    const drag = visualDragRef.current;
    if (!scroller || !drag.active) return;

    event.preventDefault();
    scroller.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
  };

  const endVisualDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = visualScrollerRef.current;
    visualDragRef.current.active = false;

    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#1b1c1a]">
      <nav className="pointer-events-none fixed left-1/2 top-0 z-50 flex h-14 w-full max-w-[430px] -translate-x-1/2 items-center justify-between px-5 pt-2">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => navigate(-1)}
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-[#f5f4f0]/95 text-[#1b1c1a] shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        >
          <ArrowLeft size={21} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          aria-label="내 스와치에 담기"
          onClick={openBookmarkModal}
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-[#f5f4f0]/95 text-[#1b1c1a] shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        >
          <Bookmark
            size={20}
            strokeWidth={1.8}
            fill={isSaved(brand.id) ? "currentColor" : "none"}
          />
        </button>
      </nav>

      <main className="mx-auto max-w-2xl pb-8">
        <section className="brand-note-section px-5 pt-8">
          <div className="relative mt-8 aspect-[4/5] w-full overflow-hidden rounded-[32px] bg-[#e9e8e4]">
            {brand.thumbnailUrl ? (
              <img
                src={brand.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-7xl font-bold text-[#89888e]">
                {brand.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-5 right-5 text-white">
              <h1 className="font-display text-xl font-extrabold">
                {brand.name}
              </h1>
              <p className="mb-3 mt-2 text-sm font-bold leading-[20px] text-white/90">
                {brand.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {brand.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wide backdrop-blur-md"
                  >
                    {KEYWORD_LABELS[keyword] ?? keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="brand-note-section mt-8 px-5">
          <h2 className="font-display text-base font-bold tracking-wide">
            Brand Story
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#47464b]">
            {brand.story}
          </p>
        </section>

        <section className="brand-note-section mt-8">
          <div className="mb-2 flex items-end justify-between px-5">
            <h2 className="font-display text-base font-bold tracking-wide">
              Brand Visuals
            </h2>
          </div>
          <div
            ref={visualScrollerRef}
            onPointerDown={startVisualDrag}
            onPointerMove={moveVisualDrag}
            onPointerUp={endVisualDrag}
            onPointerCancel={endVisualDrag}
            className="flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto px-5 select-none touch-pan-y active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {visualUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="aspect-[3/4] w-64 flex-none snap-center overflow-hidden rounded-xl border border-[#c8c5cb]"
              >
                <img
                  src={url}
                  alt={`${brand.name} visual ${index + 1}`}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="brand-note-section mt-8 flex flex-col gap-2 px-5">
          {brand.instagramUrl && (
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-[#0a0a0f] text-[11px] font-bold tracking-wide transition-colors hover:bg-[#efeeea]"
            >
              <ExternalLink size={18} />
              Instagram
            </a>
          )}
          {brand.websiteUrl && (
            <a
              href={brand.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-[#c8c5cb] text-[11px] font-bold tracking-wide text-[#47464b] transition-colors hover:bg-[#efeeea]"
            >
              <ExternalLink size={18} />
              Website
            </a>
          )}
        </section>

        {similarBrands.length > 0 && (
          <section className="brand-note-section mt-8 px-5">
            <h2 className="mb-4 font-display text-base font-bold tracking-wide">
              비슷한 키워드의 브랜드
            </h2>
            <div className="space-y-3">
              {similarBrands.map((similarBrand) => (
                <button
                  key={similarBrand.id}
                  type="button"
                  onClick={() => navigate(`/brand/${similarBrand.id}`)}
                  className="group flex w-full items-center rounded-2xl border border-[#c8c5cb] bg-white p-3 text-left transition-colors hover:border-[#0a0a0f]"
                >
                  <div className="size-24 flex-none overflow-hidden rounded-xl bg-[#e9e8e4]">
                    <img
                      src={similarBrand.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <h3 className="truncate font-display text-sm font-bold">
                      {similarBrand.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-[#47464b]">
                      {similarBrand.description}
                    </p>
                    <p className="mt-2 truncate text-[10px] font-medium text-[#78767b]">
                      {similarBrand.keywords
                        .map((keyword) => KEYWORD_LABELS[keyword] ?? keyword)
                        .join(" · ")}
                    </p>
                  </div>
                  <ChevronRight
                    size={20}
                    className="ml-2 text-[#c8c5cb] transition-colors group-hover:text-[#0a0a0f]"
                  />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {bookmarkModalOpen && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setBookmarkModalOpen(false);
            }
          }}
          className="fixed inset-0 z-[60] flex items-end bg-black/40"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookmark-modal-title"
            className="mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-[32px] bg-[#faf9f5] p-5 pb-10"
          >
            <div className="mx-auto mb-8 h-1.5 w-12 rounded-full bg-[#e3e2df]" />
            <h2
              id="bookmark-modal-title"
              className="font-display text-xl font-extrabold"
            >
              내 스와치에 담기
            </h2>
            <p className="mb-8 mt-1 text-sm text-[#47464b]">
              어떤 카테고리에 추가할까요?
            </p>

            <div className="mb-8 flex items-center gap-4 rounded-2xl bg-[#f5f4f0] p-3">
              <div className="size-16 overflow-hidden rounded-xl">
                <img
                  src={brand.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-display text-base font-bold">
                {brand.name}
              </span>
            </div>

            <div className="mb-8 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-[#e9e8e4] p-4">
                <span className="text-base font-bold">전체</span>
                <CheckCircle2 size={24} />
              </div>
              {categories
                .filter((category) => !category.isDefault)
                .map((category) => {
                  const selected = selectedCategories.includes(category.id);
                  return (
                    <button
                      type="button"
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`flex w-full items-center justify-between rounded-xl p-4 text-left ${
                        selected ? "bg-[#e9e8e4]" : ""
                      }`}
                    >
                      <span className="text-base font-bold">
                        {category.name}
                      </span>
                      {selected ? (
                        <CheckCircle2 size={24} />
                      ) : (
                        <Circle size={24} className="text-[#c8c5cb]" />
                      )}
                    </button>
                  );
                })}
            </div>

            {newCategoryOpen ? (
              <div className="mb-8 flex gap-2">
                <input
                  autoFocus
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") createCategory();
                  }}
                  placeholder="카테고리 이름"
                  className="min-w-0 flex-1 rounded-xl border border-[#c8c5cb] bg-white px-4 py-3 text-sm outline-none focus:border-[#0a0a0f]"
                />
                <button
                  type="button"
                  onClick={createCategory}
                  className="rounded-xl bg-[#212126] px-4 text-sm font-bold text-white"
                >
                  만들기
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setNewCategoryOpen(true)}
                className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c8c5cb] py-4 text-sm font-bold text-[#47464b]"
              >
                <Plus size={20} />
                새 카테고리 만들기
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="h-14 w-full rounded-full bg-[#0a0a0f] text-base font-bold text-white transition-transform active:scale-95"
            >
              저장 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
