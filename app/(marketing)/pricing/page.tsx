import type { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";

export const metadata: Metadata = {
  title: "الأسعار",
  description:
    "اختار الخطة المناسبة لطريقة شغلك مع مدار. سواء مدرس منفرد أو مركز تعليمي — في خطة مناسبة لكل حالة.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "الأسعار | مدار",
    description:
      "اختار الخطة المناسبة لطريقة شغلك مع مدار. ابدأ مجانًا بدون بطاقة ائتمان.",
    url: "https://madar-edu.vercel.app/pricing",
    type: "website",
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
