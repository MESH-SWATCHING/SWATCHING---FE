import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, Clock } from "lucide-react";
import api from "../api/client";

type Status = "all" | "pending" | "approved" | "rejected";

interface Application {
  brandId: number;
  brandName: string;
  shortDesc: string;
  thumbnailUrl: string | null;
  appliedAt: string;
  applicant: string;
  status: "pending" | "approved" | "rejected";
}

function mapBackendStatus(visibility: string): "pending" | "approved" | "rejected" {
  if (visibility === "PENDING") return "pending";
  if (visibility === "PUBLIC") return "approved";
  return "rejected";
}

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeStatus, setActiveStatus] = useState<Status>("all");
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/v1/admin/brands");
      const data = res.data.data as {
        brandId: number;
        name: string;
        summary: string | null;
        mainImageUrl: string | null;
        status: string;
        createdAt: string;
        submitterNickname: string | null;
      }[];
      setApplications(
        data.map((b) => ({
          brandId: b.brandId,
          brandName: b.name,
          shortDesc: b.summary ?? "",
          thumbnailUrl: b.mainImageUrl,
          appliedAt: b.createdAt ? b.createdAt.slice(0, 10) : "",
          applicant: b.submitterNickname ?? "",
          status: mapBackendStatus(b.status),
        }))
      );
    } catch (e) {
      console.error("브랜드 목록 조회 실패", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const approve = async (brandId: number) => {
    try {
      await api.patch(`/api/v1/admin/brands/${brandId}/approve`);
      await fetchBrands();
    } catch (e) {
      console.error("승인 실패", e);
      alert("승인에 실패했습니다.");
    }
  };

  const reject = async (brandId: number) => {
    const reason = prompt("반려 사유를 입력해주세요.");
    if (!reason) return;
    try {
      await api.patch(`/api/v1/admin/brands/${brandId}/reject`, { reason });
      await fetchBrands();
    } catch (e) {
      console.error("반려 실패", e);
      alert("반려 처리에 실패했습니다.");
    }
  };

  const filtered =
    activeStatus === "all"
      ? applications
      : applications.filter((a) => a.status === activeStatus);

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-28">
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-[#1a1a1a]">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-[#1a1a1a]">브랜드 승인 관리</h1>
        </div>

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

        {loading ? (
          <p className="text-sm text-[#bbb] text-center py-20">불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-[#bbb] text-center py-20">신청 내역이 없습니다</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((app) => (
              <div key={app.brandId} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-3 mb-3">
                  {app.thumbnailUrl ? (
                    <img
                      src={app.thumbnailUrl}
                      alt={app.brandName}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#f0ede8] flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1a1a1a]">{app.brandName}</p>
                    <p className="text-xs text-[#888] mt-0.5">{app.shortDesc}</p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border mt-1.5 ${STATUS_COLOR[app.status]}`}
                    >
                      <Clock size={10} />
                      {STATUS_LABEL[app.status]}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#f0ede8] pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#aaa]">신청일: {app.appliedAt}</p>
                    <p className="text-xs text-[#aaa]">제출자: {app.applicant}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/brands/${app.brandId}`)}
                    className="flex items-center gap-1 text-xs text-[#555] font-medium"
                  >
                    <Eye size={13} /> 자세히 보기
                  </button>
                </div>

                {app.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => reject(app.brandId)}
                      className="flex-1 py-2.5 rounded-xl bg-[#f0ede8] text-[#555] text-xs font-semibold"
                    >
                      반려
                    </button>
                    <button
                      onClick={() => approve(app.brandId)}
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
