module wires.core.ConfigurableNode
import Watchable from wires.core;
class ConfigurableNode extends Watchable {
   constructor(config, scope, locals) {
      super();
      this.scope = scope;
      this.locals = locals;
      if (config.type) {
         this.original = this.initialize(config);
      } else {
         this.original = config;
      }
   }
}
export ConfigurableNode;
