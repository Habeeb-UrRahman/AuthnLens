
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Image Detection', path: '/image' },
    { name: 'Video Detection', path: '/video' },
    { name: 'Audio Detection', path: '/audio' },
    { name: 'Text Detection', path: '/text' },
    { name: 'Fact Verification', path: '/factcheck' }
  ];
  
  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110 duration-300">
                <Search size={18} />
              </div>
              <span className="text-xl font-bold hidden sm:inline-block group-hover:text-primary transition-colors duration-300">AuthenLens</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            {links.map((link, index) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={cn(
                  "relative animated-border py-2 font-medium transition-colors", 
                  location.pathname === link.path 
                    ? "text-primary after:w-full" 
                    : "text-foreground/70 hover:text-foreground"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu} 
              aria-label="Toggle menu"
              className="blue-glow-hover"
            >
              <Menu />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "md:hidden absolute w-full bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 overflow-hidden", 
        mobileMenuOpen ? "max-h-64" : "max-h-0"
      )}>
        <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {links.map((link, index) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={cn(
                "px-4 py-2 rounded-md transition-all duration-300", 
                location.pathname === link.path 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-foreground/70 hover:bg-accent hover:text-foreground hover:translate-x-2"
              )}
              style={{ transitionDelay: `${index * 50}ms` }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;




























// import { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { Menu } from 'lucide-react';

// const Navigation = () => {
//   const location = useLocation();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
//   const links = [{
//     name: 'Home',
//     path: '/'
//   }, {
//     name: 'Image Detection',
//     path: '/image'
//   }, {
//     name: 'Video Detection',
//     path: '/video'
//   }, {
//     name: 'Audio Detection',
//     path: '/audio'
//   }, {
//     name: 'Text Detection',
//     path: '/text'
//   }];
  
//   const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
//   return <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-2 group">
//               <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110 duration-300">A</div>
//               <span className="text-xl font-bold hidden sm:inline-block group-hover:text-primary transition-colors duration-300">AuthenLens</span>
//             </Link>
//           </div>
          
//           <nav className="hidden md:flex space-x-8 items-center">
//             {links.map((link, index) => (
//               <Link 
//                 key={link.path} 
//                 to={link.path} 
//                 className={cn(
//                   "relative animated-border py-2 font-medium transition-colors", 
//                   location.pathname === link.path 
//                     ? "text-primary after:w-full" 
//                     : "text-foreground/70 hover:text-foreground"
//                 )}
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </nav>
          
//           <div className="md:hidden">
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               onClick={toggleMenu} 
//               aria-label="Toggle menu"
//               className="blue-glow-hover"
//             >
//               <Menu />
//             </Button>
//           </div>
//         </div>
//       </div>
      
//       {/* Mobile menu */}
//       <div className={cn(
//         "md:hidden absolute w-full bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 overflow-hidden", 
//         mobileMenuOpen ? "max-h-64" : "max-h-0"
//       )}>
//         <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
//           {links.map((link, index) => (
//             <Link 
//               key={link.path} 
//               to={link.path} 
//               className={cn(
//                 "px-4 py-2 rounded-md transition-all duration-300", 
//                 location.pathname === link.path 
//                   ? "bg-primary/10 text-primary font-medium" 
//                   : "text-foreground/70 hover:bg-accent hover:text-foreground hover:translate-x-2"
//               )}
//               style={{ transitionDelay: `${index * 50}ms` }} 
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               {link.name}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </header>;
// };

// export default Navigation;