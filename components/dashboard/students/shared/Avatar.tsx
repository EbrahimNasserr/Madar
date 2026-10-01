const SIZE = {
  md: 'w-9 h-9 text-sm',
  lg: 'w-14 h-14 text-xl',
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  return (
    <div
      aria-hidden="true"
      className={`shrink-0 rounded-full bg-[#EAF0FF] text-[#3157D5] font-bold flex items-center justify-center select-none ${SIZE[size]}`}
    >
      {name.charAt(0)}
    </div>
  )
}
