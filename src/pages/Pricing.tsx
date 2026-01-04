
import { useNavigate } from 'react-router-dom';
import { Check, Youtube, ArrowRight, Shield } from 'lucide-react';
import { MinimalCard, PillButton, PageHeader } from '@/components/ui/MinimalComponents';
import { motion } from 'framer-motion';

const Pricing = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-6 py-24 max-w-5xl">
            <PageHeader
                title="Simple, transparent pricing."
                subtitle="We are in public beta. Enjoy full access to enterprise-grade detection tools for free."
                className="text-center mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Beta Card */}
                <MinimalCard className="border-2 border-blue-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                        Values
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-bold mb-2">Public Beta</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-gray-400">/ month</span>
                        </div>
                        <p className="text-gray-500 mb-8">
                            Everything you need to detect deepfakes in images and videos. No credit card required.
                        </p>

                        <ul className="space-y-4 mb-8">
                            {['Unlimited Image Analysis', 'Unlimited Video Analysis', 'Forensic Reports', 'API Access (Coming Soon)'].map((feat) => (
                                <li key={feat} className="flex items-center gap-3 text-sm">
                                    <span className="bg-green-100 text-green-600 p-0.5 rounded-full">
                                        <Check className="w-3 h-3" />
                                    </span>
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        <PillButton onClick={() => navigate('/dashboard')} className="w-full justify-center">
                            Start Detecting Now <ArrowRight className="w-4 h-4 ml-2" />
                        </PillButton>
                    </div>
                </MinimalCard>

                {/* Support Us Card */}
                <MinimalCard className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden transform md:scale-105 shadow-2xl">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl"></div>
                    <div className="p-8 relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-600 p-2 rounded-lg text-white">
                                <Youtube className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold">Support the Project</h3>
                        </div>

                        <p className="text-gray-300 mb-8 leading-relaxed">
                            AuthenLens is an open research initiative. The best way to support our work is by subscribing to our YouTube channel, where we break down the latest AI security threats.
                        </p>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 border border-white/10">
                            <div className="font-bold text-lg mb-1">TechBrew TV</div>
                            <div className="text-xs text-gray-400 uppercase tracking-widest">Official Channel</div>
                        </div>

                        <a
                            href="https://www.youtube.com/@techbrewtv"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 group">
                                <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Subscribe on YouTube
                            </button>
                        </a>
                    </div>
                </MinimalCard>
            </div>

            <div className="mt-20 text-center space-y-4">
                <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-full text-sm font-medium border border-green-100">
                    <Shield className="w-4 h-4" />
                    Strict Privacy Policy
                </div>
                <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
                    We value your trust. Any media files you upload for analysis are <span className="font-bold text-gray-700">processed in real-time and immediately discarded</span>.
                    We do <u>not</u> store, collect, or use your data to train our models. Your content remains yours.
                </p>
            </div>
        </div>
    );
};

export default Pricing;
