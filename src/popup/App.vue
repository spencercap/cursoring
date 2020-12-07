<template>
	<span>popup:</span>
	<hello-world />

	<div>
		<p>set username:</p>
		<input v-model="userName" type="text" placeholder="username">
	</div>

	<div>
		<p>user color:</p>
		<input v-model="userColor" type="text" placeholder="#ff00ff">
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';

export default defineComponent({
	name: 'App',
	components: { HelloWorld },
	data() {
		return {
			userName: '',
			userColor: ''
		};
	},
	watch: {
		userName: {
			async handler(inUserName: string) {
				await browser.storage.local.set({ userName: inUserName });
			}
		},
		userColor: {
			async handler(inHexColor: string) {
				await browser.storage.local.set({ userColor: inHexColor });
			}
		}
	},
	async mounted() {
		console.log('popup mounted');

		// has userName set?
		const gotUsernameData = await browser.storage.local.get(['userName']);
		if (gotUsernameData && gotUsernameData.userName) {
			this.userName = gotUsernameData.userName;
		}

		// has userColor set?
		const gotUserColorData = await browser.storage.local.get(['userColor']);
		if (gotUserColorData && gotUserColorData.userColor) {
			this.userColor = gotUsernameData.userColor;
		}
	}
});
</script>

<style>
html {
	width: 400px;
	height: 400px;
}
</style>
