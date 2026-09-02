import type { ParallaxFeature } from '@/components/ui/parallax-scroll-feature-section'
import type { Testimonial } from '@/components/ui/animated-testimonials'
import {
  IconCheck,
  IconCreditCard,
  IconBook,
  IconChartBar,
  IconBell,
  IconShield,
  IconDeviceMobile,
  IconUsers,
} from '@tabler/icons-react'
import React from 'react'

// ── Features ────────────────────────────────────────────
export const featureItems = [
  { icon: React.createElement(IconCheck,         { size: 28 }), title: 'حضور وغياب فوري',     description: 'كل الطلاب بيبدأوا حاضرين، عدّل الغياب بلمسة واحدة.' },
  { icon: React.createElement(IconCreditCard,    { size: 28 }), title: 'متابعة المصروفات',     description: 'شوف مين دفع ومين لأ في الوقت الفعلي بدون حسابات.' },
  { icon: React.createElement(IconBook,          { size: 28 }), title: 'تنظيم المجموعات',      description: 'كل مجموعة بنظامها الخاص، صف ومواعيد وسعر مستقل.' },
  { icon: React.createElement(IconChartBar,      { size: 28 }), title: 'تقارير الأداء',        description: 'درجات الكويزات وتحليل أداء الطلاب بشكل مرئي واضح.' },
  { icon: React.createElement(IconBell,          { size: 28 }), title: 'تنبيهات ذكية',         description: 'متأخرات، غياب متكرر، أو مدفوعات معلقة — كلها عندك.' },
  { icon: React.createElement(IconShield,        { size: 28 }), title: 'بيانات آمنة',          description: 'بياناتك ومعلومات طلابك محفوظة ومشفّرة بالكامل.' },
  { icon: React.createElement(IconDeviceMobile,  { size: 28 }), title: 'مصمم للموبايل',        description: 'استخدمه في الحصة مباشرةً من موبايلك بدون أي تعقيد.' },
  { icon: React.createElement(IconUsers,         { size: 28 }), title: 'إدارة طلاب لا محدودة', description: 'أضف مجموعات وطلاب بلا حدود، كل واحد بملفه الكامل.' },
]

// ── Workflow parallax ────────────────────────────────────
export const workflowFeatures: ParallaxFeature[] = [
  {
    id: 1,
    title: 'أنشئ مجموعتك في دقيقتين.',
    description: 'حدد اسم المجموعة، الصف الدراسي، عدد الحصص الشهرية، وسعر الحصة — وMadar يجهّز كل حاجة تانية تلقائيًا.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&h=640&fit=crop',
    reverse: false,
  },
  {
    id: 2,
    title: 'سجّل الحضور بضغطة واحدة.',
    description: 'كل الطلاب بيبدأوا حاضرين، بس عدّل الغياب أو التأخير اللي محتاجه — وانتهى الأمر. السجل بيتحفظ تلقائيًا لكل حصة.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=640&h=640&fit=crop',
    reverse: true,
  },
  {
    id: 3,
    title: 'تابع المصروفات بدون كشكول.',
    description: 'اعرف مين دفع ومين لسه في الوقت الفعلي، وشوف ملخص المبالغ المحصّلة والمتبقية لكل مجموعة بنظرة واحدة.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=640&fit=crop',
    reverse: false,
  },
]

// ── Testimonials ─────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'أحمد سامي',
    role: 'مدرس رياضيات',
    company: 'القاهرة',
    content: 'Madar غيّر طريقة شغلي من أول يوم. الحضور والمصروفات كانوا بياخدوا مني وقت كتير، دلوقتي خلصتهم في ثواني وأنا ماشي.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'منى خالد',
    role: 'مدرسة لغة عربية',
    company: 'الإسكندرية',
    content: 'أخيرًا لقيت نظام بيفهم طريقة شغل المدرس الخصوصي. متابعة المدفوعات بقت سهلة جدًا، ومفيش طالب بينسى يدفع.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'محمود عادل',
    role: 'مدرس فيزياء',
    company: 'الجيزة',
    content: 'بستخدم Madar من الموبايل أثناء الحصة مباشرةً. تسجيل الحضور بضغطة واحدة وكل المجموعة حاضرة — وفّر عليّ وقت كتير.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
  },
]

// ── FAQ ──────────────────────────────────────────────────
export const faqCategories: Record<string, string> = {
  general:    'عام',
  attendance: 'الحضور',
  payments:   'المصروفات',
  plans:      'الخطط',
}

export const faqData: Record<string, { question: string; answer: string }[]> = {
  general: [
    { question: 'هل Madar مناسب للمدرس الخصوصي؟', answer: 'أيوه، Madar معمول مخصوص للمدرس اللي بيدير مجموعات وحصص خاصة وعايز كل تفاصيل شغله في مكان واحد.' },
    { question: 'هل يمكنني استخدامه من الموبايل؟', answer: 'نعم، الواجهة متجاوبة ومصممة لتستخدمها بسهولة من الموبايل أثناء الحصة.' },
    { question: 'هل بياناتي وبيانات طلابي آمنة؟', answer: 'نعم، كل البيانات مشفّرة ومحفوظة على سيرفرات آمنة. لا أحد غيرك يقدر يوصل لمعلومات طلابك.' },
  ],
  attendance: [
    { question: 'هل أقدر أتابع الحضور لكل حصة؟', answer: 'تقدر تسجل حضور كل طالب في كل حصة، وتبدأ كل المجموعة حاضرة بضغطة واحدة.' },
    { question: 'هل أقدر أسجل التأخير بشكل منفصل عن الغياب؟', answer: 'أيوه، في ٣ حالات للحضور: حاضر، غائب، ومتأخر — وتقدر تغيّر أي طالب بلمسة واحدة.' },
    { question: 'هل بيتحفظ سجل الحضور تلقائيًا؟', answer: 'أيوه، كل تعديل بيتحفظ فورًا وبتلاقي السجل الكامل لكل حصة في أي وقت.' },
  ],
  payments: [
    { question: 'هل أقدر أسجل المصروفات حصة بحصة؟', answer: 'أيوه، تابع المدفوع والمتبقي لكل طالب ولكل مجموعة، مع اختلاف نظام كل مجموعة.' },
    { question: 'هل أقدر أحدد سعر مختلف لكل مجموعة؟', answer: 'أيوه، كل مجموعة ليها سعرها الخاص وعدد حصصها الخاص، وMadar بيحسب المستحقات تلقائيًا.' },
    { question: 'هل تقدر أشوف تقرير المصروفات الشهري؟', answer: 'تقدر تشوف ملخص كامل بالمحصّل والمتبقي لكل طالب وكل مجموعة خلال الشهر.' },
  ],
  plans: [
    { question: 'ما الفرق بين Basic و Pro؟', answer: 'Basic ينظم شغلك اليومي، وPro يضيف الاختبارات والدرجات وتحليلات أداء الطلاب.' },
    { question: 'هل الكويزات موجودة في Basic؟', answer: 'لا، الكويزات والدرجات من مميزات Pro.' },
    { question: 'هل أقدر أبدأ بـ Basic وأترقى لـ Pro لاحقًا؟', answer: 'أيوه، تقدر تبدأ بـ Basic وتترقى لـ Pro في أي وقت من إعدادات حسابك بدون أي تعقيد.' },
  ],
}

// ── Pricing ──────────────────────────────────────────────
export const basicFeatures = ['الطلاب والمجموعات', 'الحصص والحضور', 'متابعة المدفوعات', 'تقارير أساسية']
export const proFeatures   = ['كل مميزات Basic', 'إنشاء الاختبارات', 'تسجيل الدرجات', 'تحليلات أداء متقدمة']

export const comparisonRows: [string, boolean, boolean][] = [
  ['الطلاب والمجموعات',        true,  true],
  ['الحضور والمدفوعات',         true,  true],
  ['التقارير الأساسية',          true,  true],
  ['الاختبارات وتحليل الأداء',   false, true],
  ['درجات الكويزات',             false, true],
  ['تحليلات متقدمة',             false, true],
]
