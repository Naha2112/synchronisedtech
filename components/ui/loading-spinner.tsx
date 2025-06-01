import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "overlay" | "inline";
  text?: string;
  className?: string;
}

const sizeVariants = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8",
  xl: "w-12 h-12"
};

export function LoadingSpinner({ 
  size = "md", 
  variant = "default", 
  text, 
  className 
}: LoadingSpinnerProps) {
  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 flex flex-col items-center gap-4">
          <Loader2 className={cn("animate-spin text-blue-400", sizeVariants[size])} />
          {text && <p className="text-white text-sm">{text}</p>}
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className={cn("animate-spin text-blue-400", sizeVariants[size])} />
        {text && <span className="text-gray-300 text-sm">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <Loader2 className={cn("animate-spin text-blue-400 mb-4", sizeVariants[size])} />
      {text && <p className="text-gray-300 text-sm">{text}</p>}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="h-4 bg-gray-700/50 rounded w-12 animate-pulse"></div>
          <div className="h-4 bg-gray-700/50 rounded flex-1 animate-pulse"></div>
          <div className="h-4 bg-gray-700/50 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-700/50 rounded w-16 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/50 rounded w-full"></div>
        <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
      </div>
    </div>
  );
} 