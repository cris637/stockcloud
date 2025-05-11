'use client'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 w-full min-h-screen bg-base-100">
        {children}
      </main>
    </div>
  )
}
