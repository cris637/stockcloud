import { SessionProvider } from '@/context/SessionContext'
import AppShell from '@/components/AppShell'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppShell>
        {children}
      </AppShell>
    </SessionProvider>
  )
}
