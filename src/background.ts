import { auth, rtdb } from '@/firebase/index';



// uid
let uid = undefined as undefined | string;
auth.onAuthStateChanged(function (user) {
	console.log('got a user', user);
	uid = user?.uid || undefined;
});
auth.signInAnonymously();



// init storage
const storage = {} as Record<string, string>;
// const initStorage = () => {
// 	chrome.storage.local.get(null, (items) => {
// 		// const allKeys = Object.keys(items);
// 		// console.log(allKeys);
// 		storage.userName = items.userName || 'anonymous';
// 		storage.userColor = items.userColor || 'pink';
// 	});
// };
const initStorage = async () => {
	const items = await browser.storage.local.get();
	storage.userName = items.userName || 'anonymous';
	storage.userColor = items.userColor || 'pink';
	// console.log('got storage', storage);
};
initStorage();

// listen to storage
chrome.storage.onChanged.addListener((changes, namespace) => {
	// console.log('changes', changes);
	// console.log('namespace', namespace); // namespace is always "local", "sync" is for anywhere this user logs in

	for (const changeKey in changes) {
		storage[changeKey] = changes[changeKey].newValue;
	}
	// console.log({ storage });
});



/* eslint-disable @typescript-eslint/no-unused-vars */
browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	console.log('background got message');
	// console.log('request', request);
	// console.log('sender', sender);

	if (request.type == 'get:uid') {
		return uid;
		// sendResponse(uid);
		// can use sendResponse or return to get info back to caller
	}
	// update rtdb xy
	else if (request.type == 'update:pos') {
		if (uid) {
			await rtdb.ref(`${request.rtdbPath}/${uid}`).update({
				uid,
				userName: storage.userName || null,
				userColor: storage.userColor || null,
				x: request.data.x,
				y: request.data.y
			});
		} else {
			console.warn('no uid');
		}
	}
});





// setInterval(() => {
// 	console.log('Hello from the background');
// }, 2000);

