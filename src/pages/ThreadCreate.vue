<template>
	<div class="col-full push-top">
		<h1>
			Create new thread in <i>{{ forum.name }}</i>
		</h1>
		<thread-editor @save="save" @cancel="cancel" />
	</div>
</template>

<script>
	import ThreadEditor from "@/components/ThreadEditor";
	import { findById } from "@/helpers";

	export default {
		props: {
			forumId: { type: String, required: true },
		},
		components: {
			ThreadEditor,
		},
		data() {
			return {
				title: "",
				text: "",
			};
		},
		computed: {
			forum() {
				return findById(this.$store.state.forums, this.forumId);
			},
		},
		methods: {
			async save({ title, text }) {
				const thread = await this.$store.dispatch("createThread", {
					forumId: this.forum.id,
					title,
					text,
				});

				this.$router.push({ name: "ThreadShow", params: { id: thread.id } });
			},

			cancel() {
				this.$router.push({ name: "Forum", params: { id: this.forum.id } });
			},
		},
	};
</script>