type Props = {
  cards?: number;
};

export default function PageSkeleton({ cards = 4 }: Props) {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>

      <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}
