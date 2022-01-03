<template>
	<div class="post-list">
		<div class="post" v-for="post in posts" :key="post.id">
			<div v-if="user(post.userId)" class="user-info">
				<a href="#" class="user-name">{{ user(post.userId).name }}</a>

				<a href="#">
					<app-avatar-image
						class="avatar-large"
						:src="user(post.userId).avatar"
						alt=""
					/>
				</a>
				<p class="desktop-only text-small">
					{{ userPostsCount(post.userId) }}
					{{ userPostsCount(post.userId) > 1 ? "posts" : "post" }}
				</p>
				<p class="desktop-only text-small">
					{{ user(post.userId).threadsCount }}
					{{ user(post.userId).threadsCount > 1 ? "threads" : "thread" }}
				</p>
			</div>

			<div class="post-content">
				<div class="col-full">
					<post-editor
						v-if="editing === post.id"
						:post="post"
						@save="handleUpdate"
					/>
					<p v-else>
						{{ post.text }}
					</p>
				</div>
				<a
					v-if="post.userId === $store.state.auth.authId"
					@click.prevent="toggleEditMode(post.id)"
					href="#"
					style="margin-left: auto; padding-left: 10px"
					class="link-unstyled"
					title="Make a change"
				>
					<fa icon="pencil-alt" />
				</a>
			</div>
			<div class="post-date text-faded">
				<div v-if="posts.edited?.at" class="edition-info">edited</div>
				<app-date :timestamp="post.publishedAt" />
			</div>
		</div>
	</div>
</template>

<script>
	import PostEditor from "@/components/PostEditor.vue";
	import { mapActions, mapGetters } from "vuex";

	export default {
		props: {
			posts: {
				required: true,
				type: Array,
			},
		},
		components: {
			PostEditor,
		},
		data() {
			return {
				editing: null,
			};
		},
		computed: {
			...mapGetters("users", ["user"]),
			users() {
				return this.$store.state.users.items;
			},
		},
		methods: {
			...mapActions("posts", ["updatePost"]),
			userById(userId) {
				return this.$store.getters["users/user"](userId);
			},
			userPostsCount(id) {
				return this.user(id).postsCount;
			},
		},
	};
</script>

<style scoped>
</style>