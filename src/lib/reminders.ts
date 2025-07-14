import { prisma } from './prisma'
import { MemberStatus } from '@prisma/client'

export interface Reminder {
  id: string
  type: 'thought_report' | 'probation_expiration' | 'development_target'
  title: string
  description: string
  memberId: string
  memberName: string
  daysUntilDue: number
  urgency: 'low' | 'medium' | 'high'
}

export async function generateReminders(userId: string): Promise<Reminder[]> {
  const reminders: Reminder[] = []
  
  // 获取所有未忽略的提醒
  const dismissedReminders = await prisma.dismissedReminder.findMany({
    where: { userId },
    select: { reminderId: true }
  })
  
  const dismissedIds = new Set(dismissedReminders.map(r => r.reminderId))

  // 获取所有成员
  const members = await prisma.member.findMany({
    include: {
      submissions: {
        orderBy: { submissionDate: 'desc' },
        take: 1
      }
    }
  })

  for (const member of members) {
    // 检查思想汇报提醒（90天无提交）
    if (member.status === MemberStatus.ACTIVIST || member.status === MemberStatus.DEVELOPMENT_TARGET) {
      const lastSubmission = member.submissions[0]
      const daysSinceLastSubmission = lastSubmission 
        ? Math.floor((Date.now() - lastSubmission.submissionDate.getTime()) / (1000 * 60 * 60 * 24))
        : Math.floor((Date.now() - member.createdAt.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSinceLastSubmission >= 90) {
        const reminderId = `thought_report_${member.id}`
        if (!dismissedIds.has(reminderId)) {
          reminders.push({
            id: reminderId,
            type: 'thought_report',
            title: '思想汇报提醒',
            description: `${member.name}已超过90天未提交思想汇报`,
            memberId: member.id,
            memberName: member.name,
            daysUntilDue: 90 - daysSinceLastSubmission,
            urgency: daysSinceLastSubmission >= 120 ? 'high' : daysSinceLastSubmission >= 105 ? 'medium' : 'low'
          })
        }
      }
    }

    // 检查预备党员转正提醒（预备期满一年）
    if (member.status === MemberStatus.PROBATIONARY && member.probationDate) {
      const probationDays = Math.floor((Date.now() - member.probationDate.getTime()) / (1000 * 60 * 60 * 24))
      const daysUntilYear = 365 - probationDays

      if (daysUntilYear <= 30 && daysUntilYear >= 0) {
        const reminderId = `probation_expiration_${member.id}`
        if (!dismissedIds.has(reminderId)) {
          reminders.push({
            id: reminderId,
            type: 'probation_expiration',
            title: '预备党员转正提醒',
            description: `${member.name}的预备期即将满一年，请及时讨论转正事宜`,
            memberId: member.id,
            memberName: member.name,
            daysUntilDue: daysUntilYear,
            urgency: daysUntilYear <= 7 ? 'high' : daysUntilYear <= 14 ? 'medium' : 'low'
          })
        }
      }
    }

    // 检查发展对象提醒
    if (member.status === MemberStatus.DEVELOPMENT_TARGET && member.developmentDate) {
      const developmentDays = Math.floor((Date.now() - member.developmentDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (developmentDays >= 180) {
        const reminderId = `development_target_${member.id}`
        if (!dismissedIds.has(reminderId)) {
          reminders.push({
            id: reminderId,
            type: 'development_target',
            title: '发展对象提醒',
            description: `${member.name}已成为发展对象超过180天，请及时讨论接收预备党员事宜`,
            memberId: member.id,
            memberName: member.name,
            daysUntilDue: -developmentDays,
            urgency: developmentDays >= 240 ? 'high' : developmentDays >= 210 ? 'medium' : 'low'
          })
        }
      }
    }
  }

  return reminders.sort((a, b) => {
    // 按紧急程度排序
    const urgencyOrder = { high: 0, medium: 1, low: 2 }
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
    }
    return a.daysUntilDue - b.daysUntilDue
  })
}

export async function dismissReminder(userId: string, reminderId: string) {
  return await prisma.dismissedReminder.create({
    data: {
      reminderId,
      userId
    }
  })
}