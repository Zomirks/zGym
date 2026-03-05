import { Input } from '@/components/ui/input';

export function InputWithAddon({
	id,
	value,
	onChange,
	addon,
	min = 0,
	step = 1,
	placeholder,
	required,
}: {
	id: string;
	value: number;
	onChange: (v: number) => void;
	addon: string;
	min?: number;
	step?: number;
	placeholder?: string;
	required?: boolean;
}) {
	return (
		<div className="relative">
			<Input
				id={id}
				type="number"
				min={min}
				step={step}
				value={value}
				onChange={(e) => onChange(e.target.valueAsNumber)}
				placeholder={placeholder}
				required={required}
				className="pr-16"
			/>
			<span className="absolute right-3 top-1/2 -translate-y-1/2 font-data text-[10px] tracking-widest uppercase text-muted-foreground pointer-events-none select-none">
				{addon}
			</span>
		</div>
	);
}