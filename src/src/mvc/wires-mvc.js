Wires.MVC = Wires.MVC || {};
(function() {
	'use strict';
	Wires.MVC.templateCollection = {};
	Wires.MVC.openedTemplate;
	Wires.MVC.createdViews = {};
	Wires.MVC.createdControllers = {};
	Wires.MVC.controllerTemplates = {};
	Wires.MVC.interceptors = {};
	Wires.MVC.registeredControllers = [];
	Wires.MVC.collectionsInstances = {};
	// REST Helpers
	Wires.MVC.rest = {
		_send : function(options, data) {
			$.ajax({
				type : options.type,
				url : options.url,
				data : data,
				dataType : 'json',
				success : options.success,
				error : function(res) {
					var response = JSON.parse(res.response);
					options.error(response);
				}
			})
		},
		"get" : function(url, success, error) {
			this._send({
				type : "GET",
				url : url,
				success : success,
				error : error
			});
		},
		post : function(url, success, error) {
			this._send({
				type : "POST",
				url : url,
				success : success,
				error : error
			});
		},
		del : function(url, success, error) {
			this._send({
				type : "DELETE",
				url : url,
				success : success,
				error : error
			});
		}
	}

	// Knockout interceptor
	Wires.MVC.ControllerInterceptor = function(controller, ready) {
		var loaders = controller.interceptors || {};
		var fns = [];
		_.each(loaders, function(loader, name) {
			if (!Wires.MVC.interceptors[name]) {
				Wires.MVC.interceptors[name] = new loader();
			}
			if (Wires.MVC.interceptors[name].call) {
				fns.push(function(done) {
					Wires.MVC.interceptors[this.name].call(done);
				}.bind({
					name : name
				}));
			}
		});
		async.waterfall(fns, ready);
	};
	Wires.MVC.getURLParameters = function() {
		var url = window.location.hash.replace('#', '/');
		var fragments = url.split('/');
		fragments.splice(0, 1);
		var params = {
			controller : fragments.length >= 1 ? fragments[0] : 'main',
			action : fragments.length >= 2 ? fragments[1] : 'index',
			id : fragments.length >= 3 ? fragments[2] : null
		};
		return params;
	};
	Wires.MVC.onHistory = function(c) {
		var self = this;
		$(window).on("hashchange", function(e) {
			c(Wires.MVC.getURLParameters());
		});
	}
	Wires.MVC.LastOpenedView = null;
	Wires.MVC.Essentials = function(controller, action, ready) {
		var action = action || "index";
		var essentials = controller.essentials || {};
		var views = essentials.views || {};
		var collections = essentials.collections || {};
		var container = essentials.containers ? essentials.containers['*'] || essentials.containers[action] : '#content';
		var viewTemplate;
		var templateFor = views['*'] ? views['*'] : views[action] || null;
		var fns = [];
		if (templateFor) {
			fns.push(function(done) {
				Wires.MVC.fetchTemplate(templateFor, function(tpl) {
					viewTemplate = tpl;
					done();
				});
			})
		}
		controller.collections = controller.collections || {};
		_.each(collections, function(collectionClass, name) {
			fns.push(function(done) {
				var name = this.name;
				Wires.MVC.collections(name, collectionClass, function(collection) {
					controller.collections[name] = collection;
					done();
				});
			}.bind({
				name : name
			}))
		})
		async.waterfall(fns, function() {

			ready({
				tpl : viewTemplate,
				container : container,
				sameView : templateFor === Wires.MVC.LastOpenedView
			});
			Wires.MVC.LastOpenedView = templateFor;
		});
	};
	Wires.MVC.ExecuteTarget = function(controller, method) {
		controller._currentMethod = method;

		Wires.MVC.Essentials(controller, method, function(options) {
			if (!options.sameView) {
				$(options.container).hide();
				Wires.World.cleanUp($(options.container)[0]);
			}
			controller[method](Wires.MVC.getURLParameters(), function() {
				controller.attach.bind(controller)(options);
			});
		});
	}
	Wires.MVC.Router = function(routes) {
		this.routes = [];
		this.controllers = {};
		this.fetchEssentials = function(controller, ready) {
			Wires.MVC.Essentials(controller, this.params.action, ready);
		};
		this.register = function(path, controller) {
			Wires.MVC.registeredControllers.push({
				path : path,
				controller : controller
			});
			this.routes.push({
				path : path ? path : 'main',
				controller : controller
			})
		}
		this._start = function(params) {
			var self = this;
			this.params = params;
			try {
				_.each(this.routes, function(info) {
					if (_.isString(info.path)) {
						if (info.path === params.controller) {
							self.executeController.bind(self)(info)
						}
					} else {
						if (self.url.match(info.path)) {
							self.executeController.bind(self)(info);
						}
					}
				})
			} catch (e) {
				console.log('error', e.stack ? e.stack : e);
			}
		}
		this.start = function() {
			this._start(Wires.MVC.getURLParameters());
			Wires.MVC.onHistory(this._start.bind(this));
		}
		// Create controller, and before we start calling method
		// We need to run a chain of events if neccesery
		this.createController = function(info, ready) {
			if (!Wires.MVC.createdControllers[info.path]) {
				var controller = new info.controller();
				Wires.MVC.createdControllers[info.path] = controller;
			}
			var self = this;
			var controller = Wires.MVC.createdControllers[info.path];
			Wires.MVC.ControllerInterceptor(controller, function() {
				ready(controller);
			});
		}
		// Executing controller
		this.executeController = function(info) {
			this.createController(info, function(controller) {
				if (controller[this.params.action]) {
					Wires.MVC.ExecuteTarget(controller, this.params.action);
				}
			}.bind(this))
		}
	}
	Wires.MVC.fetchTemplate = function(template, done) {
		if (!Wires.MVC.controllerTemplates[template]) {
			$.get(Wires.Config.viewsFolder + template, function(e) {
				var fns = [];
				var includes = e.match(/\{\{\s?include (.*?)\}\}/ig);
				_.each(includes, function(include) {
					var file = include.match('include (.*?)\}\}')[1];
					fns.push(function(done) {
						Wires.MVC.fetchTemplate(file, function(tpl) {
							e = e.split(include).join(tpl);
							done();
						});
					});
				});
				async.waterfall(fns, function() {
					Wires.MVC.controllerTemplates[template] = e;
					done(e);
				});
			});
		} else {
			done(Wires.MVC.controllerTemplates[template]);
		}
	};
	Wires.MVC.Layout = Wires.Class.extend({
		template : function(template, callback, container) {
			var self = this;
			Wires.MVC.fetchTemplate(template, function(data) {
				// Wires.World.cleanUp($(container)[0])
				$(container).hide();
				callback.bind(self)(function(afterDone) {
					self.attach.bind(self)({
						container : container,
						tpl : data,
						afterDone : afterDone
					});
				});
			})
		},
		attach : function(options) {
			if (this['beforeRender']) {
				this['beforeRender'](Wires.MVC.getURLParameters());
			}
			var afterDone = options.afterDone || function() {
			};
			if (!options.sameView) {

				var container = $(options.container);
				if (!container[0]) {
					console.error(options.container, 'was not found in DOM');
					console.error('Cannot render instance ', this)
				} else {

					container.show();
					var self = this;
					var wires = new Wires.World({
						template : options.tpl,
						scope : {
							instance : self
						},
						target : container[0]
					});

					// ko.cleanNode(container[0])
					// ko.applyBindings(self, container[0]);
					afterDone();
					this.afterRender();
				}
			} else {
				afterDone();
				this.afterRender();
			}
		},
		afterRender : function() {
			var essentials = this.essentials || {}
			var components = essentials.components || [];
			var targetComponents = components[this._currentMethod] || {}
			var self = this;
			_.each(targetComponents, function(component, name) {
				var Component = _.isString(component) ? app[component] : component;
				var cmp = new Component();
				cmp.render();
				self[name] = cmp;
			})
		}
	}, {
		displayName : ""
	});
	Wires.MVC.Component = Wires.MVC.Layout.extend({
		initialize : function(options) {

			this.essentials = this.essentials || {};
			this.options = options || {};
			if (options && options.container) {
				this.essentials.containers = {
					index : options.container
				}

			}
			var self = this;
			_.each(options, function(value, key) {
				self[key] = value;
			});
			Wires.MVC.Component.__super__.initialize.apply(this, arguments);
		},
		render : function() {
			Wires.MVC.ExecuteTarget(this, 'index');
		}
	});
	// Extended Backbone collection to help dealing with knockout arrays
	// Minimalistic set
	// ----------
	Wires.MVC.Controller = Wires.MVC.Layout.extend({
		// Here we bind events that will modify the ko array
		initialize : function(models, options) {
		}
	});
})();