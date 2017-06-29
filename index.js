"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScrollDetective = function () {
	function ScrollDetective(settings) {
		_classCallCheck(this, ScrollDetective);

		// padding of viewport watching. If > 0 - view size is smaller,
		// else view size is bigger. Default = 0;
		this.padding = 0;

		// set of blocks to watch
		this.blocks = [];

		// scroll timeout to watch blocks states
		// default = 0 ms
		this.delay = 0;

		this.settings = settings || {};
	}

	_createClass(ScrollDetective, [{
		key: "setPadding",
		value: function setPadding(integer) {
			this.padding = integer;
		}
	}, {
		key: "setDelay",
		value: function setDelay(miliseconds) {
			this.delay = miliseconds;
		}
	}, {
		key: "addBlocks",
		value: function addBlocks(selector) {
			var a = document.querySelectorAll(selector);
			for (var i = 0; i < a.length; i++) {
				this.blocks.push(a[i]);
			}
		}
	}, {
		key: "getBlocks",
		value: function getBlocks() {
			return this.blocks;
		}
	}, {
		key: "setState",
		value: function setState(state, el) {
			switch (state) {
				case "visible":
					if (!el.classList.contains("visible-state")) {
						el.classList.remove("invisible-state");
						el.classList.remove("partly-visible-state");
						el.classList.add("visible-state");

						// thigger an event for element
						if (this.settings.onVisible) this.settings.onVisible(el);
					}
					break;

				case "invisible":
					if (!el.classList.contains("invisible-state")) {
						el.classList.remove("visible-state");
						el.classList.remove("partly-visible-state");
						el.classList.add("invisible-state");

						// thigger an event for element
						if (this.settings.onInvisible) this.settings.onInvisible(el);
					}
					break;

				case "partly-visible":
					if (!el.classList.contains("partly-visible-state")) {
						el.classList.remove("invisible-state");
						el.classList.remove("visible-state");
						el.classList.add("partly-visible-state");

						// thigger an event for element
						if (this.settings.onPartlyVisible) this.settings.onPartlyVisible(el);
					}
					break;
			}
		}
	}, {
		key: "checkStates",
		value: function checkStates() {
			var _this = this;

			var viewportTopPoint = parseInt(window.pageYOffset);
			var viewportBottomPoint = parseInt(window.pageYOffset) + parseInt(window.innerHeight - 50);
			// console.log(this.blocks);

			this.blocks.forEach(function (block) {
				var blockTopPoint = $(block).offset().top + _this.padding;
				var blockBottomPoint = $(block).offset().top + block.clientHeight + _this.padding;

				// console.log(blockTopPoint, viewportTopPoint);
				// console.log(blockBottomPoint, viewportBottomPoint);

				// block is fully visible
				if (blockTopPoint >= viewportTopPoint && blockBottomPoint <= viewportBottomPoint) {
					_this.setState("visible", block);
				}

				// block is fully invisible
				else if (blockTopPoint > viewportBottomPoint || blockBottomPoint < viewportTopPoint) {
						_this.setState("invisible", block);
					}

					// block is partly visible
					else {
							_this.setState("partly-visible", block);
						}
			});
		}
	}, {
		key: "addScrollEvent",
		value: function addScrollEvent() {
			var _this2 = this;

			var tm;

			window.addEventListener("scroll", function () {
				clearTimeout(tm);

				tm = setTimeout(function () {
					_this2.checkStates();
				}, _this2.delay);
			});
		}
	}]);

	return ScrollDetective;
}();

module.exports = ScrollDetective;