import { createRouter, createWebHashHistory } from "vue-router";
import HighscoreView from "./views/HighscoreView.vue";
import SearchView from "./views/SearchView.vue";

export default createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: "/", redirect: "/highscore" },
		{ path: "/highscore", component: HighscoreView },
		{ path: "/search", component: SearchView }
	]
});
