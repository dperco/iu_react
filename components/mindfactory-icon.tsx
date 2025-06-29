"use client"

interface MindfactoryIconProps {
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  className?: string
}

export function MindfactoryIcon({ size = "md", animated = true, className = "" }: MindfactoryIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {/* Gradient background circle */}
      <div
        className={`w-full h-full rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg ${
          animated ? "animate-pulse hover:scale-110 transition-transform duration-300" : ""
        }`}
      >
        {/* White M letter */}
        <div
          className="text-white font-bold text-center"
          style={{ fontSize: `${Number.parseInt(sizeClasses[size].split("-")[1]) * 0.4}rem` }}
        >
          M
        </div>
      </div>

      {/* Animated ring effect */}
      {animated && <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping"></div>}
    </div>
  )
}
