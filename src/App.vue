<template>
	<the-navbar />
	<div class="container">
		<router-view
			v-show="showPage"
			@ready="onPageReady"
			:key="`${$route.path}${JSON.stringify($route.query)}`"
		/>
		<app-spinner v-show="!showPage" />
	</div>
	<app-notifications />
</template>

<script>
	import AppNotifications from "@/components/AppNotifications";
	import TheNavbar from "./components/TheNavbar.vue";
	import { mapActions } from "vuex";
	import NProgress from "nprogress";

	export default {
		components: { TheNavbar, AppNotifications },
		name: "App",
		data() {
			return {
				showPage: false,
			};
		},
		methods: {
			...mapActions("auth", ["fetchAuthUser"]),
			onPageReady() {
				this.showPage = true;
				NProgress.done();
			},
		},
		created() {
			this.fetchAuthUser();
			NProgress.configure({
				speed: 200,
				showSpinner: false,
			});
			this.$router.beforeEach(() => {
				this.showPage = false;
				NProgress.start();
			});
		},
	};
</script>

<style>
	@import "assets/style.css";
	@import "~nprogress/nprogress.css";

	#nprogress .bar {
		background: #57ad8d !important;
	}
</style>
