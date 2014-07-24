var Wires = Wires || {};
(function() {
	'use strict';
	Wires.TagNode = Wires.Node.extend({
		initialize : function(scope, dom, target, options) {
			var self = this;
			this.dom = dom;
			this.scope = scope;
			
			this.instance = scope.instance;
			this.attributes = [];
			this.element = this.getElement();
			
			// We continue parsing in case of attibute does not do it manualluy
			
			// In case if this element needs to be inserted before node
			// Here we ignore options
			if ( options && options.insertBefore){
				$(this.element).insertBefore(options.insertBefore);
				Wires.World.parse(scope, dom.children, this.element);
				
			} else {
				// In any other case, regular routine
				if (dom.children && !this.attributeClamsChildren) {
					Wires.World.parse(scope, dom.children, this.element);
				}
					
				if ( this.shouldAppendElement ){
					target.appendChild(this.element);
				} else {
					this.placeholder = document.createComment('');
					target.appendChild(this.placeholder);
				}
			}
			_.each(this.attributes, function(attribute){
				if ( attribute.onElementReady)
					attribute.onElementReady(self);
			});
		},
		bindAttribute : function(attr, element) {
			new Wires.Attr(this.scope, this.dom, element, attr);
		},
		getElement : function() {
			var element = document.createElement(this.dom.name);
			var self = this;
			this.shouldAppendElement = true;
			var customAttributes = [];
			// Adding and processing attributes
			_.each(this.dom.attribs, function(attrValue, attrKey) {
				var attr = document.createAttribute(attrKey);
				attr.value = attrValue;
				var addAttribute = true;
				// Custom attributes should be handled differently
				if (Wires.attrs[attrKey]) {
					var handler = Wires.attrs[attrKey];
					customAttributes.push({
						handler : handler,
						attr : attr
					});
					if (handler.claimsChildren === true) {
						self.attributeClamsChildren = true;
					}
					if ( handler.shouldAppendElement !== undefined ){
						self.shouldAppendElement = handler.shouldAppendElement
					}
					addAttribute = handler.addAttibute;
				} else {
					// If there is a need of even trying processing attibute value
					if (attrValue.indexOf('$') > -1) {
						self.bindAttribute(attr, element);
					}
				}
				// Sometimes custom attributes don't want to have source code inside
				// Nor adding itself
				// For example value attribute
				if (addAttribute) {
					element.setAttributeNode(attr);
				}
			});
			
			_.each(customAttributes, function(data) {
				self.attributes.push( new data.handler(self.scope, self.dom, element, data.attr, self) );
			});
			return element;
		}
	});
})();