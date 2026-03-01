"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS - UI
import { Button } from "@/components/shared/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"

// ICONS
import { Calendar as CalendarIcon, Check as CheckIcon } from "lucide-react"

export default function WeightForm() {
	const [weight, setWeight] = useState("");
	const [note, setNote] = useState("");
	const [date, setDate] = useState<Date>(new Date());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const dateString = `${year}-${month}-${day}`;

			const response = await fetch("/api/weight", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ weight: parseFloat(weight), date: dateString, note })
			});

			if (!response.ok) {
				const data = await response.json();
				setError(data.error || "Une erreur est survenue");
				return;
			}

			setWeight("");
			setNote("");
			setDate(new Date());
			setSuccess(true);
			router.refresh();
		} catch {
			setError("Impossible de contacter le serveur");
		} finally {
			setLoading(false);
		}
	}

	return (
		success ? (
			<Card className="px-4 flex flex-col items-center justify-center gap-y-4 py-8">
				<CheckIcon className="text-green-600" size={48} />
				<p className="text-center text-lg">Votre poids a bien été enregistré.</p>
				<Button
					variant="outline"
					onClick={() => {
						setSuccess(false);
					}}
				>Ajouter une nouvelle mesure</Button>
			</Card>
		) : (
			<Card className="px-4">
				<div className="">
					<div className="flex items-center gap-2 font-data text-[10px] text-zgym-gold/85 tracking-[0.25em] uppercase mb-2">
						<span className="inline-block w-6 h-px bg-zgym-gold/50" />
						Suivi du poids
					</div>
					<h3 className="font-poster text-3xl tracking-[0.06em] uppercase text-zgym-text-1 leading-none">
						Nouvelle mesure
					</h3>
				</div>

				{error && (
					<div className="flex items-center gap-2 bg-zgym-brick/10 border border-zgym-brick/30 rounded-lg px-3 py-2 mb-5">
						<span className="text-zgym-brick text-sm">◆</span>
						<span className="font-body text-sm italic text-zgym-brick">
							{error}
						</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
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
							<InputGroupAddon className="font-data" align="inline-end">
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
									className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
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
						<Label htmlFor="note">
							Note
							<span className="ml-1 opacity-50 italic text-xs">
								— optionnel
							</span>
						</Label>
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
		)
	);
}