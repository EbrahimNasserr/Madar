import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Madar Design System — Button
 *
 * Variants:
 *  default   → Madar Indigo gradient, white text (primary CTA)
 *  secondary → White surface, outline border (secondary action)
 *  ghost     → No background, subtle hover
 *  destructive → Error-tinted surface
 *  link      → Inline text link
 *
 * Radius: rounded-md = 12px (standard Madar elements)
 * Focus ring: 2px Madar Indigo at 20% opacity
 */
const buttonVariants = cva(
  // Base
  [
    'group/button inline-flex shrink-0 items-center justify-center gap-2',
    'rounded-md border border-transparent bg-clip-padding',
    'text-sm font-medium whitespace-nowrap',
    'transition-all duration-150 outline-none select-none',
    // Focus: 2px Madar Indigo ring at 20% opacity (per Madar spec)
    'focus-visible:ring-2 focus-visible:ring-[#063cbc]/20 focus-visible:border-[#063cbc]',
    'active:not-aria-[haspopup]:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  ],
  {
    variants: {
      variant: {
        // Primary: Madar Indigo gradient (Indigo → Primary Dark)
        default: [
          'bg-gradient-to-b from-[#3157d5] to-[#063cbc]',
          'text-white border-[#063cbc]/30',
          'hover:from-[#2a4fc4] hover:to-[#052ea8]',
          'shadow-sm',
        ],

        // Secondary: white surface + outline border
        secondary: [
          'bg-white text-[#141b2b]',
          'border-[#c4c5d6]',
          'hover:bg-[#f1f3ff] hover:border-[#a0a2b8]',
        ],

        // Ghost: no background
        ghost: [
          'text-[#141b2b]',
          'hover:bg-[#e9edff] hover:text-[#063cbc]',
          'aria-expanded:bg-[#e9edff] aria-expanded:text-[#063cbc]',
        ],

        // Destructive: error-tinted
        destructive: [
          'bg-[#ba1a1a]/10 text-[#ba1a1a]',
          'hover:bg-[#ba1a1a]/20',
          'focus-visible:border-[#ba1a1a]/40 focus-visible:ring-[#ba1a1a]/20',
        ],

        // Outline: muted background
        outline: [
          'border-[#c4c5d6] bg-white',
          'hover:bg-[#f1f3ff] hover:text-[#063cbc]',
          'aria-expanded:bg-[#f1f3ff]',
          'dark:border-[#444654] dark:bg-[#293040]/30 dark:hover:bg-[#293040]/50',
        ],

        // Link: inline text
        link: 'text-[#063cbc] underline-offset-4 hover:underline',
      },

      size: {
        default: 'h-10 px-4 py-2',
        xs:      'h-7 gap-1 rounded-sm px-2.5 text-xs [&_svg:not([class*="size-"])]:size-3',
        sm:      'h-8 gap-1.5 px-3 text-[0.8rem] [&_svg:not([class*="size-"])]:size-3.5',
        lg:      'h-12 px-6 text-base',
        icon:    'size-10',
        'icon-xs': 'size-7 rounded-sm [&_svg:not([class*="size-"])]:size-3',
        'icon-sm': 'size-8 [&_svg:not([class*="size-"])]:size-3.5',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
