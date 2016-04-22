(function(isNode, domain) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

domain.module("_", function () {
	return isNode ? require("lodash") : window._;
});
var nodeAsyncLib = isNode ? require("async-watch") : undefined;
domain.module("wires.AsyncWatch", function () {
	return isNode ? nodeAsyncLib.AsyncWatch : window.AsyncWatch;
});
domain.module("AsyncTransaction", function () {
	return isNode ? nodeAsyncLib.AsyncTransaction : window.AsyncTransaction;
});
domain.module("wires.compiler.ViewCompiler", ["wires.utils.UniversalQuery"], function (UniversalQuery) {
	var ViewCompiler = function () {
		function ViewCompiler() {
			_classCallCheck(this, ViewCompiler);

			this.json = [];
		}
		/**
   * iterateChildren - a recursive function (private)
   *  Generates JSON
   * @return {type}  description
   */


		_createClass(ViewCompiler, [{
			key: "iterateChildren",
			value: function iterateChildren() {}
			/**
    * htmlString - convert raw html into a JSON
    *
    * @param  {type} html description
    * @return {type}      description
    */

		}], [{
			key: "htmlString",
			value: function htmlString(html) {
				var $ = UniversalQuery.init(html);
				var compiler = new ViewCompiler();
				var result = compiler.iterateChildren($.children);
				return result;
			}
		}]);

		return ViewCompiler;
	}();
	return ViewCompiler;
});
domain.module("wires.expressions.AngularExpressionParser", [], function () {
	// We don't want to lint angular's code...
	/* eslint-disable */
	// Angular environment stuff
	// ------------------------------
	function noop() {}
	// Simplified extend() for our use-case
	function extend(dst, obj) {
		var key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				dst[key] = obj[key];
			}
		}
		return dst;
	}
	function isDefined(value) {
		return typeof value !== 'undefined';
	}
	function valueFn(value) {
		return function () {
			return value;
		};
	}
	function $parseMinErr(module, message, arg1, arg2, arg3) {
		var args = arguments;
		message = message.replace(/{(\d)}/g, function (match) {
			return args[2 + parseInt(match[1])];
		});
		throw new SyntaxError(message);
	}
	function lowercase(string) {
		return typeof string === "string" ? string.toLowerCase() : string;
	}
	// Simplified forEach() for our use-case
	function forEach(arr, iterator) {
		arr.forEach(iterator);
	}
	// Sandboxing Angular Expressions
	// ------------------------------
	// Angular expressions are generally considered safe because these expressions only have direct
	// access to $scope and locals. However, one can obtain the ability to execute arbitrary JS code by
	// obtaining a reference to native JS functions such as the Function constructor.
	//
	// As an example, consider the following Angular expression:
	//
	//   {}.toString.constructor(alert("evil JS code"))
	//
	// We want to prevent this type of access. For the sake of performance, during the lexing phase we
	// disallow any "dotted" access to any member named "constructor".
	//
	// For reflective calls (a[b]) we check that the value of the lookup is not the Function constructor
	// while evaluating the expression, which is a stronger but more expensive test. Since reflective
	// calls are expensive anyway, this is not such a big deal compared to static dereferencing.
	//
	// This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits
	// against the expression language, but not to prevent exploits that were enabled by exposing
	// sensitive JavaScript or browser apis on Scope. Exposing such objects on a Scope is never a good
	// practice and therefore we are not even trying to protect against interaction with an object
	// explicitly exposed in this way.
	//
	// A developer could foil the name check by aliasing the Function constructor under a different
	// name on the scope.
	//
	// In general, it is not possible to access a Window object from an angular expression unless a
	// window or some DOM object that has a reference to window is published onto a Scope.
	function ensureSafeMemberName(name, fullExpression) {
		if (name === "constructor") {
			throw $parseMinErr('isecfld', 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
		}
		return name;
	}
	function ensureSafeObject(obj, fullExpression) {
		// nifty check if obj is Function that is fast and works across iframes and other contexts
		if (obj) {
			if (obj.constructor === obj) {
				throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
			} else if ( // isWindow(obj)
			obj.document && obj.location && obj.alert && obj.setInterval) {
				throw $parseMinErr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
			} else if ( // isElement(obj)
			obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find)) {
				throw $parseMinErr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
			}
		}
		return obj;
	}
	var OPERATORS = {
		/* jshint bitwise : false */
		'null': function _null() {
			return null;
		},
		'true': function _true() {
			return true;
		},
		'false': function _false() {
			return false;
		},
		undefined: noop,
		'+': function _(self, locals, a, b) {
			a = a(self, locals);
			b = b(self, locals);
			if (isDefined(a)) {
				if (isDefined(b)) {
					return a + b;
				}
				return a;
			}
			return isDefined(b) ? b : undefined;
		},
		'-': function _(self, locals, a, b) {
			a = a(self, locals);
			b = b(self, locals);
			return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
		},
		'*': function _(self, locals, a, b) {
			return a(self, locals) * b(self, locals);
		},
		'/': function _(self, locals, a, b) {
			return a(self, locals) / b(self, locals);
		},
		'%': function _(self, locals, a, b) {
			return a(self, locals) % b(self, locals);
		},
		'^': function _(self, locals, a, b) {
			return a(self, locals) ^ b(self, locals);
		},
		'=': noop,
		'===': function _(self, locals, a, b) {
			return a(self, locals) === b(self, locals);
		},
		'!==': function _(self, locals, a, b) {
			return a(self, locals) !== b(self, locals);
		},
		'==': function _(self, locals, a, b) {
			return a(self, locals) == b(self, locals);
		},
		'!=': function _(self, locals, a, b) {
			return a(self, locals) != b(self, locals);
		},
		'<': function _(self, locals, a, b) {
			return a(self, locals) < b(self, locals);
		},
		'>': function _(self, locals, a, b) {
			return a(self, locals) > b(self, locals);
		},
		'<=': function _(self, locals, a, b) {
			return a(self, locals) <= b(self, locals);
		},
		'>=': function _(self, locals, a, b) {
			return a(self, locals) >= b(self, locals);
		},
		'&&': function _(self, locals, a, b) {
			return a(self, locals) && b(self, locals);
		},
		'||': function _(self, locals, a, b) {
			return a(self, locals) || b(self, locals);
		},
		'&': function _(self, locals, a, b) {
			return a(self, locals) & b(self, locals);
		},
		//    '|':function(self, locals, a,b){return a|b;},
		'|': function _(self, locals, a, b) {
			return b(self, locals)(self, locals, a(self, locals));
		},
		'!': function _(self, locals, a) {
			return !a(self, locals);
		}
	};
	/* jshint bitwise: true */
	var ESCAPE = {
		"n": "\n",
		"f": "\f",
		"r": "\r",
		"t": "\t",
		"v": "\v",
		"'": "'",
		'"': '"'
	};
	/////////////////////////////////////////
	/**
  * @constructor
  */
	var Lexer = function Lexer(options) {
		this.options = options;
	};
	Lexer.prototype = {
		constructor: Lexer,
		lex: function lex(text) {
			this.text = text;
			this.index = 0;
			this.ch = undefined;
			this.lastCh = ':'; // can start regexp
			this.tokens = [];
			var token;
			var json = [];
			while (this.index < this.text.length) {
				this.ch = this.text.charAt(this.index);
				if (this.is('"\'')) {
					this.readString(this.ch);
				} else if (this.isNumber(this.ch) || this.is('.') && this.isNumber(this.peek())) {
					this.readNumber();
				} else if (this.isIdent(this.ch)) {
					this.readIdent();
					// identifiers can only be if the preceding char was a { or ,
					if (this.was('{,') && json[0] === '{' && (token = this.tokens[this.tokens.length - 1])) {
						token.json = token.text.indexOf('.') === -1;
					}
				} else if (this.is('(){}[].,;:?')) {
					this.tokens.push({
						index: this.index,
						text: this.ch,
						json: this.was(':[,') && this.is('{[') || this.is('}]:,')
					});
					if (this.is('{[')) json.unshift(this.ch);
					if (this.is('}]')) json.shift();
					this.index++;
				} else if (this.isWhitespace(this.ch)) {
					this.index++;
					continue;
				} else {
					var ch2 = this.ch + this.peek();
					var ch3 = ch2 + this.peek(2);
					var fn = OPERATORS[this.ch];
					var fn2 = OPERATORS[ch2];
					var fn3 = OPERATORS[ch3];
					if (fn3) {
						this.tokens.push({
							index: this.index,
							text: ch3,
							fn: fn3
						});
						this.index += 3;
					} else if (fn2) {
						this.tokens.push({
							index: this.index,
							text: ch2,
							fn: fn2
						});
						this.index += 2;
					} else if (fn) {
						this.tokens.push({
							index: this.index,
							text: this.ch,
							fn: fn,
							json: this.was('[,:') && this.is('+-')
						});
						this.index += 1;
					} else {
						this.throwError('Unexpected next character ', this.index, this.index + 1);
					}
				}
				this.lastCh = this.ch;
			}
			return this.tokens;
		},
		is: function is(chars) {
			return chars.indexOf(this.ch) !== -1;
		},
		was: function was(chars) {
			return chars.indexOf(this.lastCh) !== -1;
		},
		peek: function peek(i) {
			var num = i || 1;
			return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
		},
		isNumber: function isNumber(ch) {
			return '0' <= ch && ch <= '9';
		},
		isWhitespace: function isWhitespace(ch) {
			// IE treats non-breaking space as \u00A0
			return ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\v' || ch === " ";
		},
		isIdent: function isIdent(ch) {
			return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '_' === ch || ch === '$';
		},
		isExpOperator: function isExpOperator(ch) {
			return ch === '-' || ch === '+' || this.isNumber(ch);
		},
		throwError: function throwError(error, start, end) {
			end = end || this.index;
			var colStr = isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end;
			throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', error, colStr, this.text);
		},
		readNumber: function readNumber() {
			var number = '';
			var start = this.index;
			while (this.index < this.text.length) {
				var ch = lowercase(this.text.charAt(this.index));
				if (ch == '.' || this.isNumber(ch)) {
					number += ch;
				} else {
					var peekCh = this.peek();
					if (ch == 'e' && this.isExpOperator(peekCh)) {
						number += ch;
					} else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == 'e') {
						number += ch;
					} else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == 'e') {
						this.throwError('Invalid exponent');
					} else {
						break;
					}
				}
				this.index++;
			}
			number = 1 * number;
			this.tokens.push({
				index: start,
				text: number,
				json: true,
				fn: function fn() {
					return number;
				}
			});
		},
		readIdent: function readIdent() {
			var parser = this;
			var ident = '';
			var start = this.index;
			var lastDot, peekIndex, methodName, ch;
			while (this.index < this.text.length) {
				ch = this.text.charAt(this.index);
				if (ch === '.' || this.isIdent(ch) || this.isNumber(ch)) {
					if (ch === '.') lastDot = this.index;
					ident += ch;
				} else {
					break;
				}
				this.index++;
			}
			//check if this is not a method invocation and if it is back out to last dot
			if (lastDot) {
				peekIndex = this.index;
				while (peekIndex < this.text.length) {
					ch = this.text.charAt(peekIndex);
					if (ch === '(') {
						methodName = ident.substr(lastDot - start + 1);
						ident = ident.substr(0, lastDot - start);
						this.index = peekIndex;
						break;
					}
					if (this.isWhitespace(ch)) {
						peekIndex++;
					} else {
						break;
					}
				}
			}
			var token = {
				index: start,
				text: ident
			};
			// OPERATORS is our own object so we don't need to use special hasOwnPropertyFn
			if (OPERATORS.hasOwnProperty(ident)) {
				token.fn = OPERATORS[ident];
				token.json = OPERATORS[ident];
			} else {
				var getter = getterFn(ident, this.options, this.text);
				token.fn = extend(function (self, locals) {
					return getter(self, locals);
				}, {
					assign: function assign(self, value) {
						return setter(self, ident, value, parser.text, parser.options);
					}
				});
			}
			this.tokens.push(token);
			if (methodName) {
				this.tokens.push({
					index: lastDot,
					text: '.',
					json: false
				});
				this.tokens.push({
					index: lastDot + 1,
					text: methodName,
					json: false
				});
			}
		},
		readString: function readString(quote) {
			var start = this.index;
			this.index++;
			var string = '';
			var rawString = quote;
			var escape = false;
			while (this.index < this.text.length) {
				var ch = this.text.charAt(this.index);
				rawString += ch;
				if (escape) {
					if (ch === 'u') {
						var hex = this.text.substring(this.index + 1, this.index + 5);
						if (!hex.match(/[\da-f]{4}/i)) this.throwError("Invalid unicode escape [\\u" + hex + ']');
						this.index += 4;
						string += String.fromCharCode(parseInt(hex, 16));
					} else {
						var rep = ESCAPE[ch];
						if (rep) {
							string += rep;
						} else {
							string += ch;
						}
					}
					escape = false;
				} else if (ch === '\\') {
					escape = true;
				} else if (ch === quote) {
					this.index++;
					this.tokens.push({
						index: start,
						text: rawString,
						string: string,
						json: true,
						fn: function fn() {
							return string;
						}
					});
					return;
				} else {
					string += ch;
				}
				this.index++;
			}
			this.throwError('Unterminated quote', start);
		}
	};
	/**
  * @constructor
  */
	var Parser = function Parser(lexer, $filter, options) {
		this.lexer = lexer;
		this.$filter = $filter;
		this.options = options;
	};
	Parser.ZERO = function () {
		return 0;
	};
	Parser.prototype = {
		constructor: Parser,
		parse: function parse(text) {
			this.text = text;
			this.tokens = this.lexer.lex(text);
			var value = this.statements();
			if (this.tokens.length !== 0) {
				this.throwError('is an unexpected token', this.tokens[0]);
			}
			value.literal = !!value.literal;
			value.constant = !!value.constant;
			return value;
		},
		tokenize: function tokenize(text) {
			this.text = text;
			//2
			this.tokens = this.lexer.lex(text);
			return this.tokens;
		},
		primary: function primary() {
			var primary;
			if (this.expect('(')) {
				primary = this.filterChain();
				this.consume(')');
			} else if (this.expect('[')) {
				primary = this.arrayDeclaration();
			} else if (this.expect('{')) {
				primary = this.object();
			} else {
				var token = this.expect();
				primary = token.fn;
				if (!primary) {
					this.throwError('not a primary expression', token);
				}
				if (token.json) {
					primary.constant = true;
					primary.literal = true;
				}
			}
			var next, context;
			while (next = this.expect('(', '[', '.')) {
				if (next.text === '(') {
					primary = this.functionCall(primary, context);
					context = null;
				} else if (next.text === '[') {
					context = primary;
					primary = this.objectIndex(primary);
				} else if (next.text === '.') {
					context = primary;
					primary = this.fieldAccess(primary);
				} else {
					this.throwError('IMPOSSIBLE');
				}
			}
			return primary;
		},
		throwError: function throwError(msg, token) {
			throw $parseMinErr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
		},
		peekToken: function peekToken() {
			if (this.tokens.length === 0) throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
			return this.tokens[0];
		},
		peek: function peek(e1, e2, e3, e4) {
			if (this.tokens.length > 0) {
				var token = this.tokens[0];
				var t = token.text;
				if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
					return token;
				}
			}
			return false;
		},
		expect: function expect(e1, e2, e3, e4) {
			var token = this.peek(e1, e2, e3, e4);
			if (token) {
				this.tokens.shift();
				return token;
			}
			return false;
		},
		consume: function consume(e1) {
			if (!this.expect(e1)) {
				this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
			}
		},
		unaryFn: function unaryFn(fn, right) {
			return extend(function (self, locals) {
				return fn(self, locals, right);
			}, {
				constant: right.constant
			});
		},
		ternaryFn: function ternaryFn(left, middle, right) {
			return extend(function (self, locals) {
				return left(self, locals) ? middle(self, locals) : right(self, locals);
			}, {
				constant: left.constant && middle.constant && right.constant
			});
		},
		binaryFn: function binaryFn(left, fn, right) {
			return extend(function (self, locals) {
				return fn(self, locals, left, right);
			}, {
				constant: left.constant && right.constant
			});
		},
		statements: function statements() {
			var statements = [];
			while (true) {
				if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']')) statements.push(this.filterChain());
				if (!this.expect(';')) {
					// optimize for the common case where there is only one statement.
					// TODO(size): maybe we should not support multiple statements?
					return statements.length === 1 ? statements[0] : function (self, locals) {
						var value;
						for (var i = 0; i < statements.length; i++) {
							var statement = statements[i];
							if (statement) {
								value = statement(self, locals);
							}
						}
						return value;
					};
				}
			}
		},
		filterChain: function filterChain() {
			var left = this.expression();
			var token;
			while (true) {
				if (token = this.expect('|')) {
					left = this.binaryFn(left, token.fn, this.filter());
				} else {
					return left;
				}
			}
		},
		filter: function filter() {
			var token = this.expect();
			var fn = this.$filter(token.text);
			var argsFn = [];
			while (true) {
				if (token = this.expect(':')) {
					argsFn.push(this.expression());
				} else {
					var fnInvoke = function fnInvoke(self, locals, input) {
						var args = [input];
						for (var i = 0; i < argsFn.length; i++) {
							args.push(argsFn[i](self, locals));
						}
						return fn.apply(self, args);
					};
					return function () {
						return fnInvoke;
					};
				}
			}
		},
		expression: function expression() {
			return this.assignment();
		},
		assignment: function assignment() {
			var left = this.ternary();
			var right;
			var token;
			if (token = this.expect('=')) {
				if (!left.assign) {
					this.throwError('implies assignment but [' + this.text.substring(0, token.index) + '] can not be assigned to', token);
				}
				right = this.ternary();
				return function (scope, locals) {
					return left.assign(scope, right(scope, locals), locals);
				};
			}
			return left;
		},
		ternary: function ternary() {
			var left = this.logicalOR();
			var middle;
			var token;
			if (token = this.expect('?')) {
				middle = this.ternary();
				if (token = this.expect(':')) {
					return this.ternaryFn(left, middle, this.ternary());
				} else {
					this.throwError('expected :', token);
				}
			} else {
				return left;
			}
		},
		logicalOR: function logicalOR() {
			var left = this.logicalAND();
			var token;
			while (true) {
				if (token = this.expect('||')) {
					left = this.binaryFn(left, token.fn, this.logicalAND());
				} else {
					return left;
				}
			}
		},
		logicalAND: function logicalAND() {
			var left = this.equality();
			var token;
			if (token = this.expect('&&')) {
				left = this.binaryFn(left, token.fn, this.logicalAND());
			}
			return left;
		},
		equality: function equality() {
			var left = this.relational();
			var token;
			if (token = this.expect('==', '!=', '===', '!==')) {
				left = this.binaryFn(left, token.fn, this.equality());
			}
			return left;
		},
		relational: function relational() {
			var left = this.additive();
			var token;
			if (token = this.expect('<', '>', '<=', '>=')) {
				left = this.binaryFn(left, token.fn, this.relational());
			}
			return left;
		},
		additive: function additive() {
			var left = this.multiplicative();
			var token;
			while (token = this.expect('+', '-')) {
				left = this.binaryFn(left, token.fn, this.multiplicative());
			}
			return left;
		},
		multiplicative: function multiplicative() {
			var left = this.unary();
			var token;
			while (token = this.expect('*', '/', '%')) {
				left = this.binaryFn(left, token.fn, this.unary());
			}
			return left;
		},
		unary: function unary() {
			var token;
			if (this.expect('+')) {
				return this.primary();
			} else if (token = this.expect('-')) {
				return this.binaryFn(Parser.ZERO, token.fn, this.unary());
			} else if (token = this.expect('!')) {
				return this.unaryFn(token.fn, this.unary());
			} else {
				return this.primary();
			}
		},
		fieldAccess: function fieldAccess(object) {
			var parser = this;
			var field = this.expect().text;
			var getter = getterFn(field, this.options, this.text);
			return extend(function (scope, locals, self) {
				return getter(self || object(scope, locals));
			}, {
				assign: function assign(scope, value, locals) {
					var o = object(scope, locals);
					if (!o) object.assign(scope, o = {}, locals);
					return setter(o, field, value, parser.text, parser.options);
				}
			});
		},
		objectIndex: function objectIndex(obj) {
			var parser = this;
			var indexFn = this.expression();
			this.consume(']');
			return extend(function (self, locals) {
				var o = obj(self, locals),
				    i = indexFn(self, locals),
				    v,
				    p;
				if (!o) return undefined;
				v = ensureSafeObject(o[i], parser.text);
				return v;
			}, {
				assign: function assign(self, value, locals) {
					var key = indexFn(self, locals);
					// prevent overwriting of Function.constructor which would break ensureSafeObject check
					var o = ensureSafeObject(obj(self, locals), parser.text);
					if (!o) obj.assign(self, o = [], locals);
					return o[key] = value;
				}
			});
		},
		functionCall: function functionCall(fn, contextGetter) {
			var argsFn = [];
			if (this.peekToken().text !== ')') {
				do {
					argsFn.push(this.expression());
				} while (this.expect(','));
			}
			this.consume(')');
			var parser = this;
			return function (scope, locals) {
				var args = [];
				var context = contextGetter ? contextGetter(scope, locals) : scope;
				for (var i = 0; i < argsFn.length; i++) {
					args.push(argsFn[i](scope, locals));
				}
				var fnPtr = fn(scope, locals, context) || noop;
				ensureSafeObject(context, parser.text);
				ensureSafeObject(fnPtr, parser.text);
				// IE stupidity! (IE doesn't have apply for some native functions)
				var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);
				return ensureSafeObject(v, parser.text);
			};
		},
		// This is used with json array declaration
		arrayDeclaration: function arrayDeclaration() {
			var elementFns = [];
			var allConstant = true;
			if (this.peekToken().text !== ']') {
				do {
					if (this.peek(']')) {
						// Support trailing commas per ES5.1.
						break;
					}
					var elementFn = this.expression();
					elementFns.push(elementFn);
					if (!elementFn.constant) {
						allConstant = false;
					}
				} while (this.expect(','));
			}
			this.consume(']');
			return extend(function (self, locals) {
				var array = [];
				for (var i = 0; i < elementFns.length; i++) {
					array.push(elementFns[i](self, locals));
				}
				return array;
			}, {
				literal: true,
				constant: allConstant
			});
		},
		object: function object() {
			var keyValues = [];
			var allConstant = true;
			if (this.peekToken().text !== '}') {
				do {
					if (this.peek('}')) {
						// Support trailing commas per ES5.1.
						break;
					}
					var token = this.expect(),
					    key = token.string || token.text;
					this.consume(':');
					var value = this.expression();
					keyValues.push({
						key: key,
						value: value
					});
					if (!value.constant) {
						allConstant = false;
					}
				} while (this.expect(','));
			}
			this.consume('}');
			return extend(function (self, locals) {
				var object = {};
				for (var i = 0; i < keyValues.length; i++) {
					var keyValue = keyValues[i];
					object[keyValue.key] = keyValue.value(self, locals);
				}
				return object;
			}, {
				literal: true,
				constant: allConstant
			});
		}
	};
	//////////////////////////////////////////////////
	// Parser helper functions
	//////////////////////////////////////////////////
	function setter(obj, path, setValue, fullExp) {
		var element = path.split('.'),
		    key;
		for (var i = 0; element.length > 1; i++) {
			key = ensureSafeMemberName(element.shift(), fullExp);
			var propertyObj = obj[key];
			if (!propertyObj) {
				propertyObj = {};
				obj[key] = propertyObj;
			}
			obj = propertyObj;
		}
		key = ensureSafeMemberName(element.shift(), fullExp);
		obj[key] = setValue;
		return setValue;
	}
	var getterFnCache = {};
	/**
  * Implementation of the "Black Hole" variant from:
  * - http://jsperf.com/angularjs-parse-getter/4
  * - http://jsperf.com/path-evaluation-simplified/7
  */
	function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp) {
		ensureSafeMemberName(key0, fullExp);
		ensureSafeMemberName(key1, fullExp);
		ensureSafeMemberName(key2, fullExp);
		ensureSafeMemberName(key3, fullExp);
		ensureSafeMemberName(key4, fullExp);
		return function cspSafeGetter(scope, locals) {
			var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
			if (pathVal == null) return pathVal;
			pathVal = pathVal[key0];
			if (!key1) return pathVal;
			if (pathVal == null) return undefined;
			pathVal = pathVal[key1];
			if (!key2) return pathVal;
			if (pathVal == null) return undefined;
			pathVal = pathVal[key2];
			if (!key3) return pathVal;
			if (pathVal == null) return undefined;
			pathVal = pathVal[key3];
			if (!key4) return pathVal;
			if (pathVal == null) return undefined;
			pathVal = pathVal[key4];
			return pathVal;
		};
	}
	function simpleGetterFn1(key0, fullExp) {
		ensureSafeMemberName(key0, fullExp);
		return function simpleGetterFn1(scope, locals) {
			if (scope == null) return undefined;
			return (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
		};
	}
	function simpleGetterFn2(key0, key1, fullExp) {
		ensureSafeMemberName(key0, fullExp);
		ensureSafeMemberName(key1, fullExp);
		return function simpleGetterFn2(scope, locals) {
			if (scope == null) return undefined;
			scope = (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
			return scope == null ? undefined : scope[key1];
		};
	}
	function getterFn(path, options, fullExp) {
		// Check whether the cache has this getter already.
		// We can use hasOwnProperty directly on the cache because we ensure,
		// see below, that the cache never stores a path called 'hasOwnProperty'
		if (getterFnCache.hasOwnProperty(path)) {
			return getterFnCache[path];
		}
		var pathKeys = path.split('.'),
		    pathKeysLength = pathKeys.length,
		    fn;
		// When we have only 1 or 2 tokens, use optimized special case closures.
		// http://jsperf.com/angularjs-parse-getter/6
		if (pathKeysLength === 1) {
			fn = simpleGetterFn1(pathKeys[0], fullExp);
		} else if (pathKeysLength === 2) {
			fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
		} else if (options.csp) {
			if (pathKeysLength < 6) {
				fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options);
			} else {
				fn = function fn(scope, locals) {
					var i = 0,
					    val;
					do {
						val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);
						locals = undefined; // clear after first iteration
						scope = val;
					} while (i < pathKeysLength);
					return val;
				};
			}
		} else {
			var code = 'var p;\n';
			forEach(pathKeys, function (key, index) {
				ensureSafeMemberName(key, fullExp);
				code += 'if(s == null) return undefined;\n' + 's=' + (index
				// we simply dereference 's' on any .dot notation
				? 's'
				// but if we are first then we check locals first, and if so read it first
				: '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n';
			});
			code += 'return s;';
			/* jshint -W054 */
			var evaledFnGetter = new Function('s', 'k', 'pw', code); // s=scope, k=locals, pw=promiseWarning
			/* jshint +W054 */
			evaledFnGetter.toString = valueFn(code);
			fn = evaledFnGetter;
		}
		// Only cache the value if it's not going to mess up the cache object
		// This is more performant that using Object.prototype.hasOwnProperty.call
		if (path !== 'hasOwnProperty') {
			getterFnCache[path] = fn;
		}
		return fn;
	}
	return {
		Lexer: Lexer,
		Parser: Parser
	};
});
domain.module("wires.expressions.AngularExpressions", ["wires.expressions.AngularExpressionParser"], function (AngularExpressionParser) {
	var parse = AngularExpressionParser;
	var filters = {};
	var Lexer = parse.Lexer;
	var Parser = parse.Parser;
	var lexer = new Lexer({});
	var parser = new Parser(lexer, function getFilter(name) {
		return filters[name];
	});
	/**
  * Compiles src and returns a function that executes src on a target object.
  * The compiled function is cached under compile.cache[src] to speed up further calls.
  *
  * @param {string} src
  * @returns {function}
  */
	function compile(src) {
		var cached;
		if (typeof src !== "string") {
			throw new TypeError("src must be a string, instead saw '" + (typeof src === "undefined" ? "undefined" : _typeof(src)) + "'");
		}
		if (!compile.cache) {
			return parser.parse(src);
		}
		cached = compile.cache[src];
		if (!cached) {
			cached = compile.cache[src] = parser.parse(src);
		}
		return cached;
	}
	function extract(src) {
		if (typeof src !== "string") {
			throw new TypeError("src must be a string, instead saw '" + (typeof src === "undefined" ? "undefined" : _typeof(src)) + "'");
		}
		var tokens = parser.tokenize(src);
		var variables = {};
		var nested = false;
		var latest;
		for (var i in tokens) {
			var item = tokens[i];
			if (item.text.match(/[a-z0-9\.$]+/i)) {
				if (nested) {
					if (latest) {
						if (item.string) {
							latest.str = item.string;
						} else {
							latest.nested = {};
							latest.nested[item.text] = {};
							latest = latest.nested[item.text];
						}
						nested = false;
					}
				} else {
					latest = variables[item.text] = {};
				}
			}
			if (item.text === "[") {
				nested = true;
			}
		}
		return variables;
	}
	/**
  * A cache containing all compiled functions. The src is used as key.
  * Set this on false to disable the cache.
  *
  * @type {object}
  */
	compile.cache = {};
	return {
		Lexer: Lexer,
		Parser: Parser,
		extract: extract,
		compile: compile,
		filters: filters
	};
});
domain.module("wires.expressions.StringInterpolation", ["_", "wires.expressions.AngularExpressions", "wires.expressions.WatchBatch", "wires.utils.DotNotation"], function (_, AngularExpressions, WatchBatch, DotNotation) {
	var StringInterpolation = {
		/** 
   * compile - Compile a string
   * var model = parser.compile('Hello {{name}}');
   * model({ name : "John" }, function(str){
   *
   * })
   *
   * @param  {type} lines string or a list of compiled statements
   * @return {type}       callback when changes are made
   */
		compile: function compile(lines) {
			if (!_.isArray(lines)) {
				lines = this.parse(lines);
			}
			return function () {
				var $scope = _typeof(arguments[0]) === "object" ? arguments[0] : {};
				var $locals = !_.isFunction(arguments[1]) && _.isObject(arguments[1]) ? arguments[1] : {};
				var cb = _.isFunction(arguments[1]) ? arguments[1] : _.isFunction(arguments[2]) ? arguments[2] : undefined;
				var trigged = false;
				var changed = function changed(changes) {
					var strings = _.map(lines, function (item) {
						return item.e ? AngularExpressions.compile(item.e)($scope, $locals) : item;
					});
					cb ? cb(strings.join('')) : undefined;
				};
				var watchable = _.chain(lines).map(function (item) {
					return item.v || false;
				}).compact().value();
				return WatchBatch({
					locals: $locals,
					scope: $scope,
					batch: watchable
				}, changed);
			};
		},
		/**
   * parse - Parsing input string
   * Extrating expressions and regular string
   * "Hello {{user.name}}" will give an array
   * ['Hello', {e : 'user.name', v {}}]
   *       e - raw expression
   *       v - extracted variable names (for watchers)
   * @param  {type} str user string
   * @return {type}     Array
   */
		parse: function parse(str) {
			if (!_.isString(str)) {
				return [];
			}
			var re = /({{\s*[^}]+\s*}})/g;
			var list = str.split(re).map(function (x) {
				var expr;
				if (expr = x.match(/{{\s*([^}]+)\s*}}/)) {
					var expressionString = expr[1].trim();
					return {
						e: expressionString,
						v: AngularExpressions.extract(expressionString)
					};
				}
				return x;
			});
			return _.filter(list, function (x) {
				return x ? x : undefined;
			});
		}
	};
	return StringInterpolation;
});
domain.module("wires.expressions.WatchBatch", ["_", "wires.AsyncWatch", "wires.utils.DotNotation"], function (_, AsyncWatch, DotNotation) {
	return function (opts, cb) {
		opts = opts || {};
		var $locals = opts.locals || {};
		var $scope = opts.scope || {};
		var batch = opts.batch || [];
		var paths = [];
		_.each(batch, function (item) {
			var key = _.keys(item)[0];
			var prop = item[key];
			paths.push(key);
		});
		var a = false;
		var anyValueChanged = function anyValueChanged(value) {};
		var watchers = [];
		// collecting watchers
		_.each(paths, function (path) {
			if (DotNotation.hasProperty($locals, path)) {
				watchers.push(AsyncWatch($locals, path, anyValueChanged));
			} else {
				watchers.push(AsyncWatch($scope, path, anyValueChanged));
			}
		});
		return AsyncWatch.subscribe(watchers, cb);
	};
});
domain.module("Directive", ["_"], function (_) {
	var Directive = function () {
		_createClass(Directive, null, [{
			key: "type",
			get: function get() {
				return "attribute";
			}
		}]);

		function Directive() {
			_classCallCheck(this, Directive);
		}

		return Directive;
	}();
	return function (_Directive) {
		_inherits(SuperTest, _Directive);

		function SuperTest() {
			_classCallCheck(this, SuperTest);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(SuperTest).apply(this, arguments));
		}

		_createClass(SuperTest, null, [{
			key: "type",
			get: function get() {
				return "pukka";
			}
		}]);

		return SuperTest;
	}(Directive);
});
domain.module("wires.utils.DotNotation", ["wires.AsyncWatch"], function (AsyncWatch) {
	var DotNotation = {
		nextTick: function nextTick(cb) {
			return isNode ? process.nextTick(cb) : window.requestAnimationFrame(cb);
		},
		dotNotation: function dotNotation(path) {
			if (path instanceof Array) {
				return {
					path: path,
					str: path.join('.')
				};
			}
			if (typeof path !== 'string') {
				return;
			}
			return {
				path: path.split('\.'),
				str: path
			};
		},
		hasProperty: function hasProperty(obj, path) {
			if (path.length === 0 || obj === undefined) {
				return false;
			}
			var notation = this.dotNotation(path);
			if (!notation) {
				return false;
			}
			path = notation.path;
			var validNext = true;
			for (var i = 0; i < path.length; i++) {
				if (validNext && obj.hasOwnProperty(path[i])) {
					obj = obj[path[i]];
					if (obj === undefined) {
						validNext = false;
					}
				} else {
					return false;
				}
			}
			return true;
		},
		getPropertyValue: function getPropertyValue(obj, path) {
			if (path.length === 0 || obj === undefined) {
				return undefined;
			}
			var notation = this.dotNotation(path);
			if (!notation) {
				return;
			}
			path = notation.path;
			for (var i = 0; i < path.length; i++) {
				obj = obj[path[i]];
				if (obj === undefined) {
					return undefined;
				}
			}
			return obj;
		}
	};
	return DotNotation;
});
domain.module("wires.utils.UniversalQuery", [], function () {
	/**
  * Universal "jQuery"
  * For backend we use cheerio
  * For Browser jQuery to Zepto
  */
	return function () {
		function _class() {
			_classCallCheck(this, _class);
		}

		_createClass(_class, null, [{
			key: "init",
			value: function init(html) {
				html = "<div>" + html + "</div>";
				if (isNode) {
					var cheerio = require("cheerio");
					var $ = cheerio.load(html);
					return $("div").first();
				}
				if (!window.$) {
					console.error("jQuery or Zepto is required!");
				}
				return $(html).find("div").first();
			}
		}]);

		return _class;
	}();
});
})(typeof exports !== 'undefined', typeof exports !== 'undefined' ? require('wires-domain') : window.domain)