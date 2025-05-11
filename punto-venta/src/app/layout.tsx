import ThemeSwitcher from '@/components/ThemeSwitcher'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="fixed top-4 right-4 z-50">
          <ThemeSwitcher />
        </div>
        {children}
      </body>
    </html>
  )
}
