import { ref, watch } from "vue";

export type ThemeMode = "auto" | "light" | "dark";

const STORAGE_KEY = "theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");

function loadMode(): ThemeMode {
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		if (v === "light" || v === "dark") return v;
	} catch (e) {
		// storage unavailable
	}
	return "auto";
}

export const themeMode = ref<ThemeMode>(loadMode());

function apply() {
	const dark = themeMode.value === "dark" || (themeMode.value === "auto" && media.matches);
	document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}

watch(themeMode, mode => {
	try {
		if (mode === "auto") localStorage.removeItem(STORAGE_KEY);
		else localStorage.setItem(STORAGE_KEY, mode);
	} catch (e) {
		// storage unavailable
	}
	apply();
});

media.addEventListener("change", apply);
apply();
