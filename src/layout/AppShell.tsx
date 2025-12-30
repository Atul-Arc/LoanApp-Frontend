import type { PropsWithChildren } from 'react'

import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="appShell">
      <Header />
      <div className="appShell__body">
        <Sidebar />
        <main className="appShell__main" role="main">
          <div className="appShell__content">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
