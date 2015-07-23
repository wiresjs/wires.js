var app = app || {};
domain.service("components.my-component", function(){
	return ['/app/views/test-component.html', function(args){

		this.someItem = args.someItem;
	}]
})



domain.service("components.vittu-sataana", function(){
	return ['/app/views/saatana.html', function(args){

		this.dict = args.someShit;

	}]
})
