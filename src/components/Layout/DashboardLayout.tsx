
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Image as ImageIcon,
    Video as VideoIcon,
    Mic,
    FileText,
    ShieldCheck,
    Menu,
    X,
    LogOut,
    Settings
} from 'lucide-react';
import { CyberButton, GlitchText } from '@/components/ui/CyberComponents';

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
    <Link to={path}>
        <div className={cn(
            "flex items-center space-x-3 px-4 py-3 mb-2 rounded-r-lg transition-all duration-300 border-l-2",
            active
                ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
        )}>
            <Icon className="w-5 h-5" />
            <span className="font-medium tracking-wide">{label}</span>
            {active && (
                <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-8 bg-primary blur-[2px]"
                />
            )}
        </div>
    </Link>
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ImageIcon, label: 'Image Analysis', path: '/image' },
        { icon: VideoIcon, label: 'Video Analysis', path: '/video' },
        { icon: Mic, label: 'Audio Analysis', path: '/audio' },
        { icon: FileText, label: 'Text Analysis', path: '/text' },
        { icon: ShieldCheck, label: 'Fact Check', path: '/factcheck' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden flex">
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
                className={cn(
                    "fixed md:relative z-50 h-screen bg-card/60 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300",
                    !isOpen && "md:w-0 overflow-hidden" // Handle desktop collapse
                )}
            >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white">AL</div>
                        <GlitchText text="AuthenLens" className="text-xl font-bold tracking-tighter" />
                    </Link>
                    <button onClick={toggleSidebar} className="md:hidden text-muted-foreground hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto hide-scrollbar">
                    <div className="mb-6">
                        <p className="px-4 text-xs font-mono text-muted-foreground mb-4 uppercase tracking-widest">Tools</p>
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                path={item.path}
                                active={location.pathname === item.path}
                            />
                        ))}
                    </div>

                    <div>
                        <p className="px-4 text-xs font-mono text-muted-foreground mb-4 uppercase tracking-widest">System</p>
                        <SidebarItem icon={Settings} label="Settings" path="/settings" active={location.pathname === '/settings'} />
                    </div>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center p-3 rounded-lg bg-white/5 space-x-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">User</p>
                            <p className="text-xs text-muted-foreground">Premium Plan</p>
                        </div>
                    </div>
                    <CyberButton variant="danger" className="w-full text-xs py-2 flex items-center justify-center gap-2">
                        <LogOut className="w-3 h-3" /> Sign Out
                    </CyberButton>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto h-screen bg-grid-white">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className={cn("p-2 text-muted-foreground hover:text-white rounded-md hover:bg-white/10 transition-colors", isOpen && "md:hidden")}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>Platform</span>
                            <span>/</span>
                            <span className="text-white">
                                {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Place for global search or notifications if needed */}
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="text-xs font-mono text-green-500">SYSTEM ONLINE</span>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
