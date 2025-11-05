import { pipeline } from "@huggingface/transformers";

let classifier: any = null;

export async function initializeSentimentAnalyzer() {
  if (!classifier) {
    try {
      // Using a sentiment analysis model optimized for browser
      classifier = await pipeline(
        "sentiment-analysis",
        "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
      );
    } catch (error) {
      console.error("Failed to initialize sentiment analyzer:", error);
      throw error;
    }
  }
  return classifier;
}

export interface SentimentResult {
  positive: number;
  negative: number;
  neutral: number;
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    const analyzer = await initializeSentimentAnalyzer();
    
    // Split text into chunks if it's too long (max ~512 tokens)
    const maxLength = 500;
    const chunks = text.match(new RegExp(`.{1,${maxLength}}`, 'g')) || [text];
    
    // Analyze each chunk
    const results = await Promise.all(
      chunks.map(chunk => analyzer(chunk))
    );
    
    // Aggregate results
    let positiveSum = 0;
    let negativeSum = 0;
    
    results.forEach(result => {
      const sentiment = result[0];
      if (sentiment.label === "POSITIVE") {
        positiveSum += sentiment.score;
      } else {
        negativeSum += sentiment.score;
      }
    });
    
    const total = results.length;
    const positive = positiveSum / total;
    const negative = negativeSum / total;
    const neutral = Math.max(0, 1 - positive - negative);
    
    return {
      positive,
      negative,
      neutral,
    };
  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    throw error;
  }
}
