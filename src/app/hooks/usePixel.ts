import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { pageview } from '../utils/pixel'

export const usePixel = () => {
  const pathname = usePathname()

  useEffect(() => {
    pageview()
  }, [pathname])
}