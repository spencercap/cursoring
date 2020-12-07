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
let myUid = undefined as undefined | Uid;
const getUid = async (): Promise<string | undefined> => {
	// console.log('getUid started');

	// myUid
	const gotUid: undefined | Uid = await browser.runtime.sendMessage({ type: 'get:uid' });
	console.log('gotUid', gotUid);
	if (gotUid) myUid = gotUid;

	//
	if (gotUid) {
		// init presence
		const writingRef = rtdb.ref(`${rtdbPath}/${myUid}`);
		rtdb.ref('.info/connected').on('value', async (snap) => {
			// If we're not currently connected, don't do anything.
			if (snap.val() == false) {
				return;
			}
			// init disconnect operation
			await writingRef.onDisconnect().remove();
			// write is online
			await writingRef.update({
				uid: myUid
			});
		});
	}

	return gotUid;
};



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



// cursor element generator
const makeCursorEl = (uid: Uid): HTMLDivElement => {
	const el = document.createElement('div');
	el.setAttribute('id', uid);

	// styles
	el.style.position = 'absolute';
	el.style.pointerEvents = 'none';
	el.style.width = '24px';
	el.style.height = '24px';
	el.style.borderBottomRightRadius = '12px';
	el.style.opacity = '0.6';
	el.style.zIndex = '9999';

	return el;
};



// cursor
let myCursor: undefined | HTMLDivElement;
const initMyCursor = (uid: Uid) => {
	myCursor = makeCursorEl(uid);

	// dynamics
	myCursor.style.backgroundColor = storage.userColor;
	myCursor.innerText = storage.userName;
	// update xy in mouse move event

	document.body.appendChild(myCursor);
};



// listen to storage
chrome.storage.onChanged.addListener((changes, namespace) => {
	for (const changeKey in changes) {
		storage[changeKey] = changes[changeKey].newValue;

		// update myCursor
		if (myCursor) {
			if (changeKey == 'userColor') {
				myCursor.style.backgroundColor = storage.userColor;
			} else if (changeKey == 'userName') {
				myCursor.innerText = storage.userName;
			}
		}
	}
});



// mouse
let x = 0;
let y = 0;
document.body.addEventListener('mousemove', async (ev) => {
	// console.log('mouse', ev);
	x = ev.pageX;
	y = ev.pageY;
	// const down = ev.cl

	const width = window.innerWidth;
	const height = window.innerHeight;

	const xVw = (x / width) * 100;
	const yVh = (y / height) * 100;
	console.log(xVw, yVh);


	// move cursor
	if (myCursor) {
		// myCursor.style.left = x + 'px';
		// myCursor.style.top = y + 'px';

		myCursor.style.left = xVw + 'vw';
		myCursor.style.top = yVh + 'vh';
	} else {
		console.warn('myCursor not defined');
	}



	// rtdb: send data to backend for rtdb update
	await browser.runtime
		.sendMessage({
			type: 'update:pos',
			rtdbPath,
			data: {
				// mousedown: false,
				x: xVw,
				y: yVh
			}
		});
});



// types
type Uid = string;
type UserCursor = {
	uid: Uid;
	userName: string;
	userColor: string;
	x?: number;
	y?: number;
}

// init rtdb site listen
const cursorMap = new Map() as Map<Uid, UserCursor>;
const domCursors = new Map() as Map<Uid, HTMLDivElement>;
rtdb.ref(rtdbPath).on('value', (snap) => {
	// console.log('val', snap.val());

	const rawRtdbCursorObj = snap.val() as null | Record<Uid, UserCursor>;
	if (!rawRtdbCursorObj) return;

	const tempCursorMap = new Map() as Map<Uid, UserCursor>;

	for (const uid in rawRtdbCursorObj) {
		tempCursorMap.set(uid, rawRtdbCursorObj[uid]);

		// check for NEW dom cursors to add
		if ((uid !== myUid) && !cursorMap.has(uid)) {
			// const domCursor = document.createElement('div');
			const c = makeCursorEl(uid);
			domCursors.set(uid, c);
			document.body.appendChild(c);
		}

		cursorMap.set(uid, rawRtdbCursorObj[uid]); // updates + sets news
	}

	// console.log('tempCursorMap', tempCursorMap);
	// console.log('cursorMap 1', cursorMap);

	cursorMap.forEach((userCursor, uid) => {
		// console.log('iterating on', uid);

		if (!tempCursorMap.has(uid)) {
			cursorMap.delete(uid);

			const c = domCursors.get(uid);
			if (c) {
				document.body.removeChild(c);
			} else {
				console.warn('no dom element to remove');
			}
		} else {
			// console.log('printing', uid);

			// update remaining cursors
			const c = domCursors.get(uid);
			if (c) {
				c.style.backgroundColor = userCursor.userColor;
				c.innerText = userCursor.userName;

				// c.style.left = (userCursor.x || 0) + 'px';
				// c.style.top = (userCursor.y || 0) + 'px';

				c.style.left = (userCursor.x || 0) + 'vw';
				c.style.top = (userCursor.y || 0) + 'vh';
			}
		}
	});

	// console.log('cursorMap 2', cursorMap);
});



// start everything up
window.addEventListener('load', async () => {
	const myUid = await getUid();

	await initStorage();

	if (myUid) {
		initMyCursor(myUid);
	} else {
		console.warn('no myUid for initMyCursor');
	}
}, false);
