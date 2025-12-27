"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A radial chart with stacked sections";

const chartData = [{ 
  month: "january", 
  sports: 80.02, 
  casino: 24.53,
  stocks: 16.47,
  crypto: 16.47 
}];

const chartConfig = {
  sports: {
    label: "Sports",
    color: "#693EE0",
  },
  casino: {
    label: "Casino",
    color: "#008640",
  },
  stocks: {
    label: "Stocks",
    color: "#35ADE9"
  },
  crypto: {
    label: "Crypto",
    color: "#2B303B"
  }
} satisfies ChartConfig;

export function ChartRadialStacked() {
  // Calculate total win rate (92% as shown in your screenshot)
  const overallWinRate = 92;

  return (
    <Card className="flex flex-col bg-transparent border-none">
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[360px] h-[280px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={120}
            outerRadius={200}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
             <Label
  content={({ viewBox }) => {
    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
      return (
        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
          <tspan
            x={viewBox.cx}
            y={(viewBox.cy || 0) - 44}
            className="fill-gray-400 text-sm"
            dy="0.3em"
          >
            Overall Win rate
          </tspan>
          <tspan
            x={viewBox.cx}
            y={(viewBox.cy || 0) -10}
            className="fill-white text-3xl font-bold"
            dy="0.3em"
          >
            {overallWinRate} %
          </tspan>
          {/* <tspan
            x={viewBox.cx}
            y={(viewBox.cy || 0) + 8}
            className="fill-white text-3xl font-bold"
            dx="8"
            dy="0.3em"
          >
            %
          </tspan> */}
        </text>
      );
    }
  }}
/>
            </PolarRadiusAxis>
            <RadialBar
              dataKey="crypto"
              stackId="a"
              cornerRadius={10}
              fill={chartConfig.crypto.color}
              stroke="#0E121B"
              strokeWidth={2}
            />
            <RadialBar
              dataKey="stocks"
              stackId="a"
              cornerRadius={10}
              fill={chartConfig.stocks.color}
              stroke="#0E121B"
              strokeWidth={2}
            />
            <RadialBar
              dataKey="casino"
              stackId="a"
              cornerRadius={10}
              fill={chartConfig.casino.color}
              stroke="#0E121B"
              strokeWidth={2}
            />
            <RadialBar
              dataKey="sports"
              stackId="a"
              cornerRadius={10}
              fill={chartConfig.sports.color}
              stroke="#0E121B"
              strokeWidth={2}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}