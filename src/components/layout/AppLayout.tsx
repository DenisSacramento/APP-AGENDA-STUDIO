import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-app">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(244,114,182,0.18),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.2),_transparent_35%)]" />
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
