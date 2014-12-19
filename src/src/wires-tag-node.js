var Wires = Wires || {};
// Here we store components that should stay no matter where there were created from
// Pretty much like a singletone
Wires.StoredComponents = {};
(function() {
    'use strict';
    Wires.TagNode = Wires.Node.extend({
        initialize: function(scope, dom, target, options) {
            var self = this;
            this.dom = dom;
            this.scope = scope;
            this.instance = scope.instance;
            this.attributes = {};
            this.target = target;
            this.options = options;
            this.persistComponentsDom = false;

        },
        prepareNodeStructure: function(ready) {
            var self = this;

            this.element = this.getElement();
            var CustomComponentClass;
            if ((CustomComponentClass = Wires.Component.getCustomComponent(this.dom.name))) {


                // Need to re-define a scope
                // Need to build up children, based on components settings
                // (Could be raw template or remote view )
                var component = new CustomComponentClass();
                Wires.MVC.Essentials(component, null, function() {



                    if (component.module) {
                        Wires.StoredComponents[self.dom.name] = component;
                        self.element._persistData = true;
                        component.element = self.element;
                    }
                    component.getDom(self.dom, function(dom) {
                        // Collecting attributes

                        _.each(self.dom.attribs, function(attr, attrName) {
                            var result = Wires.Exec.expression({
                                statement: attr,
                                scope: self.scope,
                                variables: Wires.Variable.extract(self.scope, attr)
                            });
                            // Setting it to component
                            component[attrName] = result;
                        });
                        component.__resolveInitialization();
                        //console.log(component.persist);
                        // Re-defined children
                        self.dom.children = dom;
                        // Setting new scope
                        self.scope = Wires.World.attachParents(self.scope, component);
                        ready();
                    });
                });
            } else {
                ready();
            }
        },
        create: function(ready) {
            var options = this.options;
            var target = this.target;
            var dom = this.dom;
            var self = this;

            // If we actually don't need to create anything'
            if (Wires.StoredComponents[self.dom.name]) {
                var cmp = Wires.StoredComponents[self.dom.name];
                $(target).append(cmp.element);

                ready();
                return;
            }

            $(this.element).data("wires-node", this);
            this.prepareNodeStructure(function() {
                // We continue parsing in case of attribute does not do it manualluy
                // In case if this element needs to be inserted before node
                // Here we ignore options
                if (options && options.insertBefore) {
                    $(this.element).insertBefore(options.insertBefore);
                    Wires.World.parse(self.scope, dom.children, this.element);
                } else {
                    if (!this.shouldAppendElement)
                        this.attributeClamsChildren = true;
                    // In any other case, regular routine
                    if (dom.children && !this.attributeClamsChildren) {
                        Wires.World.parse(self.scope, dom.children, this.element);
                    }
                    if (this.shouldAppendElement) {
                        target.appendChild(this.element);
                    } else {
                        this.placeholders = true;
                    }
                }
                if (this.placeholders) {
                    this.placeholderBefore = document.createComment('');
                    target.appendChild(this.placeholderBefore);
                    this.placeholderAfter = document.createComment('');
                    target.appendChild(this.placeholderAfter);
                }
                _.each(this.attributes, function(attribute) {
                    if (attribute.onElementReady)
                        attribute.onElementReady(self);
                });
                ready();
            }.bind(this));
        },
        bindAttribute: function(attr, element) {
            new Wires.Attr(this.scope, this.dom, element, attr);
        },
        getElement: function() {
            var element = document.createElement(this.dom.name);
            var self = this;
            this.shouldAppendElement = true;
            var ignoreRestAttributes = false;
            var customAttributes = [];


            if (this.dom.persists) {
                element.__persists = true;

            }

            // Adding and processing attributes
            _.each(this.dom.attribs, function(attrValue, attrKey) {
                if (ignoreRestAttributes) {
                    return false;
                }
                var attr = document.createAttribute(attrKey);
                attr.value = attrValue;
                var addAttribute = true;
                // Custom attributes should be handled differently
                if (Wires.attrs[attrKey]) {
                    var handler = Wires.attrs[attrKey];
                    customAttributes.push({
                        handler: handler,
                        attr: attr
                    });
                    if (handler.claimsChildren === true) {
                        self.attributeClamsChildren = true;
                    }
                    if (handler.placeholders) {
                        self.placeholders = true;
                    }
                    if (handler.shouldAppendElement !== undefined) {
                        self.shouldAppendElement = handler.shouldAppendElement;
                    }
                    if (handler.ignoreRestAttributes !== undefined) {
                        ignoreRestAttributes = handler.ignoreRestAttributes;
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
                var persistWatch = false;
                var attributeHandler = new data.handler(self.scope, self.dom, element, data.attr, self);
                if (data.handler.persistWatch !== undefined) {
                    attributeHandler.persistWatch = data.handler.persistWatch;
                }
                self.attributes[data.attr.nodeName] = attributeHandler;
            });
            return element;
        }
    });
})();