import type { Metadata } from "next";
import { Bebas_Neue, Lora, Space_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/shared/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";

const bebasNeue = Bebas_Neue({
	variable: "--font-bebas-neue",
	weight: "400",
	subsets: ["latin"],
});

const lora = Lora({
	variable: "--font-lora",
	subsets: ["latin"],
});

const spaceMono = Space_Mono({
	variable: "--font-space-mono",
	weight: ["400", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "zGym",
	description: "Faites un suivi de vos performances",
};

export default function RootLayout({children}: Readonly<{
  	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${bebasNeue.variable} ${lora.variable} ${spaceMono.variable} antialiased dark`}
			>
				<TooltipProvider>
					<Layout>
						{children}
					</Layout>
				</TooltipProvider>
			</body>
		</html>
	);
}
