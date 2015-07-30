domain.service("$tagAttrs", ['TagAttribute','$evaluate', '$customAttributes'],
   function(TagAttribute, $evaluate, $customAttributes){
   return {
      create : function(item, scope, element){
         var attributes = [];

         _.each(item.a, function(attr, name){

            var customPath = "attrs." + name;
            var tagAttribute;

            var opts = {
               scope : scope,
               attr : attr,
               name : name,
               element : element
            }
            
            if ( $customAttributes[customPath] ){
               tagAttribute = new $customAttributes[customPath](opts)
            } else{
               tagAttribute = new TagAttribute(opts);
            }

            if ( tagAttribute ){
               tagAttribute.create();
               attributes.push(tagAttribute);
            } else {
               console.log("no attr", customPath)
            }
         });
         return attributes;
      }
   }
})
