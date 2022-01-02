<template>
	<div class="form-group">
		<label :for="name">{{ label }}</label>
		<vee-field
			:name="name"
			:label="label"
			:modelValue="modelValue"
			@input="$emit('modelUpdate', $event)"
			:id="name"
			class="form-input"
			v-bind="$attrs"
		/>
		<vee-error-message :name="name" class="form-error" />
	</div>
</template>
<script>
	export default {
		inheritAttrs: false,
		props: {
			name: { type: String, required: true },
			label: { type: String, default: "" },
			modelValue: { type: String, default: "" },
		},
	};
</script>