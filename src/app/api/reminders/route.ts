import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateReminders } from '@/lib/reminders'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const reminders = await generateReminders(session.user.id)
    return NextResponse.json({ reminders })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate reminders' }, { status: 500 })
  }
}