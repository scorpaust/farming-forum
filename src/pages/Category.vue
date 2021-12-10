<template>
	<h1>{{ category.name }}</h1>
	<forum-list
		:title="category.name"
		:forums="getForumsForCategory(category)"
	></forum-list>
</template>

<script>
	import ForumList from "@/components/ForumList";
	import { findById } from "@/helpers";
	import { mapActions } from "vuex";

	export default {
		props: {
			id: {
				required: true,
				type: String,
			},
		},
		components: {
			ForumList,
		},
		computed: {
			category() {
				return findById(this.$store.state.categories, this.id) || {};
			},
		},
		methods: {
			...mapActions(["fetchCategory", "fetchForums"]),
			getForumsForCategory(category) {
				return this.$store.state.forums.filter(
					(forum) => forum.categoryId === category.id
				);
			},
		},
		async created() {
			const category = await this.fetchCategory({
				id: this.id,
			});
			this.fetchForums({ ids: category.forums });
		},
	};
</script>

<style>
</style>