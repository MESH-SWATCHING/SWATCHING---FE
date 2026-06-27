interface DeleteCategoryModalProps {
  categoryName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteCategoryModal({
  categoryName,
  onConfirm,
  onCancel,
}: DeleteCategoryModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl z-10 px-6 pt-8 pb-6 animate-slide-up">
        <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">
          카테고리를 삭제할까요?
        </h3>
        <p className="text-sm text-[#888] leading-relaxed mb-6">
          "{categoryName}" 카테고리가 삭제됩니다. 브랜드는 삭제되지 않고 전체에
          그대로 남아있어요.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl bg-[#f0ede8] text-[#555] text-sm font-semibold"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 rounded-2xl bg-[#e03131] text-white text-sm font-semibold"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
