"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS - UI
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Button } from "../ui/button";

// Icons
import { Calendar as CalendarIcon, Check as CheckIcon } from "lucide-react"

export default function ManualEntriesForm() {
	const [calories, setCalories] = useState(0);
	const [carbohydrates, setCarbohydrates] = useState(0);
	const [date, setDate] = useState<Date>(new Date());
	const [description, setDescription] = useState('');
	const [fats, setFats] = useState(0);
	const [proteins, setProteins] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/nutrition/manual-entry", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					calories,
					carbohydrates,
					date: date.toISOString(),
					description,
					fats,
					proteins
				})
			});

			if (!response.ok) {
				const data = await response.json();
				setError(data.error || "Une erreur est survenue");
				return;
			}
			
			setCalories(0);
			setCarbohydrates(0);
			setDate(new Date());
			setDescription('');
			setFats(0);
			setProteins(0);
			setSuccess(true);
			router.refresh();
		} catch {
			setError("La nouvelle entrée n'a pas pu être enregistrée")
		} finally {
			setLoading(false);
		}
	}

	return (
		success ? (
			<Card className="px-4 flex flex-col items-center justify-center gap-y-4 py-8">
				<CheckIcon className="text-green-600" size={48} />
				<p className="text-center text-lg">Vos calories & macros ont bien été ajoutées.</p>
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
					<div className="flex items-center gap-2 font-data text-xs text-zgym-gold/85 tracking-[0.25em] uppercase mb-2">
						<span className="inline-block w-6 h-px bg-zgym-gold/50" />
						Suivi des calories
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
						<Label htmlFor="desc">Description</Label>
						<Input
							id="desc"
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
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
						<Label htmlFor="calories">Calories</Label>
						<Input
							id="calories"
							type="number"
							min={0}
							step={1}
							value={calories}
							onChange={(e) => setCalories(e.target.valueAsNumber)}
						/>
					</div>
					<div className="flex flex-col gap-y-2">
						<Label htmlFor="carbohydrates">Glucides</Label>
						<InputGroup>
							<InputGroupInput
								id="carbohydrates"
								type="number"
								min={0}
								value={carbohydrates}
								onChange={(e) => setCarbohydrates(e.target.valueAsNumber)}
								required
							/>
							<InputGroupAddon className="font-data" align="inline-end">
								Grammes
							</InputGroupAddon>
						</InputGroup>
					</div>
					<div className="flex flex-col gap-y-2">
						<Label htmlFor="fats">Lipides</Label>
						<InputGroup>
							<InputGroupInput
								id="fats"
								type="number"
								min={0}
								value={fats}
								onChange={(e) => setFats(e.target.valueAsNumber)}
								required
							/>
							<InputGroupAddon className="font-data" align="inline-end">
								Grammes
							</InputGroupAddon>
						</InputGroup>
					</div>
					<div className="flex flex-col gap-y-2">
						<Label htmlFor="proteins">Protéines</Label>
						<InputGroup>
							<InputGroupInput
								id="proteins"
								type="number"
								min={0}
								value={proteins}
								onChange={(e) => setProteins(e.target.valueAsNumber)}
								required
							/>
							<InputGroupAddon className="font-data" align="inline-end">
								Grammes
							</InputGroupAddon>
						</InputGroup>
					</div>

					<Button
						type="submit"
						disabled={loading}
					>{loading ? "Ajout en cours..." : "Ajouter"}</Button>
				</form>
			</Card>
		)
	)
}