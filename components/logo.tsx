"use client"

import { useState } from "react"
import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const [imageError, setImageError] = useState(false)

  const sizes = {
    sm: { width: 16, height: 16 },
    md: { width: 32, height: 32 },
    lg: { width: 80, height: 80 },
  }

  const { width, height } = sizes[size]

  if (imageError) {
    // Fallback to text if image fails to load
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-teal-700 text-white font-bold ${className}`}
        style={{ width, height }}
      >
        M
      </div>
    )
  }

  return (
    <Image
      src="/markit-logo.png"
      alt="MarkIt Logo"
      width={width}
      height={height}
      className={`${className}`}
      priority
      onError={() => setImageError(true)}
    />
  )
}
