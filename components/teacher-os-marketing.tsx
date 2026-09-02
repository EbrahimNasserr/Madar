import { Navbar }                  from '@/components/marketing/navbar'
import { Hero }                    from '@/components/marketing/hero'
import { LogoStrip }               from '@/components/marketing/logo-strip'
import { FeaturesSection }         from '@/components/marketing/features-section'
import { ProblemSection }          from '@/components/marketing/problem-section'
import { HowItWorksTimeline }      from '@/components/marketing/workflow-section'
import { AttendanceSpotlight }     from '@/components/marketing/attendance-feature'
import { PaymentSpotlight }        from '@/components/marketing/payments-feature'
import { GroupSpotlight }          from '@/components/marketing/groups-section'
import { StudentProfileSpotlight } from '@/components/marketing/students-spotlight'
import { ProFeatureSection }       from '@/components/marketing/pro-section'
import { PricingSection }          from '@/components/marketing/pricing-section'
import { TestimonialsSection }     from '@/components/marketing/testimonials-section'
import { FaqSection }              from '@/components/marketing/faq-section'
import { CtaSection }              from '@/components/marketing/cta-section'
import { Footer }                  from '@/components/marketing/footer'

interface MadarMarketingProps {
  pricing?: boolean
}

export default function MadarMarketing({ pricing = false }: MadarMarketingProps) {
  return (
    <div className="bg-background text-foreground font-arabic" dir="rtl">
      <Navbar />

      {pricing ? (
        <main>
          <section className="pt-24 pb-8 text-center">
            <div className="max-w-[1180px] mx-auto px-7">
              <p className="inline-flex items-center justify-center gap-1.5 text-primary text-[12px] font-extrabold uppercase tracking-[0.4px] mb-3.5">
                خطتك تبدأ هنا
              </p>
              <h1 className="m-0 text-[clamp(42px,6vw,68px)] font-extrabold leading-[1.07] tracking-[-2.2px] text-foreground">
                اختار الخطة اللي تناسب<br />
                <span className="text-primary">طريقة شغلك.</span>
              </h1>
              <p className="mt-4 text-[16px] leading-[1.8] text-muted-foreground max-w-[500px] mx-auto">
                ابدأ بتنظيم يومك، وطوّر متابعتك لما تكون جاهز.
              </p>
            </div>
          </section>

          <PricingSection />
          <FaqSection />
          <CtaSection />
          <Footer />
        </main>
      ) : (
        <main>
          <Hero />
          <LogoStrip />
          <FeaturesSection />
          <ProblemSection />
          <HowItWorksTimeline />
          <AttendanceSpotlight />
          <PaymentSpotlight />
          <GroupSpotlight />
          <StudentProfileSpotlight />
          <ProFeatureSection />
          <PricingSection />
          <TestimonialsSection />
          <FaqSection />
          <CtaSection />
          <Footer />
        </main>
      )}
    </div>
  )
}
