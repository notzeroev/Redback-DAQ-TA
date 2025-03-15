import { memo } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import RedbackLogoDarkMode from "../../../public/logo-darkmode.svg"
import RedbackLogoLightMode from "../../../public/logo-lightmode.svg"

interface HeaderProps {
  connectionStatus: string;
}

const Header = memo(({ connectionStatus }: HeaderProps) => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="px-5 h-20 flex items-center gap-5 border-b">
      <Image
        src={resolvedTheme === 'dark' ? RedbackLogoDarkMode : RedbackLogoLightMode}
        className="h-12 w-auto"
        alt="Redback Racing Logo"
      />
      <h1 className="text-foreground text-xl font-semibold">DAQ Technical Assessment</h1>
      <Badge variant={connectionStatus === "Connected" ? "success" : "destructive"} className="ml-auto">
        {connectionStatus}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      >
        {resolvedTheme === 'light' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </header>
  )
})

Header.displayName = 'Header'

export default Header