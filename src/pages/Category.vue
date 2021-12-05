<template>
	<h1>{{ category.name }}</h1>
	<forum-list
		:title="category.name"
		:forums="getForumsForCategory(category)"
	></forum-list>
</template>

<script>
	import ForumList from "@/components/ForumList";

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
				return this.$store.state.categories.find(
					(category) => category.id === this.id
				);
			},
		},
		methods: {
			getForumsForCategory(category) {
				return this.$store.state.forums.filter(
					(forum) => forum.categoryId === category.id
				);
			},
		},
	};
</script>

<style>
</style>