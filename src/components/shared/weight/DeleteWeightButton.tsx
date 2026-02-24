"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 as TrashIcon } from "lucide-react";

export default function DeleteWeightButton({ entryId }: { entryId: string }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		setLoading(true);
		try {
			const response = await fetch(`/api/weight?id=${entryId}`, {
				method: "DELETE",
			});
			
			if (!response.ok) {
				const data = await response.json();
				console.log(data);
				return;
			}

			router.refresh();
		} catch (error) {
			console.error("Erreur lors de la suppression :", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={handleDelete}
			disabled={loading}
		>
			<TrashIcon size={8} className="text-red-500" />
		</Button>
	);
}