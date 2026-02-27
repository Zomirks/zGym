"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

// COMPONENTS - UI
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";

const chartConfig = {
	weight: {
		label: "Poids",
		color: "var(--chart-gold)",
	},
} satisfies ChartConfig;

// TYPES
import { WeightDataPoint } from "@/types/weight";

export default function WeightChart({ data }: { data: WeightDataPoint[] }) {
	if (data.length === 0) {
		return <p className="text-muted-foreground text-sm">Pas encore de données.</p>;
	}

	return (
		<Card className="p-4">
			<h3 className="font-poster text-2xl mb-4">Évolution du poids</h3>
			<ChartContainer config={chartConfig} className="min-h-75 w-full">
				<LineChart data={data}>
					<CartesianGrid vertical={false} />
					<XAxis dataKey="date" />
					<YAxis domain={["dataMin - 2", "dataMax + 2"]} />
					<ChartTooltip content={<ChartTooltipContent />} />
					<Line
						type="monotone"
						dataKey="weight" 
						stroke="var(--color-weight)"
						strokeWidth={2}
						dot={{ r: 4 }} 
					/> 
				</LineChart>
			</ChartContainer>
		</Card>
	);
}