import { isServer } from "@tanstack/react-query";
import { useState } from "react";

export function useMediaQuery(query: string) {
	const [matches, setMatches] = useState<boolean>(() => {
		if (isServer) return false;
		return window.matchMedia(`(${query})`).matches;
	});

	if (isServer) {
		return { matches };
	}

	window.onresize = () => {
		setMatches(window.matchMedia(query).matches);
	};

	return { matches };
}
