import { Navbar } from './Navbar/Navbar'
import { Footer } from './Footer/Footer'

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[var(--color-surface)]">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
