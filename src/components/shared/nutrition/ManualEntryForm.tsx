"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS - UI
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputWithAddon } from "@/components/ui/input-with-addon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SectionTag } from "@/components/ui/section-tag";

// Icons
import { Calendar as CalendarIcon, Check as CheckIcon, Utensils as UtensilsIcon } from "lucide-react";

export default function ManualEntriesForm() {
	const [calories, setCalories] = useState(0);
	const [carbohydrates, setCarbohydrates] = useState(0);
	const [date, setDate] = useState<Date>(new Date());
	const [description, setDescription] = useState("");
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
					proteins,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				setError(data.error || "Une erreur est survenue");
				return;
			}

			setCalories(0);
			setCarbohydrates(0);
			setDate(new Date());
			setDescription("");
			setFats(0);
			setProteins(0);
			setSuccess(true);
			router.refresh();
		} catch {
			setError("La nouvelle entrée n'a pas pu être enregistrée");
		} finally {
			setLoading(false);
		}
	}

	if (success) {
		return (
			<Card className="px-6 py-10 flex flex-col items-center justify-center gap-y-5">
				<div className="relative flex items-center justify-center w-16 h-16">
					<span className="absolute inset-0 rounded-full bg-primary/10" />
					<CheckIcon className="relative text-primary" strokeWidth={2.5} size={32} />
				</div>

				<div className="text-center">
					<p className="font-data text-[10px] text-primary/85 tracking-[0.25em] uppercase mb-2">
						Enregistrement
					</p>
					<h3 className="font-display text-2xl tracking-[0.06em] uppercase leading-none text-foreground">
						Apport enregistré
					</h3>
					<p className="font-serif text-sm text-secondary mt-2 italic">
						Vos calories & macros ont bien été enregistrées.
					</p>
				</div>

				<Divider />

				<Button
					variant="outline"
					className="w-full font-data text-xs tracking-widest uppercase"
					onClick={() => setSuccess(false)}
				>
					+ Nouvel apport
				</Button>
			</Card>
		);
	}

	return (
		<Card className="px-6 pb-6 flex flex-col gap-y-5">
			<div>
				<SectionTag>Suivi des calories</SectionTag>
				<div className="flex items-end gap-3">
					<h3 className="font-display text-3xl tracking-[0.06em] uppercase leading-none text-foreground">
						Nouvel apport
					</h3>
					<UtensilsIcon className="text-primary/60 mb-0.5 shrink-0" size={20} strokeWidth={1.5} />
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
					<Label htmlFor="desc">
						Description
					</Label>
					<Input
						id="desc"
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Déjeuner, collation..."
						className="font-serif"
					/>
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
					<Label htmlFor="calories">
						Calories
					</Label>
					<InputWithAddon
						id="calories"
						value={calories}
						onChange={setCalories}
						addon="kcal"
						placeholder="0"
					/>
				</div>

				<div className="flex items-center gap-3 pt-1">
					<span className="font-data text-[9px] tracking-[0.25em] uppercase text-muted-foreground shrink-0">
						Macros
					</span>
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="grid grid-cols-3 gap-3">
					{[
						{ id: "carbohydrates", label: "Glucides", value: carbohydrates, setter: setCarbohydrates },
						{ id: "fats", label: "Lipides", value: fats, setter: setFats },
						{ id: "proteins", label: "Protéines", value: proteins, setter: setProteins },
					].map(({ id, label, value, setter }) => (
						<div key={id} className="flex flex-col gap-y-2">
							<Label htmlFor={id} className="text-[10px] tracking-[0.15em]">
								{label}
							</Label>
							<InputWithAddon
								id={id}
								value={value}
								onChange={setter}
								addon="g"
								placeholder="0"
								required
							/>
						</div>
					))}
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
						"Enregistrer l'apport"
					)}
				</Button>
			</form>
		</Card>
	);
}