import { FeaturesSectionWithHoverEffects } from '@/components/ui/feature-section-with-hover-effects'
import { featureItems } from './data'

export function FeaturesSection() {
  return (
    <section className="py-16" id="features">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-[560px] mx-auto mb-5 lg:mb-16 text-center">
          <p className="inline-flex items-center gap-1.5 text-primary text-[12px] font-extrabold uppercase tracking-[0.4px] mb-3.5">
            كل اللي تحتاجه
          </p>
          <h2 className="m-0 text-[clamp(34px,4.5vw,54px)] font-extrabold leading-[1.1] tracking-[-1.8px] text-foreground">
            أدوات بسيطة،<br /><span className="text-primary">نتيجة أقوى.</span>
          </h2>
          <p className="mt-4 text-[16px] leading-[1.8] text-muted-foreground">
            كل ميزة مصممة لتوفر وقتك وتخليك تركز على التدريس.
          </p>
        </div>
        <FeaturesSectionWithHoverEffects features={featureItems} />
      </div>
    </section>
  )
}
