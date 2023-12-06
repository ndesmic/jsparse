import { Parser, nonterminal, virtual } from "../src/parser.js";
import { javascriptTokenizer } from "./javascript-tokenizer.js";

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
			[nonterminal("ModuleItem"), virtual("ModuleItemListSuffix")],
		],
		"ModuleItemListSuffix": [
			[nonterminal("ModuleItem"), virtual("ModuleItemListSuffix")],
			[]
		],
		"ModuleItem": [
			[nonterminal("ImportDeclaration")],
			//[nonterminal("ExportDeclaration")],
			//[nonterminal("StatementListItem")],
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
			[nonterminal("ImportSpecifier"), virtual("ImportsListSuffix")],
		],
		"ImportsListSuffix": [
			[",", nonterminal("ImportSpecifier"), virtual("ImportsListSuffix")],
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