#target illustrator

// https://forums.adobe.com/message/3037150#3037150
// https://forums.adobe.com/message/7852473#7852473
// https://forums.adobe.com/message/8749234#8749234

function title(swatches) {
	
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
	
}

if (app.documents.length) {
	
	var doc = app.activeDocument;
	var swatches = doc.swatches.getSelected();
	var grad;
	var swatch;
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
		grad = app.activeDocument.gradients.add();
		
		grad.name = title(swatches);
		grad.type = GradientType.LINEAR;
		
		for (i = 0; i < l; i++) {
			
			if (i == 0) {
				
				grad.gradientStops[0].color = swatches[i].color;
				grad.gradientStops[0].rampPoint = 0;
				grad.gradientStops[0].midPoint = 50;
				
			} else if (i == (l - 1)) {
				
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
	
}
