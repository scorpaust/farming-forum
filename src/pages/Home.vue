<template>
	<h1>Welcome to the Farming Forum</h1>
	<category-list :categories="categories" />
</template>

<script>
	import CategoryList from "@/components/CategoryList";
	import sourceData from "@/data.json";
	export default {
		components: {
			CategoryList,
		},
		data() {
			return {
				categories: sourceData.categories,
			};
		},
	};
</script>

<style>
</style>