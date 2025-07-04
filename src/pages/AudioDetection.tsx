// AudioDetection.tsx All Combined

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import DetectionResult from '@/components/DetectionResult';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader, Mic, User } from 'lucide-react';

// Define API endpoint
// const API_URL = 'http://localhost:5000';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = "https://authnlens-backend-674458572550.asia-south1.run.app/";

// Define the types for our audio analysis result
interface AudioAnalysisResult {
  is_real: boolean;
  confidence_real_fake: number;
  speaker: string;
  confidence_speaker: number;
  top_3_speakers: Array<{
    speaker: string;
    confidence: number;
  }>;
}

const AudioDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysisResult | undefined>();
  const [apiStatus, setApiStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const { toast } = useToast();

  // Helper function to check API health
  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
        toast({
          title: "API Connection Issue",
          description: "Unable to connect to the detection server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API health check failed:", error);
      setApiStatus('offline');
      toast({
        title: "API Connection Issue",
        description: "Unable to connect to the detection server",
        variant: "destructive",
      });
    }
  };

  // Check API health when component mounts
  useEffect(() => {
    checkApiHealth();
  }, []);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysisComplete(false);
    setAnalysisResult(undefined);
    
    // Create audio preview
    const url = URL.createObjectURL(selectedFile);
    setAudioPreview(url);
  };

  const handleAnalyzeClick = async () => {
    if (!file) {
      toast({
        title: "No audio selected",
        description: "Please upload an audio file to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Send request to Flask API - ensure this matches the endpoint in your Flask app
      const response = await fetch(`${API_URL}/api/audio/analyze`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Process the response
      setAnalysisResult(result);
      setAnalysisComplete(true);
      
      toast({
        title: "Analysis complete",
        description: result.is_real 
          ? "This audio appears to be human-created" 
          : "This audio appears to be AI-generated",
      });
    } catch (error) {
      console.error('Error analyzing audio:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }
    setFile(null);
    setAudioPreview(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setAnalysisResult(undefined);
  };

  // Function to render simple detection result for compatibility with DetectionResult component
  const getSimpleResult = () => {
    if (!analysisResult) return undefined;
    
    return {
      isAI: !analysisResult.is_real,
      confidence: analysisResult.confidence_real_fake
    };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Audio Detection</h1>
            <p className="text-muted-foreground">
              Upload an audio file to determine whether it was generated by AI or created by a human
            </p>
            {apiStatus === 'offline' && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
                <p className="font-medium">Detection server is offline</p>
                <p className="text-sm">Please ensure the Flask server is running at {API_URL}</p>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-6">
              {/* Uploader Section */}
              <Card>
                <CardContent className="p-6">
                  <FileUpload
                    accept="audio/*"
                    maxSize={10}
                    onFileSelected={handleFileSelected}
                  />
                  
                  <div className="flex justify-center mt-6 space-x-4">
                    <Button 
                      onClick={handleAnalyzeClick} 
                      disabled={!file || isAnalyzing || apiStatus === 'offline'}
                      className="w-full md:w-auto"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : "Analyze Audio"}
                    </Button>
                    
                    {(file || analysisComplete) && (
                      <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="w-full md:w-auto"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Audio Preview */}
              {audioPreview && (
                <Card className="overflow-hidden animate-fade-in">
                  <CardContent className="p-6">
                    <div className="w-full bg-muted/50 p-4 rounded-lg">
                      <audio 
                        src={audioPreview} 
                        controls 
                        className="w-full"
                      />
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground text-center">
                      Listen to the audio to check if you can hear any artificial patterns or artifacts
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="md:col-span-2">
              <DetectionResult
                loading={isAnalyzing}
                completed={analysisComplete}
                result={getSimpleResult()}
              />
              
              {analysisComplete && analysisResult && (
                <div className="space-y-6 mt-6">
                  {/* Speaker Detection Card */}
                  <Card className="overflow-hidden animate-fade-in">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4 space-x-2">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Speaker Detection</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                          <div className="text-sm text-muted-foreground mb-1">Identified Speaker</div>
                          <div className="text-lg font-medium">{analysisResult.speaker}</div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Confidence</span>
                            <span className="font-medium">{Math.round(analysisResult.confidence_speaker * 100)}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Top 3 Speaker Matches</h4>
                          <ul className="space-y-2">
                            {analysisResult.top_3_speakers.map((item, index) => (
                              <li key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <Mic className="h-4 w-4 text-muted-foreground" />
                                  <span>{item.speaker}</span>
                                </div>
                                <span className="text-sm font-medium">{Math.round(item.confidence * 100)}%</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Analysis Details */}
                  <div className="p-4 rounded-lg bg-muted animate-fade-in">
                    <h3 className="font-medium mb-2">Detection Details:</h3>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Analysis Method:</strong> MFCC & Mel Spectrogram</li>
                      <li><strong>Model:</strong> Dual-Output Neural Network</li>
                      <li><strong>Audio Length:</strong> {file?.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Unknown'}</li>
                      <li><strong>Classification:</strong> {analysisResult.is_real ? 'Human-Created' : 'AI-Generated'}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AudioDetection;




































// import { useState } from 'react';
// import Layout from '@/components/Layout';
// import FileUpload from '@/components/FileUpload';
// import DetectionResult from '@/components/DetectionResult';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/use-toast';

// const AudioDetection = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [audioPreview, setAudioPreview] = useState<string | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisComplete, setAnalysisComplete] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState<{ isAI: boolean; confidence: number } | undefined>();
//   const { toast } = useToast();

//   const handleFileSelected = (selectedFile: File) => {
//     setFile(selectedFile);
//     setAnalysisComplete(false);
//     setAnalysisResult(undefined);
    
//     // Create audio preview
//     const url = URL.createObjectURL(selectedFile);
//     setAudioPreview(url);
//   };

//   const handleAnalyzeClick = () => {
//     if (!file) {
//       toast({
//         title: "No audio selected",
//         description: "Please upload an audio file to analyze",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsAnalyzing(true);
//     setAnalysisComplete(false);
    
//     // Simulate API call to ML model
//     setTimeout(() => {
//       // This is where you would actually call your Keras model API
//       const mockResult = {
//         isAI: Math.random() > 0.5, // Random result for now
//         confidence: 0.7 + Math.random() * 0.25, // Random confidence between 70-95%
//       };
      
//       setAnalysisResult(mockResult);
//       setIsAnalyzing(false);
//       setAnalysisComplete(true);
      
//       toast({
//         title: "Analysis complete",
//         description: mockResult.isAI 
//           ? "This audio appears to be AI-generated" 
//           : "This audio appears to be human-created",
//       });
//     }, 4000);
//   };

//   const handleReset = () => {
//     if (audioPreview) {
//       URL.revokeObjectURL(audioPreview);
//     }
//     setFile(null);
//     setAudioPreview(null);
//     setIsAnalyzing(false);
//     setAnalysisComplete(false);
//     setAnalysisResult(undefined);
//   };

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-10">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-10">
//             <h1 className="text-3xl md:text-4xl font-bold mb-4">Audio Detection</h1>
//             <p className="text-muted-foreground">
//               Upload an audio file to determine whether it was generated by AI or created by a human
//             </p>
//           </div>
          
//           <div className="grid md:grid-cols-5 gap-8">
//             <div className="md:col-span-3 space-y-6">
//               {/* Uploader Section */}
//               <Card>
//                 <CardContent className="p-6">
//                   <FileUpload
//                     accept="audio/*"
//                     maxSize={10}
//                     onFileSelected={handleFileSelected}
//                   />
                  
//                   <div className="flex justify-center mt-6 space-x-4">
//                     <Button 
//                       onClick={handleAnalyzeClick} 
//                       disabled={!file || isAnalyzing}
//                       className="w-full md:w-auto"
//                     >
//                       {isAnalyzing ? "Analyzing..." : "Analyze Audio"}
//                     </Button>
                    
//                     {(file || analysisComplete) && (
//                       <Button 
//                         variant="outline" 
//                         onClick={handleReset}
//                         className="w-full md:w-auto"
//                       >
//                         Reset
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
              
//               {/* Audio Preview */}
//               {audioPreview && (
//                 <Card className="overflow-hidden animate-fade-in">
//                   <CardContent className="p-6">
//                     <div className="w-full bg-muted/50 p-4 rounded-lg">
//                       <audio 
//                         src={audioPreview} 
//                         controls 
//                         className="w-full"
//                       />
//                     </div>
//                     <div className="mt-4 text-sm text-muted-foreground text-center">
//                       Listen to the audio to check if you can hear any artificial patterns or artifacts
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
            
//             <div className="md:col-span-2">
//               <DetectionResult
//                 loading={isAnalyzing}
//                 completed={analysisComplete}
//                 result={analysisResult}
//               />
              
//               {analysisComplete && analysisResult && (
//                 <div className="mt-6 p-4 rounded-lg bg-muted animate-fade-in">
//                   <h3 className="font-medium mb-2">Detection Details:</h3>
//                   <ul className="space-y-2 text-sm">
//                     <li><strong>Analysis Method:</strong> Spectrogram Analysis</li>
//                     <li><strong>Model:</strong> AuraSound v1.0</li>
//                     <li><strong>Audio Length:</strong> {file?.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Unknown'}</li>
//                     <li className="text-muted-foreground pt-2 text-xs">
//                       Note: This is a demonstration. In the real application, your Keras model would provide the actual detection results.
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AudioDetection;
