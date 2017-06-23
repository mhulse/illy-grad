/* jshint laxbreak:true, -W043 */
/* globals app, $, GradientType, BridgeTalk */

// jshint ignore:start
#target illustrator
#targetengine main
// jshint ignore:end
// @@@BUILDINFO@@@ Gradient from Swatches.jsx !Version! Mon May 16 2016 21:47:52 GMT-0700
// https://forums.adobe.com/message/3037150#3037150
// https://forums.adobe.com/message/7852473#7852473
// https://forums.adobe.com/message/8749234#8749234
// https://addyosmani.com/resources/essentialjsdesignpatterns/book/#facadepatternjavascript

var GRAD = (function($application, $helper, $gradienttype, undefined) {
	
	// Private variable container object:
	var _private = {};
	
	// IMPORTANT! This MUST return a non-cached `activeDocument` result on each
	// call due to the way Illustrator palettes communicate with the target app.
	_private.doc = (function() {
		
		return $application.activeDocument;
		
	})();
	
	// Creates and returns a palette window object.
	_private.palette = function(title) {
		
		// Palette box setup:
		var meta = 'palette { \
			orientation: "column", \
			alignChildren: ["fill", "top"], \
			margins: 10, \
			group1: Group { \
				alignChildren: ["fill", "top"], \
				orientation: "row", \
				make: Button { text: "Make Gradient" }, \
				close: Button { text: "Close" } \
			} \
		}';
		
		// Instanciate `Window` class with setup from above:
		var palette = new Window(meta, title, undefined, {
			//option: value
			//closeButton: false
		});
		
		// Start button:
		palette.group1.make.onClick = function() {
			
			// We HAVE to “reconnect” to the app using `BridgeTalk`:
			_private.reconnect();
			
		};
		
		// Close and/or palette UI close buttons:
		palette.group1.close.onClick = function() {
			
			palette.close();
			
		};
		
		palette.onClose = function() {
			
			// Do any cleanup or garbage collection?
			
		};
		
		return palette;
		
	};
	
	// Reconnect to the `activeDocument`:
	_private.reconnect = function() {
		
		var bt;
		
		bt = new BridgeTalk();
		
		bt.target = 'illustrator';
		
		// Enter the script through the “back door”:
		bt.body = 'GRAD.init({ backdoor: true })';
		
		bt.send();
		
	};
	
	// Check to see if gradient name already exists:
	_private.exists = function(name) {
		
		var swatches = _private.doc.swatches;
		var i;
		var l;
		var flag = false; // Assumed to not exist.
		
		for (i = 0, l = swatches.length; i < l; i++) {
			
			if (swatches[i].name == name) {
				
				// It already exists!
				flag = true;
				
				break;
				
			}
			
		}
		
		return flag; // Single exit point.
		
	};
	
	// Check if argument contains only color swatch types:
	_private.valid = function(swatches) {
		
		var i;
		var l;
		var result = true; // Assumed to be true by default.
		var color;
		
		for (i = 0, l = swatches.length; i < l; i++) {
			
			color = swatches[i].color.typename.toLowerCase();
			
			// Only color types listed in below `if` statement are allowed.
			//
			// Complete list of available color types:
			//
			// CMYKColor
			// GradientColor
			// GrayColor
			// LabColor
			// NoColor
			// PatternColor
			// RGBColor
			// SpotColor
			if (
				(color != 'cmykcolor')
				&&
				(color != 'graycolor')
				&&
				(color != 'labcolor')
				&&
				(color != 'rgbcolor')
				&&
				(color != 'spotcolor')
			) {
				
				result = false; // Not allowed!
				
				break; // Break the loop.
				
			}
			
		}
		
		return result;
		
	};
	
	// Creates a swatch title based on selected swatch names, or user input:
	_private.title = function(swatches) {
		
		var user;
		var names = [];
		var name = '';
		var i;
		var l;
		
		for (i = 0, l = swatches.length; i < l; i++) {
			
			// Add swatch name to array:
			names[i] = swatches[i].name;
			
		}
		
		// Convert array to string with dashes inbetween:
		name = names.join('-');
		
		// Max length of gradient swatch name is 31 characters:
		name = (name.split('').splice(0, 28).join('') + '...');
		
		// Give user the option of naming the gradient swatch:
		user = prompt('Enter name for new gradient swatch', name);
		
		// Return the user’s chosen name:
		return user;
		
	};
	
	// Makes the gradient swatch:
	_private.make = function() {
		
		var swatches = _private.doc.swatches.getSelected(); // Gets selected swatches.
		var grad;
		var i;
		var l = swatches.length;
		var stop;
		var name;
		
		// Must have at least one swatch selected:
		if (l) {
			
			// Check if user select only color swatches:
			if (_private.valid(swatches)) {
				
				// Get desired gradient swatch name:
				name = _private.title(swatches);
				
				// Will be `null` if user clicked the prompt’s cancel button:
				if (name !== null) {
					
					// Only continue if they provided a name:
					if (name && name.length) {
						
						// Check if gradient swatch name already exists:
						if ( ! _private.exists(name)) {
							
							// Making a new gradient by default must have 2 colors and a mid point.
							// Once you have made a gradient and referenced it. You can use
							// `gradientStops.add()` to give you extra stops that you require.
							//
							// Gradient stops are ordered from left to right, no matter what order
							// they were created in.
							grad = _private.doc.gradients.add();
							
							grad.name = name;
							grad.type = $gradienttype.LINEAR;
							
							// Loop over selected swatches:
							for (i = 0; i < l; i++) {
								
								if (i === 0) {
									
									// Colorize the first default gradient color:
									grad.gradientStops[0].color = swatches[i].color;
									grad.gradientStops[0].rampPoint = 0;
									grad.gradientStops[0].midPoint = 50;
									
								} else if (i === (l - 1)) {
									
									// Colorize the last default gradient color:
									grad.gradientStops[l - 1].color = swatches[i].color;
									grad.gradientStops[l - 1].rampPoint = 100;
									grad.gradientStops[l - 1].midPoint = 50;
									
								} else {
									
									// Fill-in the rest of the colors, evenly, between first
									// and last color stops:
									stop = grad.gradientStops.add();
									stop.color = swatches[i].color;
									grad.gradientStops[i].rampPoint = ((i / (l - 1)) * 100);
									grad.gradientStops[i].midPoint = 50;
									
								}
								
							}
							
						} else {
							
							alert('A gradient swatch, by that name (' + name + '), already exists.');
							
						}
						
					} else {
						
						alert('You must provide a gradient swatch name.');
						
					}
					
				} else {
					
					$helper.writeln('User canceled.');
					
				}
				
			} else {
				
				alert('You must select one or more color swatches.');
				
			}
			
		} else {
			
			alert('You must select one or more swatches.');
			
		}
		
	};
	
	// Script setup, if coming through the “front door”:
	_private.init = function(title) {
		
		var palette;
		
		// Open document(s)?
		if ($application.documents.length > 0) {
			
			// Make palette window:
			palette = _private.palette();
			
			// Center and show the palette window:
			palette.center();
			palette.show();
			
		} else {
			
			// Nope, let the user know what they did wrong:
			alert('You must open at least one document.');
			
		}
		
	};
	
	// Public API:
	return {
		init: function(args) {
			
			// Entry point for `BridgeTalk` and script testing:
			if (
				args.backdoor
				&&
				(args.backdoor.toString() == 'true') // Normalizing due to `BridgeTalk` passing ONLY strings.
			) {
				
				// Jump straight to the `prompt`:
				_private.make();
				
			} else {
				
				// Fire-up the palette window:
				_private.init(args.title);
				
			}
			
		}
	};
	
})(app, $, GradientType);

GRAD.init({
	//backdoor: true, // Use this for testing!
	title: 'Gradient Maker'
});

// Done!
