// TODO: Clean up namespace
var bg_colour = "#AAF";   // Light blue
var line_colour = "#88F"; // Less light blue
var max_val = 1200; // 20 min

var canvas = document.getElementById("time_data");

function time_bg_fill_pattern () {
	// Fill with diagonal blue lines

	var pattern = document.createElement("canvas");
	pattern.width = 5;
	pattern.height = 10;
	var ctx_pat = pattern.getContext("2d");

	ctx_pat.beginPath();
	ctx_pat.moveTo(0,0);
	ctx_pat.lineTo(pattern.width,pattern.height);
	ctx_pat.lineWidth = 1;
	ctx_pat.strokeStyle = bg_colour;
	ctx_pat.stroke();

	// Need to fill in the empty corners so the stripes don't look disconnected
	ctx_pat.strokeRect(0,pattern.height-0.1,0.1,pattern.height);
	ctx_pat.strokeRect(pattern.width-0.1,0,pattern.width,0.1);

	return pattern;
}

function draw_time_bg () {
	var canvas = document.getElementById("time_data");
	var ctx = canvas.getContext("2d");

	// Fill under the curve
	ctx.beginPath();
	ctx.moveTo(0,2);
	ctx.quadraticCurveTo(canvas.width*0.8, canvas.height*0.03, canvas.width, canvas.height);
	ctx.lineTo(canvas.width, 2);
	ctx.lineTo(0,2);
	ctx.closePath();

	ctx.fillStyle = ctx.createPattern(time_bg_fill_pattern(), "repeat");
	ctx.fill();

	// Light line to close it off
	ctx.lineWidth = 1;
	ctx.strokeStyle = bg_colour;
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0,2);
	ctx.quadraticCurveTo(canvas.width*0.8, canvas.height*0.03, canvas.width, canvas.height);

	// Draw the curve
	ctx.lineWidth = 2;
	ctx.strokeStyle = line_colour;
	ctx.stroke();
}

/* I played with a bunch of different functions before landing on this one.
 *
 * Linear feels better to click - it is more intuitive - but the range looks weird
 * Essentially I want to go up to 20min but the most common points are around 1 min.
 *
 * Square-root like shapes are ok, best was: return Math.pow(v-elbow,1/1.5);
 * Log gave a slightly better distribution
 *
 * I eventually landed on using both log and linear with a transition point at 1 minute.
 * The most common values are around the 1 minute mark, forcing it to be the middle of the range
 * is a recognition of that and makes it easy to select those region of values.
 *
 * Making the lower half linear means that clicking is intuitive and the full range is easily accessible.
 * The nature of the log function is that it kicks in almost linearly, so the 1-5min area feels natural too.
 *
 * Using log allows 10-20 minute values to be selected without distorting the entire scale.
 *
 * The background image is designed to get across the concept that the scale isn't linear,
 * in addition to doing the impossible in representing the passage of time.
 */

function v2m(v) {
	// Fix elbow in middle of range
	var elbow = 60;
	return v > elbow ? v2m(elbow) + Math.log((v-elbow)/50+1) : Math.log((max_val-elbow)/50+1)/elbow*v;
}

function m2v(m) {
	// Reverse v2m - to map clicks to values
	var elbow_v = 60;
	var elbow = v2m(elbow_v);
	return m > elbow ? elbow_v + (Math.exp(m-elbow)-1)*50 : m/elbow*elbow_v;
}

function val2y (v) {
	// Scale, 1sec - 1hr
	return (1-v2m(v)/v2m(max_val))*canvas.offsetHeight;
}

function y2val (y) {
	var m = (1-y/canvas.offsetHeight)*v2m(max_val);
	var raw_val = m2v(m);

	// To make people happy, we want to bias towards pretty numbers
	// There is no practical difference between 60 and 63 seconds...
	// But if somebody pushes the 1 min button they expect 60 seconds

	if (raw_val > 200 && (raw_val + 100) % 300 < 200) { 
		return Math.round(raw_val/300)*300; // Nearest 5 minutes
	} else if (raw_val > 50 && (raw_val + 10) % 60 < 20) {
		return Math.round(raw_val/60)*60; // Nearest minute
	} else if (raw_val > 5 && (raw_val + 5) % 10 < 10) {
		return Math.round(raw_val/10)*10; // Nearest 10 seconds
	} else {
		return Math.round(raw_val);
	}
}

function time_label (v, label) {
	var canvas = document.getElementById("time_data");
	var ctx = canvas.getContext("2d");

	var y = val2y(v);

	ctx.font = "20px sans-serif";
	ctx.fillStyle = "black";
	ctx.textAlign = "right";
	ctx.fillText(label, canvas.offsetWidth-5, y+10); // +10 vertically centers text
}

draw_time_bg();

time_label(10,    "10 sec");
time_label(30,    "30 sec");
time_label(60,    "1 min");
time_label(5*60,  "5 min");
time_label(10*60, "10 min");

canvas.addEventListener('click', function(event) {
	if (event.button) return; // Not left-button, ignore

	var y = event.pageY - canvas.offsetTop; // Get local coordinates
	var v = y2val(y);
	console.log("Click", y,v,v/60);

	window.location.href = 'time_based.html?time='+v;
});

