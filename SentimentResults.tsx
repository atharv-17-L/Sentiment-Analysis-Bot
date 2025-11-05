import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Smile, Frown, AlertTriangle } from "lucide-react";

interface SentimentScore {
  positive: number;
  negative: number;
  neutral: number;
}

interface SentimentResultsProps {
  scores: SentimentScore | null;
  isAnalyzing: boolean;
}

export const SentimentResults = ({ scores, isAnalyzing }: SentimentResultsProps) => {
  if (!scores && !isAnalyzing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Upload a file or enter text to see sentiment analysis results
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analyzing...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMaxSentiment = () => {
    if (!scores) return null;
    const entries = Object.entries(scores);
    return entries.reduce((max, entry) => entry[1] > max[1] ? entry : max);
  };

  const maxSentiment = getMaxSentiment();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sentiment Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Sentiment */}
        {maxSentiment && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Overall Sentiment</p>
            <div className="flex items-center gap-2">
              {maxSentiment[0] === 'positive' && <Smile className="w-5 h-5 text-positive" />}
              {maxSentiment[0] === 'negative' && <Frown className="w-5 h-5 text-negative" />}
              {maxSentiment[0] === 'neutral' && <AlertTriangle className="w-5 h-5 text-muted-foreground" />}
              <p className="text-lg font-semibold capitalize">{maxSentiment[0]}</p>
              <p className="text-sm text-muted-foreground">
                ({(maxSentiment[1] * 100).toFixed(1)}% confidence)
              </p>
            </div>
          </div>
        )}

        {/* Positive */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-positive" />
              <span className="text-sm font-medium">Positive</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {((scores?.positive || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-positive transition-all duration-500"
              style={{ width: `${(scores?.positive || 0) * 100}%` }}
            />
          </div>
        </div>

        {/* Neutral */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Neutral</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {((scores?.neutral || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-muted-foreground transition-all duration-500"
              style={{ width: `${(scores?.neutral || 0) * 100}%` }}
            />
          </div>
        </div>

        {/* Negative */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Frown className="w-4 h-4 text-negative" />
              <span className="text-sm font-medium">Negative</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {((scores?.negative || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-negative transition-all duration-500"
              style={{ width: `${(scores?.negative || 0) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
