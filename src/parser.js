export function nonterminal(type) {
	return { type: "nonterminal", include: true, matcher: type };
}

export function virtualNonterminal(type) {
	return { type: "nonterminal", include: "children", matcher: type };
}

export function excludeNonterminal(type) {
	return { type: "nonterminal", include: false, matcher: type };
}

export function include(type) {
	return { type: "equals", include: true, matcher: type };
}

export function exclude(type) {
	return { type: "equals", include: false, matcher: type };
}

export function not(type) {
	return { type: "not", include: true, matcher: type }
}

export function excludeNot(type) {
	return { type: "not", include: false, matcher: type }
}

export function optional(type) {
	return { type: "optional", include: true, matcher: type };
}

export function excludeOptional(type) {
	return { type: "optional", include: false, matcher: type };
}

export class Parser {
	#tokenizer;
	#productions;
	#goalProduction;

	constructor(tokenizer, productions, goalProduction) {
		this.#tokenizer = tokenizer;
		this.#productions = productions;
		this.#goalProduction = goalProduction;
		if (!this.#productions[goalProduction]) throw new Error(`Goal production ${goalProduction} did not exist.`);
	}

	parse(text) {
		const tokens = [...this.#tokenizer.tokenize(text)];
		const production = this.produce(tokens, this.#goalProduction);
		if (production.failed) {
			throw new Error(`Syntax Error`);
		}
		if (production.length != tokens.length && production.length != tokens.length - 1) { //if just END is left that's probably okay, we don't need to force them to make a production that includes it.
			throw new Error(`Syntax Error: not all content read.`);
		}
		return {
			type: production.type,
			children: production.children
		};
	}


	debug(tokens, productionType, startIndex, label) {
		const token = tokens[startIndex];
		const tokenInfo = token.type.toString();

		console.log(`${label} ${[productionType]} index: ${startIndex}, type: "${tokenInfo}"${token.value ? `, value: ${token.value}` : ""}`);
	}

	produce(tokens, productionType, startIndex = 0) {
		const productionRules = this.#productions[productionType];

		//this.debug(tokens, productionType, startIndex, "Producing");

		for (const rule of productionRules) {
			const match = this.matchRule(tokens, rule, startIndex);

			//this.debug(tokens, productionType, startIndex, match.failed ? "Backtracked" : "Produced");

			if (!match.failed) {
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

	matchRule(tokens, rule, startIndex) {
		const matches = [];
		let offset = 0;

		for (const part of rule) {
			const currentToken = tokens[startIndex + offset];
			const isBasicPart = typeof (part) === "string" || typeof (part) === "symbol" || Array.isArray(part);

			if (isBasicPart || part.type === "equals") {
				const shouldInclude = (isBasicPart && currentToken.value)
					|| part.include;

				if (currentToken.type === part 
					|| currentToken.type === part.matcher
					|| Array.isArray(part) && part.includes(currentToken.type)
					|| Array.isArray(part.matcher) && part.matcher.includes(currentToken.type)) {

					if (shouldInclude) {
						matches.push(currentToken);
					}
					offset++;
				} else {
					return { length: offset, failed: true };
				}
			} else if (part.type === "nonterminal") {
				if (!this.#productions[part.matcher]) {
					throw new Error(`Nonterminal production ${part.matcher} did not exist.`);
				}

				const production = this.produce(
					tokens,
					part.matcher,
					startIndex + offset
				);

				if (!production.failed) {
					if (part.include === "children") {
						matches.push(...production.children);
					} else if(part.include){
						matches.push({ type: production.type, children: production.children });
					}
					offset += production.length
				} else {
					return { length: offset, failed: true };
				}
			} else if (part.type === "not") {
				if ((!Array.isArray(part.matcher) && currentToken.type !== part.matcher)
					|| (Array.isArray(part.matcher) && !part.matcher.includes(currentToken.type))) {
					

					if(part.include){
						matches.push(currentToken)
					}
					offset++;
				} else {
					return { length: offset, failed: true };
				}
			} else if (part.type === "optional") {
				if (currentToken.type === part.matcher
					|| Array.isArray(part.matcher) && part.matcher.includes(currentToken.type)) {

					if (part.include) {
						matches.push(currentToken);
					}
					offset++;
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