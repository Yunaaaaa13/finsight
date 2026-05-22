import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Jika berhasil tukar token, arahkan ke halaman sukses
      return NextResponse.redirect(`${origin}/auth/success`)
    }
  }

  // Jika gagal atau tidak ada token, kembali ke login dengan error
  return NextResponse.redirect(`${origin}/login?error=Token_tidak_valid`)
}
