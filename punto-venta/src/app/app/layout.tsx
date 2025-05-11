import '../globals.css'
import AppShell from '@/components/AppShell'
import { SessionProvider } from '@/context/SessionContext'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  )
}
