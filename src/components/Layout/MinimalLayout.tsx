
import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Image as ImageIcon,
    Video,
    Settings,
    Menu,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Image Analysis', path: '/image', icon: ImageIcon },
    { label: 'Video Analysis', path: '/video', icon: Video },
    // { label: 'Audio Analysis', path: '/audio', icon: Mic },
    // { label: 'Text Analysis', path: '/text', icon: FileText },
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <motion.div
                className={cn(
                    "fixed top-0 left-0 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 z-50 flex flex-col p-6 shadow-2xl md:shadow-none transition-transform duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 mb-10 pl-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">AuthenLens</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Beta</span>
                </Link>

                {/* Nav Links */}
                <nav className="space-y-1 flex-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && onClose()}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                    isActive
                                        ? "bg-black text-white shadow-lg shadow-black/10 scale-105"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                    <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 w-full rounded-xl hover:bg-gray-50 transition-colors">
                        <Settings className="w-5 h-5" />
                        Settings
                    </button>
                    <div className="text-xs text-gray-400 mt-4 pl-4">
                        v2.0 Minimal
                    </div>
                </div>
            </motion.div>
        </>
    );
};

const MinimalLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="md:ml-64 transition-all duration-300">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-30">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <ShieldCheck className="w-5 h-5" /> AuthenLens
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="p-2 bg-gray-100 rounded-lg">
                        <Menu className="w-5 h-5" />
                    </button>
                </header>

                <main className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
                    {/* Background Soft Gradients */}
                    <div className="fixed inset-0 bg-gradient-soft pointer-events-none -z-10" />
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MinimalLayout;
