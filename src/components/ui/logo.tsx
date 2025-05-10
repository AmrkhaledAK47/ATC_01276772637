
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
        <div className="bg-primary rounded-full p-1 rotate-45">
          <Ticket className={cn(
            "text-background rotate-[-45deg]",
            sizeClasses[size]
          )} />
        </div>
      </div>
      {showText && (
        <span className={cn(
          "font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary",
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
