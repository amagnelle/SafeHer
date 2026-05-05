import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DayData {
  day: string;
  clicks: number;
}

interface Last7DaysChartProps {
  data: DayData[];
}

export function Last7DaysChart({ data }: Last7DaysChartProps) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
            labelStyle={{ color: "#F3F4F6" }}
            formatter={(value) => [`${value} cliques`, "Cliques"]}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ fill: "#8B5CF6", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}