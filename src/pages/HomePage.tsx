import { useMemo, useState } from "react";
import { Bookmark, Check, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSwatch } from "../context/SwatchContext";
import swatchingLogo from "../assets/swatching-logo.png";

const FILTERS = [
  { id: "minimal", label: "미니멀", keyword: "Minimal" },
  { id: "street", label: "스트릿", keyword: "Street" },
  { id: "vintage", label: "빈티지", keyword: "Vintage" },
  { id: "gorpcore", label: "고프코어", keyword: "Gorpcore" },
  { id: "classic", label: "클래식", keyword: "Classic" },
  { id: "feminine", label: "페미닌", keyword: "Feminine" },
  { id: "techwear", label: "테크웨어", keyword: "Techwear" },
  { id: "workwear", label: "워크웨어", keyword: "Workwear" },
  { id: "amekaji", label: "아메카지", keyword: "Amekaji" },
  { id: "accessories", label: "액세서리", keyword: "Accessories" },
] as const;

const KEYWORD_LABELS: Record<string, string> = Object.fromEntries(
  FILTERS.map(({ keyword, label }) => [keyword, label]),
);

interface FilterTileProps {
  filterId: string;
  label: string;
  active: boolean;
  className: string;
  onClick: (filterId: string) => void;
}

function FilterTile({
  filterId,
  label,
  active,
  className,
  onClick,
}: FilterTileProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      data-filter-id={filterId}
      onClick={() => onClick(filterId)}
      className={`filter-tile relative flex flex-col items-center justify-center overflow-hidden font-display font-black transition-all hover:opacity-95 active:scale-[0.98] ${className}`}
    >
      {active && (
        <span className="absolute right-2.5 top-2.5 flex size-[18px] items-center justify-center rounded-full bg-white text-black shadow-sm">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
      <span className="relative z-[1]">{label}</span>
    </button>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { brands, isSaved, saveBrand, unsaveBrand } = useSwatch();
  const [searchOpen, setSearchOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const filteredBrands = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const selectedKeywords = FILTERS.filter((filter) =>
      selectedFilters.includes(filter.id),
    ).map((filter) => filter.keyword.toLowerCase());

    return brands.filter((brand) => {
      const searchableText = [
        brand.name,
        brand.description,
        ...brand.keywords,
        ...brand.keywords.map((keyword) => KEYWORD_LABELS[keyword] ?? keyword),
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchableText.includes(normalizedSearch) &&
        selectedKeywords.every((keyword) =>
          brand.keywords.some(
            (brandKeyword) => brandKeyword.toLowerCase() === keyword,
          ),
        )
      );
    });
  }, [brands, searchTerm, selectedFilters]);

  const toggleFilter = (filterId: string) => {
    if (filterId === "all") {
      setSelectedFilters([]);
      return;
    }

    setSelectedFilters((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId],
    );
  };

  const toggleBookmark = (brandId: string) => {
    if (isSaved(brandId)) {
      unsaveBrand(brandId);
      return;
    }

    saveBrand(brandId, []);
  };

  return (
    <div className="min-h-screen bg-white text-[#1b1c1a]">
      <header className="pointer-events-none absolute left-1/2 top-0 z-50 h-[60px] w-full -translate-x-1/2 bg-transparent">
        <div className="flex h-full items-center px-5">
          <div className="relative h-14 w-[180px] overflow-hidden">
            <img
              src={swatchingLogo}
              alt="Swatching"
              className="absolute left-1/2 top-1/2 size-[180px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain brightness-105 contrast-[500%]"
            />
          </div>
          <div className="pointer-events-auto ml-auto flex items-center gap-4">
            <button
              type="button"
              aria-label="브랜드 등록"
              onClick={() => setRegisterModalOpen(true)}
              className="flex size-10 items-center justify-center rounded-full bg-white/95 text-[#47464b] shadow-sm transition-opacity hover:opacity-80"
            >
              <Plus size={28} />
            </button>
            <button
              type="button"
              aria-label={searchOpen ? "검색 닫기" : "검색 열기"}
              onClick={() => setSearchOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-full bg-white/95 text-[#47464b] shadow-sm transition-opacity hover:opacity-80"
            >
              {searchOpen ? <X size={28} /> : <Search size={27} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-3 px-4 pb-28 pt-[60px]">
        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ${
            searchOpen
              ? "mb-2 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <label className="flex items-center gap-3 rounded-full border border-[#c8c5cb]/30 bg-[#efeeea] px-4 py-2.5">
              <Search size={18} className="shrink-0 text-[#47464b]/70" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="브랜드명 또는 키워드 검색"
                className="w-full border-none bg-transparent p-0 text-sm text-[#47464b] outline-none placeholder:text-[#47464b]/60"
              />
            </label>
          </div>
        </div>

        <section
          aria-label="브랜드 무드 필터"
          className="flex flex-col gap-2 overflow-hidden rounded-[24px] bg-[#e9e8e4]"
        >
          <div className="flex h-[120px] gap-2">
            <div className="flex w-[55%] flex-col gap-2">
              <FilterTile
                filterId="all"
                label="Swatching"
                active={selectedFilters.length === 0}
                onClick={toggleFilter}
                className="h-1/2 w-full rounded-[24px] rounded-bl-none rounded-br-none rounded-tr-none bg-[#1b1b1b] text-[16px] text-white"
              />
              <div className="flex h-1/2 gap-2">
                <FilterTile
                  filterId="minimal"
                  label="미니멀"
                  active={selectedFilters.includes("minimal")}
                  onClick={toggleFilter}
                  className="w-[68%] rounded-[2px] bg-[#e3e2df] text-sm text-[#1b1c1a]"
                />
                <FilterTile
                  filterId="street"
                  label="스트릿"
                  active={selectedFilters.includes("street")}
                  onClick={toggleFilter}
                  className="w-[32%] rounded-[2px] bg-[#2a2a2a] text-sm text-white"
                />
              </div>
            </div>
            <FilterTile
              filterId="vintage"
              label="빈티지"
              active={selectedFilters.includes("vintage")}
              onClick={toggleFilter}
              className="h-full w-[45%] rounded-[24px] rounded-bl-[2px] rounded-br-none rounded-tl-none bg-[#c0a27a] text-sm text-[#1b1c1a]"
            />
          </div>

          <div className="flex h-[120px] gap-2">
            <div className="flex w-[55%] flex-col gap-2">
              <FilterTile
                filterId="gorpcore"
                label="고프코어"
                active={selectedFilters.includes("gorpcore")}
                onClick={toggleFilter}
                className="h-[55%] w-full rounded-[2px] bg-[#6d795a] text-[13px] text-white"
              />
              <div className="flex h-[45%] gap-2">
                <FilterTile
                  filterId="classic"
                  label="클래식"
                  active={selectedFilters.includes("classic")}
                  onClick={toggleFilter}
                  className="w-[60%] rounded-[2px] bg-[#c6ad8a] text-sm text-[#1b1c1a]"
                />
                <FilterTile
                  filterId="feminine"
                  label="페미닌"
                  active={selectedFilters.includes("feminine")}
                  onClick={toggleFilter}
                  className="w-[40%] rounded-[2px] bg-[#d3a8a5] text-sm text-[#1b1c1a]"
                />
              </div>
            </div>
            <FilterTile
              filterId="techwear"
              label="테크웨어"
              active={selectedFilters.includes("techwear")}
              onClick={toggleFilter}
              className="h-full w-[45%] rounded-[2px] bg-[#222532] text-sm text-white"
            />
          </div>

          <div className="flex h-[55px] gap-2">
            <FilterTile
              filterId="workwear"
              label="워크웨어"
              active={selectedFilters.includes("workwear")}
              onClick={toggleFilter}
              className="w-[40%] rounded-[8px] rounded-br-none rounded-tl-none rounded-tr-[2px] bg-[#877054] text-[13px] text-white"
            />
            <FilterTile
              filterId="amekaji"
              label="아메카지"
              active={selectedFilters.includes("amekaji")}
              onClick={toggleFilter}
              className="w-[38%] rounded-[2px] bg-[#4e5b76] text-[13px] text-white"
            />
            <FilterTile
              filterId="accessories"
              label="액세사리"
              active={selectedFilters.includes("accessories")}
              onClick={toggleFilter}
              className="w-[22%] rounded-[24px] rounded-bl-[2px] rounded-tl-[2px] rounded-tr-none bg-[#b5aba6] text-[11px] text-[#1b1c1a]"
            />
          </div>
        </section>

        {selectedFilters.length > 0 && (
          <p className="text-xs text-[#78767b]">
            선택한 무드{" "}
            <strong className="font-medium text-[#1b1c1a]">
              {FILTERS.filter((filter) =>
                selectedFilters.includes(filter.id),
              )
                .map((filter) => filter.label)
                .join(" · ")}
            </strong>
          </p>
        )}

        <section className="mt-4 flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h1 className="font-display text-xl font-extrabold tracking-tight">
              Brands
            </h1>
            <span className="text-[11px] text-[#89888e]">
              {filteredBrands.length} brands
            </span>
          </div>

          {filteredBrands.length === 0 ? (
            <div className="rounded-2xl bg-[#f5f4f0] px-5 py-14 text-center">
              <p className="text-sm font-medium text-[#47464b]">
                조건에 맞는 브랜드가 없습니다.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilters([]);
                }}
                className="mt-3 text-xs text-[#78767b] underline underline-offset-4"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              {filteredBrands.map((brand) => {
                const saved = isSaved(brand.id);
                return (
                  <article
                    key={brand.id}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#c8c5cb] bg-white transition-shadow hover:shadow-sm"
                    onClick={() => navigate(`/brand/${brand.id}`)}
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e9e8e4]">
                      {brand.thumbnailUrl ? (
                        <img
                          src={brand.thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl font-bold text-[#89888e]">
                          {brand.name.charAt(0)}
                        </div>
                      )}
                      <button
                        type="button"
                        aria-label={
                          saved ? "내 스와치에서 제거" : "내 스와치에 저장"
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleBookmark(brand.id);
                        }}
                        className="absolute right-1.5 top-1.5 z-10 flex size-8 items-center justify-center rounded-full bg-white text-[#0a0a0f] shadow-sm"
                      >
                        <Bookmark
                          size={18}
                          fill={saved ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1.5 p-3">
                      <h2 className="truncate font-display text-base font-bold leading-tight text-[#0a0a0f]">
                        {brand.name}
                      </h2>
                      <p className="line-clamp-2 text-[11px] leading-snug text-[#47464b]">
                        {brand.description}
                      </p>
                      <span className="mt-1 truncate text-[10px] text-[#47464b]">
                        {brand.keywords
                          .map((keyword) => KEYWORD_LABELS[keyword] ?? keyword)
                          .join(" · ")}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {registerModalOpen && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setRegisterModalOpen(false);
            }
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-6"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-modal-title"
            className="w-full max-w-[340px] rounded-[24px] bg-white p-8 shadow-2xl"
          >
            <h2
              id="register-modal-title"
              className="mb-3 text-lg font-bold leading-tight text-[#1b1c1a]"
            >
              브랜드 등록을 신청할까요?
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-[#47464b]/80">
              제출한 정보는 관리자 검토 후 승인되면 사용자에게 노출됩니다.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="flex-1 rounded-full bg-[#e9e8e4] py-3.5 text-sm font-bold text-[#1b1c1a]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => navigate("/brand-register")}
                className="flex-1 rounded-full bg-black py-3.5 text-sm font-bold text-white"
              >
                등록 신청하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
