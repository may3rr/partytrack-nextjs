'use client'

import { useState } from 'react'
import { Bell, X } from 'lucide-react'

interface Reminder {
  id: string
  type: 'thought_report' | 'probation_expiration' | 'development_target'
  title: string
  description: string
  memberId: string
  memberName: string
  daysUntilDue: number
  urgency: 'low' | 'medium' | 'high'
}

interface ReminderCardProps {
  reminder: Reminder
  onDismiss: (id: string) => void
}

export default function ReminderCard({ reminder, onDismiss }: ReminderCardProps) {
  const [isDismissing, setIsDismissing] = useState(false)

  const handleDismiss = async () => {
    setIsDismissing(true)
    try {
      await fetch(`/api/reminders/${reminder.id}/dismiss`, {
        method: 'POST',
      })
      onDismiss(reminder.id)
    } catch (error) {
      console.error('Failed to dismiss reminder:', error)
    } finally {
      setIsDismissing(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800'
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${getUrgencyColor(reminder.urgency)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Bell className="h-5 w-5 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium">{reminder.title}</h3>
            <p className="text-sm mt-1">{reminder.description}</p>
            <p className="text-xs mt-2 opacity-75">
              {reminder.daysUntilDue > 0 
                ? `还有 ${reminder.daysUntilDue} 天`
                : `已逾期 ${Math.abs(reminder.daysUntilDue)} 天`
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          disabled={isDismissing}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}