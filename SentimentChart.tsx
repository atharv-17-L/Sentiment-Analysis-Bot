import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SentimentScore {
  positive: number;
  negative: number;
  neutral: number;
}

interface SentimentChartProps {
  scores: SentimentScore | null;
}

const COLORS = {
  positive: "hsl(142, 70%, 45%)",
  neutral: "hsl(215, 16%, 47%)",
  negative: "hsl(0, 70%, 50%)",
};

export const SentimentChart = ({ scores }: SentimentChartProps) => {
  if (!scores) {
    return null;
  }

  const data = [
    { name: "Positive", value: scores.positive * 100 },
    { name: "Neutral", value: scores.neutral * 100 },
    { name: "Negative", value: scores.negative * 100 },
  ].filter(item => item.value > 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sentiment Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
