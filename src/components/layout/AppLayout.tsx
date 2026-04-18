import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f7fb]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_90%_at_0%_40%,_rgba(205,177,233,0.48),_transparent_70%),radial-gradient(60%_80%_at_100%_85%,_rgba(242,231,222,0.5),_transparent_75%)]" />
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
