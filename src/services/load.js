(function() {
   var _loaded = {};
   var counter = 0;
   domain.service("$load", ['$queryString', '$loadView', '$run'],
      function( $queryString, $loadView, $run) {
      return {
         component: function(component, opts) {

         },
         controller: function(controller, opts) {
            var _url = window.location.url;
            var opts = opts || {};
            var parent = opts.parent;

            var params = $queryString();

            if (opts.params) {
               params = _.merge(params, opts.params);
            }
            var injections = {
               $params: {
                  target: params
               }
            };

            // Check if controller has custom injections
            if (opts.injections) {
               _.each(opts.injections, function(value, key) {
                  injections[key] = {
                     target: value
                  }
               })
            }
            return domain.require([controller], injections, function(list) {
               counter++;
               // Basic validation on list
               if (!_.isArray(list)) {
                  return;
               }
               if (list.length < 2) {
                  return;
               }
               var loadOpts = list[0].match(/^([^\s]+)(\s*->\s*([^\s]+))?/i)
               var Ctrl = list[1];
               if (!loadOpts) {
                  return;
               }
               var view = loadOpts[1];
               var targetSelector = loadOpts[3] || "section";
               var target = null;

               if ( parent && parent.element){
                  target = $(parent.element).find(targetSelector)[0]
               } else {
                  target = document.querySelector(targetSelector)
               }

               if ( !target  ){
                  throw { message : "Can't find a target "}
               }

               var ctrl = new Ctrl();
               // detach the very first
               if ( target.$tag ){
                  if ( target.$tag.gc){
                     target.$tag.gc(true);
                  }
               }
               while (target.firstChild) {
                  target.removeChild(target.firstChild);
               }
               return $loadView(view).then(function(structure){
                  $run({
                     structure : structure,
                     target : target,
                     scope : ctrl
                  });
                  return {scope : ctrl, element : target};
               });
            })
         }
      }
   })
})();
