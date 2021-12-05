<template>
	<h1 class="push-top">Welcome to the Farming Forum</h1>
	<category-list :categories="categories" />
</template>

<script>
	import CategoryList from "@/components/CategoryList";

	export default {
		components: {
			CategoryList,
		},
		computed: {
			categories() {
				return this.$store.state.categories;
			},
		},
	};
</script>

<style>
</style>