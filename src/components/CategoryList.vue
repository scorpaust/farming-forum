<template>
	<forum-list
		v-for="category in categories"
		:key="category.id"
		:forums="getForumsForCategory(category)"
		:title="category.name"
		:category-id="category.id"
	/>
</template>

<script>
	import ForumList from "@/components/ForumList.vue";

	export default {
		props: {
			categories: {
				required: true,
				type: Array,
			},
		},
		components: {
			ForumList,
		},
		methods: {
			getForumsForCategory(category) {
				return this.$store.state.forums.items.filter(
					(forum) => forum.categoryId === category.id
				);
			},
		},
	};
</script>

<style>
</style>