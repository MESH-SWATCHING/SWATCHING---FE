import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

interface BrandDetail {
  brandId: number;
  name: string;
  summary: string | null;
  mainImageUrl: string | null;
  status: string;
  rejectReason: string | null;
  createdAt: string;
  submitterNickname: string | null;
  managerName: string | null;
  managerEmail: string | null;
  managerPhone: string | null;
  instagramUrl: string | null;
  websiteUrl: string | null;
}

function statusLabel(status: string) {
  if (status === "PENDING") return "승인 대기";
  if (status === "PUBLIC") return "승인 완료";
  return "반려";
}

export default function AdminBrandDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [brand, setBrand] = useState<BrandDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    api.get(`/api/v1/admin/brands/${id}`)
      .then((res) => setBrand(res.data.data))
      .catch((e) => {
        console.error("브랜드 조회 실패", e);
        alert("브랜드 정보를 불러오지 못했습니다.");
        navigate(-1);
      });
  }, [id]);

  const approve = async () => {
    try {
      await api.patch(`/api/v1/admin/brands/${id}/approve`);
      alert("승인이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      console.error("승인 실패", e);
      alert("승인에 실패했습니다.");
    }
  };

  const reject = async () => {
    if (!rejectReason.trim()) {
      alert("반려 사유를 입력해주세요.");
      return;
    }
    try {
      await api.patch(`/api/v1/admin/brands/${id}/reject`, { reason: rejectReason });
      alert("반려 처리되었습니다.");
      navigate(-1);
    } catch (e) {
      console.error("반려 실패", e);
      alert("반려 처리에 실패했습니다.");
    }
  };

  if (!brand) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <p className="text-sm text-[#aaa]">불러오는 중...</p>
      </div>
    );
  }

  const isPending = brand.status === "PENDING";

  return (
    <div className="bg-[#faf9f5] text-[#1b1c1a] antialiased min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[#faf9f5] flex justify-between items-center w-full px-5 h-16">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:opacity-80 transition-opacity">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-5 pt-4 pb-8">
        <h2 className="text-[24px] font-extrabold tracking-tight mb-6">브랜드 승인 관리</h2>

        <article className="bg-white border border-[#c8c5cb]/50 rounded-3xl overflow-hidden shadow-sm">
          {/* Brand Summary */}
          <div className="p-5 pb-4">
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden bg-[#efeeea]">
                {brand.mainImageUrl && (
                  <img src={brand.mainImageUrl} alt="Brand Logo" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-[16px] font-bold text-[#0a0a0f] mb-1">{brand.name}</h3>
                <p className="text-[12px] text-[#47464b]">{brand.summary}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF3E0] text-[#E65100] text-[10px] font-bold">
              {statusLabel(brand.status)}
            </span>
          </div>

          <div className="px-5 pb-5 flex flex-col gap-1 text-[12px] text-[#78767b]">
            <p>신청일: {brand.createdAt?.slice(0, 10)}</p>
            <p>제출자: {brand.submitterNickname}</p>
          </div>

          <hr className="border-[#c8c5cb]/30 mx-5" />

          <div className="p-5 space-y-6">
            <h4 className="text-[14px] text-[#78767b] font-medium">상세 정보</h4>

            {brand.managerName && (
              <div>
                <h5 className="text-[12px] text-[#78767b] mb-2">담당자</h5>
                <p className="text-[15px] font-medium">{brand.managerName}</p>
                {brand.managerEmail && <p className="text-[13px] text-[#78767b]">{brand.managerEmail}</p>}
              </div>
            )}

            {brand.managerPhone && (
              <div>
                <h5 className="text-[12px] text-[#78767b] mb-2">연락처</h5>
                <p className="text-[15px] font-medium">{brand.managerPhone}</p>
              </div>
            )}

            {(brand.instagramUrl || brand.websiteUrl) && (
              <div>
                <h5 className="text-[12px] text-[#78767b] mb-3">링크</h5>
                <div className="flex flex-col gap-3">
                  {brand.instagramUrl && (
                    <a href={brand.instagramUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[15px] font-medium hover:text-[#0a0a0f] transition-colors w-fit">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Instagram
                    </a>
                  )}
                  {brand.websiteUrl && (
                    <a href={brand.websiteUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[15px] font-medium hover:text-[#0a0a0f] transition-colors w-fit">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}

            {brand.rejectReason && (
              <div>
                <h5 className="text-[12px] text-[#78767b] mb-2">반려 사유</h5>
                <p className="text-[15px] font-medium text-[#D32F2F]">{brand.rejectReason}</p>
              </div>
            )}
          </div>

          {isPending && (
            <div className="p-5 flex gap-3 rounded-b-3xl">
              <button
                onClick={approve}
                className="flex-1 py-3.5 px-4 bg-[#4CAF50] text-white rounded-[20px] text-[14px] font-bold hover:bg-[#43A047] transition-colors shadow-sm"
              >
                승인하기
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="flex-1 py-3.5 px-4 bg-white text-[#D32F2F] border-2 border-[#D32F2F] rounded-[20px] text-[14px] font-bold hover:bg-[#FEE2E2]/10 transition-colors"
              >
                반려하기
              </button>
            </div>
          )}
        </article>
      </main>

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
              <button
                onClick={reject}
                className="flex-1 py-3.5 bg-[#D32F2F] text-white font-bold rounded-full hover:opacity-90 transition-opacity"
              >
                반려
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
