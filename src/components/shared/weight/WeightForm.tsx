"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS - UI
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SectionTag } from "@/components/ui/section-tag";

// ICONS
import { Calendar as CalendarIcon, Check as CheckIcon, Scale as ScaleIcon } from "lucide-react";

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
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const dateString = `${year}-${month}-${day}`;

			const response = await fetch("/api/weight", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ weight: parseFloat(weight), date: dateString, note }),
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

	if (success) {
		return (
			<Card className="px-6 py-10 flex flex-col items-center justify-center gap-y-5">
				<div className="relative flex items-center justify-center w-16 h-16">
					<span className="absolute inset-0 rounded-full bg-primary/10" />
					<CheckIcon
						className="relative text-primary"
						strokeWidth={2.5}
						size={32}
					/>
				</div>

				<div className="text-center">
					<p className="font-data text-[10px] text-primary/85 tracking-[0.25em] uppercase mb-2">
						Enregistrement
					</p>
					<h3 className="font-display text-2xl tracking-[0.06em] uppercase leading-none text-foreground">
						Mesure ajoutée
					</h3>
					<p className="font-serif text-sm text-secondary mt-2 italic">
						Votre poids a bien été enregistré.
					</p>
				</div>

				<Divider />

				<Button
					variant="outline"
					className="w-full font-data text-xs tracking-widest uppercase"
					onClick={() => setSuccess(false)}
				>
					+ Nouvelle mesure
				</Button>
			</Card>
		);
	}

	return (
		<Card className="px-6 pb-6 flex flex-col gap-y-5">
			<div>
				<SectionTag>Suivi du poids</SectionTag>
				<div className="flex items-end gap-3">
					<h3 className="font-display text-3xl tracking-[0.06em] uppercase leading-none text-foreground">
						Nouvelle mesure
					</h3>
					<ScaleIcon
						className="text-primary/60 mb-0.5 shrink-0"
						size={20}
						strokeWidth={1.5}
					/>
				</div>
			</div>

			<Divider />

			{error && (
				<div className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-3 py-2.5">
					<span className="font-data text-xs mt-0.5 shrink-0">◆</span>
					<span className="font-serif text-sm italic leading-snug">{error}</span>
				</div>
			)}

			<form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="weight">
						Poids
					</Label>
					<div className="relative">
						<Input
							id="weight"
							type="number"
							step="0.01"
							value={weight}
							min={30}
							onChange={(e) => setWeight(e.target.value)}
							required
							placeholder="75.0"
							className="pr-12"
						/>
						<span className="absolute right-3 top-1/2 -translate-y-1/2 font-data text-xs tracking-widest text-muted-foreground pointer-events-none select-none">
							KG
						</span>
					</div>
				</div>

				<div className="flex flex-col gap-y-2">
					<Label htmlFor="date">
						Date de la mesure
					</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="outline"
								data-empty={!date}
								className="
									w-full justify-start text-left font-serif font-normal
									bg-lifted border-border text-foreground
									hover:bg-surface hover:text-foreground
									data-[empty=true]:text-muted-foreground
									transition-colors duration-150
								"
							>
								<CalendarIcon className="text-primary/70 shrink-0" size={15} />
								<span className="capitalize">
									{date.toLocaleDateString("fr-FR", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0 bg-surface border-border">
							<Calendar mode="single" required selected={date} onSelect={setDate} />
						</PopoverContent>
					</Popover>
				</div>

				<div className="flex flex-col gap-y-2">
					<Label htmlFor="note">
						Note
						<span className="ml-2 font-serif normal-case tracking-normal text-[10px] italic text-muted-foreground">
							— optionnel
						</span>
					</Label>
					<Input
						id="note"
						type="text"
						value={note}
						onChange={(e) => setNote(e.target.value)}
						placeholder="Après le sport, à jeun..."
						className="font-serif"
					/>
				</div>

				<Button
					type="submit"
					disabled={loading}
					className="w-full mt-1 text-xs tracking-[0.2em]"
				>
					{loading ? (
						<span className="flex items-center gap-2">
							<span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
							Ajout en cours…
						</span>
					) : (
						"Ajouter la mesure"
					)}
				</Button>
			</form>
		</Card>
	);
}