var cache = function(object) { 

 //alert(object); 
 document.querySelector('#'+ object).setAttribute("visible",false);
 
}

var montre = function(object) { 

 //alert(object); 
 document.querySelector('#'+ object).setAttribute("visible",true);
 
}


if (annyang) {
	
  annyang.setLanguage('fr-FR');
  
  // Let's define a command.
  var commands = {
    'cache :object': cache,
	'montre :object': montre
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening.
  annyang.start( {continuous: true} );
}
