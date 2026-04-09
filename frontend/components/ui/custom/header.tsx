import { SidebarTrigger } from '@/components/ui/sidebar'
import MenuBar from '@/components/ui/custom/menu-bar'
import MenuNav from '@/components/ui/custom/menu-nav'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background flex flex-row h-16 items-center gap-2 border-b px-4 py-2">
      <SidebarTrigger className="-ml-1 rounded-full border border-border" />
      <div className="flex flex-col justify-center w-full">
        <MenuNav />
        <MenuBar />
      </div>
    </header>
  )
}