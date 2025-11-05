import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { TextInput } from "@/components/TextInput";
import { SentimentResults } from "@/components/SentimentResults";
import { SentimentChart } from "@/components/SentimentChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";
import { analyzeSentiment, SentimentResult } from "@/lib/sentimentAnalysis";
import { toast } from "sonner";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentScores, setSentimentScores] = useState<SentimentResult | null>(null);

  const handleAnalyze = async () => {
    let textToAnalyze = textInput;

    // If file is selected, read its content
    if (selectedFile) {
      try {
        if (selectedFile.type === "text/plain") {
          textToAnalyze = await selectedFile.text();
        } else if (
          selectedFile.type === "application/pdf" ||
          selectedFile.type === "application/msword" ||
          selectedFile.type.includes("wordprocessingml")
        ) {
          toast.info("Document parsing coming soon! For now, please use the text input.");
          return;
        } else if (selectedFile.type.startsWith("image/")) {
          toast.info("Image text extraction coming soon! For now, please use the text input.");
          return;
        }
      } catch (error) {
        toast.error("Failed to read file");
        return;
      }
    }

    if (!textToAnalyze.trim()) {
      toast.error("Please enter text or upload a file");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      toast.info("Analyzing sentiment... This may take a moment on first run.");
      const results = await analyzeSentiment(textToAnalyze);
      setSentimentScores(results);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze sentiment. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sentiment Analysis Bot
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered sentiment detection using BERT
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg border-border/50">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Input Data
                  </h2>
                  <FileUpload
                    onFileSelect={setSelectedFile}
                    onFileClear={() => setSelectedFile(null)}
                    selectedFile={selectedFile}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <TextInput value={textInput} onChange={setTextInput} />

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!selectedFile && !textInput.trim())}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze Sentiment
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <SentimentResults scores={sentimentScores} isAnalyzing={isAnalyzing} />
            {sentimentScores && <SentimentChart scores={sentimentScores} />}
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-muted/30 border-border/50">
          <h3 className="font-semibold mb-2">How it works</h3>
          <p className="text-sm text-muted-foreground">
            This sentiment analysis bot uses advanced BERT-based models running directly in your
            browser. Upload documents, paste text, or drag and drop files to analyze the emotional
            tone and sentiment. The AI model processes the text and provides confidence scores for
            positive, neutral, and negative sentiments.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Index;
