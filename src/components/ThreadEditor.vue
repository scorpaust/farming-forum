<template>
	<vee-form @submit="save">
		<app-form-field
			name="title"
			label="Title"
			v-model="form.title"
			type="text"
			id="thread_title"
			rules="required"
		/>

		<app-form-field
			as="textarea"
			v-model="form.text"
			id="thread_content"
			name="content"
			label="Content"
			rows="8"
			cols="140"
			rules="required"
		/>

		<div class="btn-group">
			<button @click.prevent="$emit('cancel')" class="btn btn-ghost">
				Cancel
			</button>
			<button class="btn btn-blue" type="submit" name="Publish">
				{{ existing ? "Update" : "Publish" }}
			</button>
		</div>
	</vee-form>
</template>

<script>
	import AppFormField from "./AppFormField.vue";
	export default {
		components: { AppFormField },
		props: {
			title: { type: String, default: "" },
			text: { type: String, default: "" },
		},
		data() {
			return {
				form: {
					title: this.title,
					text: this.text,
				},
			};
		},
		computed: {
			existing() {
				return !!this.title;
			},
		},
		methods: {
			save() {
				this.$emit("clean");
				this.$emit("save", { ...this.form });
			},
		},
		watch: {
			form: {
				handler() {
					if (this.form.title !== this.title || this.form.text !== this.text) {
						this.$emit("dirty");
					} else {
						this.$emit("clean");
					}
				},
				deep: true,
			},
		},
	};
</script>