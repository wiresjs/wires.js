(function(isNode, realm) {
realm.module("wires.schema.test", function(){
	return {
	  "hello.html":[[1,["MUKKA\n"]],[0,0,"section",[],[[1,["\nHello.html\n"]]]]],
	  "tests/watchers/index.html":[[0,0,"div",[["id",["a"]]],[[1,[{"e":"user.name","v":{"user.name":{}}}]]]],[0,0,"div",[["id",["b"]]],[[1,["Hello ",{"e":"user.name","v":{"user.name":{}}}," ",{"e":"user.age","v":{"user.age":{}}}]]]]],
	  "tests/show/index.html":[[0,0,"div",[["id",["a"]],["ng-show","index > 5","wires.directives.Show"]],[]]],
	  "tests/include/include.html":[[0,0,"div",[],[[0,0,"div",[["id",["a"]],["ng-include","tests/include/partial.html","wires.directives.IncludeView"]],[]]]],[0,0,"div",[],[[2,"wires.directives.IncludeView","ng-include",[["id",["b"]],["src",["tests/include/partial.html"]]],[]]]],[0,0,"div",[],[[2,"wires.directives.IncludeView","ng-include",[["id",["c"]],["ng-if","hello === 1","wires.directives.Conditional"],["src",["tests/include/partial.html"]]],[]]]],[0,0,"div",[],[[2,"wires.directives.IncludeView","ng-include",[["id",["d"]],["ng-if","hello === 0","wires.directives.Conditional"],["src",["tests/include/partial.html"]]],[]]]]],
	  "tests/include/partial.html":[[0,0,"h1",[],[[1,["Hello World"]]]]],
	  "tests/include/partial2.html":[[0,0,"div",[],[[1,["\n   Hello from partial2.html\n"]]]],[0,0,"section",[["ng-transclude","1","wires.directives.Transclude"]],[]]],
	  "tests/directives/index.html":[[0,0,"div",[],[[2,"wires.directives.MyDirective","my-directive",[["id",["a"]]],[]]]],[0,0,"div",[],[[2,"wires.directives.MyDirective","my-directive",[["id",["b"]]],[[0,0,"h1",[],[[1,["transcluded element"]]]]]]]],[0,0,"div",[],[[2,"wires.directives.MyDirective","my-directive",[["ng-if","hello === 0","wires.directives.Conditional"],["id",["c"]]],[[0,0,"h1",[],[[1,["transcluded element"]]]]]]]]],
	  "tests/conditions/index.html":[[0,0,"div",[],[[0,0,"h1",[["id",["c"]],["ng-if","user.age > 50","wires.directives.Conditional"]],[[1,[{"e":"user.name","v":{"user.name":{}}}," is ",{"e":"user.age","v":{"user.age":{}}}]]]],[0,0,"h1",[],[[1,["Hello with name ",{"e":"user.name","v":{"user.name":{}}}]]]]]]],
	  "tests/attributes/index.html":[[0,0,"div",[["id",["a"]],["ng-show","1==1","wires.directives.Show"],["style",["color:red"]]],[[0,0,"div",[["id",["b"]],["ng-if","index >= 1","wires.directives.Conditional"],["style",["color:blue"]]],[[0,0,"div",[["id",["c"]],["style",["left:",{"e":"index","v":{"index":{}}},"px"]]],[]]]]]]],
	  "other/my-directive.html":[[0,0,"div",[],[[0,0,"span",[],[[1,["Hello from directive"]]]],[0,0,"div",[["ng-transclude","","wires.directives.Transclude"]],[]]]]],
	  "other/pukka.html":[[1,["Pukka!\n"]],[0,0,"h3",[],[[1,["I am pukka"]]]],[0,0,"div",[["style",["margin-left:50px;"]],["ng-include","other/sukka.html","wires.directives.IncludeView"]],[]]],
	  "other/sukka.html":[[0,0,"h1",[],[[1,["Hello Sukka"]]]]]
	}
});
})(typeof exports !== 'undefined', typeof exports !== 'undefined' ? require('realm-js') : window.realm)