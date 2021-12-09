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
		async beforeCreate() {
			const categories = await this.$store
				.dispatch("fetchAllCategories")
				.then((categories) => {
					const forumIds = categories.map((category) => category.forums).flat();
					this.$store.dispatch("fetchForums", { ids: forumIds });
				});
		},
	};
</script>

<style>
</style>