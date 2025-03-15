import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

type CardSize = "small" | "medium" | "large"

interface BentoCardProps {
  title: string
  icon: LucideIcon
  size?: CardSize
  children: ReactNode
}

export function BentoCard({ title, icon: Icon, size = "small", children }: BentoCardProps) {
  // predefined size classes
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-2",
    large: "col-span-1 md:col-span-2 row-span-3",
  }

  return (
    <Card className={sizeClasses[size]}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-light flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}