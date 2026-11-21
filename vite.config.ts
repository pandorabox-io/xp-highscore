import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	root: "frontend",
	base: "./",
	plugins: [vue()],
	build: {
		outDir: "../dist",
		emptyOutDir: true
	},
	server: {
		// forward api calls to the express backend (npm start)
		proxy: {
			"/api": "http://127.0.0.1:8080"
		}
	}
});
