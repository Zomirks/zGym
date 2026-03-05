interface MacroCardProps {
	label: string
	value: number
	unit: string
	colorBg: string
	colorAccent: string
}

export default async function MacroCard({ label, value, unit, colorBg, colorAccent }: MacroCardProps) {
	const int = Math.floor(value);
	const dec = value.toFixed(1).split(".")[1];
	return (
		<div className={`flex flex-col gap-1 rounded-md py-3 ${colorBg}`}>
			<div className="border-b pb-2">
				<span className={`px-4 font-serif text-xs tracking-widest uppercase ${colorAccent}`}>{label}</span>
			</div>

			<div className="flex flex-col flex-1 justify-end px-4">
				<div className="font-data text-6xl font-bold tracking-tighter">
					{int}
					<span className="font-normal opacity-40 text-xl">.{dec}</span>

					<span className="text-2xl ml-2">{unit}</span>

				</div>
				<div className="text-[8px] font-serif text-secondary tracking-wider uppercase">
					/ journée
				</div>
			</div>
		</div>
	)
}