'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image
              src="/school-logo.png"
              alt="大连外国语大学软件学院"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">党建助手</h1>
              <p className="text-sm text-gray-600">大连外国语大学软件学院</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              首页
            </Link>
            <Link href="/members" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              成员管理
            </Link>
            <Link href="/chat" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              AI助手
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  退出登录
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                登录
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}