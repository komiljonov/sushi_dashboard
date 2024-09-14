import { Button } from "@/components/ui/Button"
import { Bell, User, ChevronRight, ChevronLeft } from "lucide-react"

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Header({ collapsed, setCollapsed }: HeaderProps) {
  return (
    <header className="bg-background border-b h-16 flex items-center justify-between px-4">


      <div className="flex items-center">
        {<Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={"Expand sidebar"}
          className={'mr-4'}
        >
          {/* <Menu className="h-4 w-4" /> */}
          {collapsed ? <ChevronRight /> : <ChevronLeft />}

        </Button>}

        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="User menu">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}