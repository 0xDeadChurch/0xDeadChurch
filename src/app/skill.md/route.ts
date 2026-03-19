import { NextResponse } from 'next/server'

// Canonical skill.md lives at daodegen.com — redirect there
export async function GET() {
  return NextResponse.redirect('https://daodegen.com/skill.md', { status: 301 })
}
