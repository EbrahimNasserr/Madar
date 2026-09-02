import { cn } from '@/lib/utils'
import React from 'react'

export interface FeatureItem {
  title: string
  description: string
  icon: React.ReactNode
}

export function FeaturesSectionWithHoverEffects({ features }: { features: FeatureItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  )
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string
  description: string
  icon: React.ReactNode
  index: number
}) => {
  return (
    <div
      className={cn(
        'flex flex-col lg:border-r py-10 relative group/feature border-border',
        (index === 0 || index === 4) && 'lg:border-l border-border',
        index < 4 && 'lg:border-b border-border',
      )}
    >
      {/* Hover gradient — uses Madar surface-container */}
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-muted to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-muted to-transparent pointer-events-none" />
      )}

      {/* Icon */}
      <div className="mb-4 relative z-10 px-10 text-muted-foreground">
        {icon}
      </div>

      {/* Title */}
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        {/* RTL accent bar — right side */}
        <div className="absolute right-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tl-full rounded-bl-full bg-outline-variant group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:-translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  )
}
