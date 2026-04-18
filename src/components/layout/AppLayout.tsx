import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'

export const AppLayout = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="app-atmosphere pointer-events-none fixed inset-0 -z-10" />
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
