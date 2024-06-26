import init, { calc_score } from "../../pkg/dvsc.js";

export default class ScoringCalculator extends HTMLElement {
	#categoryColors = ["#FF1D15", "#0075FF", "#61E786", "#ffbb00", "#AA3E98", "#AA3E98", "#34F6F2"];
	#columns = ["Category", "Value", "Mode", "Type", "Target", "Spread", "Weight", "Score"];
	#columnDescriptions = {
		Mode: "Defines the sign of the slope of the scroring function. Zero means the scoring function start with positive slope and ends with a negative one",
		Type: "The type of scoring function to be used",
		Target: "Defines where the value needs to be, to  get the score 100",
		Spread: "Defines the offset from the target value, to get the score 1",
		Score: "Takes on values from 0 to 100",
	};
	// wasm functions
	#scoringCalc = null;
	// #matrixCalc = null;

	// saved elements
	#svgBackgroundCircles = [];
	#svgScoreCircles = [];
	#svgTexts = [];
	#svgTextsDims = [];
	#categoryRow = [];
	#totalScoreElem = null;
	#totalScoreIndicatorElem = null;

	// observers
	#categoryObservers = [];
	#observerAttributes = {
		attributeFilter: ["mode", "type", "target", "spread", "weight"],
	};

	constructor() {
		super();
		this._root = this.attachShadow({ mode: "open" });
		this.tableBody;
		this.categoryCount = 0;
		this.categoryWeights = [];
		this.categoryScores = [];
		this.categoryNames = [];
	}

	// execute once on init
	connectedCallback() {
		this.categoryCount = this.children.length;
		for (let i = 0; i < this.categoryCount; i++) {
			this.categoryWeights[i] = 100 / this.categoryCount;
		}

		// create elements
		this.#attachStyleSheet();
		const wrapper = document.createElement("div");
		wrapper.setAttribute("class", "wrapper");
		this.#attachTable(wrapper);
		this.#attachSVG(wrapper);
		this._root.appendChild(wrapper);

		for (let i = 0; i < this.categoryCount; i++) {
			this.#svgTextsDims[i] = {
				height: this.#svgTexts[i].getBoundingClientRect().height,
				width: this.#svgTexts[i].getBoundingClientRect().width,
			};
		}

		// init and save wasm module
		init().then(() => {
			this.#scoringCalc = calc_score;
			for (let i = 0; i < this.categoryCount; i++) {
				let wasmInput = this.#getRowAttributes(this.#categoryRow[i]);
				let score = calc_score(wasmInput.value, wasmInput.mode, wasmInput.fn_type, wasmInput.target, wasmInput.spread);
				this.#categoryRow[i].setAttribute("score", score);
				this.categoryScores[i] = score;
			}
			this.#calcTotalScore();
		});
		this.#setOffset();
	}
	/**
	 * resets every weight to 1/categoryCount
	 */
	#resetWeights() {
		for (let i = 0; i < this.categoryCount; i++) {
			this.categoryWeights[i] = 100 / this.categoryCount;
			this.#categoryObservers[i].disconnect();
		}
		for (let i = 0; i < this.categoryCount; i++) {
			this.#categoryRow[i].setAttribute("weight", this.categoryWeights[i]);
			this.#categoryObservers[i].observe(this.#categoryRow[i], this.#observerAttributes);
		}
	}

	/**
	 * creates and attaches the style sheet defined in sc-style.css to the document
	 */
	#attachStyleSheet() {
		const attrs = {
			href: "./src/js/sc-style.css",
			rel: "stylesheet",
			type: "text/css",
		};
		const style = document.createElement("link");
		this.#applyAttributes(style, attrs);
		this.appendChild(style);
	}
	/**
	 * 
	 * @param {HTMLElement} wrapper 
	 */
	#attachTable(wrapper) {
		const table = document.createElement("table");
		table.setAttribute("class", "table");
		const tablehead = document.createElement("thead");
		tablehead.setAttribute("class", "table-head");
		const tbody = document.createElement("tbody");
		const children = Array.from(this.children);

		for (let i = 0; i < this.categoryCount; i++) {
			const rowObserver = new MutationObserver(this.#callback);
			const childAttrs = {
				weight: (100 / this.categoryCount).toFixed(1),
			};
			this.categoryNames[i] = children[i].getAttribute("name");
			this.#categoryRow[i] = children[i];
			this.#applyAttributes(children[i], childAttrs);
			rowObserver.observe(children[i], this.#observerAttributes);
			this.#categoryObservers.push(rowObserver);
		}

		for (const child of children) {
			tbody.appendChild(child);
		}

		const tr = document.createElement("tr");
		for (const item of this.#columns) {
			const th = document.createElement("th");

			if (Object.keys(this.#columnDescriptions).includes(item)) {
				// add an description if one exisits
				const abbr = document.createElement("abbr");
				const abbrAttrs = {
					title: this.#columnDescriptions[item],
				};
				this.#applyAttributes(abbr, abbrAttrs);
				abbr.innerText = item;
				th.appendChild(abbr);
			} else {
				th.innerText = item;
			}

			if (item === "Weight") {
				// add a reset button next to weights
				const button = document.createElement("button");
				const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
				const buttonAttrs = {
					class: "reset-button",
					title: "Reset weights",
				};
				const svgAttrs = {
					viewBox: "0 0 13.806 12.065",
					fill: "none",
					stroke: "lightgrey",
					"stroke-width": "1.5",
				};
				const pathAttrs = {
					d: "M4.569 7.842 1.002 4.275 4.569.709m4.987 3.566H1.002m8.548.001h.007a3.54 3.54 0 1 1-2.48 6.067",
				};
				this.#applyAttributes(button, buttonAttrs);
				this.#applyAttributes(svg, svgAttrs);
				this.#applyAttributes(path, pathAttrs);

				svg.appendChild(path);
				button.appendChild(svg);
				th.appendChild(button);

				button.addEventListener("click", () => this.#resetWeights());
			}

			tr.appendChild(th);
		}
		tablehead.appendChild(tr);
		table.appendChild(tablehead);
		this.tableBody = tbody;
		table.appendChild(tbody);
		wrapper.appendChild(table);
	}

	/**
	 * 
	 * @param {HTMLElement} wrapper 
	 */
	#attachSVG(wrapper) {
		const svgWrapperAttrs = {
			class: "svg-wrapper",
		};
		const svgWrapper = document.createElement("div");
		this.#applyAttributes(svgWrapper, svgWrapperAttrs);

		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

		const svgAttrs = {
			viewBox: "0 0 100 100",
			class: "sc-svg",
		};
		this.#applyAttributes(svg, svgAttrs);

		const group1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
		const group2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
		group1.setAttribute("class", "fractions");
		group2.setAttribute("class", "score");
		svg.appendChild(group1);

		const circleAttr = {
			cx: "50",
			cy: "50",
			r: "40",
			fill: "none",
			id: "indicator",
			"stroke-width": "1.5",
			"stroke-dasharray": (2 * 40 * Math.PI - 6).toString(),
			"stroke-dashoffset": "0",
		};
		const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		this.#applyAttributes(circle, circleAttr);
		this.#totalScoreIndicatorElem = circle;

		group2.appendChild(circle);
		const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		const textAttrs = {
			id: "score-text",
			x: "50",
			y: "50",
		};
		this.#applyAttributes(text, textAttrs);
		text.innerText = "-";
		this.#totalScoreElem = text;
		group2.appendChild(text);

		for (let i = 0; i < this.categoryCount; i++) {
			let svgFractionBackground = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			let svgFractionScore = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			let svgName = document.createElementNS("http://www.w3.org/2000/svg", "text");
			let svgBackgroundProps = {
				id: "fraction_" + i.toString() + "_background",
				stroke: this.#categoryColors[i],
				class: "fraction fraction_bg",
				"stroke-dasharray": (2 * 46 * Math.PI - 6).toString(),
				style: "",
				cx: "50",
				cy: "50",
				r: "46",
				fill: "none",
			};
			let svgFractionProps = {
				id: "fraction_" + i.toString() + "_indicator",
				stroke: this.#categoryColors[i],
				class: "fraction fraction_bar",
				"stroke-dasharray": (2 * 46 * Math.PI - 6).toString(),
				style: "",
				cx: "50",
				cy: "50",
				r: "46",
				fill: "none",
			};
			let svgTextProps = {
				id: "category_name_" + i.toString(),
				class: "category_text",
				style: "text-anchor:middle; dominant-baseline: middle; transform-origin: center",
				x: "50",
				y: "50",
				dx: "0",
				dy: "0",
			};
			this.#applyAttributes(svgFractionBackground, svgBackgroundProps);
			this.#applyAttributes(svgFractionScore, svgFractionProps);
			this.#applyAttributes(svgName, svgTextProps);
			group1.appendChild(svgFractionBackground);
			group1.appendChild(svgFractionScore);
			// console.log(this.categoryNames[i]);
			svgName.innerHTML = this.categoryNames[i];
			group1.appendChild(svgName);

			// Save the elements in an array to have access to them later when setting the stroke offset
			this.#svgBackgroundCircles[i] = svgFractionBackground;
			this.#svgScoreCircles[i] = svgFractionScore;
			this.#svgTexts[i] = svgName;
		}

		svg.appendChild(group2);
		svgWrapper.appendChild(svg);
		wrapper.appendChild(svgWrapper);
	}

	/**
	 * 
	 * @param {HTMLElement} element 
	 * @param {Object} attributes 
	 */
	#applyAttributes(element, attributes) {
		for (const key in attributes) {
			element.setAttribute(key, attributes[key]);
		}
	}

	/**
	 * 
	 * @param {HTMLElement} row 
	 * @returns 
	 */
	#getRowAttributes(row) {
		return {
			value: parseFloat(row.attributes.value?.value) ?? 0.0,
			mode: parseFloat(row.attributes.mode?.value) ?? 0,
			fn_type: row.attributes.type?.value ?? "a",
			target: parseFloat(row.attributes.target?.value) ?? 0.0,
			spread: parseFloat(row.attributes.spread?.value) ?? 1.0,
		};
	}

	/**
	 * 
	 * @param {*} entries 
	 * @param {} observer 
	 */
	#callback = (entries, observer) => {
		if (entries[0].target.localName === "scoring-calc-row") {
			// what row is being contolled right now ( counted from the top)
			let initiatorIndex = Array.from(entries[0].target.parentNode.children).indexOf(entries[0].target);

			if (entries[0].attributeName === "spread") {
				let wasmInput = this.#getRowAttributes(entries[0].target);
				if (this.#scoringCalc !== null) {
					let score = this.#scoringCalc(wasmInput.value, wasmInput.mode, wasmInput.fn_type, wasmInput.target, wasmInput.spread);
					entries[0].target.setAttribute("score", score);
					this.categoryScores[initiatorIndex] = score;
					this.#calcTotalScore();
					this.#setOffset();
				}
			}
			if (entries[0].attributeName === "weight") {
				let rows = Array.from(this.tableBody.children);
				for (let i = 0; i < this.categoryCount; i++) {
					if (rows[i].hasAttribute("weight") && rows[i].localName !== "link") {
						if (rows[i].getAttribute("weight") !== null) {
							this.categoryWeights[i] = parseFloat(rows[i].getAttribute("weight"));
						}
					}
				}
				if (this.categoryCount === 1) {
					this.categoryWeights[0] = parseFloat(entries[0].target.attributes.weight.value);
					this.#setOffset();
					this.#calcTotalScore();
				} else {
					let { matrix, vector } = this.#createMatrix(initiatorIndex, this.categoryWeights);

					// let rustString = this.#convertMatrixToString(matrix,vector);
					// let weights = this.#matrixCalc(rustString);
					let weights = this.#matrixCalculations(matrix, vector); // this is a dropin replacement, the target is for it to use rust and more than one
					let combined = this.#recombineWeight(weights, initiatorIndex, parseFloat(entries[0].target.attributes.weight.value));
					this.categoryWeights = combined;
					this.#applyWeighs(combined, initiatorIndex, rows);
					this.#setOffset();
					this.#calcTotalScore();
				}
			}
		}
	};

	/**
	 * 
	 * @param {number} initiatorIndex 
	 * @param {Array<number>} weights 
	 * @returns 
	 */
	#createMatrix(initiatorIndex, weights) {
		// calculate only if there is more than one category
		if (this.categoryCount !== 1 && this.categoryCount !== 0) {
			let matrix = new Array(this.categoryCount - 1);
			let vector = new Array(this.categoryCount - 1);
			// assemble the matrix and the vector to use linear algebra
			for (let i = 0; i < this.categoryCount - 1; i++) {
				if (i == 0) {
					vector[i] = [100 - parseFloat(weights[initiatorIndex])];
				} else {
					vector[i] = [0];
				}

				let temp = new Array(this.categoryCount - 1);
				for (let k = 0; k < temp.length; k++) {
					temp[k] = 0;
				}
				matrix[i] = temp;
			}

			// filling 0-matrix with values
			for (let row = 0; row < this.categoryCount - 1; row++) {
				for (let column = 0; column < this.categoryCount - 1; column++) {
					if (row == 0) {
						matrix[row][column] = 1;
					} else {
						if (column == row - 1) {
							matrix[row][column] = parseFloat(-weights[row + 1]);
						}
						if (column == row) {
							matrix[row][column] = parseFloat(weights[row]);
						}
					}
				}
			}
			return { matrix, vector };
		}
	}

	//convert to string to be read by rust. This way the row count can be variable and there is no need to deal with rusts typesystem
	#convertMatrixToString(matrix, vector) {
		let rustString = "";
		for (let i = 0; i < matrix.length; i++) {
			rustString += matrix[i].join(",");
			if (i !== matrix.length - 1) {
				rustString += ";";
			}
		}
		rustString += "v";
		rustString += vector.join(";");

		return rustString;
	}

	/**
	 * 
	 * @param {Array<number>} weights 
	 * @param {number} initiatorIndex 
	 * @param {number} activeWeight 
	 * @returns 
	 */
	#recombineWeight(weights, initiatorIndex, activeWeight) {
		let newPercentages = [...weights];
		newPercentages.splice(initiatorIndex, 0, activeWeight);
		for (let i = 0; i < this.categoryCount; i++) {
			newPercentages[i] = Math.abs(newPercentages[i]);
			if (newPercentages[i] < 0.01 && i !== initiatorIndex) {
				// adjust any value below 0.01 to 0.01 by subtracting the amount below 0.01 from the input weight
				newPercentages[initiatorIndex] -= 0.01;
				newPercentages[i] += 0.01;
			}
		}
		return newPercentages;
	}

	/**
	 * 
	 * @param {number[]} combined 
	 * @param {number} initiatorIndex 
	 * @param {HTMLElement[]} rows 
	 */
	#applyWeighs(combined, initiatorIndex, rows) {
		for (let i = 0; i < this.#categoryObservers.length; i++) {
			if (i !== initiatorIndex) {
				this.#categoryObservers[i].disconnect();
			}
		}
		for (let i = 0; i < this.#categoryObservers.length; i++) {
			if (i !== initiatorIndex) {
				rows[i].setAttribute("weight", combined[i]);
				this.#categoryObservers[i].observe(rows[i], this.#observerAttributes);
			}
		}
	}

	// drop in replacement, rust implementation wip
	#matrixCalculations(t, e) {
		let l = t.length,
			$ = [],
			f = [],
			r = [],
			o = [],
			_ = [],
			n = [];
		for (let g = 0; g < l; g++) {
			($[g] = []), (o[g] = []);
			for (let h = 0; h < l; h++) ($[g][h] = 0), (o[g][h] = 0);
			(_[g] = 0), (f[g] = 0), (r[g] = 0), (n[g] = [0]);
		}
		for (let i = 0; i < l; i++) {
			for (let a = 0; a < l; a++) ($[i][a] = t[i][a]), (o[i][a] = t[i][a]);
			_[i] = i;
		}
		for (let c = 0; c < l - 1; c++) {
			let b = Math.abs(o[c][c]),
				s = c;
			for (let u = c + 1; u < l; u++) {
				let W = Math.abs(o[u][c]);
				W >= b && ((b = W), (s = u));
			}
			if (s != c) {
				let d = o[s];
				(o[s] = o[c]), (o[c] = d);
				let j = _[s];
				(_[s] = _[c]), (_[c] = j);
			}
			let k = o[c][c];
			if (0 != k)
				for (let m = c + 1; m < l; m++) {
					let p = o[m][c] / k;
					o[m][c] = p;
					for (let q = c + 1; q < l; q++) o[m][q] -= p * o[c][q];
				}
		}
		for (let v = 0; v < l; v++) {
			for (let w = 0; w < l; w++) v == _[w] ? (f[w] = 1) : (f[w] = 0);
			for (let x = 1; x < l; x++) {
				let y = f[x];
				for (let z = 0; z < x; z++) y -= o[x][z] * f[z];
				f[x] = y;
			}
			f[l - 1] /= o[l - 1][l - 1];
			for (let A = l - 2; A >= 0; A--) {
				let B = f[A];
				for (let C = A + 1; C < l; C++) B -= o[A][C] * f[C];
				f[A] = B / o[A][A];
			}
			for (let D = 0; D < l; D++) $[D][v] = f[D];
		}
		for (let E = 0; E < $.length; E++) for (let F = 0; F < $[0].length; ++F) n[E][0] += $[E][F] * e[F][0];
		return n;
	}

	/**
	 * sets the stroke dash offset for every svg element and rotate them to fit into the scheme
	 */
	#setOffset() {
		const circum = 2 * 46 * Math.PI;
		// console.log(this.categoryCount);
		let scores = [];
		for (let i = 0; i < this.categoryCount; i++) {
			scores[i] = parseFloat(this.#categoryRow[i].getAttribute("score"));
			if (i > 0) {
				this.#svgBackgroundCircles[i].setAttribute("transform", "rotate(" + this.#getDegrees(i).toFixed(2) + ")");
				this.#svgScoreCircles[i].setAttribute("transform", "rotate(" + this.#getDegrees(i).toFixed(2) + ")");
			}

			this.#svgBackgroundCircles[i].setAttribute("stroke-dashoffset", circum * (1 - this.categoryWeights[i] / 100));
			this.#svgScoreCircles[i].setAttribute(
				"stroke-dashoffset",
				circum * (1.0 - this.categoryWeights[i] * (scores[i] / 100) * 0.01) > 278
					? 278
					: circum * (1.0 - this.categoryWeights[i] * (scores[i] / 100) * 0.01) < circum * (1 - this.categoryWeights[i] / 100.0) + circum * (1 - this.categoryWeights[i] / 100.0) * 0.05
					? circum * (1.0 - this.categoryWeights[i] / 100.0)
					: circum * (1.0 - this.categoryWeights[i] * (scores[i] / 100) * 0.01)
			);

			if (i === 0) {
				this.#svgTexts[i].setAttribute("dx", Math.cos((this.categoryWeights[i] / 100) * Math.PI) * 56);
				this.#svgTexts[i].setAttribute("dy", Math.sin((this.categoryWeights[i] / 100) * Math.PI) * 56);
			} else {
				this.#svgTexts[i].setAttribute("dx", Math.cos((this.#getDegrees(i) * Math.PI) / 180 + (this.categoryWeights[i] / 100) * Math.PI) * 56);
				this.#svgTexts[i].setAttribute("dy", Math.sin((this.#getDegrees(i) * Math.PI) / 180 + (this.categoryWeights[i] / 100) * Math.PI) * 56);
			}
		}
	}

	/**
	 * calculates the total score based and category row score and wight
	 */
	#calcTotalScore() {
		let score = 0;
		for (let i = 0; i < this.categoryCount; i++) {
			score += (parseFloat(this.categoryScores[i]) * parseFloat(this.categoryWeights[i])) / 100;
		}

		this.#totalScoreElem.innerHTML = score.toFixed(0);

		this.#totalScoreElem.setAttribute("fill", "hsl(" + ((score / 100) * 115).toString() + ",78%,45%)");
		this.#totalScoreIndicatorElem.setAttribute("stroke", "hsl(" + ((score / 100) * 115).toFixed(2) + ",78%,45%)");
		this.#totalScoreIndicatorElem.setAttribute("stroke-dashoffset", (2 * 40 * Math.PI * (1 - score / 100)).toFixed(4));
	}

	/**
	 * get the offset in degrees for the current index category circle part
	 * @param {number} currentIndex
	 * @returns number
	 */
	#getDegrees(currentIndex) {
		let degree = 0;
		for (let i = 0; i < currentIndex; i++) {
			degree += parseFloat(this.categoryWeights[i]);
		}
		return 3.6 * degree;
	}
}
