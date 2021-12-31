<template>
	<div class="profile-card">
		<vee-form @submit="save">
			<p class="text-center avatar-edit">
				<label for="avatar">
					<app-avatar-image
						:src="activeUser.avatar"
						:alt="`${user.name} profile picture`"
						class="avatar-xlarge img-update"
					/>
					<div class="avatar-upload-overlay">
						<app-spinner v-if="uploadingImage" color="white" />
						<fa
							v-else
							icon="camera"
							size="3x"
							style="{text-color: 'white', opacity: '0.8'}"
						/>
					</div>
					<input
						v-show="false"
						type="file"
						id="avatar"
						accept="image/*"
						@change="handleAvatarUpload"
					/>
				</label>
			</p>
			<user-profile-card-editor-random-avatar
				@hit="activeUser.avatar = $event"
			/>

			<app-form-field
				label="Username"
				name="username"
				v-model="activeUser.username"
				:rules="{
					required: true,
					unique: {
						mycollection: 'users',
						field: 'username',
						excluding: user.username,
					},
				}"
			/>
			<app-form-field
				label="Full Name"
				name="name"
				v-model="activeUser.name"
				rules="required"
			/>
			<app-form-field
				label="Bio"
				name="bio"
				as="textarea"
				v-model="activeUser.bio"
				placeholder="Write a few words about yourself."
			/>

			<div class="stats">
				<span>{{ user.postsCount }} posts</span>
				<span>{{ user.threadsCount }} threads</span>
			</div>

			<hr />

			<app-form-field
				label="Website"
				name="website"
				v-model="activeUser.website"
				rules="url"
			/>

			<app-form-field
				label="Email"
				name="email"
				v-model="activeUser.email"
				:rules="{
					required: true,
					email: true,
					unique: {
						mycollection: 'users',
						field: 'email',
						excluding: user.email,
					},
				}"
			/>

			<app-form-field
				label="Location"
				name="location"
				v-model="activeUser.location"
				list="locations"
				@mouseenter="loadLocationOptions"
			/>

			<datalist id="locations">
				<option
					v-for="location in locationOptions"
					:value="location.name.common"
					:key="location.name.common"
				/>
			</datalist>

			<div class="btn-group space-between">
				<button class="btn-ghost" @click.prevent="cancel">Cancel</button>
				<button type="submit" class="btn-blue">Save</button>
			</div>
		</vee-form>
	</div>
</template>

<script>
	import { mapActions } from "vuex";
	import UserProfileCardEditorRandomAvatar from "@/components/UserProfileCardEditorRandomAvatar.vue";

	export default {
		props: {
			user: {
				type: Object,
				required: true,
			},
		},
		components: {
			UserProfileCardEditorRandomAvatar,
		},
		data() {
			return {
				uploadingImage: false,
				activeUser: { ...this.user },
				locationOptions: [],
			};
		},
		methods: {
			...mapActions("auth", ["uploadAvatar"]),
			async loadLocationOptions() {
				if (this.locationOptions.length) return;
				const res = await fetch("https://restcountries.com/v3/all");
				this.locationOptions = await res.json();
			},
			async handleAvatarUpload(e) {
				this.uploadingImage = true;
				const file = e.target.files[0];
				const uploadedImage = await this.uploadAvatar({ file });
				this.activeUser.avatar = uploadedImage || this.activeUser.avatar;
				this.uploadingImage = false;
			},
			async handleRandomAvatarUpload() {
				const randomAvatarGenerated =
					this.activeUser.avatar.startsWith("https://pixabay");
				if (randomAvatarGenerated) {
					const image = await fetch(this.activeUser.avatar);
					const blob = await image.blob();
					this.activeUser.avatar = await this.uploadAvatar({
						file: blob,
						filename: "random",
					});
				}
			},
			async save() {
				await this.handleRandomAvatarUpload();
				this.$store.dispatch("users/updateUser", { ...this.activeUser });
				this.$router.push({ name: "Profile" });
			},
			cancel() {
				this.$router.push({ name: "Profile" });
			},
		},
	};
</script>