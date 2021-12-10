<template>
	<div v-if="forum" class="col-full push-top">
		<div class="forum-header">
			<div class="forum-details">
				<h1>{{ forum.name }}</h1>
				<p class="text-lead">{{ forum.description }}</p>
			</div>
			<router-link
				:to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
				class="btn-green btn-small"
			>
				Start a thread
			</router-link>
		</div>
	</div>

	<div v-if="threadLoaded" class="col-full push-top">
		<thread-list :threads="threads" />
	</div>
</template>

<script>
	import ThreadList from "@/components/ThreadList";
	import { findById } from "@/helpers";
	import { mapActions } from "vuex";

	export default {
		components: { ThreadList },
		props: {
			id: {
				required: true,
				type: String,
			},
		},
		data() {
			return {
				threadLoaded: false,
			};
		},
		computed: {
			forum() {
				return findById(this.$store.state.forums, this.id);
			},
			threads() {
				if (!this.forum?.threads) return [];
				return this.forum.threads.map((threadId) =>
					this.$store.getters.thread(threadId)
				);
			},
		},
		methods: {
			...mapActions(["fetchForum", "fetchThreads", "fetchUsers"]),
		},
		async created() {
			const forum = await this.fetchForum({ id: this.id });
			const threads = await this.fetchThreads({
				ids: forum.threads,
			});
			await this.fetchUsers({
				ids: threads.map((thread) => thread.userId),
			});
			this.threadLoaded = true;
		},
	};
</script>

<style scoped>
</style>