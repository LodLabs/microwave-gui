function square_element(elem) {
	// Round out the round buttons
	// CSS can kind of do this, but it is messy, for example a table-cell button can't
	// control its width or margin.
	//
	// Take the size and add to the smaller direction's padding to make it even
	var $elem = $(elem);
	var w = $elem.outerWidth();
	var h = $elem.outerHeight();

	if (h > w) {
		var correction = (h-w)/2;
		$elem.css('padding-left',  parseInt($elem.css('padding-left'))  + correction + 'px');
		$elem.css('padding-right', parseInt($elem.css('padding-right')) + correction + 'px');
	} else if (w > h) {
		var correction = (w-h)/2;
		$elem.css('padding-top',    parseInt($elem.css('padding-top'))    + correction + 'px');
		$elem.css('padding-bottom', parseInt($elem.css('padding-bottom')) + correction + 'px');
	}
}

function color_between(a_color_str, b_color_str, pcnt) {
	// TODO: Lack of # character required, but not ideal
	var a = parseInt(a_color_str, 16);
	var b = parseInt(b_color_str, 16);
	// Can't just do a straight number between, because red->blue goes through green
	// Need to do it by rgb component
	return (
			((((a >> 16 & 0xFF) - (b >> 16 & 0xFF))*pcnt + (b >> 16 & 0xFF)) << 16) +
			((((a >>  8 & 0xFF) - (b >>  8 & 0xFF))*pcnt + (b >>  8 & 0xFF)) <<  8) +
			((((a >>  0 & 0xFF) - (b >>  0 & 0xFF))*pcnt + (b >>  0 & 0xFF)) <<  0)
		   ).toString(16);
}

function temperature_color(temperature) {
	console.log("TEMP", temperature);
	// Convert a temperature value into a RGB color string
	// Based on a three-point gradient:
	// 150: orange (#FFA500), 120: red (#FF0000), 30: blue (#0000FF)
	if (temperature > 150) {
		return "#FFA500";
	} else if (temperature > 120) {
		return "#" + color_between('FFA500', 'FF0000', (temperature-120)/(150-120));
	} else if (temperature > 30) {
		return "#" + color_between('FF0000', '0000FF', (temperature-30)/(120-30));
	} else { // temperature < 30
		return "#0000FF";
	}
}
