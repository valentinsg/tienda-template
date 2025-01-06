import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar si viene de una navegación válida
  const referer = request.headers.get('referer')
  const isFromCart = referer?.includes('/cart') || false
  
  // Si no viene del carrito, redirigir a home
  if (!isFromCart) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/checkout',
}