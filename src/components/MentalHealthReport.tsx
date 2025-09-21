import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";

// Sample data - in a real app, this would come from your backend
const generateSampleData = () => {
  const today = new Date();
  return Array.from({ length: 10 }, (_, i) => ({
    date: format(subDays(today, 9 - i), "MMM dd"),
    mood: Math.floor(Math.random() * (10 - 5 + 1)) + 5, // Random mood score between 5-10
    anxiety: Math.floor(Math.random() * 5) + 1, // Random anxiety level between 1-5
    sleep: Math.floor(Math.random() * (9 - 5 + 1)) + 5, // Random sleep hours between 5-9
  }));
};

const MentalHealthReport = () => {
  const data = generateSampleData();

  return (
    <Card className="w-full bg-gradient-card shadow-card hover:shadow-soft transition-all duration-300 border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          10-Day Mental Health Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#8884d8"
                name="Mood Score"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="anxiety"
                stroke="#82ca9d"
                name="Anxiety Level"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#ffc658"
                name="Sleep Hours"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Average Mood</p>
            <p className="text-lg font-bold">
              {(
                data.reduce((acc, item) => acc + item.mood, 0) / data.length
              ).toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Average Anxiety</p>
            <p className="text-lg font-bold">
              {(
                data.reduce((acc, item) => acc + item.anxiety, 0) / data.length
              ).toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Average Sleep</p>
            <p className="text-lg font-bold">
              {(
                data.reduce((acc, item) => acc + item.sleep, 0) / data.length
              ).toFixed(1)}
              hrs
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentalHealthReport;
