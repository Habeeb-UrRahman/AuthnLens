
import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

// --- Cyber Button ---
interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  glitch?: boolean;
}

export const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = 'primary', glitch = false, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground border-primary hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]',
      secondary: 'bg-secondary/10 text-secondary border-secondary hover:bg-secondary/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      danger: 'bg-destructive/10 text-destructive border-destructive hover:bg-destructive/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative px-6 py-2 font-mono font-bold uppercase tracking-wider border transition-all duration-300 group',
          'clip-path-cyber', // We need to add this utility or style
          variants[variant],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        {glitch && (
          <span className="absolute inset-0 bg-white/20 translate-x-[2px] opacity-0 group-hover:opacity-100 group-hover:animate-pulse pointer-events-none" />
        )}
      </button>
    );
  }
);
CyberButton.displayName = 'CyberButton';

// --- Cyber Card ---
interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, hoverEffect = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative bg-card/50 backdrop-blur-md border border-white/10 p-6 overflow-hidden',
          hoverEffect && 'hover:border-primary/50 transition-colors duration-300 group',
          className
        )}
        {...props}
      >
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/50" />
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
        
        {children}
      </div>
    );
  }
);
CyberCard.displayName = 'CyberCard';

// --- Glitch Text ---
export const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={cn("relative inline-block group", className)}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-secondary opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 select-none delay-75">
        {text}
      </span>
    </div>
  );
};

// --- Cyber Badge ---
export const CyberBadge = ({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'outline' }) => (
  <span className={cn(
    "px-2 py-0.5 text-xs font-mono uppercase tracking-widest border border-primary/30 bg-primary/10 text-primary rounded-sm",
    variant === 'outline' && "bg-transparent",
    className
  )}>
    {children}
  </span>
);
