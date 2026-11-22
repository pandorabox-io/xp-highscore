import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Rank } from "#shared/types.ts";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function numberWithCommas(x: string | number | undefined): string {
	if (x === undefined) {
		return "";
	}
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

// milliseconds since the given date
export function msSince(date: string): number {
	return dayjs().diff(date);
}

export function humanizeMs(ms: number): string {
	return dayjs.duration(ms).humanize();
}

export function humanizeSeconds(seconds: string | undefined): string {
	return seconds ? dayjs.duration(+seconds, "seconds").humanize() : "";
}

// ranks are ordered ascending by xp
export function getRank(ranks: Rank[], xp: string | number | undefined): Rank | null {
	const value = Number(xp ?? 0);
	let current: Rank | null = null;
	for (const rank of ranks) {
		if (rank.xp > value) {
			break;
		}
		current = rank;
	}
	return current;
}

export function rankColor(rank: Rank): string {
	return `rgb(${rank.color.r}, ${rank.color.g}, ${rank.color.b})`;
}

export function playerImage(skins: Record<string, string>, name: string): string {
	const skin = skins[name];
	return skin ? `api/texture/${skin}_preview.png` : "img/sam.png";
}
