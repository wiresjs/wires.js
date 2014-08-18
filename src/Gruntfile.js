module.exports = function(grunt) {

	var targetFiles = [ 
	    
	    './lib/htmlparser.js',
	    './src/wires-config.js',
	    './src/wires-events.js',
	    './src/wires-extend.js',
	    './src/wires-form.js',
	    './src/wires-object-utils.js',
	    
	    './src/acts/main.js',
	    './src/acts/toggle.js',
	    
	    './src/wires-node.js',
	    './src/wires-attr.js',
	    './src/wires-text-node.js',
	    './src/wires-tag-node.js',
	    './src/wires-compiler.js',
	    './src/wires-exec.js',
	    './src/wires-variable.js',
	    './src/wires-watcher.js',
	    './src/wires-base-attr.js',
	    './src/wires-variable-tricks.js',
	    
	    
	    './src/attributes/ws-if.js',
	    './src/attributes/ws-visible.js',
	    './src/attributes/ws-repeat.js',
	    './src/attributes/ws-value.js',
	    './src/attributes/ws-click.js',
	    './src/attributes/ws-animation.js',
	    './src/attributes/ws-submit.js',
	    './src/attributes/ws-selected.js',
	    './src/attributes/ws-class.js',
	    './src/attributes/ws-sortable.js',
	    
	    './src/wires-component.js',
	    
	    './src/mvc/wires-mvc.js',
	    './src/mvc/wires-collection.js',
	    './src/mvc/wires-model.js',
	    
	    './src/wires-dom.js',
	    './src/wires-controller.js',
	    './src/wires-connect.js'
	];

	grunt.initConfig({
		uglify : {
			my_target : {
				files : {
					'../build/wires.min.js' : targetFiles
				}
			}
		},

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.task.run('uglify');
	
	grunt.registerTask('default', ['uglify']);


};