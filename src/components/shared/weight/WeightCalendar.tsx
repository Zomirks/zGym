"use client";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";

const WeightCalendar = () => {
	const [mounted, setMounted] = useState(false);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [entryDates, setEntryDates] = useState<Date[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setMounted(true);
		fetch("/api/weight", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})
			.then(async (response) => {
				if (!response.ok) {
					const data = await response.json();
					setError(data.error || "Une erreur est survenue");
					return;
				}
				const data = await response.json();
				setEntryDates(data.map((entry: { date: string }) => new Date(entry.date)));
			})
			.catch(() => setError("Impossible de contacter le serveur"));
	}, []);

	if (!mounted) return null;

	return (
		<>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<Calendar
				mode="single"
				selected={date}
				onSelect={setDate}
				locale={fr}
				modifiers={{
					entries: entryDates,
				}}
				modifiersClassNames={{
					entries: "bg-green-500/20 rounded-md",
				}}
				className="w-full rounded-lg border"
			/>
		</>
	);
};

export default WeightCalendar;