import { type ClassValue, cn } from "cnfn";
import { useState } from "react";

export interface ListingThumbnailProps {
	src?: string | null;
	alt: string;
	class?: ClassValue;
}

export function ListingThumbnail({
	src,
	alt,
	...props
}: ListingThumbnailProps) {
	const [hasFailed, setHasFailed] = useState(false);

	return src && !hasFailed ? (
		<img
			src={src}
			alt={alt}
			className={cn("aspect-square size-12 rounded", props.class)}
			onError={() => setHasFailed(true)}
		/>
	) : (
		<div className="aspect-square size-12 rounded bg-zinc-700"></div>
	);
}
