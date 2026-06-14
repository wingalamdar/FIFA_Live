import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        secondary: "bg-white/10 text-gray-300",
        destructive: "bg-red-500/20 text-red-400 border border-red-500/30",
        outline: "border border-white/20 text-gray-300",
        live: "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse",
        goal: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
