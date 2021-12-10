<template>
	<h1 class="push-top">Welcome to the Farming Forum</h1>
	<category-list :categories="categories" />
</template>

<script>
	import CategoryList from "@/components/CategoryList";
	import { mapActions } from "vuex";

	export default {
		components: {
			CategoryList,
		},
		computed: {
			categories() {
				return this.$store.state.categories;
			},
		},
		methods: {
			...mapActions(["fetchAllCategories", "fetchForums"]),
		},
		async created() {
			const categories = await this.fetchAllCategories().then((categories) => {
				const forumIds = categories.map((category) => category.forums).flat();
				this.fetchForums({ ids: forumIds });
			});
		},
	};
</script>

<style>
</style>