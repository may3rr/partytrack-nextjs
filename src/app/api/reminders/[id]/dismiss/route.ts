import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dismissReminder } from '@/lib/reminders'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dismissReminder(session.user.id, params.id)
    return NextResponse.json({ message: 'Reminder dismissed successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to dismiss reminder' }, { status: 500 })
  }
}