import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'
import { testimonials } from './data'

export function TestimonialsSection() {
  return (
    <AnimatedTestimonials
      title="آراء المدرسين"
      subtitle="مش كلام — ده تجارب حقيقية من مدرسين بيستخدموا Madar كل يوم."
      badgeText="موثوق من المدرسين"
      testimonials={testimonials}
      autoRotateInterval={6000}
    />
  )
}
