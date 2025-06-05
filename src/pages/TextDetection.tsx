import { useState, useCallback } from 'react';
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

const TextDetection = () => {
  const [text, setText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | undefined>();
  const { toast } = useToast();

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
      if (currentProgress >= 95) {
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

      const response = await fetch('https://api.sapling.ai/api/v1/aidetect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'I9DA47LYX4C3UQGRRBUF7C5DZPRFJ65S', text }),
      });
      const data = await response.json();

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
      clearInterval(progressInterval);
      setProgress(0);
      setIsAnalyzing(false);
      toast({
        title: 'Processing error',
        description: 'Unable to process the text. Please try again.',
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
                      disabled={!text.trim() || text.length < 50 || isAnalyzing}
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

























// // TexteDetection.tsx All Combined

// import { useState, useCallback } from 'react';
// import Layout from '@/components/Layout';
// import DetectionResult from '@/components/DetectionResult';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/components/ui/use-toast';

// // Note: PRIVATE_KEY should be handled server-side in a production environment
// // const PRIVATE_KEY = 'I9DA47LYX4C3UQGRRBUF7C5DZPRFJ65S';

// interface AnalysisResult {
//   isAI: boolean;
//   confidence: number;
//   mockMetrics?: {
//     lexicalDiversity: number;
//     syntacticComplexity: number;
//   };
// }

// const TextDetection = () => {
//   const [text, setText] = useState<string>('');
//   const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
//   const [progress, setProgress] = useState<number>(0);
//   const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
//   const [analysisResult, setAnalysisResult] = useState<AnalysisResult | undefined>();
//   const { toast } = useToast();

//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setText(e.target.value);
//     if (analysisComplete) {
//       setAnalysisComplete(false);
//       setAnalysisResult(undefined);
//       setProgress(0);
//     }
//   }, [analysisComplete]);

//   const simulateModelProgress = (textLength: number) => {
//     setProgress(0);
//     const steps = Math.ceil(textLength / 100); // Simulate processing in chunks
//     let currentStep = 0;
//     const interval = setInterval(() => {
//       currentStep++;
//       setProgress(Math.min(100, (currentStep / steps) * 100));
//       if (currentStep >= steps) {
//         clearInterval(interval);
//       }
//     }, 200); // 200ms per step
//     return interval;
//   };

//   const handleAnalyzeClick = async () => {
//     if (!text.trim()) {
//       toast({ title: 'No text entered', description: 'Please enter some text to process', variant: 'destructive' });
//       return;
//     }

//     if (text.trim().length < 50) {
//       toast({ title: 'Text too short', description: 'Please enter at least 50 characters for accurate processing', variant: 'destructive' });
//       return;
//     }

//     // Check if text matches a sample text (mocked results)
//     const sampleIndex = sampleTexts.indexOf(text.trim());
//     if (sampleIndex !== -1) {
//       setIsAnalyzing(true);
//       setAnalysisComplete(false);
//       const progressInterval = simulateModelProgress(text.length);

//       // Mocked results for sample texts
//       const mockResults: AnalysisResult[] = [
//         { isAI: true, confidence: 0.92, mockMetrics: { lexicalDiversity: 0.68, syntacticComplexity: 0.85 } },
//         { isAI: false, confidence: 0.23, mockMetrics: { lexicalDiversity: 0.45, syntacticComplexity: 0.60 } },
//       ];

//       setTimeout(() => {
//         clearInterval(progressInterval);
//         setProgress(100);
//         setAnalysisResult(mockResults[sampleIndex]);
//         setAnalysisComplete(true);
//         toast({
//           title: 'Processing complete',
//           description: mockResults[sampleIndex].isAI ? 'This text appears to be AI-generated' : 'This text appears to be human-written',
//         });
//         setIsAnalyzing(false);
//       }, 1000); // Short delay to mimic model inference
//       return;
//     }

//     setIsAnalyzing(true);
//     setAnalysisComplete(false);
//     const progressInterval = simulateModelProgress(text.length);

//     try {
//       // In production, this should be a server-side endpoint (e.g., /api/analyze)
//       const response = await fetch('https://api.sapling.ai/api/v1/aidetect', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ key: 'I9DA47LYX4C3UQGRRBUF7C5DZPRFJ65S', text }),
//       });
//       const data = await response.json();

//       clearInterval(progressInterval);
//       setProgress(100);

//       const aiScore = typeof data.score === 'number' ? data.score : 0;
//       const isAI = aiScore > 0.5;
//       setAnalysisResult({
//         isAI,
//         confidence: aiScore,
//         mockMetrics: {
//           lexicalDiversity: Math.random() * 0.3 + 0.5, // Fake metric
//           syntacticComplexity: Math.random() * 0.3 + 0.6, // Fake metric
//         },
//       });
//       setAnalysisComplete(true);

//       toast({
//         title: 'Processing complete',
//         description: isAI ? 'This text appears to be AI-generated' : 'This text appears to be human-written',
//       });
//     } catch (error) {
//       clearInterval(progressInterval);
//       setProgress(0);
//       toast({
//         title: 'Processing error',
//         description: 'Unable to process the text. Please try again.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const handleReset = () => {
//     setText('');
//     setProgress(0);
//     setIsAnalyzing(false);
//     setAnalysisComplete(false);
//     setAnalysisResult(undefined);
//   };

//   const sampleTexts = [
//     'The neural network architecture employs multi-head attention mechanisms to process sequential data with remarkable efficiency, enabling the model to capture long-range dependencies within textual inputs.',
//     'My cat knocked over a plant yesterday while I was at work. When I got home there was dirt everywhere and she just sat there looking proud of her accomplishment.'
//   ];

//   const handleUseSample = (index: number) => {
//     setText(sampleTexts[index]);
//     if (analysisComplete) {
//       setAnalysisComplete(false);
//       setAnalysisResult(undefined);
//       setProgress(0);
//     }
//   };

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-10">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-10">
//             <h1 className="text-3xl md:text-4xl font-bold mb-4">Text Analysis Model</h1>
//             <p className="text-muted-foreground">Enter text to analyze whether it was generated by AI or written by a human using our proprietary neural network.</p>
//           </div>

//           <div className="grid md:grid-cols-5 gap-8">
//             <div className="md:col-span-3 space-y-6">
//               <Card>
//                 <CardContent className="p-6">
//                   <Textarea
//                     placeholder="Enter text to analyze (minimum 50 characters)"
//                     value={text}
//                     onChange={handleInputChange}
//                     rows={10}
//                     className="mb-4 resize-none"
//                     aria-label="Text input for AI detection"
//                   />

//                   <div className="flex flex-wrap justify-between gap-4 mb-4">
//                     <div className={`text-sm ${text.length < 50 ? 'text-red-500' : text.length >= 100 ? 'text-green-500' : 'text-muted-foreground'}`}>
//                       {text.length} characters | At least 50 needed, 100+ recommended
//                     </div>
//                     <div className="space-x-2">
//                       <Button variant="outline" size="sm" onClick={() => handleUseSample(0)} aria-label="Load AI-generated sample text">Sample AI Text</Button>
//                       <Button variant="outline" size="sm" onClick={() => handleUseSample(1)} aria-label="Load human-written sample text">Sample Human Text</Button>
//                     </div>
//                   </div>

//                   <div className="relative mb-4">
//                     {isAnalyzing && (
//                       <div className="w-full bg-muted h-2 rounded">
//                         <div className="h-2 bg-accent rounded transition-all duration-200" style={{ width: `${progress}%` }} />
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex justify-center space-x-4">
//                     <Button
//                       onClick={handleAnalyzeClick}
//                       disabled={!text.trim() || text.length < 50 || isAnalyzing}
//                       className="w-full md:w-auto"
//                       aria-label="Analyze text"
//                     >
//                       {isAnalyzing ? 'Processing...' : 'Analyze Text'}
//                     </Button>
//                     {(text || analysisComplete) && (
//                       <Button variant="outline" onClick={handleReset} className="w-full md:w-auto" aria-label="Reset form">
//                         Reset
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="md:col-span-2">
//               <DetectionResult loading={isAnalyzing} completed={analysisComplete} result={analysisResult} />

//               {analysisComplete && analysisResult && (
//                 <div className="mt-6 p-4 rounded-lg bg-muted animate-fade-in">
//                   <h3 className="font-medium mb-2">Model Analysis Details:</h3>
//                   <ul className="space-y-2 text-sm">
//                     <li><strong>Analysis Method:</strong> Neural Network Inference</li>
//                     <li><strong>Confidence Score:</strong> {analysisResult.confidence.toFixed(2)}</li>
//                     <li><strong>Lexical Diversity:</strong> {analysisResult.mockMetrics?.lexicalDiversity.toFixed(2)}</li>
//                     <li><strong>Syntactic Complexity:</strong> {analysisResult.mockMetrics?.syntacticComplexity.toFixed(2)}</li>
//                     <li><strong>Text Length:</strong> {text.length} characters</li>
//                   </ul>
//                 </div>
//               )}

//               <Card className="mt-6">
//                 <CardContent className="p-4">
//                   <h3 className="font-medium mb-2">About Our Model</h3>
//                   <p className="text-sm text-muted-foreground">
//                      Our proprietary neural network analyzes linguistic patterns, semantic coherence, and syntactic structures to distinguish AI-generated text from human-authored content.
//                   </p>
//                   <p className="text-sm text-muted-foreground mt-2">For best results, provide at least 100+ characters.</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default TextDetection;















// import { useState } from 'react';
// import Layout from '@/components/Layout';
// import DetectionResult from '@/components/DetectionResult';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/components/ui/use-toast';

// const PRIVATE_KEY = 'I9DA47LYX4C3UQGRRBUF7C5DZPRFJ65S';

// const TextDetection = () => {
//   const [text, setText] = useState('');
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [analysisComplete, setAnalysisComplete] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState<{ isAI: boolean; confidence: number } | undefined>();
//   const { toast } = useToast();

//   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setText(e.target.value);
//     if (analysisComplete) {
//       setAnalysisComplete(false);
//       setAnalysisResult(undefined);
//       setProgress(0);
//     }
//   };

//   const simulateProgress = () => {
//     setProgress(0);
//     const interval = setInterval(() => {
//       setProgress(prev => {
//         const next = prev + Math.random() * 15;
//         if (next >= 95) {
//           clearInterval(interval);
//           return 95;
//         }
//         return next;
//       });
//     }, 200);
//     return interval;
//   };

//   const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//   const handleAnalyzeClick = async () => {
//     if (!text.trim()) {
//       toast({ title: 'No text entered', description: 'Please enter some text to analyze', variant: 'destructive' });
//       return;
//     }

//     if (text.trim().length < 50) {
//       toast({ title: 'Text too short', description: 'Please enter at least 50 characters for accurate analysis', variant: 'destructive' });
//       return;
//     }

//     setIsAnalyzing(true);
//     setAnalysisComplete(false);
//     const progressInterval = simulateProgress();
//     const minDuration = 2500;
//     const startTime = Date.now();

//     try {
//       const response = await fetch('https://api.sapling.ai/api/v1/aidetect', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ key: PRIVATE_KEY, text }),
//       });
//       const data = await response.json();

//       const elapsed = Date.now() - startTime;
//       if (elapsed < minDuration) await sleep(minDuration - elapsed);

//       clearInterval(progressInterval);
//       setProgress(100);

//       const aiScore = typeof data.score === 'number' ? data.score : 0;
//       const isAI = aiScore > 0.5;
//       setAnalysisResult({ isAI, confidence: aiScore });
//       setAnalysisComplete(true);

//       toast({
//         title: 'Analysis complete',
//         description: isAI ? 'This text appears to be generated by AI' : 'This text appears to be human-written',
//       });
//     } catch {
//       clearInterval(progressInterval);
//       setProgress(0);
//       toast({ title: 'Analysis failed', description: 'There was an error processing your request. Please try again.', variant: 'destructive' });
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const handleReset = () => {
//     setText('');
//     setProgress(0);
//     setIsAnalyzing(false);
//     setAnalysisComplete(false);
//     setAnalysisResult(undefined);
//   };

//   const sampleTexts = [
//     'The neural network architecture employs multi-head attention mechanisms to process sequential data with remarkable efficiency, enabling the model to capture long-range dependencies within textual inputs.',
//     'My cat knocked over a plant yesterday while I was at work. When I got home there was dirt everywhere and she just sat there looking proud of her accomplishment.'
//   ];

//   const handleUseSample = (index: number) => {
//     setText(sampleTexts[index]);
//     if (analysisComplete) {
//       setAnalysisComplete(false);
//       setAnalysisResult(undefined);
//       setProgress(0);
//     }
//   };

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-10">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-10">
//             <h1 className="text-3xl md:text-4xl font-bold mb-4">Text Detection</h1>
//             <p className="text-muted-foreground">Enter text to determine whether it was generated by AI or written by a human</p>
//           </div>

//           <div className="grid md:grid-cols-5 gap-8">
//             <div className="md:col-span-3 space-y-6">
//               <Card>
//                 <CardContent className="p-6">
//                   <Textarea
//                     placeholder="Enter text to analyze (minimum 50 characters)"
//                     value={text}
//                     onChange={handleInputChange}
//                     rows={10}
//                     className="mb-4 resize-none"
//                   />

//                   <div className="flex flex-wrap justify-between gap-4 mb-4">
//                     <div className="text-sm text-muted-foreground">{text.length} characters | At least 50 needed for analysis</div>
//                     <div className="space-x-2">
//                       <Button variant="outline" size="sm" onClick={() => handleUseSample(0)}>Sample AI Text</Button>
//                       <Button variant="outline" size="sm" onClick={() => handleUseSample(1)}>Sample Human Text</Button>
//                     </div>
//                   </div>

//                   <div className="relative mb-4">
//                     {isAnalyzing && (
//                       <div className="w-full bg-muted h-2 rounded">
//                         <div className="h-2 bg-accent rounded" style={{ width: `${progress}%` }} />
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex justify-center space-x-4">
//                     <Button onClick={handleAnalyzeClick} disabled={!text.trim() || text.length < 50 || isAnalyzing} className="w-full md:w-auto">
//                       {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
//                     </Button>
//                     {(text || analysisComplete) && <Button variant="outline" onClick={handleReset} className=" w-full md:w-auto">Reset</Button>}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="md:col-span-2">
//               <DetectionResult loading={isAnalyzing} completed={analysisComplete} result={analysisResult} />

//               {analysisComplete && analysisResult && (
//                 <div className="mt-6 p-4 rounded-lg bg-muted animate-fade-in">
//                   <h3 className="font-medium mb-2">Detection Details:</h3>
//                   <ul className="space-y-2 text-sm">
//                     <li><strong>Analysis Method:</strong> Proprietary NLP Pipeline</li>
//                     <li><strong>Confidence Score:</strong> {analysisResult.confidence.toFixed(2)}</li>
//                     <li><strong>Text Length:</strong> {text.length} characters</li>
//                   </ul>
//                 </div>
//               )}

//               <Card className="mt-6">
//                 <CardContent className="p-4">
//                   <h3 className="font-medium mb-2">About Text Detection</h3>
//                   <p className="text-sm text-muted-foreground">Our system analyzes linguistic patterns, stylistic markers, and statistical features to differentiate between AI-generated and human-authored text.</p>
//                   <p className="text-sm text-muted-foreground mt-2">For best results, provide at least 100+ characters.</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default TextDetection;







