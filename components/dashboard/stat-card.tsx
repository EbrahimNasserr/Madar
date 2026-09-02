'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const toneClasses: Record<string, string> = {
  teal:   'text-primary bg-primary/10',
  blue:   'text-primary bg-primary/10',
  amber:  'text-[#e09a34] bg-[#e09a34]/10',
  purple: 'text-secondary bg-secondary/10',
}

interface StatCardProps {
  label:  string
  value:  string
  detail: string
  icon:   LucideIcon
  tone:   'teal' | 'blue' | 'amber' | 'purple'
}

export function StatCard({ label, value, detail, icon: Icon, tone }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex items-center gap-3.5 p-[17px] bg-card border border-border rounded-2xl shadow-sm"
    >
      <div className={cn('grid place-items-center w-[38px] h-[38px] rounded-[11px] shrink-0', toneClasses[tone])}>
        <Icon size={19} />
      </div>
      <div>
        <p className="text-muted-foreground text-[11px] leading-snug m-0">{label}</p>
        <p className="text-[18px] font-extrabold mt-1 m-0">{value}</p>
        <p className="text-[10px] text-primary mt-0.5 m-0">{detail}</p>
      </div>
    </motion.div>
  )
}
