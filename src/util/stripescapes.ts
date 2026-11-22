// Luanti wraps translatable strings in escape sequences, e.g.
// "\x1b(T@xp_redo_ranks_ores)Uranium\x1bE". Mirrors core.strip_escapes:
// drop "\x1b(...)" sequences first, then any remaining single-char escape ("\x1bE", "\x1bF", ...)
export function stripEscapes(s: string): string {
	return s.replace(/\x1b\([^)]*\)/g, "").replace(/\x1b./gs, "");
}
