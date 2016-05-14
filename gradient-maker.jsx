/* jshint laxbreak:true, -W043, -W030 */
/* globals GradientType */

// jshint ignore:start
#target illustrator
#targetengine main
// jshint ignore:end

// https://forums.adobe.com/message/3037150#3037150
// https://forums.adobe.com/message/7852473#7852473
// https://forums.adobe.com/message/8749234#8749234
// https://addyosmani.com/resources/essentialjsdesignpatterns/book/#facadepatternjavascript

var GRAD = (function(win, undefined) {
	
	var _private = {};
	
	_private.doc = null;
	
	_private.title = function(swatches) {
		
		var user;
		var names = [];
		var name = '';
		var i;
		var l;
		
		for (i = 0, l = swatches.length; i < l; i++) {
			
			names[i] = swatches[i].name;
			
		}
		
		name = names.join('-');
		
		user = prompt('Enter name for new gradient swatch', name);
		
		return user;
		
	};
	
	_private.main = function() {
		
		var swatches = _private.doc.swatches.getSelected();
		var grad;
		var i;
		var l = swatches.length;
		var stop;
		
		if (l) {
			
			// Making a new gradient by default must have 2 colors and a mid point.
			// Once you have made a gradient and referenced it. You can use
			// `gradientStops.add()`` to give you extra stops that you require.
			//
			// Gradient stops are ordered from left to right, no matter what order
			// they were created in.
			grad = _private.doc.gradients.add();
			
			grad.name = _private.title(swatches);
			grad.type = GradientType.LINEAR;
			
			for (i = 0; i < l; i++) {
				
				if (i === 0) {
					
					grad.gradientStops[0].color = swatches[i].color;
					grad.gradientStops[0].rampPoint = 0;
					grad.gradientStops[0].midPoint = 50;
					
				} else if (i === (l - 1)) {
					
					grad.gradientStops[l - 1].color = swatches[i].color;
					grad.gradientStops[l - 1].rampPoint = 100;
					grad.gradientStops[l - 1].midPoint = 50;
					
				} else {
					
					stop = grad.gradientStops.add();
					stop.color = swatches[i].color;
					grad.gradientStops[i].rampPoint = ((i / (l - 1)) * 100);
					grad.gradientStops[i].midPoint = 50;
					
				}
				
			}
			
		}
		
	};
	
	_private.init = function($title) {
		
		_private.doc = win.app.activeDocument;
		
		// Open document(s)?
		if (win.app.documents.length > 0) {
			
			// Begin the program:
			_private.main(); // Only run if there's at least one document open.
			
		} else {
			
			// Nope, let the user know what they did wrong:
			win.alert('You must open at least one document.');
			
		}
		
	};
	
	return {
		init: function(args) {
			
			_private.init();
			
		}
	};
	
})(this);

GRAD.init({
	title: 'Gradient Maker'
});
