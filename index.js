window.addEventListener("load", function() {		
	animateGems();
	parallaxGems();
}, false);

gsap.registerPlugin(ScrollTrigger);

function parallaxGems() {
	const container = document.querySelector('.mainContainer-parallax');
	const layer1 = container.querySelector('.mainContainer-gems-layer_1');
	const layer2 = container.querySelector('.mainContainer-gems-layer_2');
	const koef_1 = 20;
	const koef_2 = 5;

	container.addEventListener("mouseenter", (e) => {
		let gemsContainer = e.target.querySelector(".mainContainer-gems");
		gemsContainer.classList.add("hovered");
		
		setTimeout(() => {
			gemsContainer.classList.remove("hovered");
		}, 500);
	});

	container.addEventListener('mousemove', (e) => {
					
		const rect = container.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;			

		layer1.style.transform = `translate(${(x - 0.5) * koef_1}%, ${(y - 0.5) * koef_1}%)`;
		layer2.style.transform = `translate(${(x - 0.5) * koef_2}%, ${(y - 0.5) * koef_2}%)`;
	});

	container.addEventListener('mouseleave', (e) => {
		layer1.style.transform = `translate(${(0)}%, ${(0)}%)`;
		layer2.style.transform = `translate(${(0)}%, ${(0)}%)`;
	});
}


function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
function animateGems() {
	let gemsContainer = document.querySelector(".mainContainer-gems-layer_1");

	if(!gemsContainer) return;

	let gems = gemsContainer.querySelectorAll(".mainContainer-gems-gem");
	let gemsLayer2 = document.querySelector(".mainContainer-gems-layer_2 img");
	let gemsArray = gsap.utils.toArray(gems);
	shuffle(gemsArray);

	ScrollTrigger.create({
		trigger: gemsContainer,
		start: "top 50%",
		end: "bottom 10%",		
		onToggle: self => {
			if(self.isActive) {						
				if(typeof actionGems == 'function') {
					setTimeout(function() {
						actionGems();
						actionGems2();
					}, 500);
				}
			}
			else {
				floating.kill();
				floating2.kill();
			}
		}
	});

	let floating, floating2;
	function actionGems() {
		if(floating) {					
			floating.kill();
		}
		floating = gsap.timeline({onComplete:actionGems,repeatRefresh: true});

		floating.to(gemsArray, {
			x: "random(-30, 30)",
			y: "random(-30, 30)",
			rotation: "random(-30, 30)",
			transformOrigin:'50% 50%',
			duration: 5, 
			ease:"none",
			repeat:0			
		})
	}
	function actionGems2() {
		if(floating2) {					
			floating2.kill();
		}
		floating2 = gsap.timeline({onComplete:actionGems2,repeatRefresh: true});

		floating2.to(gemsLayer2, {
			x: "random(-15, 15)",
			y: "random(-10, 10)",
			rotation: "random(-2, 2)",
			transformOrigin:'50% 50%',
			duration: 5, 
			ease:"none",
			repeat:0			
		})
	}
}

function closePage(sender) {
	event.preventDefault();
	event.stopPropagation();
	let pages = sender.closest(".mainContainer-pages");
	if(!pages) return;
	pages.classList.remove("mainContainer-pages-active");
	if(pages.querySelector(".mainContainer-page-active")) {
		pages.querySelector(".mainContainer-page-active").style.display = 'none';
		pages.querySelector(".mainContainer-page-active").classList.remove("mainContainer-page-active");
	}
	pages.style.display = 'none';

	_togglePlay(pages.closest(".mainContainer").querySelector("video"));
}

function showPage(button, num, event) {
	console.log(event);
	event.preventDefault();
	event.stopPropagation();
	let mainContainer = button.closest(".mainContainer");
	if(!mainContainer) return;
	let pages = mainContainer.querySelector(".mainContainer-pages");
	if(!pages) return;

	_togglePlay(mainContainer.querySelector("video"));

	pages.style.display = 'block';

	let buttonsContainer = button.closest(".mainContainer-buttons");
	if(buttonsContainer.querySelector("[aria-expanded=true]")) {
		buttonsContainer.querySelector("[aria-expanded=true]").setAttribute('aria-expanded', false);
	}
	button.setAttribute('aria-expanded', true);

	setTimeout(() => {
		pages.classList.add("mainContainer-pages-active");
		if(pages.querySelector(".mainContainer-page-active")) {
			pages.querySelector(".mainContainer-page-active").style.display = 'none';
			pages.querySelector(".mainContainer-page-active").classList.remove("mainContainer-page-active");
		}

		pages.getElementsByClassName("mainContainer-page")[num-1].style.display = 'block';
		setTimeout(() => {
			pages.getElementsByClassName("mainContainer-page")[num-1].classList.add("mainContainer-page-active");
		}, 30);
	}, 15)
}

function toggleMute(sender) {
	event.preventDefault();
	event.stopPropagation();
	sender.classList.toggle("mute-on");
	let video = sender.parentNode.querySelector("video");
	let isMuted = video.muted;

	video.muted = !isMuted;

	sender.setAttribute('aria-pressed', isMuted);
	sender.setAttribute('aria-label', !isMuted ? 'Включить звук' : 'Выключить звук');
}
function _togglePlay(video) {
	if (video.paused) {
		video.play();
	} else {
		video.pause();
	}
}
	