(function() {
   domain.service("attrs.ws-value", ['TagAttribute', '$evaluate', '$projectValidators'],
      function(TagAttribute, $evaluate, $projectValidators) {
         var WsVisible = TagAttribute.extend({
            // Overriding default method
            // (we don't need to create an attribute for this case)
            create: function() {
               this.watcher = this.startWatching();
               var validation = this.item.validate;
               if (validation) {
                  this.validators = [];
                  _.each(validation, function(item) {
                     // if validator is registered
                     if ($projectValidators[item.n]) {
                        this.validators.push({
                           validator: $projectValidators[item.n],
                           item: item
                        });
                     }
                  }, this);
               }
            },
            // Unbind listeners!!!
            detach: function() {
               if (this.keyDownListener) {
                  this.element.removeEventListener("keydown", this.keyDownListener);
               }
               if (this.clickListener) {
                  this.element.removeEventListener("click", this.clickListener);
               }
               delete this.validatonDelay;
            },
            // Happpens on new value
            checkValidations: function(data) {
               var self = this;
               if (!self.validators) {
                  return;
               }
               // We don't want to apply a check right away
               // Give a user a bit time to type his bloody email!
               clearInterval(this.validatonDelay);
               this.validatonDelay = setTimeout(function() {
                  _.each(self.validators, function(conf) {
                     var args = conf.item.a ? conf.item.a : [];
                     var clsName = conf.validator.cls;
                     var errorMessage = conf.validator.validate.apply(data, args);
                     if (errorMessage !== undefined) {
                        if (!$(self.element).hasClass(clsName)) {
                           $(self.element).addClass(clsName);
                        }
                     } else {
                        if ($(self.element).hasClass(clsName)) {
                           $(self.element).removeClass(clsName);
                        }
                     }
                  });
               }, 500);

            },
            startWatching: function() {
               var self = this;
               this.selfUpdate = false;

               // Binding variable
               var watcher = $evaluate(this.attr, {
                  scope: this.scope,
                  changed: function(data) {
                     self.checkValidations(data);
                     if (self.selfUpdate === false) {
                        self.setValue(data.str);
                     }
                     self.selfUpdate = false;
                  }
               });

               // Extracting the first variable defined
               if (watcher.locals && watcher.locals.length === 1) {
                  this.variable = watcher.locals[0];
               }
               // store variable to the element
               this.element.$variable = this.variable;

               this.bindActions(function(newValue) {
                  if (self.variable) {
                     self.selfUpdate = true;
                     self.variable.value.update(newValue);
                  }
               });
               return watcher;
            },

            setValue: function(v) {
               $(this.element).val(v);
            },
            bindActions: function(cb) {
               var self = this;
               var nodeName = this.element.nodeName.toLowerCase();
               var elType = $(this.element).attr('type');
               if (nodeName === 'textarea') {
                  elType = nodeName;
               }
               if (nodeName === 'select') {
                  elType = nodeName;
               }
               if (nodeName === 'option') {
                  elType = nodeName;
               }
               if (nodeName === 'input' && !elType) {
                  elType = 'text';
               }

               switch (elType) {
                  case 'text':
                  case 'email':
                  case 'date':
                  case 'datetime':
                  case 'month':
                  case 'search':
                  case 'url':
                  case 'tel':
                  case 'password':
                  case 'textarea':
                     this.keyDownListener = function(evt) {
                        var _that = this;
                        clearInterval(self.interval);
                        self.interval = setTimeout(function() {
                           cb($(_that).val());
                        }, 50);
                     };
                     this.element.addEventListener("keydown", this.keyDownListener, false);
                     break;
                  case 'checkbox':

                     this.clickListener = function(evt) {
                        var target = this.$checked;
                        if (_.isArray(target.value)) {
                           var currValue = self.variable.value.value;
                           var index = target.value.indexOf(currValue);
                           if (this.checked) {
                              if (index === -1) {
                                 target.value.push(currValue);
                              }
                           } else {
                              // Removing value from an array
                              if (index > -1) {
                                 target.value.splice(index, 1);
                              }
                           }
                        } else {
                           self.selfUpdate = true;
                           self.variable.value.update(this.checked);
                        }
                     };
                     this.element.addEventListener("click", this.clickListener);
                     break;
                  case 'option':

                     break;
                  case 'select':

                     $(this.element).change(function() {
                        var value = self.detectSelectValue();
                        cb(value);
                     });
                     $defered(function() {
                        // If we have set the variable beforehand
                        if (self.variable.value.value !== undefined) {
                           $(self.element).find("option").each(function(index, i) {
                              if (i.$variable) {
                                 if (_.isEqual(i.$variable.value.value, self.variable.value.value)) {
                                    i.selected = true;
                                 }
                              }
                           });
                        } else {
                           // In Any other case
                           // we should update variable with first option
                           var firstValue = self.detectSelectValue(true);
                           self.selfUpdate = true;
                           self.variable.value.update(firstValue);
                        }
                     });
                     break;
               }
            },
            detectSelectValue: function(first) {
               var value;
               $(this.element).find(first ? "option:first" : "option:selected").each(function() {

                  var el = this;
                  var tag = this.$tag;
                  // in case of option
                  var storedVariable = this.$variable;
                  if (storedVariable) {
                     value = storedVariable.value.value;
                  } else {
                     // Checking the value from simple attribute "value"
                     _.each(tag.attributes, function(attr) {
                        if (attr.name === "value") {
                           value = $(el).val();
                        }
                     });
                     // if value is stil undefined
                     // try to get it from html
                     if (value === undefined) {
                        value = $(el).html();
                     }
                  }

               });
               return value;
            },
         });
         return WsVisible;
      });

})();
