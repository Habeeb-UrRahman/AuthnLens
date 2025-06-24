import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Loader, Image, Video, AudioLines, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReviewEntry {
  textualRating?: string;
  title?: string;
  url?: string;
  publisherName?: string;
  claimReviewed?: string;
}

const RATING_MAP: Record<string, string> = {
  'True': 'This claim is accurate.',
  'Mostly True': 'This claim is largely correct but may omit nuance.',
  'Half True': 'This claim has both accurate and inaccurate elements.',
  'Mostly False': 'This claim is largely inaccurate.',
  'False': 'This claim is incorrect.',
  'Pants on Fire': 'This claim is not only false but ridiculous.',
  'Four Pinocchios': 'This claim is false with no redeeming facts.',
  'Three Pinocchios': 'This claim has multiple significant errors.',
  'Two Pinocchios': 'This claim contains a mix of good and bad parts.'
};

// const API_URL = 'http://localhost:5000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const exampleClaims = [
  'COVID-19 vaccines contain microchips.',
  'The moon landing was staged in a studio.',
  'Wind turbines cause cancer.'
];

const FactChecker = () => {
  const [mode, setMode] = useState<'type' | 'upload'>('type');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast().toast;
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Clear previous when input changes
  useEffect(() => setResults([]), [text, file]);

  const handleFile = (f: File) => {
    if (!['text/plain', 'application/pdf'].includes(f.type)) {
      toast({ title: 'Invalid file', description: 'Only .txt or .pdf allowed.', variant: 'destructive' });
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setText(e.target?.result as string || '');
    reader.readAsText(f);
  };

  const handleVerify = async () => {
    if (!text.trim()) {
      toast({ title: 'No claim', description: 'Type or upload to verify.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/factcheck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // flatten claimReview
      const entries: ReviewEntry[] = [];
      (data.claims || []).forEach((c: any) =>
        (c.claimReview || []).forEach((r: any) =>
          entries.push({
            textualRating: r.textualRating,
            title: r.title,
            url: r.url,
            publisherName: r.publisher?.name,
            claimReviewed: r.claimReviewed
          })
        )
      );
      setResults(entries);
      if (resultsRef.current) resultsRef.current.scrollTo(0, 0);
      if (!entries.length) toast({ title: 'No matches', description: 'No reviews found.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Subtle SVG background shape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-0 right-0 w-64 opacity-10 animate-float" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="#3B82F680" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 relative">
        {/* Left Panel: Input */}
        <Card className="sticky top-24 self-start shadow-lg">
          <CardContent className="space-y-6 p-8">
            <div className="flex items-center space-x-3">
              <Info className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-semibold">Fact Checker - Verify a Claim</h2>
            </div>

            {/* Mode Tabs */}
            <div className="flex space-x-4 border-b pb-2">
              <button
                className={`pb-1 font-medium ${mode === 'type' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setMode('type')}
              >
                Type / Paste
              </button>
              <button
                className={`pb-1 font-medium ${mode === 'upload' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setMode('upload')}
              >
                Upload File
              </button>
            </div>

            {/* Input Field */}
            {mode === 'type' ? (
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your claim…"
                value={text}
                onChange={e => setText(e.target.value)}
              />
            ) : (
              <FileUpload accept=".txt,.pdf" maxSize={10} onFileSelected={handleFile} />
            )}

            {/* Example Buttons */}
            <div className="flex flex-wrap gap-3">
              {exampleClaims.map((c, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => { setMode('type'); setText(c); }}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {c.length > 25 ? c.slice(0, 25) + '…' : c}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button className="flex-1" onClick={handleVerify} disabled={loading}>
                {loading
                  ? <><Loader className="w-5 h-5 mr-2 animate-spin text-white" />Checking…</>
                  : 'Verify Claim'
                }
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => { setText(''); setFile(null); setResults([]); }}>
                Reset
              </Button>
            </div>

            {/* Quick Detector Links */}
            <div>
              <h3 className="font-medium mb-2">Other Tools</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Image, label: 'Image', path: '/image', bg: 'bg-blue-100' },
                  { icon: Video, label: 'Video', path: '/video', bg: 'bg-purple-100' },
                  { icon: AudioLines, label: 'Audio', path: '/audio', bg: 'bg-green-100' },
                ].map((d) => (
                  <div
                    key={d.label}
                    className={`flex flex-col items-center p-2 rounded-lg cursor-pointer hover:shadow-md transition`}
                    onClick={() => navigate(d.path)}
                  >
                    <div className={`${d.bg} p-2 rounded-full mb-1`}>
                      <d.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm">{d.label} Tool</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel: Results */}
        <div
          ref={resultsRef}
          className="space-y-6 overflow-y-auto max-h-[75vh] pr-2"
        >
          {loading && (
            <p className="text-center text-gray-500">Fetching results…</p>
          )}

          {!loading && results.length === 0 && (
            <p className="text-center text-gray-400">No results yet. Enter a claim to begin.</p>
          )}

          {results.map((r, i) => (
            <Card key={i} className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="space-y-3 p-6">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-semibold">{r.title || 'Fact-Check Result'}</h4>
                  {r.textualRating && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full cursor-help">
                          {r.textualRating}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {RATING_MAP[r.textualRating] || 'Rating info unavailable'}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                {r.claimReviewed && (
                  <p className="italic text-gray-700">“{r.claimReviewed}”</p>
                )}
                <div className="flex justify-between items-center">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Read full review
                  </a>
                  <span className="text-gray-400 text-xs">
                    Source: {r.publisherName || 'Unknown'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FactChecker;
























// import { useState, useEffect } from 'react';
// import Layout from '@/components/Layout';
// import FileUpload from '@/components/FileUpload';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
// import { useToast } from '@/hooks/use-toast';
// import { Loader, Image, Video, AudioLines, Info } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// interface ReviewEntry {
//   textualRating?: string;
//   title?: string;
//   url?: string;
//   publisherName?: string;
//   claimReviewed?: string;
// }

// // Friendly explanations for common rating terms
// const RATING_MAP: Record<string, string> = {
//   'True': 'This claim is accurate.',
//   'Mostly True': 'This claim is largely correct but may omit nuance.',
//   'Half True': 'This claim has both accurate and inaccurate elements.',
//   'Mostly False': 'This claim is largely inaccurate.',
//   'False': 'This claim is incorrect.',
//   'Pants on Fire': 'This claim is not only false but ridiculous.',
//   'Four Pinocchios': 'This claim is false with no redeeming facts.',
//   'Three Pinocchios': 'This claim has multiple significant errors.',
//   'Two Pinocchios': 'This claim contains a mix of good and bad parts.'
// };

// const API_URL = 'http://localhost:5000';

// const FactChecker = () => {
//   const [text, setText] = useState('');
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState<ReviewEntry[]>([]);
//   const [mode, setMode] = useState<'type' | 'upload'>('type');
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   // Clear previous results when input changes
//   useEffect(() => {
//     setResults([]);
//   }, [text, file]);

//   const handleFile = (file: File) => {
//     if (!['text/plain', 'application/pdf'].includes(file.type)) {
//       toast({ title: 'Invalid file type', description: 'Only .txt or .pdf files allowed.', variant: 'destructive' });
//       return;
//     }
//     setFile(file);
//     const reader = new FileReader();
//     reader.onload = e => setText(e.target?.result as string || '');
//     reader.readAsText(file);
//   };

//   const handleVerify = async () => {
//     if (!text.trim()) {
//       toast({ title: 'No claim provided', description: 'Please type a claim or upload a file first.', variant: 'destructive' });
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/factcheck`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text })
//       });
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);

//       // Flatten all claimReview entries
//       const entries: ReviewEntry[] = [];
//       (data.claims || []).forEach((claim: any) => {
//         (claim.claimReview || []).forEach((rev: any) => {
//           entries.push({
//             textualRating: rev.textualRating,
//             title: rev.title,
//             url: rev.url,
//             publisherName: rev.publisher?.name,
//             claimReviewed: rev.claimReviewed
//           });
//         });
//       });

//       setResults(entries);
//       if (!entries.length) {
//         toast({ title: 'No fact-checks found', description: 'We found no existing reviews for that exact claim.' });
//       }
//     } catch (err: any) {
//       toast({ title: 'Error', description: err.message, variant: 'destructive' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exampleClaims = [
//     'COVID-19 vaccines contain microchips.',
//     'The moon landing was staged in a studio.',
//     'Wind turbines cause cancer.'
//   ];

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-12 space-y-10">
//         {/* Hero / Intro */}
//         <div className="text-center space-y-3">
//           <h1 className="text-5xl font-bold">Fact Verification</h1>
//           <p className="text-gray-600">
//             Paste a claim or upload a document, then see what reputable fact-checkers have published.
//           </p>
//         </div>

//         {/* Example Queries */}
//         <div className="flex justify-center space-x-3">
//           <span className="flex items-center text-gray-500"><Info className="mr-1" /> Try an example:</span>
//           {exampleClaims.map((c, i) => (
//             <Button
//               key={i}
//               variant="ghost"
//               size="sm"
//               onClick={() => { setMode('type'); setText(c); }}
//             >
//               {c.length > 30 ? c.slice(0, 30) + '…' : c}
//             </Button>
//           ))}
//         </div>

//         {/* Detector Quick-Links */}
//         <div className="grid grid-cols-3 gap-6">
//           {[
//             { label: 'Image Detector', icon: Image, path: '/image', color: 'from-blue-200 to-blue-100' },
//             { label: 'Video Detector', icon: Video, path: '/video', color: 'from-purple-200 to-purple-100' },
//             { label: 'Audio Detector', icon: AudioLines, path: '/audio', color: 'from-green-200 to-green-100' },
//           ].map(({ label, icon: Icon, path, color }) => (
//             <Card
//               key={label}
//               className="cursor-pointer hover:shadow-lg transition-shadow"
//               onClick={() => navigate(path)}
//             >
//               <CardContent className="flex flex-col items-center py-6 space-y-2">
//                 <div className={`p-3 rounded-full bg-gradient-to-br ${color}`}>
//                   <Icon className="w-7 h-7 text-white" />
//                 </div>
//                 <span className="font-medium">{label}</span>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Input Panel */}
//         <Card className="max-w-3xl mx-auto">
//           <CardContent className="p-6 space-y-5">
//             {/* Tabs */}
//             <div className="flex space-x-4 border-b">
//               <button
//                 className={`pb-2 font-medium ${mode === 'type' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
//                 onClick={() => setMode('type')}
//               >
//                 Type / Paste
//               </button>
//               <button
//                 className={`pb-2 font-medium ${mode === 'upload' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
//                 onClick={() => setMode('upload')}
//               >
//                 Upload File
//               </button>
//             </div>

//             {mode === 'type' ? (
//               <textarea
//                 rows={5}
//                 className="w-full border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-400"
//                 placeholder="Enter your claim here…"
//                 value={text}
//                 onChange={e => setText(e.target.value)}
//               />
//             ) : (
//               <FileUpload
//                 accept=".txt,.pdf"
//                 maxSize={10}
//                 onFileSelected={handleFile}
//               />
//             )}

//             <div className="flex space-x-4">
//               <Button className="flex-1" onClick={handleVerify} disabled={loading}>
//                 {loading
//                   ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Checking…</>
//                   : 'Verify Claim'
//                 }
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex-1"
//                 onClick={() => { setText(''); setFile(null); setResults([]); }}
//               >
//                 Reset
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Results */}
//         {results.length > 0 && (
//           <div className="max-w-3xl mx-auto space-y-4">
//             {results.map((r, i) => (
//               <Card key={i} className="shadow hover:shadow-lg transition-shadow">
//                 <CardContent className="p-5 space-y-3">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-xl font-semibold">{r.title || 'Fact-Check Result'}</h3>
//                     {r.textualRating && (
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full cursor-help">
//                             {r.textualRating}
//                           </span>
//                         </TooltipTrigger>
//                         <TooltipContent side="top">
//                           {RATING_MAP[r.textualRating] || 'Rating info unavailable'}
//                         </TooltipContent>
//                       </Tooltip>
//                     )}
//                   </div>
//                   {r.claimReviewed && (
//                     <p className="italic text-gray-700">“{r.claimReviewed}”</p>
//                   )}
//                   <div className="flex items-center justify-between">
//                     <a
//                       href={r.url}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-blue-600 hover:underline"
//                     >
//                       Read full review
//                     </a>
//                     <span className="text-gray-400 text-xs">
//                       Source: {r.publisherName || 'Unknown'}
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default FactChecker;



















// import { useState } from 'react';
// import Layout from '@/components/Layout';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import { Loader, CheckCircle } from 'lucide-react';

// interface ReviewEntry {
//   textualRating?: string;
//   title?: string;
//   url?: string;
//   publisherName?: string;
//   claimReviewed?: string;
// }

// const API_URL = 'http://localhost:5000';

// const FactChecker = () => {
//   const [text, setText] = useState('');
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState<ReviewEntry[]>([]);
//   const { toast } = useToast();

//   // Read TXT/PDF as plain text
//   const handleFile = (f: File) => {
//     setFile(f);
//     setResults([]);
//     const reader = new FileReader();
//     reader.onload = e => setText(e.target?.result as string);
//     reader.readAsText(f);
//   };

//   const verify = async () => {
//     if (!text.trim()) {
//       toast({ title: 'Enter text or upload file', variant: 'destructive' });
//       return;
//     }
//     setLoading(true);
//     setResults([]);
//     try {
//       const res = await fetch(`${API_URL}/api/factcheck`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text })
//       });
//       const data = await res.json();
//       if (data.error) throw new Error(data.error || 'Unknown error');

//       const entries: ReviewEntry[] = [];
//       // Google API returns data.claims, each with claimReview array
//       (data.claims || []).forEach((claim: any) => {
//         (claim.claimReview || []).forEach((review: any) => {
//           entries.push({
//             textualRating: review.textualRating,
//             title: review.title,
//             url: review.url,
//             publisherName: review.publisher?.name,
//             claimReviewed: review.claimReviewed
//           });
//         });
//       });

//       setResults(entries);
//       if (entries.length === 0) {
//         toast({ title: 'No fact checks found' });
//       }
//     } catch (err: any) {
//       toast({ title: 'Error', description: err.message, variant: 'destructive' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-10">
//         <div className="max-w-3xl mx-auto">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold">Fact Verification</h1>
//             <p className="text-muted-foreground">
//               Paste a claim or upload a TXT/PDF to verify via Google Fact Check.
//             </p>
//           </div>

//           <Card className="mb-6">
//             <CardContent className="p-6 space-y-4">
//               <textarea
//                 rows={5}
//                 className="w-full border rounded p-3 resize-none"
//                 placeholder="Enter claim text..."
//                 value={text}
//                 onChange={e => setText(e.target.value)}
//               />
//               <input
//                 type="file"
//                 accept=".txt,.pdf"
//                 onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
//               />
//               <div className="flex space-x-4">
//                 <Button onClick={verify} disabled={loading} className="flex-1">
//                   {loading ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Verifying…</> : 'Verify Claim'}
//                 </Button>
//                 <Button variant="outline" onClick={() => { setText(''); setFile(null); setResults([]); }} className="flex-1">
//                   Reset
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="space-y-4">
//             {results.map((r, i) => (
//               <Card key={i}>
//                 <CardContent className="p-4">
//                   <h3 className="font-medium flex items-center">
//                     <CheckCircle className="mr-2 text-green-500" /> {r.textualRating || 'Rating unavailable'}
//                   </h3>
//                   {r.title && <p className="italic mb-1">{r.title}</p>}
//                   {r.claimReviewed && <p className="text-sm mb-2">"{r.claimReviewed}"</p>}
//                   <p className="text-xs text-muted-foreground">
//                     Source: {r.publisherName || 'Unknown'} — {' '}
//                     {r.url 
//                       ? <a href={r.url} target="_blank" rel="noreferrer" className="underline">Read more</a>
//                       : 'No URL'
//                     }
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default FactChecker;



















// import { useState, useEffect } from 'react';
// import Layout from '@/components/Layout';
// import FileUpload from '@/components/FileUpload';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import { Loader, CheckCircle, Image, Video, AudioLines } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// interface ReviewEntry {
//   textualRating?: string;
//   title?: string;
//   url?: string;
//   publisherName?: string;
//   claimReviewed?: string;
// }

// const API_URL = 'http://localhost:5000';

// const FactChecker = () => {
//   const [text, setText] = useState('');
//   const [file, setFile] = useState<File | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [results, setResults] = useState<ReviewEntry[]>([]);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // reset results when text or file changes
//     setResults([]);
//   }, [text, file]);

//   const handleFileSelected = (selectedFile: File) => {
//     if (!['text/plain', 'application/pdf'].includes(selectedFile.type)) {
//       toast({ title: 'Invalid file type', description: 'Please upload a TXT or PDF', variant: 'destructive' });
//       return;
//     }
//     setFile(selectedFile);
//     const reader = new FileReader();
//     reader.onload = e => setText(e.target?.result as string);
//     reader.readAsText(selectedFile);
//   };

//   const handleVerify = async () => {
//     if (!text.trim()) {
//       toast({ title: 'No text provided', description: 'Please enter a claim or upload a file', variant: 'destructive' });
//       return;
//     }
//     setIsAnalyzing(true);
//     try {
//       const res = await fetch(`${API_URL}/api/factcheck`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text })
//       });
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);

//       const entries: ReviewEntry[] = [];
//       (data.claims || []).forEach((claim: any) => {
//         (claim.claimReview || []).forEach((review: any) => {
//           entries.push({
//             textualRating: review.textualRating,
//             title: review.title,
//             url: review.url,
//             publisherName: review.publisher?.name,
//             claimReviewed: review.claimReviewed
//           });
//         });
//       });

//       setResults(entries);
//       if (entries.length === 0) {
//         toast({ title: 'No fact checks found' });
//       }
//     } catch (err: any) {
//       toast({ title: 'Error', description: err.message, variant: 'destructive' });
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-10">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold mb-2">Fact Verification</h1>
//             <p className="text-muted-foreground">
//               Paste a claim text or upload a PDF/TXT to verify via Google Fact Check API.
//             </p>
//           </div>

//           {/* Suggestion to use other detectors */}
//           <Card className="mb-8">
//             <CardContent className="space-y-4">
//               <p>
//                 If your claim includes images, videos, or audio, you can also analyze them for AI tampering using our detectors:
//               </p>
//               <div className="flex space-x-4 justify-center">
//                 <Button variant="outline" onClick={() => navigate('/image')} className="flex items-center space-x-2">
//                   <Image className="h-5 w-5" /> <span>Image Detector</span>
//                 </Button>
//                 <Button variant="outline" onClick={() => navigate('/video')} className="flex items-center space-x-2">
//                   <Video className="h-5 w-5" /> <span>Video Detector</span>
//                 </Button>
//                 <Button variant="outline" onClick={() => navigate('/audio')} className="flex items-center space-x-2">
//                   <AudioLines className="h-5 w-5" /> <span>Audio Detector</span>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Form & Upload */}
//           <div className="grid md:grid-cols-5 gap-8">
//             <div className="md:col-span-3 space-y-6">
//               <Card>
//                 <CardContent className="p-6 space-y-4">
//                   <textarea
//                     rows={6}
//                     className="w-full border rounded p-3 resize-none"
//                     placeholder="Enter your claim here..."
//                     value={text}
//                     onChange={e => setText(e.target.value)}
//                   />

//                   <FileUpload
//                     accept=".txt,.pdf"
//                     maxSize={10}
//                     onFileSelected={handleFileSelected}
//                   />

//                   <div className="flex justify-center space-x-4">
//                     <Button
//                       onClick={handleVerify}
//                       disabled={isAnalyzing}
//                       className="w-full md:w-auto"
//                     >
//                       {isAnalyzing ? (
//                         <><Loader className="mr-2 h-4 w-4 animate-spin" />Verifying...</>
//                       ) : (
//                         'Verify Claim'
//                       )}
//                     </Button>
//                     {(text || file) && (
//                       <Button variant="outline" onClick={() => { setText(''); setFile(null); setResults([]); }} className="w-full md:w-auto">
//                         Reset
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Results */}
//             <div className="md:col-span-2">
//               {isAnalyzing && (
//                 <div className="text-center text-sm text-muted-foreground">Analyzing claim...</div>
//               )}
//               {results.length > 0 && results.map((r, i) => (
//                 <Card key={i} className="mb-4 overflow-hidden animate-fade-in">
//                   <CardContent className="p-4">
//                     <h3 className="font-medium flex items-center mb-2">
//                       <CheckCircle className="mr-2 text-green-500" /> {r.textualRating || 'Rating unavailable'}
//                     </h3>
//                     {r.title && <p className="italic mb-1">{r.title}</p>}
//                     {r.claimReviewed && <p className="text-sm mb-2">"{r.claimReviewed}"</p>}
//                     <p className="text-xs text-muted-foreground">
//                       Source: {r.publisherName || 'Unknown'} — {' '}
//                       {r.url
//                         ? <a href={r.url} target="_blank" rel="noreferrer" className="underline">Read more</a>
//                         : 'No URL'
//                       }
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default FactChecker;
