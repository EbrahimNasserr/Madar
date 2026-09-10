export function Avatar({ name }: { name: string }) {
  return (
    <div
      aria-hidden="true"
      className="w-9 h-9 shrink-0 rounded-full bg-[#EAF0FF] text-[#3157D5] font-bold text-sm flex items-center justify-center select-none"
    >
      {name.charAt(0)}
    </div>
  )
}
