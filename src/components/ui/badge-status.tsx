
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeStatusVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-primary-50 text-primary-700 ring-primary-600/20",
        secondary: "bg-secondary-50 text-secondary-700 ring-secondary-600/20",
        success: "bg-success-50 text-success-700 ring-success-600/20",
        destructive: "bg-destructive-50 text-destructive-700 ring-destructive-600/20",
        warning: "bg-warning-50 text-warning-700 ring-warning-600/20",
        info: "bg-info-50 text-info-700 ring-info-600/20",
        outline: "text-foreground ring-1 ring-border",
      },
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
