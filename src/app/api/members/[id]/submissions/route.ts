import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const submission = await prisma.submission.create({
      data: {
        memberId: params.id,
        userId: session.user.id,
        submissionDate: new Date(body.submissionDate),
        submissionType: body.submissionType,
        content: body.content,
      }
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}