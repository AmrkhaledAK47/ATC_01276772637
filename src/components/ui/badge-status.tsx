
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeStatusVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-muted/80 text-foreground",
        primary:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        success:
          "border-transparent bg-success-500 text-white",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        warning:
          "border-transparent bg-amber-500 text-white",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeStatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeStatusVariants> {}

function BadgeStatus({ className, variant, ...props }: BadgeStatusProps) {
  return (
    <div className={cn(badgeStatusVariants({ variant }), className)} {...props} />
  )
}

export { BadgeStatus, badgeStatusVariants }
