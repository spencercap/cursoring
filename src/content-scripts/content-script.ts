console.log('Hello from the content-script');

const el = document.createElement('BUTTON');
el.style.position = 'absolute';
el.style.transitionDuration = '200ms';
el.innerText = 'button!';
document.body.appendChild(el);

setInterval(() => {
	// console.log('Hello from the content-script');

	el.style.top = (Math.random() * window.innerHeight) + 'px';
	el.style.left = (Math.random() * window.innerWidth) + 'px';
}, 500);



