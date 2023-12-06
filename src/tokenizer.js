export const END = Symbol("END");

export class Tokenizer {
	#tokenTypes;

	constructor(tokenTypes) {
		this.#tokenTypes = tokenTypes;
	}

	*tokenize(text) {
		let index = 0;
		while (index < text.length) {
			let hasMatch = false;

			for (const { matcher, type, valueExtractor } of this.#tokenTypes) {
				const currentMatcher = new RegExp(matcher.source, "y");
				currentMatcher.lastIndex = index;
				const matched = currentMatcher.exec(text);
				if (matched !== null) {
					index += matched[0].length;
					if(type != null) {
						const token = { type };
						if(valueExtractor){
							token.value = valueExtractor(matched[0]);
						}
						yield token;
					}
					hasMatch = true;
				}
			}
			if (!hasMatch) {
				throw new Error(`Unexpected token at index ${index}`);
			}
		}
		yield { type: END };
	}
}