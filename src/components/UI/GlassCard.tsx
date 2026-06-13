import { motion } from "motion/react";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export function GlassCard({ children, className, delay = 0, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={cn(
        "glass-card p-6", 
        onClick && "cursor-pointer active:scale-95 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
