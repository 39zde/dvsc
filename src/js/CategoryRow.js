export default class CategoryRow extends HTMLElement {
	static observedAttributes = ["score", "weight"];

	#formulas = [
		`<math display="inline"><mstyle displaystyle="true" scriptlevel="0"><mi>a</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><mo stretchy="true">&#x00007B;</mo><mtable rowspacing=".5em" columnspacing="1em" displaystyle="true"><mtr><mtd><mrow><mspace width="16px" /><mo>-</mo><mi>k</mi><mo>⋅</mo><mrow><mo>|</mo><mi>x</mi><mo>-</mo><mi>h</mi><mo>|</mo></mrow><mo>+</mo><mn>1</mn></mrow><mspace width="1em"/><mo>,</mo><mspace width="1em" /><mrow><mo>-</mo><mfrac><mn>2</mn><mi>k</mi></mfrac><mo>+</mo><mn>h</mn></mrow><mspace width=".5em" /><mo><</mo><mi>x</mi><mo><</mo><mspace width=".5em" /><mrow><mfrac><mn>2</mn><mi>k</mi></mfrac><mo>+</mo><mn>h</mn></mrow></mtd></mtr><mtr><mtd><mspace width="4.5em"/><mn>0</mn><mspace width="3em"/><mspace width="1em"/><mo>,</mo><mspace width="1em"/><mrow><mo>-</mo><mfrac><mn>2</mn><mi>k</mi></mfrac><mo>+</mo><mn>h</mn></mrow><mspace width=".5em"/><mo>></mo><mi>x</mi><mo>></mo><mspace width=".5em"/><mrow><mfrac><mn>2</mn><mi>k</mi></mfrac><mo>+</mo><mn>h</mn></mrow></mtd></mtr></mtable><mspace width="2em"></mspace><mi>k</mi><mo>=</mo><mfrac><mn>0.99</mn><mrow><mo>|</mo><mi>p</mi><mo>|</mo></mrow></mfrac><mspace width="0.5em"></mspace><mo>,</mo><mspace width="0.5em"></mspace><mrow><mi>p</mi><mo>></mo><mn>0</mn></mrow><msapce width="0.5em"></mspace><mo>,</mo><msapce width="0.5em"></mspace><mrow><mo>h</mo><mi>&#8712;</mi><mi>&#8477;</mi><mrow></mstyle></math>`,
		`<math display="inline"><mstyle displaystyle="true" scriptlevel="0"><mtable rowspacing=".5em" columnspacing="1em" displaystyle="true"><mtr><mtd><mrow><mi>b</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo></mrow><mrow><mo>-</mo><mfrac><mn>2</mn><mn>&#960;</mn></mfrac><mo>⋅</mo><mi>atan</mi><mo>(</mo><mrow><mi>k</mi><mo>⋅</mo><msup><mrow><mo>(</mo><mi>x</mi><mo>-</mo><mi>h</mi><mo>)</mo></mrow><mn>2</mn></msup></mrow><mo>)</mo><mo>+</mo><mn>1</mn></mrow></mtd></mtr></mtable><mspace width="2em"></mspace><mi>k</mi><mo>=</mo><mfrac><mrow><mi>tan</mi><mo>(</mo><mfrac><mrow><mn>99</mn><mi>&pi;</mi></mrow><mn>200</mn></mfrac><mo>)</mo></mrow><mrow><msup><mi>p</mi><mn>2</mn></msup></mrow></mfrac><mspace width="0.5em"></mspace><mo>,</mo><mspace width="0.5em"></mspace><mrow><mi>p</mi><mo>></mo><mn>0</mn></mrow><msapce width="0.5em"></mspace><mo>,</mo><msapce width="0.5em"></mspace><mrow><mo>h</mo><mi>&#8712;</mi><mi>&#8477;</mi><mrow></mstyle></math>`,
		`<math display="inline"><mstyle displaystyle="true" scriptlevel="0"><mtable rowspacing=".5em" columnspacing="1em" displaystyle="true"><mtr><mtd><mi>c</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mfrac><mn>2</mn><mrow><mn>1</mn><mo>+</mo><msup><mi>e</mi><mrow><mi>k</mi><mo>⋅</mo><mrow><mo>|</mo><mrow><mi>x</mi><mo>-</mo><mi>h</mi></mrow><mo>|</mo></mrow></mrow></msup></mrow></mfrac></mtd></mtr></mtable><mspace width="2em"></mspace><mi>k</mi><mo>=</mo><mfrac> <mrow><mi>ln</mi><mo>(</mo><mn>199</mn><mi>)</mi></mrow><mrow><mo>|</mo><mi>p</mi><mo>|</mo></mrow></mfrac><mspace width="0.5em"></mspace><mo>,</mo><mspace width="0.5em"></mspace><mrow><mi>p</mi><mo>></mo><mn>0</mn></mrow><msapce width="0.5em"></mspace><mo>,</mo><msapce width="0.5em"></mspace><mrow><mo>h</mo><mi>&#8712;</mi><mi>&#8477;</mi><mrow></mstyle></math>`,
		`<math display="inline"><mstyle displaystyle="true" scriptlevel="0"><mtable rowspacing=".5em" columnspacing="1em" displaystyle="true"><mtr><mtd><mrow><mi>d</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo></mrow><mrow><mo>-</mo><mfrac><mn>2</mn><mn>&#960;</mn></mfrac><mo>⋅</mo><mi>atan</mi><mo>(</mo><mrow><mi>k</mi><mo>⋅</mo><mrow><mo>|</mo><mi>x</mi><mo>-</mo><mi>h</mi><mo>|</mo></mrow></mrow><mo>)</mo><mo>+</mo><mn>1</mn></mrow></mtd></mtr></mtable><mspace width="2em"></mspace><mi>k</mi><mo>=</mo><mfrac><mrow><mi>tan</mi><mo>(</mo><mfrac><mrow><mn>99</mn><mi>&pi;</mi></mrow><mn>200</mn></mfrac><mo>)</mo></mrow><mrow><mo>|</mo><mi>p</mi><mo>|</mo></mrow></mfrac><mspace width="0.5em"></mspace><mo>,</mo><mspace width="0.5em"></mspace><mrow><mi>p</mi><mo>></mo><mn>0</mn></mrow><msapce width="0.5em"></mspace><mo>,</mo><msapce width="0.5em"></mspace><mrow><mo>h</mo><mi>&#8712;</mi><mi>&#8477;</mi><mrow></mstyle></math>`,
		`<math display="inline"><mstyle displaystyle="true" scriptlevel="0"><mtable rowspacing=".5em" columnspacing="1em" displaystyle="true"><mtr><mtd><mrow><mi>e</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo></mrow><msup><mi>e</mi><mrow ><mo>-</mo><mi>k</mi><mo>⋅</mo><msup><mrow ><mo>(</mo><mrow><mi>x</mi><mo>-</mo><mi>h</mi></mrow><mo>)</mo></mrow><mn>2</mn></msup></mrow></msup></mtd></mtr></mtable><mspace width="2em"></mspace><mi>k</mi><mo>=</mo><mfrac> <mrow><mi>ln</mi><mo>(</mo><mn>100</mn><mi>)</mi></mrow><mrow><msup><mi>p</mi><mn>2</mn></msup></mrow></mfrac><mspace width="0.5em"></mspace><mo>,</mo><mspace width="0.5em"></mspace><mrow><mi>p</mi><mo>></mo><mn>0</mn></mrow><msapce width="0.5em"></mspace><mo>,</mo><msapce width="0.5em"></mspace><mrow><mo>h</mo><mi>&#8712;</mi><mi>&#8477;</mi><mrow></mstyle></math>`,
	];

	// https://www.desmos.com/calculator/wdk0tp8md2
	constructor() {
		super();
		this._root = this.attachShadow({ mode: "open" });
		this.name = this.getAttribute("name"); //string
		this.value = this.getAttribute("value"); // number
		this.mode = this.getAttribute("mode"); // int: -1 , 0 or 1 can be view as the slope, with 0 having both + and - slopes (symmetric)
		(this.type = this.getAttribute("type")), // a ,b ,c ,d or e
			(this.target = this.getAttribute("target")); // number
		this.weight = this.getAttribute("weight"); //number 0-100
		// lowest and hightest 1%, depending on the mode the slope
		this.score = this.getAttribute("score");
		this.spread = this.getAttribute("spread");
		this.scoreOut;
		this.weightInput;
		this.weightText;
	}

	// execute once on init
	connectedCallback() {
		const wrapper = document.createElement("tr");
		wrapper.setAttribute("class", "category-row");
		this.#attachChildren(wrapper);

		this._root.appendChild(wrapper);
	}

	/**
	 *
	 * @param {HTMLElement} wrapper
	 */
	#attachChildren(wrapper) {
		this.#attachStyleSheet(wrapper);
		this.#attachTitle(wrapper);
		this.#attachValue(wrapper);
		this.#attachMode(wrapper);
		this.#attachType(wrapper);
		this.#attachTarget(wrapper);
		this.#attachSpread(wrapper);
		this.#attachWeight(wrapper);
		this.#attachScore(wrapper);
	}

	/**
	 *
	 * @param {HTMLElement} wrapper
	 */
	#attachStyleSheet(wrapper) {
		const style = document.createElement("link");
		style.setAttribute("href", "./src/js/cr-style.css");
		style.setAttribute("rel", "stylesheet");
		style.setAttribute("type", "text/css");
		wrapper.appendChild(style);
	}

	/**
	 *
	 * @param {HTMLElement} wrapper
	 */
	#attachTitle(wrapper) {
		const title = document.createElement("th");
		title.innerText = this.name;
		wrapper.appendChild(title);
	}

	/**
	 *
	 * @param {HTMLElement} wrapper
	 */
	#attachValue(wrapper) {
		const value = document.createElement("td");
		const valueInput = document.createElement("input");
		const valueInputAttrs = {
			type: "number",
			value: this.value ?? 0,
			class: "value-input",
		};
		this.#applyAttributes(valueInput, valueInputAttrs);
		valueInput.addEventListener("input", () => {
			this.value = valueInput.value;
		});
		value.appendChild(valueInput);
		wrapper.appendChild(value);
	}

	/**
	 *
	 * @param {HTMLElement} wrapper
	 */
	#attachMode(wrapper) {
		const mode = document.createElement("td");
		const modeSlelect = document.createElement("select");
		modeSlelect.setAttribute("class", "mode");
		for (let i = 0; i < 3; i++) {
			const opt = document.createElement("option");
			opt.setAttribute("value", (i - 1).toFixed(0));
			opt.innerText = (i - 1).toFixed(0);
			if (i === parseInt(this.mode) + 1) {
				opt.setAttribute("selected", true);
			}
			modeSlelect.appendChild(opt);
		}
		modeSlelect.addEventListener("input", (e) => {
			this.setAttribute("mode", e.target.value.toString());
		});
		mode.appendChild(modeSlelect);
		wrapper.appendChild(mode);
	}

	/**
	 *
	 * @param {HTMLElement} wrapper
	 */
	#attachType(wrapper) {
		const type = document.createElement("td");
		const typeSelect = document.createElement("button");
		const popOver = document.createElement("div");
		let group = document.createElement("span");
		let link = document.createElement("a");
		const linkAttrs = {
			href: "https://www.desmos.com/calculator/wdk0tp8md2",
			target: "_blank",
			class: "plot-link",
		};
		const typeSelectAttrs = {
			class: "type-select",
			popovertarget: "type-selection",
		};
		// Firexfox Version >= 125.0
		const popOverAttrs = {
			class: "modal",
			id: "type-select",
			popover: "auto",
		};
		this.#applyAttributes(typeSelect, typeSelectAttrs);
		this.#applyAttributes(popOver, popOverAttrs);
		this.#applyAttributes(link, linkAttrs);
		typeSelect.innerText = this.type;
		link.innerText = "Plotted Functions";
		typeSelect.popoverTargetElement = popOver;
		type.appendChild(typeSelect);
		popOver.appendChild(group);
		for (let i = 0; i < this.#formulas.length; i++) {
			const formulaButton = document.createElement("button");
			const formulaButtonAttrs = {
				class: "formula-button",
				id: `formula_${i}`,
			};
			this.#applyAttributes(formulaButton, formulaButtonAttrs);
			formulaButton.addEventListener("click", () => {
				typeSelect.innerText = this.#getTypeLetter(i);
				this.setAttribute("type", this.#getTypeLetter(i));
				popOver.hidePopover();
			});
			formulaButton.insertAdjacentHTML("beforeend", this.#formulas[i]);
			group.insertAdjacentElement("beforeend", formulaButton);
		}
		popOver.appendChild(link);
		typeSelect.appendChild(popOver);
		type.appendChild(popOver);
		wrapper.appendChild(type);
	}

	/**
	 *
	 * @param {HTMLElement} wrapper
	 */
	#attachTarget(wrapper) {
		const target = document.createElement("td");
		target.setAttribute("class", "target");
		target.innerText = this.target ?? 0;
		wrapper.appendChild(target);
	}

	/**
	 *
	 * @param {HTMLElement} wrapper
	 */
	#attachSpread(wrapper) {
		const spread = document.createElement("td");
		const spreadInput = document.createElement("input");
		const spreadOutput = document.createElement("output");
		const outputWrapper = document.createElement("span");

		const outputWrapperAttrs = {
			class: "out-wrapper",
		};
		const spreadAttrs = {
			class: "spread-col",
		};
		const spreadOutputAttrs = {
			for: "spread",
		};
		const spreadInputAttrs = {
			id: "spread",
			type: "range",
			min: 0.01,
			max: this.spread,
			class: "spread-input",
			step: 0.01,
			value: this.spread / 2,
		};

		this.#applyAttributes(outputWrapper, outputWrapperAttrs);
		this.#applyAttributes(spread, spreadAttrs);
		this.#applyAttributes(spreadOutput, spreadOutputAttrs);
		this.#applyAttributes(spreadInput, spreadInputAttrs);

		spreadInput.value = this.spread / 2;
		spreadInput.addEventListener("input", (e) => {
			spreadOutput.innerText = parseFloat(e.target.value).toFixed(1);
			this.setAttribute("spread", parseFloat(e.target.value).toFixed(1));
		});
		spread.appendChild(spreadInput);
		outputWrapper.appendChild(spreadOutput);
		spread.appendChild(outputWrapper);
		spreadOutput.innerText = (this.spread / 2).toFixed(1);
		wrapper.appendChild(spread);
	}

	/**
	 *
	 * @param {HTMLElement} wrapper
	 */
	#attachWeight(wrapper) {
		const weight = document.createElement("td");
		const weightInput = document.createElement("input");
		const weightOutput = document.createElement("output");
		const outputWrapper = document.createElement("span");
		const weightInputAtts = {
			id: "weight",
			type: "range",
			max: 100,
			min: 0.01,
			class: "weight-input",
			value: this.weight,
		};
		const weightAttrs = {
			class: "weight-col",
		};
		const outputWrapperAttrs = {
			class: "out-wrapper",
		};
		const weightOutputAttrs = {
			for: "weight",
		};
		this.#applyAttributes(weightInput, weightInputAtts);
		this.#applyAttributes(weight, weightAttrs);
		this.#applyAttributes(outputWrapper, outputWrapperAttrs);
		this.#applyAttributes(weightOutput, weightOutputAttrs);

		weightInput.addEventListener("input", (e) => {
			weightOutput.innerText = e.target.value;
			this.setAttribute("weight", e.target.value);
			weightOutput.innerText = parseFloat(e.target.value).toFixed(1) + "%";
		});

		this.weightInput = weightInput;
		weight.appendChild(weightInput);
		this.weightText = weightOutput;
		weight.appendChild(weightOutput);

		weightOutput.innerText = this.weight;
		outputWrapper.appendChild(weightOutput);
		weight.appendChild(outputWrapper);
		wrapper.appendChild(weight);
	}

	/**
	 *
	 * @param {HTMLElement} wrapper
	 */
	#attachScore(wrapper) {
		const score = document.createElement("td");
		score.setAttribute("class", "category-score");
		const scoreOutput = document.createElement("output");
		scoreOutput.innerText = this.score;
		this.scoreOut = scoreOutput;
		score.appendChild(scoreOutput);
		wrapper.appendChild(score);
	}

	/**
	 *
	 * @param {number} index
	 * @returns
	 */
	#getTypeLetter(index) {
		switch (index) {
			case 0:
				return "a";
			case 1:
				return "b";
			case 2:
				return "c";
			case 3:
				return "d";
			case 4:
				return "e";
			default:
				return "a";
		}
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

	attributeChangedCallback(name, oldVal, newVal) {
		if (name === "score") {
			if (newVal !== undefined && !isNaN(newVal) && this.scoreOut !== undefined) {
				this.scoreOut.innerText = parseFloat(newVal).toFixed(1) + "";
			}
		}
		if (name === "weight") {
			if (newVal !== undefined && !isNaN(newVal) && this.weightInput !== undefined && this.weightText !== undefined) {
				// this.setAttribute("weight", Math.abs(newVal))
				this.weightInput.value = Math.abs(newVal);
				this.weightText.innerText = Math.abs(newVal).toFixed(1) + "%";
			}
		}
	}
}
