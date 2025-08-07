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

// API Endpoint for Backend
const API_URL = "https://authnlens-backend-674458572550.asia-south1.run.app/";

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
