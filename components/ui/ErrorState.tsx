type Props = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  title = "تعذر تحميل البيانات",
  description = "حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى.",
  onRetry,
}: Props) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h3 className="font-semibold text-red-900">{title}</h3>

      <p className="mt-2 text-sm text-red-700">{description}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
