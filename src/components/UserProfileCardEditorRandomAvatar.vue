<template>
	<div class="text-center" style="margin-bottom: 15px">
		<button class="btn-green btn-xsmall" @click.prevent="getRandomImage">
			Random Avatar
		</button>
		<br />
		<small style="opacity: 0.5"
			>Powered by <a href="https://pixabay.com">Pixabay</a></small
		>
	</div>
</template>

<script>
	import { arrayRandom } from "@/helpers";
	export default {
		methods: {
			async getRandomImage() {
				const searchTerms = [
					"Agribusiness",
					"Artifact",
					"Bacteria",
					"Bovine",
					"Breed",
					"Bull",
					"Bushel",
					"Canal",
					"Cash crop",
					"Cellulose",
					"Cob",
					"Combine",
					"Commodity",
					"Compaction",
					"Corn Ears",
					"Corn Husk",
					"Cradle",
					"Cultivate",
					"Disk",
					"Domesticate",
					"Ecology",
					"Ecosystem",
					"Environment",
					"Enzymes",
					"Erosion",
					"Ethanol",
					"Excrete",
					"Expense",
					"Extension Agency",
					"Fallow",
					"Farm Bureau",
					"Feed",
					"Feeder cattle",
					"Feed Lots",
					"Fertilizer",
					"Finances",
					"Fixing",
					"Flail",
					"4H",
					"Gene",
					"Grade",
					"Grange",
					"Grass",
					"Grit",
					"Groundwater",
					"Harvest",
					"Herbicide",
					"Hock",
					"Homestead",
					"Humus",
					"Hybrid",
					"Hydroponic",
					"Income",
					"Inputs",
					"Insecticide",
					"Intensive grazing",
					"Inventory",
					"Kernel",
					"Legume",
					"Livestock",
					"Manure",
					"Market",
					"Matter",
					"Mill",
					"Microorganisms",
					"Monoculture",
					"No till",
					"Nodule",
					"Nutrients",
					"Offal",
					"Organic farming",
					"Organic matter",
					"Pastures",
					"Pesticide",
					"pH",
					"Photosynthesis",
					"Plow",
					"Pollinate",
					"Pork bellies",
					"Port",
					"Rendering plant",
					"Row Dividers",
					"Rotation",
					"Rumen",
					"Scythe",
					"Shear",
					"Shock",
					"Silage",
					"Soil Conservation",
					"Species",
					"Steer",
					"Stewardship",
					"Sub-division",
					"Technology",
					"Tenant",
					"Thresh",
					"Total Mixed Ration",
					"Urbanization",
					"Weed",
					"Work ethic",
					"Yield",
				];
				const randomWord = arrayRandom(searchTerms);
				const res = await fetch(
					`https://pixabay.com/api/?key=${
						import.meta.env.VITE_PIXABAY_API_KEY
					}&q=${randomWord}`
				);
				const data = await res.json();
				const randomImage = arrayRandom(data.hits);
				this.$emit("hit", randomImage.webformatURL);
			},
		},
	};
</script>

<style>
</style>