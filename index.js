class ScrollDetective {
	constructor(settings) {
		// padding of viewport watching. If > 0 - view size is smaller,
		// else view size is bigger. Default = 0;
		this.padding = 0;
	
		// set of blocks to watch
		this.blocks = [];
	
		// scroll timeout to watch blocks states
		// default = 100 ms
		this.delay = 100;
		
		this.settings = settings || {};
	}
	
	setPadding(integer) {
		this.padding = integer;
	};
	
	setDelay(miliseconds) {
		this.delay = miliseconds;
	};
	
	addBlocks(selector) {	
		document.querySelectorAll(selector).forEach(block => {
			this.blocks.push(block);
		});
	};
	
	getBlocks() {
		return this.blocks;
	};
	
	setState(state, el) {
		switch (state) {
			case "visible":
				if(!el.classList.contains("visible-state")) {
					el.classList.remove("invisible-state");
					el.classList.remove("partly-visible-state");
					el.classList.add("visible-state");

					// thigger an event for element
					if(this.settings.onVisible) this.settings.onVisible(el)
				}
				break;

			case "invisible":
				if(!el.classList.contains("invisible-state")) {
					el.classList.remove("visible-state");
					el.classList.remove("partly-visible-state");
					el.classList.add("invisible-state");

					// thigger an event for element
					if(this.settings.onInvisible) this.settings.onInvisible(el)
				}
				break;

			case "partly-visible":
				if(!el.classList.contains("partly-visible-state")) {
					el.classList.remove("invisible-state");
					el.classList.remove("visible-state");
					el.classList.add("partly-visible-state");

					// thigger an event for element
					if(this.settings.onPartlyVisible) this.settings.onPartlyVisible(el)
				}
				break;
		}
	}
	
	checkStates() {	
		var viewportTopPoint = parseInt(window.pageYOffset);
		var viewportBottomPoint = parseInt(window.pageYOffset) + parseInt(window.innerHeight - 50);
		// console.log(this.blocks);
	
		this.blocks.forEach(block => {
			var blockTopPoint = $(block).offset().top + this.padding;
			var blockBottomPoint = $(block).offset().top + block.clientHeight + this.padding;
	
			// console.log(blockTopPoint, viewportTopPoint);
			// console.log(blockBottomPoint, viewportBottomPoint);
	
			// block is fully visible
			if(blockTopPoint >= viewportTopPoint && blockBottomPoint <= viewportBottomPoint) {
				this.setState("visible", block);
			}
	
			// block is fully invisible
			else if(blockTopPoint > viewportBottomPoint || blockBottomPoint < viewportTopPoint) {
				this.setState("invisible", block);
			}
	
			// block is partly visible
			else {
				this.setState("partly-visible", block);
			}
		});
	};
	
	addScrollEvent() {
		var tm;
	
		window.addEventListener("scroll", () => {
			clearTimeout(tm);
	
			tm = setTimeout(() => {
				this.checkStates();
			}, this.delay);
		});
	};
}

module.exports = ScrollDetective;