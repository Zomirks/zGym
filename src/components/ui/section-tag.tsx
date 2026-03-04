import { type ReactNode } from "react";

export function SectionTag({ children }: { children: ReactNode }) {
	return (
		<div className="flex items-center gap-2 font-data text-[10px] text-primary/85 tracking-[0.25em] uppercase mb-2">
			<span className="inline-block w-6 h-px bg-primary/50" />
			{children}
		</div>
	);
}
