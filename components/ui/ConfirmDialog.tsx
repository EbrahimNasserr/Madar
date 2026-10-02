"use client";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  loading = false,
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !loading && onCancel()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" dir="rtl">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>

        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={[
              "rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50",
              destructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-slate-950 hover:bg-slate-800",
            ].join(" ")}
          >
            {loading ? "جارٍ التنفيذ..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
