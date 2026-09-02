import { FAQ } from '@/components/ui/faq-tabs'
import { faqCategories, faqData } from './data'

export function FaqSection() {
  return (
    <section className="" id="faq">
      <div className="max-w-[1180px] mx-auto px-7">
        <FAQ
          title="أسئلة مهمة."
          subtitle="عندك سؤال؟"
          categories={faqCategories}
          faqData={faqData}
          className="bg-transparent px-0 py-8"
        />
      </div>
    </section>
  )
}
