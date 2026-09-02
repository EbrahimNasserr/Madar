import Link from 'next/link'
import LogoImage from '@/public/logo.jpeg'
import Image from 'next/image'
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 no-underline shrink-0 select-none"
      aria-label="مَدار — الصفحة الرئيسية"
    >
    <Image src={LogoImage} alt='logo madar' width={60} height={60}/> 
    </Link>
  )
}
