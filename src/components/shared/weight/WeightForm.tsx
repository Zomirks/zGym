"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";

import { Calendar as CalendarIcon } from "lucide-react"

export default function WeightForm() {
	const [weight, setWeight] = useState("");
	const [note, setNote] = useState("");
	const [date, setDate] = useState<Date>(new Date());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading(true);
		setError("");

		try {
			const response = await fetch("/api/weight", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ weight: parseFloat(weight), date, note })
			});

			if (!response.ok) {
				const data = await response.json();
				setError(data.error || "Une erreur est survenue");
				return;
			}

			setWeight("");
			setNote("");
			setDate(new Date());
		} catch {
			setError("Impossible de contacter le serveur");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="px-4">
			<form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
				{error && <p style={{ color: "red" }}>{error}</p>}

				<div className="flex flex-col gap-y-2">
					<Label htmlFor="weight">Ton poids</Label>
					<InputGroup>
						<InputGroupInput
							id="weight"
							type="number"
							step="0.01"
							value={weight}
							min={30}
							onChange={(e) => setWeight(e.target.value)}
							required
						/>
						<InputGroupAddon align="inline-end">
							KG
						</InputGroupAddon>
					</InputGroup>
				</div>

				<div className="flex flex-col gap-y-2">
					<Label htmlFor="date">Date de le mesure</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="outline"
								data-empty={!date}
								className="data-[empty=true]:text-muted-foreground w-70 justify-start text-left font-normal"
							>
								<CalendarIcon />
								<span className="capitalize">{date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar mode="single" required selected={date} onSelect={setDate} />
						</PopoverContent>
					</Popover>
				</div>

				<div className="flex flex-col gap-y-2">
					<Label htmlFor="note">Note</Label>
					<Input
						id="note"
						type="text"
						value={note}
						onChange={(e) => setNote(e.target.value)}
					/>
				</div>

				<Button
					type="submit"
					disabled={loading}
				>{loading ? "Ajout en cours..." : "Ajouter"}</Button>
			</form>
		</Card>
	);
}