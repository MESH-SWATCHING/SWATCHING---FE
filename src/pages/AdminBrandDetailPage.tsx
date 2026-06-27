import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_BRAND = {
  name: "브랜드명",
  shortDesc: "한줄소개",
  story: "소개입니다 소개소개",
  keywords: ["아메카지", "클래식"],
  contact: "010-0000-0000",
  instagramUrl: "#",
  websiteUrl: "#",
  appliedAt: "2026-06-27",
  applicant: "운영자명",
  status: "승인 대기",
  thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEMJNz5c8fiXe4hIUMMQhhjdzHXaXMM1D1J3UfpE7lY_jgd-A8zU28L6fpgLzPm8LJvc5BXw1DVIIfkqbRtHaPLYwizqBlQBB_sC7RCCDHj1wlqg2DdOO2iI9LOXxw0LyC_gT7QXf4TL4SXH4Cf9hlLXD-eFymT57ZFSAlfKv4wpvYDXUkKvtm7WxG_eOAgU7qmPhDAOK9COcS8dO7sxvsnEBYFFrVf0FIHTUMuBE3fLpouYrWMByup5eMudGTv6JXzDyUlYhhiAM",
  visuals: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCEMJNz5c8fiXe4hIUMMQhhjdzHXaXMM1D1J3UfpE7lY_jgd-A8zU28L6fpgLzPm8LJvc5BXw1DVIIfkqbRtHaPLYwizqBlQBB_sC7RCCDHj1wlqg2DdOO2iI9LOXxw0LyC_gT7QXf4TL4SXH4Cf9hlLXD-eFymT57ZFSAlfKv4wpvYDXUkKvtm7WxG_eOAgU7qmPhDAOK9COcS8dO7sxvsnEBYFFrVf0FIHTUMuBE3fLpouYrWMByup5eMudGTv6JXzDyUlYhhiAM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCEMJNz5c8fiXe4hIUMMQhhjdzHXaXMM1D1J3UfpE7lY_jgd-A8zU28L6fpgLzPm8LJvc5BXw1DVIIfkqbRtHaPLYwizqBlQBB_sC7RCCDHj1wlqg2DdOO2iI9LOXxw0LyC_gT7QXf4TL4SXH4Cf9hlLXD-eFymT57ZFSAlfKv4wpvYDXUkKvtm7WxG_eOAgU7qmPhDAOK9COcS8dO7sxvsnEBYFFrVf0FIHTUMuBE3fLpouYrWMByup5eMudGTv6JXzDyUlYhhiAM",
  ],
};

export default function AdminBrandDetailPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  return (
    <div className="bg-[#faf9f5] text-[#1b1c1a] antialiased min-h-screen pb-20">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-[#faf9f5] flex justify-between items-center w-full px-5 h-16">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:opacity-80 transition-opacity active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="p-2 -mr-2 hover:opacity-80 transition-opacity active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
          </svg>
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-5 pt-4 pb-8">
        <h2 className="text-[24px] font-extrabold tracking-tight mb-6">브랜드 승인 관리</h2>

        {/* Filter Tabs */}
        <nav className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {["전체", "승인 대기", "승인 완료", "반려"].map((tab, i) => (
            <button
              key={tab}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                i === 0 ? "bg-[#0a0a0f] text-white" : "bg-[#e9e8e4] text-[#47464b] hover:bg-[#e3e2df]"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Detail Card */}
        <article className="bg-white border border-[#c8c5cb]/50 rounded-3xl overflow-hidden shadow-sm">
          {/* Brand Summary */}
          <div className="p-5 pb-4">
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden bg-[#efeeea]">
                <img src={MOCK_BRAND.thumbnailUrl} alt="Brand Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-[16px] font-bold text-[#0a0a0f] mb-1">{MOCK_BRAND.name}</h3>
                <p className="text-[12px] text-[#47464b]">{MOCK_BRAND.shortDesc}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF3E0] text-[#E65100] text-[10px] font-bold">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" fillRule="evenodd" />
                </svg>
                {MOCK_BRAND.status}
              </span>
              <div className="flex flex-col gap-3 items-end">
                <button className="text-[13px] font-bold text-[#0a0a0f] hover:opacity-80">브랜드 노트 보기</button>
                <button className="text-[13px] font-bold text-[#0a0a0f] hover:opacity-80 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path clipRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.827 2.47 9.336 6.404a1.651 1.651 0 010 1.186A10.004 10.004 0 0110 17c-4.257 0-7.827-2.47-9.336-6.404zM10 15a5 5 0 100-10 5 5 0 000 10z" fillRule="evenodd" />
                  </svg>
                  신청 내용 보기
                </button>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="px-5 pb-5 flex flex-col gap-1 text-[12px] text-[#78767b]">
            <p>신청일: {MOCK_BRAND.appliedAt}</p>
            <p>제출자: {MOCK_BRAND.applicant}</p>
          </div>

          <hr className="border-[#c8c5cb]/30 mx-5" />

          {/* Detailed Info */}
          <div className="p-5 space-y-6">
            <h4 className="text-[14px] text-[#78767b] font-medium">상세 정보</h4>
            <div>
              <h5 className="text-[12px] text-[#78767b] mb-2">브랜드 소개</h5>
              <p className="text-[15px] leading-relaxed font-medium">{MOCK_BRAND.story}</p>
            </div>
            <div>
              <h5 className="text-[12px] text-[#78767b] mb-2">키워드</h5>
              <p className="text-[15px] leading-relaxed font-medium">{MOCK_BRAND.keywords.join(" · ")}</p>
            </div>
            <div>
              <h5 className="text-[12px] text-[#78767b] mb-3">대표 이미지 및 Brand Visuals</h5>
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {MOCK_BRAND.visuals.map((url, i) => (
                  <div key={i} className="w-[88px] h-[88px] rounded-2xl overflow-hidden flex-shrink-0 bg-[#efeeea]">
                    <img src={url} alt={`visual ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-[12px] text-[#78767b] mb-2">연락처</h5>
              <p className="text-[15px] leading-relaxed font-medium">{MOCK_BRAND.contact}</p>
            </div>
            <div>
              <h5 className="text-[12px] text-[#78767b] mb-3">링크</h5>
              <div className="flex flex-col gap-3">
                <a href={MOCK_BRAND.instagramUrl} className="inline-flex items-center gap-2 text-[15px] font-medium hover:text-[#0a0a0f] transition-colors w-fit">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Instagram
                </a>
                <a href={MOCK_BRAND.websiteUrl} className="inline-flex items-center gap-2 text-[15px] font-medium hover:text-[#0a0a0f] transition-colors w-fit">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Website
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-5 flex gap-3 rounded-b-3xl">
            <button className="flex-1 py-3.5 px-4 bg-[#4CAF50] text-white rounded-[20px] text-[14px] font-bold hover:bg-[#43A047] transition-colors shadow-sm">
              승인하기
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 py-3.5 px-4 bg-white text-[#D32F2F] border-2 border-[#D32F2F] rounded-[20px] text-[14px] font-bold hover:bg-[#FEE2E2]/10 transition-colors"
            >
              반려하기
            </button>
          </div>
        </article>
      </main>

      {/* Rejection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white w-full max-w-[340px] rounded-3xl p-6 shadow-xl">
            <h3 className="text-[18px] font-bold mb-4">반려 사유를 입력하세요</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full h-32 bg-[#efeeea] border-none rounded-2xl p-4 text-[14px] placeholder:text-[#c8c5cb] mb-6 resize-none outline-none"
              placeholder="예: 정보 부족 / 이미지 보완 필요 / 공식 계정 확인 필요"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-3.5 bg-[#efeeea] text-[#1b1c1a] font-bold rounded-full hover:bg-[#e3e2df] transition-colors"
              >
                취소
              </button>
              <button className="flex-1 py-3.5 bg-[#c8c5cb] text-white font-bold rounded-full hover:opacity-90 transition-opacity">
                반려
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
