<template>
	<img alt="Vue logo" src="./assets/logo.png" />
	<div class="container">
		<router-view />
	</div>
</template>

<script>
	import PageHome from "./components/PageHome.vue";

	export default {
		name: "App",
	};
</script>

<style>
	@import "assets/style.css";
</style>
