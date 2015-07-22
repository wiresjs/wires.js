var app = app || {};
domain.service("components.my-component", function(){
	return ['/app/views/test-component.html', function(args){
		
		this.someItem = args.someItem;
	}]
})
