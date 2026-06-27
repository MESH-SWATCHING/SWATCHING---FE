import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, Clock } from "lucide-react";

type Status = "all" | "pending" | "approved" | "rejected";

interface Application {
  id: string;
  brandName: string;
  shortDesc: string;
  thumbnailUrl: string;
  appliedAt: string;
  applicant: string;
  status: "pending" | "approved" | "rejected";
}

const MOCK_APPLICATIONS: Application[] = [
  {
    id: "a1",
    brandName: "ㅋㅋ",
    shortDesc: "ㅋㅋ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=200",
    appliedAt: "2026-06-27",
    applicant: "ㅋㅋ",
    status: "pending",
  },
  {
    id: "a2",
    brandName: "ㅁㄴㅇㅁ",
    shortDesc: "ㅁㅇㅇㅁㅇ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200",
    appliedAt: "2026-06-27",
    applicant: "ㅁㅇ",
    status: "pending",
  },
];

const STATUS_TABS: { id: Status; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "pending", label: "승인 대기" },
  { id: "approved", label: "승인 완료" },
  { id: "rejected", label: "반려" },
];

const STATUS_LABEL: Record<Application["status"], string> = {
  pending: "승인 대기",
  approved: "승인 완료",
  rejected: "반려",
};

const STATUS_COLOR: Record<Application["status"], string> = {
  pending: "text-[#b07d00] bg-[#fff8ec] border-[#fde8b0]",
  approved: "text-[#1a7a4a] bg-[#edfaf3] border-[#b0e8cb]",
  rejected: "text-[#c0392b] bg-[#fef0ee] border-[#f5c3be]",
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [applications, setApplications] =
    useState<Application[]>(MOCK_APPLICATIONS);
  const [activeStatus, setActiveStatus] = useState<Status>("all");

  const filtered =
    activeStatus === "all"
      ? applications
      : applications.filter((a) => a.status === activeStatus);

  const updateStatus = (id: string, status: Application["status"]) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-28">
      <div className="max-w-md mx-auto px-5 pt-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-[#1a1a1a]">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-[#1a1a1a]">브랜드 승인 관리</h1>
        </div>

        {/* 상태 탭 */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  activeStatus === tab.id
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-white text-[#555] border border-[#e0ddd8]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 신청 목록 */}
        {filtered.length === 0 ? (
          <p className="text-sm text-[#bbb] text-center py-20">
            신청 내역이 없습니다
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-3 mb-3">
                  {/* 썸네일 */}
                  <img
                    src={app.thumbnailUrl}
                    alt={app.brandName}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1a1a1a]">
                      {app.brandName}
                    </p>
                    <p className="text-xs text-[#888] mt-0.5">
                      {app.shortDesc}
                    </p>
                    {/* 상태 뱃지 */}
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border mt-1.5 ${STATUS_COLOR[app.status]}`}
                    >
                      <Clock size={10} />
                      {STATUS_LABEL[app.status]}
                    </span>
                  </div>
                </div>

                {/* 신청 정보 */}
                <div className="border-t border-[#f0ede8] pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#aaa]">
                      신청일: {app.appliedAt}
                    </p>
                    <p className="text-xs text-[#aaa]">
                      제출자: {app.applicant}
                    </p>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-[#555] font-medium">
                    <Eye size={13} /> 자세히 보기
                  </button>
                </div>

                {/* 승인 / 반려 버튼 (대기 상태만) */}
                {app.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updateStatus(app.id, "rejected")}
                      className="flex-1 py-2.5 rounded-xl bg-[#f0ede8] text-[#555] text-xs font-semibold"
                    >
                      반려
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "approved")}
                      className="flex-1 py-2.5 rounded-xl bg-[#1a1a1a] text-white text-xs font-semibold"
                    >
                      승인하기
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
