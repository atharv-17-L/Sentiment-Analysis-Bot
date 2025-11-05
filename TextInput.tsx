import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput = ({ value, onChange }: TextInputProps) => {
  return (
    <div className="w-full space-y-2">
      <Label htmlFor="text-input" className="text-sm font-medium">
        Or enter text directly
      </Label>
      <Textarea
        id="text-input"
        placeholder="Type or paste your text here for sentiment analysis..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] resize-none"
      />
    </div>
  );
};
