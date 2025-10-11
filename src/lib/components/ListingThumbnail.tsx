import { type ClassValue, cn } from "cnfn";
import { useState } from "react";

export interface ListingThumbnailProps {
	src?: string | null;
	alt: string;
	className?: ClassValue;
}

export function ListingThumbnail({
	src,
	alt,
	className,
}: ListingThumbnailProps) {
	const [hasFailed, setHasFailed] = useState(false);

	if (hasFailed || !src) {
		return <div className="aspect-square size-12 rounded bg-zinc-700" />;
	}

	return (
		<img
			src={src}
			alt={alt}
			className={cn("aspect-square size-12 rounded", className)}
			onError={() => setHasFailed(true)}
		/>
	);
}
