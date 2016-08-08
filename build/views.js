(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("wires.schema.test", function(){
	return {
	  "index.html":[[0,0,"div",[["class",["base"]]],[[0,0,"h1",[],[[1,["Hello World"]]]],[0,0,"div",[],[[1,["\n      my name is ",{"e":"name","v":{"name":{}}},"\n   "]]]],[0,0,"hr",[],[]],[0,0,"div",[],[[0,0,"div",[],[[0,0,"a",[["ws-link","/user","wires.directives.WsLink"]],[[1,["user"]]]]]],[0,0,"div",[],[[0,0,"a",[["ws-link","/user/one","wires.directives.WsLink"]],[[1,["jump to user one"]]]]]],[0,0,"div",[],[[0,0,"a",[["ws-link","/profile","wires.directives.WsLink"]],[[1,["profile"]]]]]]]],[0,0,"input",[["type",["text"]],["ng-model","name","wires.directives.Model"]],[]],[0,0,"div",[["ws-route","i","wires.directives.WsRoute"],["style",["border:1px solid red;padding:10px"]]],[]]]]],
	  "profile.html":[[0,0,"h1",[],[[1,["Some profile data here"]]]]],
	  "user.html":[[0,0,"div",[],[[1,["\n   i am user ",{"e":"name","v":{"name":{}}},"\n\n   "]],[0,0,"table",[["width",["100%"]]],[[0,0,"tr",[],[[0,0,"td",[["width",["100"]]],[[0,0,"div",[],[[0,0,"a",[["ws-link","/user/one","wires.directives.WsLink"]],[[1,["one"]]]]]],[0,0,"div",[],[[0,0,"a",[["ws-link","/user/two","wires.directives.WsLink"]],[[1,["two"]]]]]]]],[0,0,"td",[["ws-route","","wires.directives.WsRoute"]],[[1,["\n               sub routes are here\n         "]]]]]]]]]]],
	  "user/one.html":[[0,0,"h2",[],[[1,["ONE"]]]]],
	  "user/two.html":[[0,0,"h2",[],[[1,["TWO"]]]]]
	}
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());