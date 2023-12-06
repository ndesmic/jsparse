export function nonterminal(type){
	return { type: "nonterminal", matcher: type };
}

export function not(type){
	return { type: "not", matcher: type }
}

export function optional(type){
	return { type: "optional", matcher: type };
}

export function virtual(type){
	return { type: "virtual", matcher: type };
}

export function nonremovable(type){
	return { type: "nonremovable", matcher: type };
}

export class Parser {
	#tokenizer;
	#productions;
	#goalProduction;

	constructor(tokenizer, productions, goalProduction){
		this.#tokenizer = tokenizer;
		this.#productions = productions;
		this.#goalProduction = goalProduction;
		if (!this.#productions[goalProduction]) throw new Error(`Goal production ${goalProduction} did not exist.`);
	}

	parse(text){
		const tokens = [...this.#tokenizer.tokenize(text)];
		const production = this.produce(tokens, this.#goalProduction);
		if(production.failed){
			console.log(production)
			throw new Error(`Syntax Error`);
		}
		if (production.length != tokens.length && production.length != tokens.length - 1){ //if just END is left that's probably okay, we don't need to force them to make a production that includes it.
			throw new Error(`Syntax Error: not all content read.`);
		}
		return { 
			type: production.type, 
			children: production.children 
		};
	}

	produce(tokens, productionType, startIndex = 0){
		const productionRules = this.#productions[productionType];

		// console.log(`Producing ${[productionType]} @index ${startIndex} (token "${typeof (tokens[startIndex].type) === "string" ? tokens[startIndex].type : "END"}")`);

		for(const rule of productionRules){
			const match = this.matchRule(tokens, rule, startIndex);

			// console.log(`${!match.failed ? "Backtrack" : "Produced"} ${productionType} [${rule.map(x => typeof (x) === "string" ? x : x.matcher)}] @index ${startIndex} (token ${typeof (tokens[startIndex].type) === "string" ? `"${tokens[startIndex].type}" "${tokens[startIndex].value}"` : "END"})`);

			if(!match.failed){
				return {
					failed: false, 
					type: productionType, 
					children: match.matches, 
					length: match.length
				};
			}
		}

		return { failed: true };
	}

	matchRule(tokens, rule, startIndex){
		const matches = [];
		let offset = 0;
		
		for (const part of rule) {
			const currentToken = tokens[startIndex + offset];

			if (typeof (part) === "string" || typeof(part) === "symbol") {
				if (currentToken.type === part) {
					if(currentToken.value){
						matches.push(currentToken);
					}
					offset++;
				} else {
					return { length: offset, failed: true };
				}
			} else if (Array.isArray(part)) {
				if (part.includes(currentToken.type)) {
					if(currentToken.value){
						matches.push(currentToken);
					}
					offset++
				} else {
					return { length: offset, failed: true };
				}
			} else if (part.type === "nonterminal" || part.type === "virtual") {
				if (!this.#productions[part.matcher]){
					throw new Error(`Nonterminal production ${part.matcher} did not exist.`);
				}

				const production = this.produce(
					tokens, 
					part.matcher, 
					startIndex + offset
				);

				if (!production.failed) {
					if(part.type === "virtual"){
						matches.push(...production.children);
					} else {
						matches.push({ type: production.type, children: production.children });
					}
					offset += production.length
				} else {
					return { length: offset, failed: true };
				}
			} else if (part.type === "not") {
				if (currentToken.type !== part.matcher) {
					continue;
				} else {
					return { length: offset, failed: true };
				}
			} else if (part.type === "optional") {
				if (currentToken.type === part.matcher) {
					if(currentToken.value){
						matches.push(currentToken);
					}
					offset++;
				}
			} else if (part.type === "nonremovable") {
				if (currentToken.type === part.matcher) {
					matches.push(currentToken);
					offset++;
				} else {
					return { length: offset, failed: true };
				}
			}
		}

		return {
			failed: false,
			length: offset,
			matches
		};
	}
}