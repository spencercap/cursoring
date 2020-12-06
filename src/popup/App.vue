<template>
	<span>popup:</span>
	<hello-world />

	<div>
		<p>set username:</p>
		<input v-model="username" type="text" placeholder="username">
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
			username: '',
			userColor: ''
		};
	},
	watch: {
		username: {
			async handler(inUsername: string) {
				// await browser.storage.local.set({username: inUsername});

				const res: string = await browser.runtime
					.sendMessage({
						type: 'update:username',
						username: inUsername
					});
				console.log('res', res);

				// "browser" is firefox+chrome+supports async, "chrome" is ...?
				// chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
				// 	const activeTab = tabs[0];
				// 	if (activeTab && activeTab.id) {
				// 		chrome.tabs.sendMessage(activeTab.id, {'message': 'start'});
				// 	}
				// });

				// console.log('browser', browser);
				console.log('chrome', chrome);

				chrome.storage.local.get(null, function(items) {
					const allKeys = Object.keys(items);
					console.log(allKeys);
				});

				// chrome.storage.local.set({username: inUsername});
				// await browser.storage.local.set({username: inUsername});
			}
		},
		userColor: {
			async handler(inHexColor: string) {
				await browser.runtime
					.sendMessage({
						type: 'update:userColor',
						userColor: inHexColor
					});
			}
		}
	},
	async mounted() {
		console.log('popup mounted');

		// has username set?
		const gotUsernameData = await browser.storage.local.get(['username']);
		if (gotUsernameData && gotUsernameData.username) {
			this.username = gotUsernameData.username;
		}

		// has username set?
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
