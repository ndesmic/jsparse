import { Tokenizer } from "../src/tokenizer.js";

export const javascriptTokenizer = new Tokenizer([
	{ matcher: /[ \t]+/, type: "whitespace" },
	{ matcher: /\r?\n/, type: "line-break" },
	{ matcher: /\/\/(.*?)(?=\r?\n|$)/, type: "comment" },
	{ matcher: /"[^"\r\n]+"/, type: "string-literal" },
	{ matcher: /'[^'\r\n]+'/, type: "string-literal" },
	{ matcher: /`[^`]+`/, type: "string-literal" },
	{ matcher: /-?[0-9]+\.?[0-9]*(?![a-zA-Z$_])/, type: "number-literal" },
	{ matcher: /{/, type: "left-curly-brace" },
	{ matcher: /}/, type: "right-curly-brace" },
	{ matcher: /\[/, type: "left-square-brace" },
	{ matcher: /\]/, type: "right-square-brace" },
	{ matcher: /\(/, type: "left-paren" },
	{ matcher: /\)/, type: "right-paren" },
	{ matcher: /;/, type: "semicolon" },
	{ matcher: /:/, type: "colon" },
	{ matcher: /,/, type: "comma" },
	{ matcher: /\.\.\./, type: "ellipsis" },
	{ matcher: /\./, type: "dot" },
	{ matcher: /\*\*/, type: "exponential" },
	{ matcher: /\*/, type: "asterisk" },
	{ matcher: /===/, type: "triple-equal" },
	{ matcher: /==/, type: "double-equal" },
	{ matcher: /=>/, type: "right-arrow" },
	{ matcher: /=/, type: "equal" },
	{ matcher: /!==/, type: "not-strict-equal" },
	{ matcher: /!=/, type: "not-equal" },
	{ matcher: /&&/, type: "double-ampersand" },
	{ matcher: /&/, type: "ampersand" },
	{ matcher: /\^/, type: "caret" },
	{ matcher: /~/, type: "tilde" },
	{ matcher: /!/, type: "bang" },
	{ matcher: /\|\|/, type: "double-pipe" },
	{ matcher: /\|/, type: "pipe" },
	{ matcher: /\+\+/, type: "double-plus" },
	{ matcher: /\+/, type: "plus" },
	{ matcher: /\-\-/, type: "double-minus" },
	{ matcher: /\-/, type: "minus" },
	{ matcher: /\\/, type: "solidus" },
	{ matcher: /%/, type: "percent" },
	{ matcher: /\?\?/, type: "double-question" },
	{ matcher: /\?/, type: "question" },
	{ matcher: />=/, type: "greater-than-equal" },
	{ matcher: /<=/, type: "less-than-equal" },
	{ matcher: />>/, type: "double-greater-than" },
	{ matcher: />/, type: "greater-than" },
	{ matcher: /<</, type: "double-less-than" },
	{ matcher: /</, type: "less-than" },
	{ matcher: /null/, type: "null" },
	{ matcher: /true/, type: "true" },
	{ matcher: /false/, type: "false" },
	{ matcher: /import/, type: "import" },
	{ matcher: /export/, type: "export" },
	{ matcher: /from/, type: "from" },
	{ matcher: /as/, type: "as" },
	{ matcher: /for/, type: "for" },
	{ matcher: /while/, type: "while" },
	{ matcher: /in/, type: "in" },
	{ matcher: /of/, type: "of" },
	{ matcher: /break/, type: "break" },
	{ matcher: /continue/, type: "continue" },
	{ matcher: /do/, type: "do" },
	{ matcher: /if/, type: "if" },
	{ matcher: /else/, type: "else" },
	{ matcher: /switch/, type: "switch" },
	{ matcher: /case/, type: "case" },
	{ matcher: /default/, type: "default" },
	{ matcher: /function/, type: "function" },
	{ matcher: /return/, type: "return" },
	{ matcher: /yield/, type: "yield" },
	{ matcher: /await/, type: "await" },
	{ matcher: /try/, type: "try" },
	{ matcher: /catch/, type: "catch" },
	{ matcher: /finally/, type: "finally" },
	{ matcher: /throw/, type: "throw" },
	{ matcher: /new/, type: "new" },
	{ matcher: /class/, type: "class" },
	{ matcher: /super/, type: "super" },
	{ matcher: /let/, type: "let" },
	{ matcher: /const/, type: "const" },
	{ matcher: /this/, type: "this" },
	{ matcher: /[a-zA-Z$_][a-zA-Z0-9$_]*/, type: "identifier" },
]);