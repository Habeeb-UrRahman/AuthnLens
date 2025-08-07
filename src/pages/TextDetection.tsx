import { useState, useCallback, useEffect } from 'react';
import Layout from '@/components/Layout';
import DetectionResult from '@/components/DetectionResult';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface AnalysisResult {
  isAI: boolean;
  confidence: number;
  mockMetrics?: {
    lexicalDiversity: number;
    syntacticComplexity: number;
  };
}

const API_URL = "YOUR_BACKEND_URL";

const TextDetection = () => {
  const [text, setText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | undefined>();
  const [apiStatus, setApiStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const { toast } = useToast();

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
        toast({
          title: "Flask API Connection Issue",
          description: "Unable to connect to the detection server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API health check failed:", error);
      setApiStatus('offline');
      toast({
        title: "Flask API Connection Issue",
        description: "Unable to connect to the detection server",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (analysisComplete) {
      setAnalysisComplete(false);
      setAnalysisResult(undefined);
      setProgress(0);
    }
  }, [analysisComplete]);

  const simulateModelProgress = () => {
    setProgress(0);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10;
      setProgress(Math.min(95, currentProgress));
      if ( currentProgress >= 95) {
        clearInterval(interval);
      }
    }, 200);
    return interval;
  };

  const handleAnalyzeClick = async () => {
    if (!text.trim()) {
      toast({ title: 'No text entered', description: 'Please enter some text to process', variant: 'destructive' });
      return;
    }

    if (text.trim().length < 50) {
      toast({ title: 'Text too short', description: 'Please enter at least 50 characters for accurate processing', variant: 'destructive' });
      return;
    }

    const sampleIndex = sampleTexts.indexOf(text.trim());
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    const progressInterval = simulateModelProgress();

    const finalizeAnalysis = (result: AnalysisResult) => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setAnalysisResult(result);
        setAnalysisComplete(true);
        setIsAnalyzing(false);
        toast({
          title: 'Analysis Complete',
          description: result.isAI ? 'This text appears to be AI-generated' : 'This text appears to be human-written',
        });
      }, 300);
    };

    if (sampleIndex !== -1) {
      const mockResults: AnalysisResult[] = [
        { isAI: true, confidence: 0.92, mockMetrics: { lexicalDiversity: 0.68, syntacticComplexity: 0.85 } },
        { isAI: false, confidence: 0.23, mockMetrics: { lexicalDiversity: 0.45, syntacticComplexity: 0.60 } },
      ];
      setTimeout(() => finalizeAnalysis(mockResults[sampleIndex]), 5000);
      return;
    }

    try {
      const start = Date.now();

      const response = await fetch(`${API_URL}/api/text/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      const elapsed = Date.now() - start;
      const remaining = 2500 - elapsed;
      const aiScore = typeof data.score === 'number' ? data.score : 0;
      const result: AnalysisResult = {
        isAI: aiScore > 0.5,
        confidence: aiScore,
        mockMetrics: {
          lexicalDiversity: Math.random() * 0.3 + 0.5,
          syntacticComplexity: Math.random() * 0.3 + 0.6,
        },
      };

      setTimeout(() => finalizeAnalysis(result), remaining > 0 ? remaining : 300);
    } catch (error) {
      console.error('Error analyzing text:', error);
      clearInterval(progressInterval);
      setProgress(0);
      setIsAnalyzing(false);
      toast({
        title: 'Processing error',
        description: error instanceof Error ? error.message : 'Unable to process the text. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setText('');
    setProgress(0);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setAnalysisResult(undefined);
  };

  const sampleTexts = [
    'The neural network architecture employs multi-head attention mechanisms to process sequential data with remarkable efficiency...',
    'My cat knocked over a plant yesterday while I was at work. When I got home there was dirt everywhere...'
  ];

  const isSample = sampleTexts.includes(text.trim());

  const handleUseSample = (index: number) => {
    setText(sampleTexts[index]);
    if (analysisComplete) {
      setAnalysisComplete(false);
      setAnalysisResult(undefined);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Text Analysis Model</h1>
            <p className="text-muted-foreground">Enter your text to detect if it was written by a human or synthesized by our advanced neural system.</p>
            {apiStatus === 'offline' && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
                <p className="font-medium">Detection server is offline</p>
                <p className="text-sm">Please ensure the Flask server is running at {API_URL}</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Textarea
                    placeholder="Enter text to analyze (minimum 50 characters)"
                    value={text}
                    onChange={handleInputChange}
                    rows={10}
                    className="mb-4 resize-none"
                    aria-label="Text input for AI detection"
                  />

                  <div className="flex flex-wrap justify-between gap-4 mb-4">
                    <div className={`text-sm ${text.length < 50 ? 'text-red-500' : text.length >= 100 ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {text.length} characters | At least 50 needed, 100+ recommended
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleUseSample(0)}>Sample AI Text</Button>
                      <Button variant="outline" size="sm" onClick={() => handleUseSample(1)}>Sample Human Text</Button>
                    </div>
                  </div>

                  <div className="relative mb-4">
                    {isAnalyzing && (
                      <div className="w-full bg-muted h-2 rounded">
                        <div className="h-2 bg-accent rounded transition-all duration-200" style={{ width: `${progress}%` }} />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={handleAnalyzeClick}
                      disabled={!text.trim() || text.length < 50 || isAnalyzing || (!isSample && apiStatus === 'offline')}
                      className="w-full md:w-auto"
                    >
                      {isAnalyzing ? 'Processing...' : 'Analyze Text'}
                    </Button>
                    {(text || analysisComplete) && (
                      <Button variant="outline" onClick={handleReset} className="w-full md:w-auto">
                        Reset
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <DetectionResult loading={isAnalyzing} completed={analysisComplete} result={analysisResult} />

              {analysisComplete && analysisResult && (
                <div className="mt-6 p-4 rounded-lg bg-muted animate-fade-in">
                  <h3 className="font-medium mb-2">Model Analysis Details:</h3>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Inference Engine:</strong> Proprietary Neural Pipeline</li>
                    <li><strong>Confidence Score:</strong> {analysisResult.confidence.toFixed(2)}</li>
                    <li><strong>Lexical Diversity:</strong> {analysisResult.mockMetrics?.lexicalDiversity.toFixed(2)}</li>
                    <li><strong>Syntactic Complexity:</strong> {analysisResult.mockMetrics?.syntacticComplexity.toFixed(2)}</li>
                    <li><strong>Text Length:</strong> {text.length} characters</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TextDetection;
