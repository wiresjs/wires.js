var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Debug = Wires.Class.extend({
	}, {
		enabled : false, 
		// Shows errors
		showError : function(e, stringFunc)
		{
			
			if ( e && this.enabled){
				this.showStack(e, stringFunc);
			}
		},
		showStack : function(e, stringFunc)
		{
			var debugDiv = $(" <div id=\"wires-debug\" style=\"position:fixed;z-index:99999;top:0; width:100%; height:100%; background-color: rgb(0, 0, 0);  background-color: rgba(0, 0, 0, 0.6);\">\n" +
			"        <div style=\"overflow-y: auto;position:absolute;padding:10px;width:1000px; height:320px;  border:3px solid red; left:50%;margin-left: -500px; top:200px;background-color:white\">\n" +
			"            <div style=\"margin:10px;font-size:30px; color:red\">Wires.debugger</div>\n" +
			"             \n" +
			"<pre class='func'></pre>" +
			"           <pre class='stack' style=\"height:200px; \">\n" +
			"    </pre>\n" +
			
			"        </div>\n" +
			"        \n" +
			"    </div>");
			
			debugDiv.find('.stack').html(e.stack ? e.stack : e);
			// Show the compiled function
			if ( stringFunc){
				debugDiv.find('.func').html(stringFunc);
			}
			debugDiv.click(function(e){
				if ( $(e.target).attr('id') === 'wires-debug' ){
					debugDiv.remove();
				}
			});
			debugDiv.prependTo('body');
		}
	});
})();
