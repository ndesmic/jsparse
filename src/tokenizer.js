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

			for (const { matcher, type } of this.#tokenTypes) {
				const currentMatcher = new RegExp(matcher.source, "y");
				currentMatcher.lastIndex = index;
				const matched = currentMatcher.exec(text);
				if (matched !== null) {
					index += matched[0].length;
					yield {
						type: type,
						value: matched[0]
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