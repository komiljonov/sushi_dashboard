'use client'

import { Loader2 } from "lucide-react"

export function Loading({ title, description }: { title: string, description: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center space-y-2 text-foreground/80">
        <Loader2 className="h-8 w-8 animate-spin text-primary/80" />
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground/80">{description}</p>
      </div>
    </div>
  )
}