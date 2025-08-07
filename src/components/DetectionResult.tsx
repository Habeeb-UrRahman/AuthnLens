
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DetectionResultProps {
  loading: boolean;
  completed: boolean;
  result?: {
    isAI: boolean;
    confidence: number;
  };
  className?: string;
}

const DetectionResult = ({ 
  loading, 
  completed, 
  result,
  className 
}: DetectionResultProps) => {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (loading) {
      interval = setInterval(() => {
        setProgressValue(prev => {
          const increment = Math.random() * 15;
          const newValue = prev + increment;
          return newValue > 90 ? 90 : newValue;
        });
      }, 500);
    } else if (completed) {
      setProgressValue(100);
    } else {
      setProgressValue(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, completed]);

  return (
    <Card className={cn("w-full overflow-hidden transition-all duration-500", className)}>
      <CardHeader className={cn(
        "transition-colors duration-300",
        completed && result ? (
          result.isAI 
            ? "bg-detection-ai/10 border-b border-detection-ai/20" 
            : "bg-detection-real/10 border-b border-detection-real/20"
        ) : "bg-muted/30"
      )}>
        <CardTitle className="flex justify-between items-center">
          <span>Detection Result</span>
          {completed && result && (
            <span className={cn(
              "text-sm font-medium px-3 py-1 rounded-full",
              result.isAI 
                ? "bg-detection-ai/20 text-detection-ai" 
                : "bg-detection-real/20 text-detection-real"
            )}>
              {result.isAI ? "AI GENERATED" : "HUMAN CREATED"}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {loading 
            ? "Analyzing content..." 
            : completed 
              ? "Analysis complete"
              : "Upload content to begin detection"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 pb-2">
        {(loading || completed) && (
          <div className="space-y-4">
            <Progress value={progressValue} className={cn(
              "transition-all",
              completed && result ? (
                result.isAI ? "bg-detection-ai/20" : "bg-detection-real/20"
              ) : ""
            )} />
            
            {completed && result && (
              <div className="animate-enter">
                <p className="text-sm text-muted-foreground mb-2">Confidence level</p>
                <div className="text-4xl font-bold">
                  {Math.round(result.confidence * 100)}%
                </div>
              </div>
            )}
          </div>
        )}
        
        {!loading && !completed && (
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            No content analyzed yet
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground">
        {loading && "This may take a few moments..."}
        {completed && result && (
          <p>
            {result.isAI 
              ? "This content shows strong indicators of AI generation."
              : "This content appears to be human-created."
            }
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default DetectionResult;
