import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const safeNext = next?.startsWith('/') ? next : '/tableau-de-bord'
      return NextResponse.redirect(new URL(safeNext, requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/connexion?error=auth_callback', requestUrl.origin))
}

export const dynamic = 'force-dynamic'
