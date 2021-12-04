<template>
	<div class="container">
		<router-view />
	</div>
</template>

<script>
	import PageHome from "./pages/Home.vue";

	export default {
		name: "App",
	};
</script>

<style>
	@import "assets/style.css";
</style>
