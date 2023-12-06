import { assertEquals, assertThrows } from "https://deno.land/std@0.207.0/assert/mod.ts";
import { javascriptTokenizer } from "../impl/javascript-tokenizer.js";
import { END } from "../src/tokenizer.js";


Deno.test("javascriptTokenizer removes space", () => {
	const tokens = [...javascriptTokenizer.tokenize(`  `)];
	assertEquals(tokens, [{ type: END }]);
});
Deno.test("javascriptTokenizer removes tab", () => {
	const tokens = [...javascriptTokenizer.tokenize(`\t\t`)];
	assertEquals(tokens, [{ type: END }]);
});

//unclear if these need to be kept around...
// Deno.test("javascriptTokenizer can parse unix line-break", () => {
// 	const tokens = [...javascriptTokenizer.tokenize(`\n`)];
// 	assertEquals(tokens, [{ type: "line-break" }, { type: END }]);
// });
// Deno.test("javascriptTokenizer can parse windows line-break", () => {
// 	const tokens = [...javascriptTokenizer.tokenize(`\r\n`)];
// 	assertEquals(tokens, [{ type: "line-break" }, { type: END }]);
// });

//braces
Deno.test("javascriptTokenizer can parse left curly brace", () => {
	const tokens = [...javascriptTokenizer.tokenize(`{`)];
	assertEquals(tokens, [{ type: "{" }, { type: END }]);
});
Deno.test("javascriptTokenizer can parse right curly brace", () => {
	const tokens = [...javascriptTokenizer.tokenize(`}`)];
	assertEquals(tokens, [{ type: "}" }, { type: END }]);
});
Deno.test("javascriptTokenizer can parse left square brace", () => {
	const tokens = [...javascriptTokenizer.tokenize(`[`)];
	assertEquals(tokens, [{ type: "[" }, { type: END }]);
});
Deno.test("javascriptTokenizer can parse right square brace", () => {
	const tokens = [...javascriptTokenizer.tokenize(`]`)];
	assertEquals(tokens, [{ type: "]" }, { type: END }]);
});
Deno.test("javascriptTokenizer can parse left paren", () => {
	const tokens = [...javascriptTokenizer.tokenize(`(`)];
	assertEquals(tokens, [{ type: "(" }, { type: END }]);
});
Deno.test("javascriptTokenizer can parse right paren", () => {
	const tokens = [...javascriptTokenizer.tokenize(`)`)];
	assertEquals(tokens, [{ type: ")" }, { type: END }]);
});

//comments
Deno.test("javascriptTokenizer can parse line comment (to end)", () => {
	const tokens = [...javascriptTokenizer.tokenize(`//foobar`)];
	assertEquals(tokens, [{ type: "comment", value: "foobar" }, { type: END }]);
});
Deno.test("javascriptTokenizer can parse line comment (to line end)", () => {
	const tokens = [...javascriptTokenizer.tokenize(`//foobar\r\n`)];
	assertEquals(tokens, [{ type: "comment", value: "foobar" }, { type: END }]);
});

//identifier
Deno.test("javascriptTokenizer can parse identifier (letters)", () => {
	const tokens = [...javascriptTokenizer.tokenize(`foobar`)];
	assertEquals(tokens, [{ type: "identifier", value: "foobar" }, { type: END }]);
});
Deno.test("javascriptTokenizer can parse identifier (symbols)", () => {
	const tokens = [...javascriptTokenizer.tokenize(`_foobar $foobar`)];
	assertEquals(tokens, [
		{ type: "identifier", value: "_foobar" }, 
		{ type: "identifier", value: "$foobar" }, 
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse identifier (numbers)", () => {
	const tokens = [...javascriptTokenizer.tokenize(`f00bar foobar1`)];
	assertEquals(tokens, [
		{ type: "identifier", value: "f00bar" }, 
		{ type: "identifier", value: "foobar1" }, 
		{ type: END }]);
});
Deno.test("javascriptTokenizer throws on number followed by id", () => {
	assertThrows(() => {
		const tokens = [...javascriptTokenizer.tokenize(`0foobar`)];
	});
});

//string
Deno.test("javascriptTokenizer can parse strings (double quote)", () => {
	const tokens = [...javascriptTokenizer.tokenize(`"foo"`)];
	assertEquals(tokens, [
		{ type: "string-literal", value: `foo` },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse strings (single quote)", () => {
	const tokens = [...javascriptTokenizer.tokenize(`'bar'`)];
	assertEquals(tokens, [
		{ type: "string-literal", value: `bar` },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse strings (backticks)", () => {
	const tokens = [...javascriptTokenizer.tokenize("`qux`")];
	assertEquals(tokens, [
		{ type: "string-literal", value: "qux" },
		{ type: END }]);
});

//number
Deno.test("javascriptTokenizer can parse number (int)", () => {
	const tokens = [...javascriptTokenizer.tokenize(`123`)];
	assertEquals(tokens, [
		{ type: "number-literal", value: 123 },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse number (float)", () => {
	const tokens = [...javascriptTokenizer.tokenize(`123.123`)];
	assertEquals(tokens, [
		{ type: "number-literal", value: 123.123 },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse number (negative)", () => {
	const tokens = [...javascriptTokenizer.tokenize(`-123.123`)];
	assertEquals(tokens, [
		{ type: "number-literal", value: -123.123 },
		{ type: END }]);
});


//syntax char
Deno.test("javascriptTokenizer can parse semicolon", () => {
	const tokens = [...javascriptTokenizer.tokenize(";")];
	assertEquals(tokens, [
		{ type: ";" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse colon", () => {
	const tokens = [...javascriptTokenizer.tokenize(":")];
	assertEquals(tokens, [
		{ type: ":" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse comma", () => {
	const tokens = [...javascriptTokenizer.tokenize(",")];
	assertEquals(tokens, [
		{ type: "," },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse dot", () => {
	const tokens = [...javascriptTokenizer.tokenize(".")];
	assertEquals(tokens, [
		{ type: "." },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse ellipsis", () => {
	const tokens = [...javascriptTokenizer.tokenize("...")];
	assertEquals(tokens, [
		{ type: "..." },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse equal", () => {
	const tokens = [...javascriptTokenizer.tokenize("=")];
	assertEquals(tokens, [
		{ type: "=" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse question", () => {
	const tokens = [...javascriptTokenizer.tokenize("?")];
	assertEquals(tokens, [
		{ type: "?" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse double-question", () => {
	const tokens = [...javascriptTokenizer.tokenize("??")];
	assertEquals(tokens, [
		{ type: "??" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse right arrow", () => {
	const tokens = [...javascriptTokenizer.tokenize("=>")];
	assertEquals(tokens, [
		{ type: "=>" },
		{ type: END }]);
});

//comparison
Deno.test("javascriptTokenizer can parse double-equal", () => {
	const tokens = [...javascriptTokenizer.tokenize("==")];
	assertEquals(tokens, [
		{ type: "==" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse triple-equal", () => {
	const tokens = [...javascriptTokenizer.tokenize("===")];
	assertEquals(tokens, [
		{ type: "===" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse greater-than", () => {
	const tokens = [...javascriptTokenizer.tokenize(">")];
	assertEquals(tokens, [
		{ type: ">" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse double-greater-than", () => {
	const tokens = [...javascriptTokenizer.tokenize(">>")];
	assertEquals(tokens, [
		{ type: ">>" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse greater-than-equal", () => {
	const tokens = [...javascriptTokenizer.tokenize(">=")];
	assertEquals(tokens, [
		{ type: ">=" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse less-than", () => {
	const tokens = [...javascriptTokenizer.tokenize("<")];
	assertEquals(tokens, [
		{ type: "<" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse double-less-than", () => {
	const tokens = [...javascriptTokenizer.tokenize("<<")];
	assertEquals(tokens, [
		{ type: "<<" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse less-than-equal", () => {
	const tokens = [...javascriptTokenizer.tokenize("<=")];
	assertEquals(tokens, [
		{ type: "<=" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse not equal", () => {
	const tokens = [...javascriptTokenizer.tokenize("!=")];
	assertEquals(tokens, [
		{ type: "!=" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse not strict equal", () => {
	const tokens = [...javascriptTokenizer.tokenize("!==")];
	assertEquals(tokens, [
		{ type: "!==" },
		{ type: END }]);
});

//boolean
Deno.test("javascriptTokenizer can parse true", () => {
	const tokens = [...javascriptTokenizer.tokenize("true")];
	assertEquals(tokens, [
		{ type: "true", value: "true" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse false", () => {
	const tokens = [...javascriptTokenizer.tokenize("false")];
	assertEquals(tokens, [
		{ type: "false", value: "false" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse ampersand", () => {
	const tokens = [...javascriptTokenizer.tokenize("&")];
	assertEquals(tokens, [
		{ type: "&" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse double-ampersand", () => {
	const tokens = [...javascriptTokenizer.tokenize("&&")];
	assertEquals(tokens, [
		{ type: "&&" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse pipe", () => {
	const tokens = [...javascriptTokenizer.tokenize("|")];
	assertEquals(tokens, [
		{ type: "|" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse double-pipe", () => {
	const tokens = [...javascriptTokenizer.tokenize("||")];
	assertEquals(tokens, [
		{ type: "||" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse caret", () => {
	const tokens = [...javascriptTokenizer.tokenize("^")];
	assertEquals(tokens, [
		{ type: "^" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse tilde", () => {
	const tokens = [...javascriptTokenizer.tokenize("~")];
	assertEquals(tokens, [
		{ type: "~" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse bang", () => {
	const tokens = [...javascriptTokenizer.tokenize("!")];
	assertEquals(tokens, [
		{ type: "!" },
		{ type: END }]);
});

//arithmetic
Deno.test("javascriptTokenizer can parse plus", () => {
	const tokens = [...javascriptTokenizer.tokenize("+")];
	assertEquals(tokens, [
		{ type: "+" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse double-plus", () => {
	const tokens = [...javascriptTokenizer.tokenize("++")];
	assertEquals(tokens, [
		{ type: "++" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse minus", () => {
	const tokens = [...javascriptTokenizer.tokenize("-")];
	assertEquals(tokens, [
		{ type: "-" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse double minus", () => {
	const tokens = [...javascriptTokenizer.tokenize("--")];
	assertEquals(tokens, [
		{ type: "--" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse asterisk", () => {
	const tokens = [...javascriptTokenizer.tokenize("*")];
	assertEquals(tokens, [
		{ type: "*" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse asterisk", () => {
	const tokens = [...javascriptTokenizer.tokenize("**")];
	assertEquals(tokens, [
		{ type: "**" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse solidus", () => {
	const tokens = [...javascriptTokenizer.tokenize("\\")];
	assertEquals(tokens, [
		{ type: "\\" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse percent", () => {
	const tokens = [...javascriptTokenizer.tokenize("%")];
	assertEquals(tokens, [
		{ type: "%" },
		{ type: END }]);
});

//imports
Deno.test("javascriptTokenizer can parse import", () => {
	const tokens = [...javascriptTokenizer.tokenize("import")];
	assertEquals(tokens, [
		{ type: "import" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse export", () => {
	const tokens = [...javascriptTokenizer.tokenize("export")];
	assertEquals(tokens, [
		{ type: "export" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse from", () => {
	const tokens = [...javascriptTokenizer.tokenize("from")];
	assertEquals(tokens, [
		{ type: "from" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse as", () => {
	const tokens = [...javascriptTokenizer.tokenize("as")];
	assertEquals(tokens, [
		{ type: "as" },
		{ type: END }]);
});

//loops
Deno.test("javascriptTokenizer can parse for", () => {
	const tokens = [...javascriptTokenizer.tokenize("for")];
	assertEquals(tokens, [
		{ type: "for" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse while", () => {
	const tokens = [...javascriptTokenizer.tokenize("while")];
	assertEquals(tokens, [
		{ type: "while" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse of", () => {
	const tokens = [...javascriptTokenizer.tokenize("of")];
	assertEquals(tokens, [
		{ type: "of" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse in", () => {
	const tokens = [...javascriptTokenizer.tokenize("in")];
	assertEquals(tokens, [
		{ type: "in" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse break", () => {
	const tokens = [...javascriptTokenizer.tokenize("break")];
	assertEquals(tokens, [
		{ type: "break" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse continue", () => {
	const tokens = [...javascriptTokenizer.tokenize("continue")];
	assertEquals(tokens, [
		{ type: "continue" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse do", () => {
	const tokens = [...javascriptTokenizer.tokenize("do")];
	assertEquals(tokens, [
		{ type: "do" },
		{ type: END }]);
});

//branch
Deno.test("javascriptTokenizer can parse if", () => {
	const tokens = [...javascriptTokenizer.tokenize("if")];
	assertEquals(tokens, [
		{ type: "if" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse else", () => {
	const tokens = [...javascriptTokenizer.tokenize("else")];
	assertEquals(tokens, [
		{ type: "else" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse switch", () => {
	const tokens = [...javascriptTokenizer.tokenize("switch")];
	assertEquals(tokens, [
		{ type: "switch" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse case", () => {
	const tokens = [...javascriptTokenizer.tokenize("case")];
	assertEquals(tokens, [
		{ type: "case" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse default", () => {
	const tokens = [...javascriptTokenizer.tokenize("default")];
	assertEquals(tokens, [
		{ type: "default" },
		{ type: END }]);
});

//keywords
Deno.test("javascriptTokenizer can parse await", () => {
	const tokens = [...javascriptTokenizer.tokenize("await")];
	assertEquals(tokens, [
		{ type: "await" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse return", () => {
	const tokens = [...javascriptTokenizer.tokenize("return")];
	assertEquals(tokens, [
		{ type: "return" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse try", () => {
	const tokens = [...javascriptTokenizer.tokenize("try")];
	assertEquals(tokens, [
		{ type: "try" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse catch", () => {
	const tokens = [...javascriptTokenizer.tokenize("catch")];
	assertEquals(tokens, [
		{ type: "catch" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse finally", () => {
	const tokens = [...javascriptTokenizer.tokenize("finally")];
	assertEquals(tokens, [
		{ type: "finally" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse throw", () => {
	const tokens = [...javascriptTokenizer.tokenize("throw")];
	assertEquals(tokens, [
		{ type: "throw" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse function", () => {
	const tokens = [...javascriptTokenizer.tokenize("function")];
	assertEquals(tokens, [
		{ type: "function" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse yield", () => {
	const tokens = [...javascriptTokenizer.tokenize("yield")];
	assertEquals(tokens, [
		{ type: "yield" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse new", () => {
	const tokens = [...javascriptTokenizer.tokenize("new")];
	assertEquals(tokens, [
		{ type: "new" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse class", () => {
	const tokens = [...javascriptTokenizer.tokenize("class")];
	assertEquals(tokens, [
		{ type: "class" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse super", () => {
	const tokens = [...javascriptTokenizer.tokenize("super")];
	assertEquals(tokens, [
		{ type: "super" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse let", () => {
	const tokens = [...javascriptTokenizer.tokenize("let")];
	assertEquals(tokens, [
		{ type: "let" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse const", () => {
	const tokens = [...javascriptTokenizer.tokenize("const")];
	assertEquals(tokens, [
		{ type: "const" },
		{ type: END }]);
});
Deno.test("javascriptTokenizer can parse this", () => {
	const tokens = [...javascriptTokenizer.tokenize("this")];
	assertEquals(tokens, [
		{ type: "this" },
		{ type: END }]);
});



// Deno.test("can tokenize imports", () => {
// 	const tokenIterator = javascriptTokenizer.tokenize(`
// 			import { foo } from "./foo.js";

// 			console.log(foo);
// 		`);
// 	const tokens = [...tokenIterator];
// 	assertEquals(tokens, [
// 		{ type: "import" },
// 		{ type: "whitespace" },
// 		{ type: "left-curly" },
// 		{ type: "whitespace" },
// 		{ type: "identifier" },
// 		{ type: "whitespace" },
// 		{ type: "right-curly" },
// 		{ type: "whitespace" },
// 		{ type: "from" },
// 		{ type: "whitespace" },
// 		{ type: "string-literal", value: "./foo.js" },
// 		{ type: "semicolon" },
// 		{ type: "line-break" },
// 		{ type: "identifier" },
// 		{ type: "dot" },
// 		{ type: "identifier" },
// 		{ type: "left-paren" },
// 		{ type: "identifier" },
// 		{ type: "right-paren" },
// 		{ type: "semicolon" },
// 	]);
// });