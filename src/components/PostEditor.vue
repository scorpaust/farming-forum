<template>
	<div class="col-full">
		<vee-form @submit="save" :key="formKey">
			<app-form-field
				as="textarea"
				name="text"
				label="Text"
				v-model="postCopy.text"
				cols="30"
				rows="10"
				rules="required"
			/>

			<div class="form-actions">
				<button class="btn-blue">
					{{ post.id ? "Update post " : "Submit post" }}
				</button>
			</div>
		</vee-form>
	</div>
</template>

<script>
	import AppFormField from "./AppFormField.vue";
	export default {
		components: { AppFormField },
		props: {
			post: {
				type: Object,
				default: () => ({ text: null }),
			},
		},
		data() {
			return {
				postCopy: { ...this.post },
				formKey: Math.random(),
			};
		},
		methods: {
			save() {
				this.$emit("save", { post: this.postCopy }); // access under eventData.post
				this.postCopy.text = "";
				this.formKey = Math.random();
			},
		},
	};
</script>

<style scoped>
</style>