
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Cpu, Lock, CheckCircle2 } from "lucide-react";
import { PillButton, MinimalCard } from "@/components/ui/MinimalComponents";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
      {/* Nav */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            AuthenLens
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <div className="flex gap-4">
            <button className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Features</button>
            <button onClick={() => navigate('/pricing')} className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Pricing</button>
            <PillButton onClick={() => navigate('/dashboard')} size="sm">
              Get Started
            </PillButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft -z-10 pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wide mb-6 uppercase">
              v2.0 Now Available
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Truth in the age of <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">Synthetic Media.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Detect deepfakes, AI-generated images, and synthetic voice clones with
              enterprise-grade forensic precision. Simple as drag and drop.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <PillButton size="lg" onClick={() => navigate('/dashboard')} className="min-w-[180px]">
                Start for Free <ArrowRight className="w-4 h-4 ml-2" />
              </PillButton>
              <PillButton size="lg" variant="outline" className="min-w-[180px]">
                View Demo
              </PillButton>
            </div>
          </motion.div>


        </div>

        {/* Dynamic Abstract Hero Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 relative max-w-5xl mx-auto h-[400px] flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />

          {/* Animated Circles */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-[500px] h-[500px] rounded-full border border-blue-100 absolute"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-[400px] h-[400px] rounded-full border border-violet-100 absolute"
          />

          {/* Scanner Effect */}
          <div className="relative w-64 h-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-grid-slate-50 [mask-image:linear-gradient(0deg,white,transparent)]" />
            <ShieldCheck className="w-16 h-16 text-blue-600 relative z-20" />

            {/* Scanning Beam */}
            <motion.div
              animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10"
            />
          </div>

          {/* Floating Badges */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-bold text-gray-600">Authentic Verified</span>
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-600">Deepfake Detected</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid (Bento Style) */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to verify reality.</h2>
            <p className="text-gray-500">Two powerful engines. One simple interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <MinimalCard className="col-span-1 md:col-span-2 bg-white flex items-center justify-between p-8">
              <div className="max-w-md">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Deep Learning Core</h3>
                <p className="text-gray-500">
                  Our multi-modal neural networks analyze pixel-level artifacts,
                  compression anomalies, and unnatural patterns invisible to the human eye.
                </p>
              </div>
              <div className="hidden md:block w-32 h-32 bg-blue-50 rounded-full animate-pulse" />
            </MinimalCard>

            {/* Feature 2 */}
            <MinimalCard className="bg-white p-8">
              <Lock className="w-8 h-8 text-black mb-6" />
              <h3 className="text-xl font-bold mb-2">Privacy First</h3>
              <p className="text-gray-500 text-sm">
                Your media is processed securely. We never store your uploads after analysis is complete.
              </p>
            </MinimalCard>

            {/* Feature 3 */}
            <MinimalCard className="bg-white p-8">
              <CheckCircle2 className="w-8 h-8 text-green-500 mb-6" />
              <h3 className="text-xl font-bold mb-2">99.9% Accuracy*</h3>
              <p className="text-gray-500 text-sm mb-2">
                Benchmarked against the latest generative models like Midjourney v6 and Sora.
              </p>
              <p className="text-xs text-gray-400 italic">
                *Based on internal testing with current model datasets. Performance may vary on unknown generators.
              </p>
            </MinimalCard>

            {/* Feature 4 */}
            <MinimalCard className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to secure your content?</h3>
                  <p className="text-blue-100">Start detecting in seconds. No credit card required.</p>
                </div>
                <PillButton onClick={() => navigate('/dashboard')} className="bg-white text-blue-600 hover:bg-gray-100">
                  Launch App
                </PillButton>
              </div>
            </MinimalCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>&copy; 2026 AuthenLens Inc. Built by BrewAI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
