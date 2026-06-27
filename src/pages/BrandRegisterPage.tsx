import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Upload, X } from "lucide-react";
import { MOODS, MOOD_TO_EN, Mood } from "../constants/Moods";
import { submitBrand } from "../api/swatching";

interface FormState {
  name: string;
  shortDesc: string;
  story: string;
  keywords: string[];
  instagramUrl: string;
  websiteUrl: string;
  managerName: string;
  email: string;
  phone: string;
}

export default function BrandRegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    shortDesc: "",
    story: "",
    keywords: [],
    instagramUrl: "",
    websiteUrl: "",
    managerName: "",
    email: "",
    phone: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [visuals, setVisuals] = useState<File[]>([]);
  const [visualPreviews, setVisualPreviews] = useState<string[]>([]);

  const thumbnailRef = useRef<HTMLInputElement>(null);
  const visualsRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleKeyword = (kw: string) => {
    setForm((prev) => {
      const has = prev.keywords.includes(kw);
      if (!has && prev.keywords.length >= 3) return prev;
      return {
        ...prev,
        keywords: has
          ? prev.keywords.filter((k) => k !== kw)
          : [...prev.keywords, kw],
      };
    });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (thumbnailRef.current) thumbnailRef.current.value = "";
  };

  const handleVisualsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 4 - visuals.length;
    const added = files.slice(0, remaining);
    setVisuals((prev) => [...prev, ...added]);
    setVisualPreviews((prev) => [
      ...prev,
      ...added.map((f) => URL.createObjectURL(f)),
    ]);
    if (visualsRef.current) visualsRef.current.value = "";
  };

  const removeVisual = (index: number) => {
    setVisuals((prev) => prev.filter((_, i) => i !== index));
    setVisualPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid =
    form.name &&
    form.shortDesc &&
    form.instagramUrl &&
    form.managerName &&
    form.email &&
    form.phone;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    if (submitted) {
      alert("이미 신청이 완료되었습니다.");
      return;
    }
    setSubmitting(true);
    try {
      await submitBrand(
        {
          name: form.name,
          summary: form.shortDesc,
          story: form.story,
          instagramUrl: form.instagramUrl,
          websiteUrl: form.websiteUrl,
          keywords: form.keywords.map((kw) => MOOD_TO_EN[kw as Mood] ?? kw),
          managerName: form.managerName,
          email: form.email,
          phone: form.phone,
        },
        thumbnail,
        visuals
      );
      setSubmitted(true);
      alert("등록 신청이 완료되었습니다.");
      navigate("/home");
    } catch {
      alert("등록 신청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-16">
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-[#1a1a1a]">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-[#1a1a1a]">브랜드 등록</h1>
        </div>
        <p className="text-sm text-[#888] mb-8">
          신생 패션 브랜드를 스와칭에 등록해 더 많은 사용자와 연결해보세요.
        </p>

        <Field label="브랜드명" required>
          <Input
            value={form.name}
            onChange={(v) => set("name", v)}
            placeholder="브랜드명을 입력하세요"
          />
        </Field>

        <Field label="한 줄 소개" required>
          <Input
            value={form.shortDesc}
            onChange={(v) => set("shortDesc", v)}
            placeholder="브랜드를 한 문장으로 소개해주세요"
          />
        </Field>

        <Field label="브랜드 소개">
          <textarea
            value={form.story}
            onChange={(e) => set("story", e.target.value)}
            placeholder="브랜드의 방향성과 정체성을 2~4줄로 작성해주세요"
            rows={4}
            className="w-full border border-[#e0ddd8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a1a1a] transition-colors bg-white resize-none"
          />
        </Field>

        <Field label="브랜드 키워드" hint="최대 3개">
          <div className="flex flex-wrap gap-2">
            {MOODS.map((kw) => {
              const selected = form.keywords.includes(kw);
              return (
                <button
                  key={kw}
                  onClick={() => toggleKeyword(kw)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                    ${selected ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white text-[#555] border-[#e0ddd8]"}`}
                >
                  {kw}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[#aaa] mt-2">
            {form.keywords.length}개 선택됨
          </p>
        </Field>

        <Field label="공식 Instagram URL" required>
          <Input
            value={form.instagramUrl}
            onChange={(v) => set("instagramUrl", v)}
            placeholder="https://instagram.com/..."
          />
        </Field>

        <Field label="공식 Website URL">
          <Input
            value={form.websiteUrl}
            onChange={(v) => set("websiteUrl", v)}
            placeholder="https://..."
          />
        </Field>

        {/* 이미지 업로드 */}
        <Field label="대표 이미지 및 Brand Visuals">
          <p className="text-xs text-[#888] mb-2">대표 이미지 (1장)</p>
          {thumbnailPreview ? (
            <div className="relative w-full h-56 rounded-xl overflow-hidden mb-3 bg-[#f3f1ec]">
              <img
                src={thumbnailPreview}
                alt="대표이미지"
                className="w-full h-full object-contain"
              />
              <button
                onClick={removeThumbnail}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => thumbnailRef.current?.click()}
              className="w-full h-36 border border-dashed border-[#ccc] rounded-xl flex flex-col items-center justify-center gap-2 bg-white mb-3 hover:border-[#1a1a1a] transition-colors"
            >
              <Upload size={20} className="text-[#bbb]" />
              <p className="text-xs text-[#aaa]">클릭해서 대표 이미지 업로드</p>
            </button>
          )}
          <input
            ref={thumbnailRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnailChange}
          />

          <p className="text-xs text-[#888] mb-2">Brand Visuals (최대 4장)</p>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {visualPreviews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={src}
                  alt={`visual-${i}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeVisual(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {visuals.length < 4 && (
              <button
                onClick={() => visualsRef.current?.click()}
                className="aspect-square rounded-lg border border-dashed border-[#ccc] flex items-center justify-center bg-white hover:border-[#1a1a1a] transition-colors"
              >
                <Upload size={16} className="text-[#bbb]" />
              </button>
            )}
          </div>
          <input
            ref={visualsRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleVisualsChange}
          />
          <p className="text-xs text-[#ccc]">{visuals.length}/4장 선택됨</p>
        </Field>

        <p className="text-sm font-semibold text-[#1a1a1a] mb-4 mt-2">
          운영자 정보
        </p>
        <Field label="담당자명" required>
          <Input
            value={form.managerName}
            onChange={(v) => set("managerName", v)}
            placeholder="이름"
          />
        </Field>
        <Field label="이메일" required>
          <Input
            value={form.email}
            onChange={(v) => set("email", v)}
            placeholder="email@example.com"
          />
        </Field>
        <Field label="연락처" required>
          <Input
            value={form.phone}
            onChange={(v) => set("phone", v)}
            placeholder="010-0000-0000"
          />
        </Field>

        <div className="bg-[#fff8ec] border border-[#fde8b0] rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-[#b07d00] leading-relaxed">
            ⓘ 제출 후 관리자의 승인 과정을 거쳐 노출됩니다. 승인 전까지는
            공개되지 않습니다.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className={`w-full py-4 rounded-2xl text-sm font-semibold transition-colors mb-4
            ${isValid && !submitting ? "bg-[#1a1a1a] text-white" : "bg-[#e0ddd8] text-[#aaa]"}`}
        >
          {submitting ? "신청 중..." : "등록 신청하기"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="text-sm font-medium text-[#1a1a1a] mb-2 flex items-center gap-1 block">
        {label}
        {required && <span className="text-[#e03131]">*</span>}
        {hint && (
          <span className="text-xs text-[#aaa] font-normal ml-1">({hint})</span>
        )}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-[#e0ddd8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a1a1a] transition-colors bg-white"
    />
  );
}
