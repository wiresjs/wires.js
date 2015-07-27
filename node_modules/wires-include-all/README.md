# Wires Include

      domain.require(function($includeAll) {
         $includeAll("./test_folder", {
            order: ['app.js', 'first/'],
            rootPath : "myfiles",
            tagOutput : true
         }).then(function(list){
            console.log(list)
         })
      })

Prints the output

      <script src="myfiles/app.js"></script>
      <script src="myfiles/first/first_a.js"></script>
      <script src="myfiles/first/first_b.js"></script>
      <script src="myfiles/b.js"></script>
      <script src="myfiles/rouge.js"></script>
      <script src="myfiles/subfolder/a.js"></script>
