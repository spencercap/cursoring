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
// getUid(); // init



// listen for message (has to be to this specific tab id)
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.message === 'start') {
			console.log('started');
		}
	}
);



// init storage
const storage = {} as Record<string, string>;
const initStorage = async () => {
	const items = await browser.storage.local.get();
	storage.userName = items.userName || 'anonymous';
	storage.userColor = items.userColor || 'pink';
	// console.log('got storage', storage);
};
// listen to storage
chrome.storage.onChanged.addListener((changes, namespace) => {
	for (const changeKey in changes) {
		storage[changeKey] = changes[changeKey].newValue;
	}
});



// cursor
let myCursor: undefined | HTMLDivElement;
const initMyCursor = () => {
	myCursor = document.createElement('div');

	// styles
	myCursor.style.position = 'absolute';
	myCursor.style.pointerEvents = 'none';
	myCursor.style.width = '24px';
	myCursor.style.height = '24px';

	// dynamics
	myCursor.style.backgroundColor = storage.userColor;

	// myCursor.style.top = y + 'px';
	// myCursor.style.left = x + 'px';

	document.body.appendChild(myCursor);
};



// mouse
let x = 0;
let y = 0;
document.body.addEventListener('mousemove', async (ev) => {
	// console.log('mouse', ev);
	x = ev.pageX;
	y = ev.pageY;
	// const down = ev.cl



	// move cursor
	if (myCursor) {
		myCursor.style.top = y + 'px';
		myCursor.style.left = x + 'px';
	}



	// rtdb: send data to backend for rtdb update
	await browser.runtime
		.sendMessage({
			type: 'update:pos',
			rtdbPath,
			data: {
				// mousedown: false,
				x,
				y
			}
		});
});



// start everything up
window.addEventListener('load', async () => {
	await getUid();
	await initStorage();
	initMyCursor();
}, false);
