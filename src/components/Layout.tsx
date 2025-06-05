
import { ReactNode } from 'react';
import Navigation from './Navigation';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className={cn("flex-grow pt-16", className)}>
        {children}
      </main>
      
      <footer className="mt-auto py-6 px-4 bg-muted/50 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xs">A</div>
                <span className="font-bold">AuthenLens</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Advanced AI Content Detection System
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AuthenLens. University Project.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
