import { Parser, nonterminal, virtual } from "../src/parser.js";
import { javascriptTokenizer } from "./javascript-tokenizer.js";

// left-recursive, cannot use
// export const javascriptParser = new Parser({
// 	"AdditionExpression" : [
// 		[nonterminal("AdditiveExpression"), ["+", "-"], nonterminal("MultiplicativeExpression")]
// 		[nonterminal("MultiplicativeExpression")]
// 	],
// 	"MultiplicativeExpression": [
// 		[nonterminal("MultiplicativeExpression"), ["*", "/", "%"], nonterminal("MultiplicativeExpression")]
// 	],
// 	"ExponentiationExpression": [
// 		[nonterminal("UpdateExpression"), "**", nonterminal("ExponentiationExpression")],
// 		[nonterminal("UnaryExpression")]
// 	],
// 	"UnaryExpression" : [ //removed delete and void
// 		[nonterminal("UpdateExpression")],
// 		["typeof", nonterminal("UnaryExpression")],
// 		["-", nonterminal("UnaryExpression")],
// 		["~", nonterminal("UnaryExpression")],
// 		["!", nonterminal("UnaryExpression")],
// 		["await", nonterminal("UnaryExpression")],
// 	],
// 	"UpdateExpression" : [
// 		[nonterminal("LeftHandSideExpression")],
// 		["++", nonterminal("UnaryExpression")]
// 		["--", nonterminal("UnaryExpression")]
// 	]
// }, "AdditionExpression");

//
export const javascriptParser = new Parser(
	javascriptTokenizer,
	{
		"AdditionExpression": [
			[nonterminal("MultiplicativeExpression"), virtual("AdditionSuffixExpression")]
		],
		"AdditionSuffixExpression": [
			[["+", "-"], nonterminal("MultiplicativeExpression"), virtual("AdditionSuffixExpression")],
			[]
		],
		"MultiplicativeExpression": [
			[nonterminal("ExponentiationExpression"), virtual("MultiplicativeSuffixExpression")]
		],
		"MultiplicativeSuffixExpression": [
			[["*", "/", "%"], nonterminal("ExponentiationExpression"), virtual("MultiplicativeSuffixExpression")],
			[]
		],
		"ExponentiationExpression": [
			[nonterminal("UpdateExpression"), "**", nonterminal("ExponentiationExpression")],
			[nonterminal("UnaryExpression")]
		],
		"UnaryExpression": [
			[nonterminal("UpdateExpression")],
			//["delete", nonterminal("UnaryExpression")],
			//["void", nonterminal("UnaryExpression")],
			["typeof", nonterminal("UnaryExpression")],
			["-", nonterminal("UnaryExpression")],
			["~", nonterminal("UnaryExpression")],
			["!", nonterminal("UnaryExpression")],
			["await", nonterminal("UnaryExpression")],
			
		],
		"UpdateExpression": [
			[nonterminal("LeftHandSideExpression")],
			["++", nonterminal("UnaryExpression")],
			["--", nonterminal("UnaryExpression")]
		],
		"LeftHandSideExpression": [
			[nonterminal("NewExpression")],
			//[nonterminal("CallExpression")],
			//[nontermianl("OptionalExpression")]
		],
		"NewExpression": [
			[nonterminal("MemberExpression")],
			["new", nonterminal("MemberExpression")]
		],
		"CallExpression": [
			[nonterminal("CallMemberExpression")]
		],
		"CallMemberExpression": [
			[nonterminal("MemberExpression"), nonterminal("Arguments")]
		],
		"Arguments": [

		],
		"MemberExpression":[
			[nonterminal("PrimaryExpression")]
		],
		"PrimaryExpression": [
			[nonterminal("Literal")]
		],
		"Literal" : [
			[nonterminal("NumericLiteral")]
		],
		"NumericLiteral": [
			["number-literal"]
		]
	}, "AdditionExpression");