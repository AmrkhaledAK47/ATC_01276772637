
import React from "react";
import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}

export function Logo({ 
  className, 
  showText = true, 
  size = "md",
  asLink = true 
}: LogoProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const logoContent = (
    <>
      <div className="relative">
        <Ticket className={cn(
          "text-primary rotate-45",
          sizeClasses[size]
        )} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-background">E</span>
        </div>
      </div>
      {showText && (
        <span className={cn(
          "font-heading font-bold",
          textSizeClasses[size]
        )}>
          EventHub
        </span>
      )}
    </>
  );

  if (asLink) {
    return (
      <Link to="/" className={cn(
        "flex items-center gap-2",
        className
      )}>
        {logoContent}
      </Link>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-2",
      className
    )}>
      {logoContent}
    </div>
  );
}
