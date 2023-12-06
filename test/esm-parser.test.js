import { assertEquals } from "https://deno.land/std@0.207.0/assert/mod.ts";
import { esmParser } from "../impl/esm-parser.js";
import { javascriptTokenizer } from "../impl/javascript-tokenizer.js";


Deno.test("esmParser can parse NamedImport {}", () => {
	const tokens = [...javascriptTokenizer.tokenize("{ }")];
	const { type, children, failed } = esmParser.produce(tokens, `NamedImports`);
	assertEquals(type, "NamedImports");
	assertEquals(children, []);
	assertEquals(failed, false);
});

Deno.test("esmParser can parse NamedImport { foo }", () => {
	const tokens = [...javascriptTokenizer.tokenize("{ foo }")];
	const { type, children, failed } = esmParser.produce(tokens, `NamedImports`);
	assertEquals(type, "NamedImports");
	assertEquals(children, [
		{
			type: "ImportsList",
			children: [
				{
					type: "ImportSpecifier",
					children: [
						{
							type: "ImportedBinding",
							children: [
								{
									type: "identifier",
									value: "foo"
								}
							]
						}
					]
				}
			]
		}
	]);
	assertEquals(failed, false);
});

Deno.test("esmParser can parse NamedImport { foo as bar }", () => {
	const tokens = [...javascriptTokenizer.tokenize("{ foo as bar }")];
	const { type, children, failed } = esmParser.produce(tokens, `NamedImports`);
	assertEquals(type, "NamedImports");
	assertEquals(children, [
		{
			type: "ImportsList",
			children: [
				{
					type: "ImportSpecifier",
					children: [
						{
							type: "ModuleExportName",
							children: [
								{
									type: "identifier",
									value: "foo"
								}
							]
						},
						{
							type: "ImportedBinding",
							children: [
								{
									type: "identifier",
									value: "bar"
								}
							]
						}
					]
				}
			]
		}
	]);
	assertEquals(failed, false);
});

Deno.test("esmParser can parse NamedImport { foo as bar, baz as qux }", () => {
	const tokens = [...javascriptTokenizer.tokenize("{ foo as bar, baz as qux }")];
	const { type, children, failed } = esmParser.produce(tokens, `NamedImports`);
	assertEquals(type, "NamedImports");
	assertEquals(children, [
		{
			type: "ImportsList",
			children: [
				{
					type: "ImportSpecifier",
					children: [
						{
							type: "ModuleExportName",
							children: [
								{
									type: "identifier",
									value: "foo"
								}
							]
						},
						{
							type: "ImportedBinding",
							children: [
								{
									type: "identifier",
									value: "bar"
								}
							]
						}
					]
				},
				{
					type: "ImportSpecifier",
					children: [
						{
							type: "ModuleExportName",
							children: [
								{
									type: "identifier",
									value: "baz"
								}
							]
						},
						{
							type: "ImportedBinding",
							children: [
								{
									type: "identifier",
									value: "qux"
								}
							]
						}
					]
				}
			]
		}
	]);
	assertEquals(failed, false);
});

Deno.test("esmParser can parse NamedImport { foo as bar, qux }", () => {
	const tokens = [...javascriptTokenizer.tokenize("{ foo as bar, qux }")];
	const { type, children, failed } = esmParser.produce(tokens, `NamedImports`);
	assertEquals(type, "NamedImports");
	assertEquals(children, [
		{
			type: "ImportsList",
			children: [
				{
					type: "ImportSpecifier",
					children: [
						{
							type: "ModuleExportName",
							children: [
								{
									type: "identifier",
									value: "foo"
								}
							]
						},
						{
							type: "ImportedBinding",
							children: [
								{
									type: "identifier",
									value: "bar"
								}
							]
						}
					]
				},
				{
					type: "ImportSpecifier",
					children: [
						{
							type: "ImportedBinding",
							children: [
								{
									type: "identifier",
									value: "qux"
								}
							]
						}
					]
				}
			]
		}
	]);
	assertEquals(failed, false);
});

Deno.test("esmParser can parse NamedImport { foo, }", () => {
	const tokens = [...javascriptTokenizer.tokenize("{ foo, }")];
	const { type, children, failed } = esmParser.produce(tokens, `NamedImports`);
	assertEquals(type, "NamedImports");
	assertEquals(children, [
		{
			type: "ImportsList",
			children: [
				{
					type: "ImportSpecifier",
					children: [
						{
							type: "ImportedBinding",
							children: [
								{
									type: "identifier",
									value: "foo"
								}
							]
						}
					]
				}
			]
		}
	]);
	assertEquals(failed, false);
});

Deno.test("esmParser can parse ImportClause import { foo }", () => {
	const tokens = [...javascriptTokenizer.tokenize("{ foo }")];
	const { type, children, failed } = esmParser.produce(tokens, `ImportClause`);
	assertEquals(type, "ImportClause");
	assertEquals(children, [
		{
			type: "NamedImports",
			children: [
				{
					type: "ImportsList",
					children: [
						{
							type: "ImportSpecifier",
							children: [
								{
									type: "ImportedBinding",
									children: [
										{
											type: "identifier",
											value: "foo"
										}
									]
								}
							]
						}
					]
				}
			]
		}
	]);
	assertEquals(failed, false);
});

Deno.test(`esmParser can parse ModuleItemList import foo from "foo";\nimport bar from "bar";`, () => {
	const tokens = [...javascriptTokenizer.tokenize(`import foo from "foo";\nimport bar from "bar";`)];
	const { type, children, failed } = esmParser.produce(tokens, `ModuleItemList`);
	assertEquals(type, "ModuleItemList");
	console.log(children)
	assertEquals(children, [
		{
			type: "ModuleItem",
			children: [
				{
					type: "ImportDeclaration",
					children: [
						{
							type: "ImportClause",
							children: [
								{
									type: "ImportedDefaultBinding",
									children: [
										{
											type: "ImportedBinding",
											children: [
												{
													type: "identifier",
													value: "foo"
												}
											]
										}
									]
								}
							]
						},
						{
							type: "FromClause",
							children: [
								{
									type: "ModuleSpecifier",
									children: [
										{
											type: "string-literal",
											value: "foo"
										}
									]
								}
							]
						}
					]
				}
			]
		},
		{
			type: "ModuleItem",
			children: [
				{
					type: "ImportDeclaration",
					children: [
						{
							type: "ImportClause",
							children: [
								{
									type: "ImportedDefaultBinding",
									children: [
										{
											type: "ImportedBinding",
											children: [
												{
													type: "identifier",
													value: "bar"
												}
											]
										}
									]
								}
							]
						},
						{
							type: "FromClause",
							children: [
								{
									type: "ModuleSpecifier",
									children: [
										{
											type: "string-literal",
											value: "bar"
										}
									]
								}
							]
						}
					]
				}
			]
		}
	]);
	assertEquals(failed, false);
});

Deno.test(`esmParser can parse module import foo from "./foo.js";`, () => {
	const ast = esmParser.parse(`import foo from "./foo.js";`);
	assertEquals(ast, {
		type: "Module",
		children: [
			{
				type: "ModuleBody",
				children: [
					{
						type: "ModuleItemList",
						children: [
							{
								type: "ModuleItem",
								children: [
									{
										type: "ImportDeclaration",
										children: [
											{
												type: "ImportClause",
												children: [
													{
														type: "ImportedDefaultBinding",
														children: [
															{
																type: "ImportedBinding",
																children: [
																	{
																		type: "identifier",
																		value: "foo"
																	}
																]
															}
														]
													}
												]
											},
											{
												type: "FromClause",
												children: [
													{
														type: "ModuleSpecifier",
														children: [
															{
																type: "string-literal",
																value: "./foo.js"
															}
														]
													}
												]
											}
										]
									}
								]
							}
						]
					}
				]
			}
		]
	});
});

Deno.test(`esmParser can parse module import { foo as bar, baz as qux } from "./foo.js";`, () => {
	const ast = esmParser.parse(`import { foo as bar, baz as qux } from "./foo.js";`);
	assertEquals(ast,
		{
			type: "Module",
			children: [
				{
					type: "ModuleBody",
					children: [
						{
							type: "ModuleItemList",
							children: [
								{
									type: "ModuleItem",
									children: [
										{
											type: "ImportDeclaration",
											children: [
												{
													type: "ImportClause",
													children: [
														{
															type: "NamedImports",
															children: [
																{
																	type: "ImportsList",
																	children: [
																		{
																			type: "ImportSpecifier",
																			children: [
																				{
																					type: "ModuleExportName",
																					children: [
																						{
																							type: "identifier",
																							value: "foo"
																						}
																					]
																				},
																				{
																					type: "ImportedBinding",
																					children: [
																						{
																							type: "identifier",
																							value: "bar"
																						}
																					]
																				}
																			]
																		},
																		{
																			type: "ImportSpecifier",
																			children: [
																				{
																					type: "ModuleExportName",
																					children: [
																						{
																							type: "identifier",
																							value: "baz"
																						}
																					]
																				},
																				{
																					type: "ImportedBinding",
																					children: [
																						{
																							type: "identifier",
																							value: "qux"
																						}
																					]
																				}
																			]
																		}
																	]
																}
															]
														}
													]
												},
												{
													type: "FromClause",
													children: [
														{
															type: "ModuleSpecifier",
															children: [
																{
																	type: "string-literal",
																	value: "./foo.js"
																}
															]
														}
													]
												}
											]
										}
									]
								}
							]
						}
					]
				}
			]
		}
	);
});