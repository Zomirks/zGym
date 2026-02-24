import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/shared/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
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
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
