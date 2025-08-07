
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ImageDetection from "./pages/ImageDetection";
import VideoDetection from "./pages/VideoDetection";
import AudioDetection from "./pages/AudioDetection";
import TextDetection from "./pages/TextDetection";
import FactChecker from "./pages/FactChecker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/image" element={<ImageDetection />} />
          <Route path="/video" element={<VideoDetection />} />
          <Route path="/audio" element={<AudioDetection />} />
          <Route path="/text" element={<TextDetection />} />
          <Route path="/factcheck" element={<FactChecker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;














// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
// import ImageDetection from "./pages/ImageDetection";
// import VideoDetection from "./pages/VideoDetection";
// import AudioDetection from "./pages/AudioDetection";
// import TextDetection from "./pages/TextDetection";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/image" element={<ImageDetection />} />
//           <Route path="/video" element={<VideoDetection />} />
//           <Route path="/audio" element={<AudioDetection />} />
//           <Route path="/text" element={<TextDetection />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;