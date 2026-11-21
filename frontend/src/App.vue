<template>
	<nav class="navbar navbar-dark bg-dark navbar-expand mb-3 px-3">
		<RouterLink class="navbar-brand" to="/highscore">Pandorabox Highscore</RouterLink>
		<ul class="navbar-nav">
			<li class="nav-item">
				<RouterLink class="nav-link" active-class="active" to="/highscore">Highscore</RouterLink>
			</li>
			<li class="nav-item">
				<RouterLink class="nav-link" active-class="active" to="/search">Search</RouterLink>
			</li>
		</ul>
	</nav>
	<div class="container-fluid">
		<RouterView />
	</div>
</template>
