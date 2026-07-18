"use client";
import { useState, useSyncExternalStore } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import type { DayButtonProps } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import { Check as CheckIcon } from "lucide-react";

const EntryDayButton = ({ children, modifiers, day, ...props }: DayButtonProps) => {
	return (
		<CalendarDayButton day={day} modifiers={modifiers} {...props} className="relative overflow-visible">
			{children}
			{modifiers.entries && (
				<CheckIcon className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-80 size-8"/>
			)}
		</CalendarDayButton>
	)
};

const calendarComponents = { DayButton: EntryDayButton };

const emptySubscribe = () => () => {};

const WeightCalendar = ({ entryDates }: { entryDates: Date[] }) => {
	const [date, setDate] = useState<Date | undefined>(undefined);
	const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

	if (!mounted) {
		return <div className="w-full rounded-lg border" />;
	}

	return (
		<Calendar
			mode="single"
			timeZone="UTC"
			selected={date}
			onSelect={setDate}
			locale={fr}
			modifiers={{
				entries: entryDates,
			}}
			className="w-full rounded-lg border"
			components={calendarComponents}
		/>
	);
};

export default WeightCalendar;