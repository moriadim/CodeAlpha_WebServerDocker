"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeDebug() {
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-card border rounded text-xs">
      <div>Theme: {theme}</div>
      <div>System: {systemTheme}</div>
      <div>Resolved: {resolvedTheme}</div>
    </div>
  )
}
