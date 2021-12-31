<template>
	<img :src="src || './user_placeholder.png'" />
</template>

<script>
	export default {
		props: {
			src: { type: String },
		},
	};
</script>

<style scoped>
	img {
		object-fit: cover;
	}
</style>