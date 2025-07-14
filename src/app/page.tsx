'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Users, FileText, AlertTriangle, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'
import ReminderCard from '@/components/ReminderCard'

interface DashboardStats {
  totalMembers: number
  activeMembers: number
  pendingSubmissions: number
  remindersCount: number
}

interface Reminder {
  id: string
  type: string
  title: string
  description: string
  memberId: string
  memberName: string
  daysUntilDue: number
  urgency: 'low' | 'medium' | 'high'
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    pendingSubmissions: 0,
    remindersCount: 0
  })
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    fetchDashboardData()
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      const [membersRes, remindersRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/reminders')
      ])

      const membersData = await membersRes.json()
      const remindersData = await remindersRes.json()

      setStats({
        totalMembers: membersData.total || 0,
        activeMembers: membersData.members?.filter((m: any) => 
          m.status === 'ACTIVIST' || m.status === 'DEVELOPMENT_TARGET'
        ).length || 0,
        pendingSubmissions: 0, // 需要根据业务逻辑计算
        remindersCount: remindersData.reminders?.length || 0
      })

      setReminders(remindersData.reminders || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismissReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id))
    setStats(prev => ({ ...prev, remindersCount: prev.remindersCount - 1 }))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">党建助手控制台</h1>
          <p className="text-gray-600 mt-2">欢迎回来，{session?.user?.name}</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总成员数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">积极分子</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">待处理材料</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">待处理提醒</p>
                <p className="text-2xl font-bold text-gray-900">{stats.remindersCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 智能提醒 */}
        {reminders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">智能提醒</h2>
            <div className="space-y-4">
              {reminders.map(reminder => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onDismiss={handleDismissReminder}
                />
              ))}
            </div>
          </div>
        )}

        {/* 快速操作 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/members/new')}
              className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              添加新成员
            </button>
            <button
              onClick={() => router.push('/members')}
              className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              查看成员列表
            </button>
            <button
              onClick={() => router.push('/chat')}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              咨询AI助手
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}