import { assertEquals } from "https://deno.land/std@0.207.0/assert/mod.ts";
import { javascriptParser } from "../impl/javascript-parser.js";


Deno.test.ignore("javascriptParser can parse math expressions", () => {
	const ast = javascriptParser.parse(`1 + 2`);
	assertEquals(ast, {
		type: "AdditionExpression",
		children: [{
			type: "MultiplicativeExpression",
			children: [{
				type: "ExponentiationExpression",
				children: [{
					type: "UnaryExpression",
					children: [{
						type: "UpdateExpression",
						children: [{
							type: "LeftHandSideExpression",
							children: [{
								type: "NewExpression",
								children: [{
									type: "MemberExpression",
									children: [{
										type: "PrimaryExpression",
										children: [{
											type: "Literal",
											children: [{
												type: "NumericLiteral",
												children: [{
													type: "number-literal",
													value: 1
												}]
											}]
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		},
		{
			type: "MultiplicativeExpression",
			children: [{
				type: "ExponentiationExpression",
				children: [{
					type: "UnaryExpression",
					children: [{
						type: "UpdateExpression",
						children: [{
							type: "LeftHandSideExpression",
							children: [{
								type: "NewExpression",
								children: [{
									type: "MemberExpression",
									children: [{
										type: "PrimaryExpression",
										children: [{
											type: "Literal",
											children: [{
												type: "NumericLiteral",
												children: [{
													type: "number-literal",
													value: 2
												}]
											}]
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		}]
	});
});