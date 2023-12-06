import { assertEquals } from "https://deno.land/std@0.207.0/assert/mod.ts";
import { Parser, nonterminal, not, optional, nonremovable, virtual } from "../src/parser.js";
import { Tokenizer } from "../src/tokenizer.js";
import { assertThrows } from "https://deno.land/std@0.207.0/assert/assert_throws.ts";

Deno.test("Parser can parse tokens", () => {
	const parser = new Parser(
		new Tokenizer([
			{ matcher: /\s/, type: null },
			{ matcher: /foo/, type: "foo", valueExtractor: x => x },
			{ matcher: /bar/, type: "bar", valueExtractor: x => x },
			{ matcher: /qux/, type: "qux", valueExtractor: x => x }
		]),
		{
			Foobar: [
				[nonterminal("Foo"), nonterminal("Bar")]
			],
			Foo: [
				["foo"]
			],
			Bar: [
				["bar"]
			]
		},
		"Foobar"
	);

	const ast = parser.parse("foo bar");
	assertEquals(ast, {
		type: "Foobar",
		children: [
			{ type: "Foo", children: [{ type: "foo", value: "foo" }] },
			{ type: "Bar", children: [{ type: "bar", value: "bar" }] }
		]
	});
});

Deno.test("Parser can parse variants", () => {
	const parser = new Parser(
		new Tokenizer([
			{ matcher: / /, type: null },
			{ matcher: /foo/, type: "foo", valueExtractor: x => x  },
			{ matcher: /bar/, type: "bar", valueExtractor: x => x },
			{ matcher: /qux/, type: "qux", valueExtractor: x => x }
		]),
		{
			Fooquxbar: [
				[nonterminal("Foo"), nonterminal("Bar")],
				[nonterminal("Qux"), nonterminal("Bar")]
			],
			Foo: [
				["foo"]
			],
			Bar: [
				["bar"]
			],
			Qux: [
				["qux"]
			]
		},
		"Fooquxbar"
	);

	let ast = parser.parse("foo bar");
	assertEquals(ast, {
		type: "Fooquxbar",
		children: [
			{ type: "Foo", children: [{ type: "foo", value: "foo" }] },
			{ type: "Bar", children: [{ type: "bar", value: "bar" }] }
		]
	});

	ast = parser.parse("qux bar");
	assertEquals(ast, {
		type: "Fooquxbar",
		children: [
			{ type: "Qux", children: [{ type: "qux", value: "qux" }] },
			{ type: "Bar", children: [{ type: "bar", value: "bar" }] }
		]
	});


	assertThrows(() => {
		ast = parser.parse("qux foo");
	}, Error, "Syntax Error");
});

Deno.test("Parser can parse not tokens", () => {
	const parser = new Parser(
		new Tokenizer([
			{ matcher: /\ /, type: null },
			{ matcher: /\n/, type: "\n" },
			{ matcher: /foo/, type: "foo", valueExtractor: x => x },
			{ matcher: /bar/, type: "bar", valueExtractor: x => x },
			{ matcher: /qux/, type: "qux", valueExtractor: x => x }
		]),
		{
			Foobar: [
				[nonterminal("Foo"), not("\n"), nonterminal("Bar")],
				[nonterminal("FooThenBar")]
			],
			FooThenBar: [
				[nonterminal("Foo"), "\n", nonterminal("Bar")],
			],
			Foo: [
				["foo"]
			],
			Bar: [
				["bar"]
			]
		},
		"Foobar"
	);

	let ast = parser.parse("foo bar");
	assertEquals(ast, {
		type: "Foobar",
		children: [
			{ type: "Foo", children: [{ type: "foo", value: "foo" }] },
			{ type: "Bar", children: [{ type: "bar", value: "bar" }] }
		]
	});

	ast = parser.parse("foo\nbar");
	assertEquals(ast, {
		type: "Foobar",
		children: [
			{
				type: "FooThenBar", children: [
					{ type: "Foo", children: [{ type: "foo", value: "foo" }] },
					{ type: "Bar", children: [{ type: "bar", value: "bar" }] }
				]
			}
		]
	});
});

Deno.test("Parser can parse optional tokens", () => {
	const parser = new Parser(
		new Tokenizer([
			{ matcher: / /, type: null },
			{ matcher: /\n/, type: "\n" },
			{ matcher: /foo/, type: "foo", valueExtractor: x => x },
			{ matcher: /bar/, type: "bar", valueExtractor: x => x },
			{ matcher: /qux/, type: "qux", valueExtractor: x => x },
			{ matcher: /await/, type: "await" }
		]),
		{
			Foobar: [
				[optional("await"), nonterminal("Foo"), nonterminal("Bar")],
			],
			Foo: [
				["foo"]
			],
			Bar: [
				["bar"]
			]
		},
		"Foobar"
	);

	let ast = parser.parse("foo bar");
	assertEquals(ast, {
		type: "Foobar",
		children: [
			{ type: "Foo", children: [{ type: "foo", value: "foo" }] },
			{ type: "Bar", children: [{ type: "bar", value: "bar" }] }
		]
	});

	ast = parser.parse("await foo bar");
	assertEquals(ast, {
		type: "Foobar",
		children: [
			{ type: "Foo", children: [{ type: "foo", value: "foo" }] },
			{ type: "Bar", children: [{ type: "bar", value: "bar" }] }
		]
	});
});

Deno.test("Parser can parse nonremovable tokens", () => {
	const parser = new Parser(
		new Tokenizer([
			{ matcher: / /, type: null },
			{ matcher: /\n/, type: "\n" },
			{ matcher: /foo/, type: "foo", valueExtractor: x => x },
			{ matcher: /bar/, type: "bar", valueExtractor: x => x },
			{ matcher: /qux/, type: "qux", valueExtractor: x => x },
			{ matcher: /await/, type: "await" }
		]),
		{
			Foobar: [
				[nonremovable("await"), nonterminal("Foo"), nonterminal("Bar")],
			],
			Foo: [
				["foo"]
			],
			Bar: [
				["bar"]
			]
		},
		"Foobar"
	);

	let ast = parser.parse("await foo bar");
	assertEquals(ast, {
		type: "Foobar",
		children: [
			{ type: "await" },
			{ type: "Foo", children: [{ type: "foo", value: "foo" }] },
			{ type: "Bar", children: [{ type: "bar", value: "bar" }] }
		]
	});
});

Deno.test("Parser can parse virtual tokens", () => {
	const parser = new Parser(
		new Tokenizer([
			{ matcher: / /, type: null },
			{ matcher: /\n/, type: "\n" },
			{ matcher: /foo/, type: "foo", valueExtractor: x => x },
			{ matcher: /bar/, type: "bar", valueExtractor: x => x },
			{ matcher: /qux/, type: "qux", valueExtractor: x => x },
		]),
		{
			Foobar: [
				[virtual("Foo"), virtual("Bar")],
			],
			Foo: [
				["foo"]
			],
			Bar: [
				["bar"]
			]
		},
		"Foobar"
	);

	let ast = parser.parse("foo bar");
	assertEquals(ast, {
		type: "Foobar",
		children: [
			{ type: "foo", value: "foo" },
			{ type: "bar", value: "bar" }
		]
	});
});

Deno.test("Parser errors if goal production doesn't exist", () => {
	assertThrows(() => {
		const parser = new Parser(
			new Tokenizer([
				{ matcher: /\s/, type: null },
				{ matcher: /foo/, type: "foo", valueExtractor: x => x },
				{ matcher: /bar/, type: "bar", valueExtractor: x => x },
				{ matcher: /qux/, type: "qux", valueExtractor: x => x }
			]),
			{
				Foobar: [
					[nonterminal("Foo"), nonterminal("Bar")]
				],
				Foo: [
					["foo"]
				],
				Bar: [
					["bar"]
				]
			},
			"Notfoobar"
		);
	});
});

Deno.test("Parser errors if production doesn't exist", () => {
	const parser = new Parser(
		new Tokenizer([
			{ matcher: /\s/, type: null },
			{ matcher: /foo/, type: "foo", valueExtractor: x => x },
			{ matcher: /bar/, type: "bar", valueExtractor: x => x },
			{ matcher: /qux/, type: "qux", valueExtractor: x => x }
		]),
		{
			Foobar: [
				[nonterminal("Notfoo"), nonterminal("Notbar")]
			],
			Foo: [
				["foo"]
			],
			Bar: [
				["bar"]
			]
		},
		"Foobar"
	);
	assertThrows(() => {
		parser.parse("foo bar");
	});
});

Deno.test("Parser errors if there's more to parse", () => {
	const parser = new Parser(
		new Tokenizer([
			{ matcher: / /, type: null },
			{ matcher: /foo/, type: "foo", valueExtractor: x => x },
			{ matcher: /bar/, type: "bar", valueExtractor: x => x },
			{ matcher: /qux/, type: "qux", valueExtractor: x => x }
		]),
		{
			Foobar: [
				[nonterminal("Foo"), nonterminal("Bar")]
			],
			Foo: [
				["foo"]
			],
			Bar: [
				["bar"]
			]
		},
		"Foobar"
	);
	assertThrows(() => {
		parser.parse("foo bar qux");
	});
});