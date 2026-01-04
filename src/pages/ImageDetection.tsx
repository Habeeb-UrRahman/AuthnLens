
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FileDropZone } from '@/components/ui/FileDropZone';
import { MinimalCard, PillButton, PageHeader } from '@/components/ui/MinimalComponents';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { endpoints } from '@/lib/api';

const ImageDetection = () => {
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ isAI: boolean; confidence: number } | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    // Handle file passed from Dashboard
    if (location.state?.file) {
      handleFileSelected(location.state.file);
      // Clear history state
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysisComplete(false);
    setAnalysisResult(undefined);

    // Cleanup previous preview
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleAnalyzeClick = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(endpoints.image, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      setAnalysisResult({
        isAI: result.isAI,
        confidence: result.confidence,
      });
      setAnalysisComplete(true);

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Connect Error",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview); // Memory cleanup
    setFile(null);
    setImagePreview(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setAnalysisResult(undefined);
  };

  return (
    <div className="pb-12 animate-fade-in">
      <PageHeader
        title="Image Forensics"
        subtitle="Deep learning pixel analysis for generative artifact detection."
      />

      <div className="grid md:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="md:col-span-7 space-y-6">
          <MinimalCard className="min-h-[400px] flex flex-col">
            {!imagePreview ? (
              <FileDropZone
                onFileAccepted={handleFileSelected}
                accept="image/*"
                maxSizeMB={25}
                className="flex-1"
              />
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-gray-50 flex-1 flex items-center justify-center border border-gray-100">
                <img src={imagePreview} alt="Analysis Target" className="max-w-full max-h-[500px] object-contain" />

                <div className="absolute top-4 right-4 flex gap-2">
                  <PillButton size="sm" variant="secondary" onClick={handleReset} icon={<RefreshCw className="w-3 h-3" />}>
                    Reset
                  </PillButton>
                </div>
              </div>
            )}

            {file && !analysisComplete && (
              <div className="mt-6">
                <PillButton
                  onClick={handleAnalyzeClick}
                  isLoading={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? 'Running Neural Scan...' : 'Run Analysis'}
                </PillButton>
              </div>
            )}
          </MinimalCard>
        </div>

        {/* Results Column */}
        <div className="md:col-span-5 space-y-6">
          {/* Status Card */}
          <MinimalCard className={cn(
            "transition-all duration-500 border-l-4",
            !analysisComplete ? "border-l-gray-200" :
              analysisResult?.isAI ? "border-l-red-500 bg-red-50/30" : "border-l-green-500 bg-green-50/30"
          )}>
            {!analysisComplete ? (
              <div className="text-center py-12 text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 animate-pulse" />
                <p>Awaiting Results</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-full", analysisResult?.isAI ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>
                    {analysisResult?.isAI ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {analysisResult?.isAI ? "Synthetic Generated" : "Human Authentic"}
                    </h3>
                    <p className="text-gray-500">{analysisResult?.isAI ? "High probability of AI manipulation." : "No significant artifacts detected."}</p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Confidence Score</span>
                    <span>{Math.round((analysisResult?.confidence || 0) * 100)}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-1000", analysisResult?.isAI ? "bg-red-500" : "bg-green-500")}
                      style={{ width: `${Math.round((analysisResult?.confidence || 0) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </MinimalCard>

          {/* Metrics Card (Mock for now, can be real later) */}
          {analysisComplete && (
            <MinimalCard>
              <h4 className="font-bold text-gray-900 mb-4">Forensic Matrix</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">ELA Noise Level</span>
                  <span className="font-mono text-sm font-bold">0.042</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Compression Artifacts</span>
                  <span className="font-mono text-sm font-bold">Low</span>
                </div>
              </div>
            </MinimalCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDetection;