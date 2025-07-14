import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MemberStatus } from '@prisma/client'

const statusOrder: MemberStatus[] = [
  MemberStatus.ACTIVIST,
  MemberStatus.DEVELOPMENT_TARGET,
  MemberStatus.PROBATIONARY,
  MemberStatus.FULL_MEMBER
]

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const member = await prisma.member.findUnique({
      where: { id: params.id }
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const currentIndex = statusOrder.indexOf(member.status)
    if (currentIndex === -1 || currentIndex === statusOrder.length - 1) {
      return NextResponse.json({ error: 'Cannot promote further' }, { status: 400 })
    }

    const nextStatus = statusOrder[currentIndex + 1]
    const now = new Date()

    const updatedMember = await prisma.member.update({
      where: { id: params.id },
      data: {
        status: nextStatus,
        ...(nextStatus === MemberStatus.DEVELOPMENT_TARGET && { developmentDate: now }),
        ...(nextStatus === MemberStatus.PROBATIONARY && { probationDate: now }),
        ...(nextStatus === MemberStatus.FULL_MEMBER && { fullMemberDate: now }),
      }
    })

    return NextResponse.json(updatedMember)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to promote member' }, { status: 500 })
  }
}