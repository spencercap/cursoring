/* eslint-disable @typescript-eslint/no-unused-vars */
console.log('content-script init');

import { rtdb } from '@/firebase/index';

//
// const bg = browser.extension.getBackgroundPage();
// console.log('bg', bg);



// init rtdb path
let rtdbPath = '';
const host = window.location.host;
const path = window.location.pathname;
const hostFormatted = host.replaceAll('.', '*');
const pathFormatted = path.replaceAll('/', '>');
rtdbPath = `/pages/${hostFormatted}/${pathFormatted}/`;



//
let uid = '';
const getUid = async () => {
	// console.log('getUid started');

	// uid
	const gotUid: undefined | string = await browser.runtime.sendMessage({ type: 'get:uid' });
	console.log('gotUid', gotUid);
	if (gotUid) uid = gotUid;

	//
	if (gotUid) {
		// init presence
		const writingRef = rtdb.ref(`${rtdbPath}/${uid}`);
		rtdb.ref('.info/connected').on('value', async (snap) => {
			// If we're not currently connected, don't do anything.
			if (snap.val() == false) {
				return;
			}
			// init disconnect operation
			await writingRef.onDisconnect().remove();
			// write is online
			await writingRef.update({
				uid: uid
			});
		});
	}
};
getUid(); // init



// listen for message (has to be to this specific tab id)
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.message === 'start') {
			console.log('started');
		}
	}
);



document.body.addEventListener('mousemove', async (ev) => {
	// console.log('mouse', ev);
	const x = ev.pageX;
	const y = ev.pageY;
	// const down = ev.cl

	// send data to backend for rtdb update
	await browser.runtime
		.sendMessage({
			type: 'update:pos',
			rtdbPath,
			data: {
				mousedown: false,
				x,
				y
			}
		});
});
