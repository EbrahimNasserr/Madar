import Link from "next/link";

type Props = {
  title: string;
  description: string;
};

export default function ProFeatureCard({ title, description }: Props) {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-lg">
        🔒
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>

      <Link
        href="/subscription"
        className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        الترقية إلى Pro
      </Link>
    </div>
  );
}
