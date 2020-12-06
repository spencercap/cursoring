<template>
	<span>popup:</span>
	<hello-world />

	<div>
		<p>set username:</p>

		<input v-model="username" type="text" placeholder="username">
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
				// console.log('chrome', chrome);

				// chrome.storage.local.set({username: inUsername});
				// await browser.storage.local.set({username: inUsername});
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
	}
});
</script>

<style>
html {
	width: 400px;
	height: 400px;
}
</style>
