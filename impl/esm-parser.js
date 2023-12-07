import { Parser, nonterminal, virtualNonterminal, excludeNonterminal, not } from "../src/parser.js";
import { javascriptTokenizer } from "./javascript-tokenizer.js";
import { END } from "../src/tokenizer.js";

export const esmParser = new Parser(
	javascriptTokenizer,
	{
		"Module": [
			[nonterminal("ModuleBody")],
			[]
		],
		"ModuleBody": [
			[nonterminal("ModuleItemList")]
		],
		"ModuleItemList": [ //fixed for right-recursion
			[nonterminal("ModuleItem"), virtualNonterminal("ModuleItemListSuffix")],
		],
		"ModuleItemListSuffix": [
			[nonterminal("ModuleItem"), virtualNonterminal("ModuleItemListSuffix")],
			[]
		],
		"ModuleItem": [
			[nonterminal("ImportDeclaration")],
			//[nonterminal("ExportDeclaration")],
			//[nonterminal("StatementListItem")],
			[nonterminal("OtherList")]
		],
		"OtherList": [
			[excludeNonterminal("Other"), excludeNonterminal("OtherListSuffix")],
		],
		"OtherListSuffix": [
			[nonterminal("Other"), virtualNonterminal("OtherListSuffix")],
			[]
		],
		"Other": [
			[not(["export", END])]
		],
		"ImportDeclaration": [
			["import", nonterminal("ImportClause"), nonterminal("FromClause"), ";"],
			["import", nonterminal("ModuleSpecifier")]
		],
		"ImportClause": [
			[nonterminal("ImportedDefaultBinding")],
			[nonterminal("NameSpaceImport")],
			[nonterminal("NamedImports")],
			[nonterminal("ImportedDefaultBinding"), ",", nonterminal("NameSpaceImport")],
			[nonterminal("ImportedDefaultBinding", ",", nonterminal("NamedImports"))]
		],
		"ImportedDefaultBinding": [
			[nonterminal("ImportedBinding")]
		],
		"NameSpaceImport": [
			["*", "as", nonterminal("ImportedBinding")]
		],
		"NamedImports": [
			["{", "}"],
			["{", nonterminal("ImportsList"), "}"],
			["{", nonterminal("ImportsList"), ",", "}"]
		],
		"FromClause": [
			["from", nonterminal("ModuleSpecifier")]
		],
		"ImportsList": [ //fix for right-recursion
			[nonterminal("ImportSpecifier"), virtualNonterminal("ImportsListSuffix")],
		],
		"ImportsListSuffix": [
			[",", nonterminal("ImportSpecifier"), virtualNonterminal("ImportsListSuffix")],
			[]
		],
		"ImportSpecifier": [
			[nonterminal("ModuleExportName"), "as", nonterminal("ImportedBinding")],
			[nonterminal("ImportedBinding")],
		],
		"ModuleExportName": [
			["identifier"],
			["string-literal"]
		],
		"ModuleSpecifier": [
			["string-literal"]
		],
		"ImportedBinding": [
			["identifier"],
			[nonterminal("BindingIdentifier")]
		],
		"BindingIdentifier": [
			[nonterminal("Identifier")],
			["yield"],
			["await"]
		],
		"Identifier": [
			["identifier"]
		]
	}, "Module");