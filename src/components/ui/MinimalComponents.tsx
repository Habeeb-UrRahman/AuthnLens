
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

// --- Types ---
interface MinimalCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

// --- Components ---

export const MinimalCard = ({ children, className, hoverEffect = true, ...props }: MinimalCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "bg-white rounded-2xl border border-black/5 shadow-sm p-6 relative overflow-hidden",
                hoverEffect && "hover:shadow-md hover:-translate-y-1 transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const PillButton = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    disabled,
    ...props
}: PillButtonProps) => {
    const baseStyles = "rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-95";

    const variants = {
        primary: "bg-black text-white hover:bg-black/80 shadow-lg shadow-black/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
    };

    const sizes = {
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-6 text-sm",
        lg: "h-12 px-8 text-base"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : icon}
            {children}
        </button>
    );
};

export const GlassPanel = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn("glass-panel rounded-3xl p-6", className)}>
            {children}
        </div>
    );
};

export const PageHeader = ({ title, subtitle, className }: { title: string, subtitle?: string, className?: string }) => (
    <div className={cn("mb-8 animate-fade-in", className)}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">{title}</h1>
        {subtitle && <p className="text-lg text-muted-foreground max-w-2xl">{subtitle}</p>}
    </div>
);

export const GradientText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={cn("bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 font-bold", className)}>
        {children}
    </span>
);
