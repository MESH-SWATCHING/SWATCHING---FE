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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl px-6 py-7 w-[280px] shadow-xl">
        <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
          카테고리를 삭제할까요?
        </h3>
        <p className="text-sm text-[#888] leading-relaxed mb-6">
          &quot;{categoryName}&quot;에 담긴 브랜드는 삭제되지 않고
          <br />
          전체에 그대로 남아있어요.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-[#f0ede8] text-[#555] text-sm font-medium"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[#e03131] text-white text-sm font-medium"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
