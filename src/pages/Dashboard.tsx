
import { useNavigate } from 'react-router-dom';
import { FileDropZone } from '@/components/ui/FileDropZone';
import { MinimalCard, PageHeader, PillButton } from '@/components/ui/MinimalComponents';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';



const Dashboard = () => {
    const navigate = useNavigate();

    const handleFileAccepted = (file: File) => {
        const type = file.type;
        console.log("Processing file:", file.name, type);

        let path = '/';
        if (type.startsWith('image/')) path = '/image';
        else path = '/video'; // Default to video or handle error if needed

        // Use timeout to ensure state is passed correctly after navigation
        setTimeout(() => {
            navigate(path, { state: { file } });
        }, 100);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <PageHeader
                    title="Command Center"
                    subtitle="Monitor detecting activities and initialize new forensic protocols."
                />
                <div className="flex gap-2">
                    <PillButton variant="outline" size="sm" icon={<Activity className="w-4 h-4" />}>
                        View Reports
                    </PillButton>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Upload Zone - Large Block */}
                <div className="md:col-span-2 row-span-2">
                    <MinimalCard className="h-full flex flex-col justify-between bg-gradient-to-br from-white to-blue-50/50">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">
                                    <Zap className="w-4 h-4" />
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">Quick Analysis</h2>
                            </div>
                            <p className="text-gray-500">
                                Drag and drop ANY media file to instantly start the deepfake detection engine.
                            </p>
                        </div>
                        <FileDropZone
                            onFileAccepted={handleFileAccepted}
                            className="flex-1 min-h-[300px]"
                        />
                    </MinimalCard>
                </div>

                {/* 2. System Status & Info Column */}
                <div className="space-y-6">
                    {/* System Status */}
                    <MinimalCard className="py-5">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-600" /> System Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Image Engine (EfficientNet)</span>
                                <span className="flex items-center gap-1.5 text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Video Engine (MesoNet)</span>
                                <span className="flex items-center gap-1.5 text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">API Gateway</span>
                                <span className="flex items-center gap-1.5 text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                                </span>
                            </div>
                        </div>
                    </MinimalCard>

                    {/* Supported Formats */}
                    <MinimalCard className="py-5">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Supported Formats</h3>
                        <div className="flex flex-wrap gap-2">
                            {['JPG', 'PNG', 'WEBP', 'MP4', 'MOV', 'AVI'].map(fmt => (
                                <span key={fmt} className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                    {fmt}
                                </span>
                            ))}
                        </div>
                    </MinimalCard>
                </div>

                {/* 3. Analysis Tips - Wide Block */}
                <div className="md:col-span-3">
                    <MinimalCard className="bg-gradient-to-r from-gray-900 to-slate-800 text-white border-none">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-xl">
                                <ShieldCheck className="w-6 h-6 text-blue-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">Forensic Analysis Tips</h3>
                                <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">
                                    For the most accurate results, avoid uploading files that have been heavily compressed by social media platforms (WhatsApp, Facebook, etc.).
                                    Original, raw files retain the digital artifacts necessary for our deep learning models to detect manipulation.
                                </p>
                                <div className="flex gap-6 text-xs text-gray-400 font-medium tracking-wide uppercase">
                                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> No compression</span>
                                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> Original metadata</span>
                                </div>
                            </div>
                        </div>
                    </MinimalCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
