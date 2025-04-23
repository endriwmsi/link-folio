"use client";

import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface BarChartProps {
  data: {
    date: string;
    views: number;
    clicks: number;
  }[];
}

export function BarChart({ data }: BarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis
          dataKey="date"
          stroke={isDark ? "#aaa" : "#555"}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }}
        />
        <YAxis stroke={isDark ? "#aaa" : "#555"} />
        <Tooltip
          contentStyle={{
            background: isDark ? "#333" : "#fff",
            border: isDark ? "1px solid #555" : "1px solid #ddd",
            color: isDark ? "#fff" : "#000",
          }}
        />
        <Bar dataKey="views" name="Views" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="clicks" name="Clicks" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export function PieChart({ data }: PieChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            name,
          }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            
            return percent > 0.05 ? (
              <text
                x={x}
                y={y}
                fill={isDark ? "#fff" : "#000"}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            ) : null;
          }}
          outerRadius={80}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          formatter={(value) => <span style={{ color: isDark ? "#aaa" : "#555" }}>{value}</span>}
        />
        <Tooltip
          contentStyle={{
            background: isDark ? "#333" : "#fff",
            border: isDark ? "1px solid #555" : "1px solid #ddd",
            color: isDark ? "#fff" : "#000",
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}