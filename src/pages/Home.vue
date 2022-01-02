<template>
	<div v-if="asyncDataStatus_ready" class="container">
		<h1 class="push-top">Welcome to the Farming Forum</h1>
		<category-list :categories="categories" />
	</div>
</template>

<script>
	import CategoryList from "@/components/CategoryList.vue";
	import { mapActions } from "vuex";
	import asyncDataStatus from "@/mixins/asyncDataStatus";

	export default {
		components: {
			CategoryList,
		},
		mixins: [asyncDataStatus],
		computed: {
			categories() {
				return this.$store.state.categories.items;
			},
		},
		methods: {
			...mapActions("categories", ["fetchAllCategories"]),
			...mapActions("forums", ["fetchForums"]),
		},
		async created() {
			await this.fetchAllCategories().then(async (categories) => {
				const forumIds = categories.map((category) => category.forums).flat();
				await this.fetchForums({ ids: forumIds });
				this.asyncDataStatus_fetched();
			});
		},
	};
</script>

<style>
</style>