import { Parser, nonterminal, virtualNonterminal } from "../src/parser.js";
import { javascriptTokenizer } from "./javascript-tokenizer.js";

export const javascriptParser = new Parser(
	javascriptTokenizer,
	{
		"AdditionExpression": [
			[nonterminal("MultiplicativeExpression"), virtualNonterminal("AdditionSuffixExpression")]
		],
		"AdditionSuffixExpression": [
			[["+", "-"], nonterminal("MultiplicativeExpression"), virtualNonterminal("AdditionSuffixExpression")],
			[]
		],
		"MultiplicativeExpression": [
			[nonterminal("ExponentiationExpression"), virtualNonterminal("MultiplicativeSuffixExpression")]
		],
		"MultiplicativeSuffixExpression": [
			[["*", "/", "%"], nonterminal("ExponentiationExpression"), virtualNonterminal("MultiplicativeSuffixExpression")],
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