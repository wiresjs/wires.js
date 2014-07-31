var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.value = Wires.Attr.extend({
		initialize : function(scope, dom, element, attr) {
			Wires.attrs.value.__super__.initialize.apply(this, arguments);
			this.element = element;
			this.scope = scope;
			this.instance = scope.instance;
			this.bindChanges();
		},
		bindChanges : function() {
			var self = this;

			var nodeName = this.element.nodeName.toLowerCase();
			var elType = $(this.element).attr('type');
			if (nodeName === 'textarea')
				elType = nodeName;
			if (nodeName === 'select')
				elType = nodeName;

			switch (elType) {
			case 'text':
			case 'email':
			case 'password':
			case 'textarea':
				this.element.addEventListener("keydown", function(evt) {
					clearInterval(self.interval);
					self.interval = setTimeout(function() {

						if (self.variables.length > 0) {
							self.ignoreNodeSetValue = true;
							self.variables[0].setValue(this.value, {
								ignore : this.element
							});
						}
					}.bind(this), 50);

				}, false);
				break;

			case 'checkbox':
				this.element.addEventListener("click", function(evt) {
					var checked = this.checked;
					self.ignoreNodeSetValue = true;
					self.variables[0].setValue(checked);
				});
				break;
			case 'select':
				$(this.element).bind('change', function(){
					var value = $(this).val();
					self.ignoreNodeSetValue = true;
					self.variables[0].setValue(value);
					console.log('changed');
					/*
					$(this).parent().children().each(function(){
						this.setAttribute('selected', false);
					});
					this.setAttribute('selected', true);
					*/
				});
				break;
			}

		},
		setValue : function(variable, newValue) {
			if (this.ignoreNodeSetValue) {
				this.ignoreNodeSetValue = false;
				return;
			}
			
			var result = this.executeStatement(variable, newValue, 'return');
			
			var elType = this.element.getAttribute('type');
			if (elType === 'checkbox') {
				this.element.checked = result;
			} else {
				this.element.value = result;
			}
		},
	},{addAttibute : false});
})();