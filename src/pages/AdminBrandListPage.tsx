import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type FilterStatus = "전체" | "승인 대기" | "승인 완료" | "반려";

const STATUS_BADGE: Record<string, { bg: string; text: string; icon: ReactNode; label: string }> = {
  pending: {
    bg: "bg-[#FFF5E0]", text: "text-[#D97706]", label: "승인 대기",
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" fillRule="evenodd" />
      </svg>
    ),
  },
  approved: {
    bg: "bg-[#DCFCE7]", text: "text-[#16A34A]", label: "승인 완료",
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" fillRule="evenodd" />
      </svg>
    ),
  },
  rejected: {
    bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", label: "반려",
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" fillRule="evenodd" />
      </svg>
    ),
  },
};

const MOCK_LIST = [
  { id: "1", brandName: "브랜드명", shortDesc: "한줄소개", appliedAt: "2026-06-27", applicant: "운영자명", status: "pending" as const, thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvmW7I-81uvM9_1IX0ieaEW030vMzdM0TbduQdse_RzZgT4xHAKGTzYtTFHKA62HLCi5SjoikkFNdTT3tLSFlKZ5sRtUlFAr89GKmtEZHN6CbN5Ynm3538I0DDZ95wONiFvWSVJ2LDzuH8cc9e3NQw6wMEvh1DO1k3Mf_PeyYtQWQpU4R-TjNV7nCtOT85gqbuEgWuUOpPI4atEOHxleW3Y_L0XXGZQrm1EzM4s-15ryklLAMsflbImmCc3AxT5wYnZHG93bNlTds" },
  { id: "2", brandName: "브랜드명", shortDesc: "한줄소개", appliedAt: "2026-06-27", applicant: "운영자명", status: "rejected" as const, thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqCrZ59mFAZopmrVL7iq-u3GPX5BdJk4ViZsudCAtcumbMyeOAImFOl1QgUOo1NhMcoybsdF2Cc7aqNX3L4vM60rmrngzUpdmEYpiTlW1VcyHhw3kJt9tueCSTL959OHKcMMCH5tplryj2x9PDvsB0FRAESdn2Z6pYfB7qbnvxX73DUBRkLNro43iNxV3litCwf9H-zNpZVTeKvtdb-8gG1-VG9mDZ_dmpEu0jgLpfIWsxbgY9AUwhudVU7krjaKozsz1Vz5Cp3S4" },
  { id: "3", brandName: "브랜드명", shortDesc: "한줄소개", appliedAt: "2026-06-27", applicant: "운영자명", status: "approved" as const, thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD5TmppTsVLI9MD5r-WZGj-66_56eAFPJaBMKL8crEI9XjPoZCkJT2MbGSDoZ43ja0E6_2lohwyKNYYcALMWB9OtNlI2sUPj8g3plc0nhCIabXfHXpP_B2fYJ-rdcE6_F-GqLJo_Eh0nLW6znllJ42JjXe7bl4NGnLY7fCueLmhnJl-baji324Cd5z8vpR9W7gclKtIY--_665nN-P1Ro80F_ftUCw1L97EJgE4Bb4kB4-Vk0vFe8fLPopOL7bhfxwBZBbHJnzong" },
];

const FILTERS: FilterStatus[] = ["전체", "승인 대기", "승인 완료", "반려"];
const STATUS_MAP: Record<FilterStatus, string | null> = {
  "전체": null, "승인 대기": "pending", "승인 완료": "approved", "반려": "rejected",
};

export default function AdminBrandListPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("전체");

  const filtered = MOCK_LIST.filter(
    (item) => STATUS_MAP[activeFilter] === null || item.status === STATUS_MAP[activeFilter]
  );

  return (
    <div className="bg-[#faf9f5] text-[#212126] min-h-screen antialiased">
      <main className="max-w-[375px] mx-auto min-h-screen bg-[#faf9f5] px-5 py-8 flex flex-col gap-6">
        <header>
          <h1 className="text-[22px] font-bold leading-tight tracking-tight">브랜드 승인 관리</h1>
        </header>

        <nav className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors ${
                activeFilter === f
                  ? "bg-[#212126] text-white"
                  : "bg-[#f5f4f0] text-[#212126] hover:bg-[#dbdad6]"
              }`}
            >
              {f}
            </button>
          ))}
        </nav>

        <section className="flex flex-col gap-4">
          {filtered.map((item) => {
            const badge = STATUS_BADGE[item.status];
            return (
              <article key={item.id} className="bg-white rounded-[20px] p-4 border border-[#c8c5cb]/40 shadow-sm flex flex-col">
                <div className="flex gap-4">
                  <img src={item.thumbnailUrl} alt="Brand Logo" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                  <div className="flex flex-col flex-1 gap-1 py-0.5">
                    <h2 className="text-base font-bold leading-tight">{item.brandName}</h2>
                    <p className="text-[13px] text-[#535352] leading-snug">{item.shortDesc}</p>
                    <div className="mt-1.5">
                      <span className={`inline-flex items-center gap-1 ${badge.bg} ${badge.text} px-2.5 py-1 rounded-full text-xs font-semibold`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-between items-end">
                  <div className="flex flex-col text-[12px] text-[#A3A3A3] gap-1">
                    <span>신청일: {item.appliedAt}</span>
                    <span>제출자: {item.applicant}</span>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button className="text-[13px] font-bold text-[#212126] hover:underline underline-offset-2">
                      브랜드 노트 보기
                    </button>
                    <button
                      onClick={() => navigate(`/admin/brands/${item.id}`)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#212126] hover:underline underline-offset-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                        <path clipRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.827 2.47 9.336 6.404a1.651 1.651 0 010 1.186A10.004 10.004 0 0110 17c-4.257 0-7.827-2.47-9.336-6.404zM10 15a5 5 0 100-10 5 5 0 000 10z" fillRule="evenodd" />
                      </svg>
                      신청 내용 보기
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
