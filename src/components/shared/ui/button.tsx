import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	[
		"inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0",
		"font-poster tracking-[0.12em] uppercase",
		"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
		"transition-[background-color,border-color,color] duration-[280ms] ease-[ease]",
		"disabled:pointer-events-none disabled:opacity-40",
		"outline-none focus-visible:ring-2 focus-visible:ring-[var(--zgym-gold)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--zgym-bg)]",
		"aria-invalid:ring-[var(--zgym-brick)]/30 aria-invalid:border-[var(--zgym-brick)]",
		"border border-transparent",
	],
	{
		variants: {
			variant: {
				default: [
					"bg-[color-mix(in_srgb,var(--zgym-gold)_10%,transparent)]",
					"border-[color-mix(in_srgb,var(--zgym-gold)_45%,transparent)]",
					"text-[var(--zgym-gold)]",
					"hover:bg-[var(--zgym-gold)]",
					"hover:border-[var(--zgym-gold)]",
					"hover:text-[#0C0B09]",
				],
				destructive: [
					"bg-[color-mix(in_srgb,var(--zgym-brick)_10%,transparent)]",
					"border-[color-mix(in_srgb,var(--zgym-brick)_40%,transparent)]",
					"text-[var(--zgym-brick)]",
					"hover:bg-[var(--zgym-brick)]",
					"hover:border-[var(--zgym-brick)]",
					"hover:text-[var(--zgym-cream)]",
				],
				outline: [
					"bg-transparent",
					"border-[rgba(237,232,220,0.18)]",
					"text-[var(--zgym-text-2)]",
					"hover:bg-[rgba(237,232,220,0.08)]",
					"hover:border-[rgba(237,232,220,0.35)]",
					"hover:text-[var(--zgym-cream)]",
				],
				secondary: [
					"bg-[var(--zgym-bg-lifted)]",
					"border-[rgba(237,232,220,0.10)]",
					"text-[var(--zgym-cream)]",
					"hover:bg-[color-mix(in_srgb,var(--zgym-cream)_8%,var(--zgym-bg-lifted))]",
					"hover:border-[rgba(237,232,220,0.22)]",
				],
				ghost: [
					"bg-transparent border-transparent",
					"text-[var(--zgym-text-2)]",
					"font-body italic tracking-normal normal-case",
					"hover:bg-transparent hover:border-transparent",
					"hover:text-[var(--zgym-cream)]",
					"underline underline-offset-4",
					"decoration-[rgba(237,232,220,0.20)]",
					"hover:decoration-[rgba(237,232,220,0.50)]",
					"transition-[color,text-decoration-color] duration-[280ms] ease-[ease]",
				],
				link: [
					"bg-transparent border-transparent",
					"text-[var(--zgym-gold)]",
					"font-body italic tracking-normal normal-case",
					"underline underline-offset-4",
					"decoration-[rgba(232,176,48,0.35)]",
					"hover:decoration-[var(--zgym-gold)]",
					"hover:text-[var(--zgym-gold)]",
					"transition-[color,text-decoration-color] duration-[280ms] ease-[ease]",
				],
			},
			size: {
				default: "h-9 px-5 py-2 rounded-[10px] text-[17px] has-[>svg]:px-4",
				sm: "h-8 px-4 py-1.5 rounded-[8px] text-[15px] gap-1.5 has-[>svg]:px-3",
				lg: "h-11 px-7 py-2.5 rounded-[10px] text-[19px] has-[>svg]:px-5",
				xs: "h-6 px-2.5 py-1 rounded-[6px] text-[12px] gap-1 has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
				icon: "size-9 rounded-[10px]",
				"icon-sm": "size-8 rounded-[8px]",
				"icon-lg": "size-11 rounded-[10px]",
				"icon-xs": "size-6 rounded-[6px] [&_svg:not([class*='size-'])]:size-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? Slot.Root : "button"

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	)
}

export { Button, buttonVariants }