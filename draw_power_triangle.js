// TODO: Make this a generic module

/* Should be called using something like the following: 

draw_power_bg( document.getElementById("power_triangle") );
draw_fixed_power_marker( document.getElementById("power_marker") );
set_power_marker(100);

HTML Should be:
<canvas id="power_triangle" width="250px" height="60px"></canvas>
<canvas id="power_marker" draggable="true" width="15px" height="70px"></canvas>
<div><span>Power</span> <span id="power_pcnt">80</span>% (<span id="power_watts">900</span>W)</div>

*/

function draw_power_bg(canvas) {
	var canvas = document.getElementById("power_triangle");
	var ctx = canvas.getContext("2d");

	// Draw a triangle depicting increasing power
	ctx.beginPath();
	ctx.moveTo(0, canvas.height);
	ctx.lineTo(canvas.width, canvas.height);
	ctx.lineTo(canvas.width, 0);
	ctx.closePath();

	var gradient = ctx.createLinearGradient(0,-canvas.width*0.2, canvas.width,0);
	gradient.addColorStop(0,"blue");
	gradient.addColorStop(1,"red");

	ctx.fillStyle = gradient;
	ctx.fill();
}

// Draw a marker depicting current power
function draw_fixed_power_marker(canvas) {
	var ctx = canvas.getContext("2d");

	ctx.lineWidth = 5;

	ctx.beginPath();
	ctx.moveTo(0, ctx.lineWidth/2);
	ctx.lineTo(canvas.width, ctx.lineWidth/2);
	ctx.moveTo(0, canvas.height-ctx.lineWidth/2);
	ctx.lineTo(canvas.width, canvas.height-ctx.lineWidth/2);
	ctx.moveTo(canvas.width/2, 0);
	ctx.lineTo(canvas.width/2, canvas.height);

	ctx.strokeStyle = "black";
	ctx.stroke();
}

// Make the marker move
document.getElementById("power_triangle").addEventListener('click', function(event) {
	if (event.button) return; // Not left-button, ignore

	var canvas = document.getElementById("power_triangle");

	// TODO: De-jquery, finding relative position without it is a PIA though
	var x = event.pageX - $(canvas).offset().left;
	var pcnt = x/canvas.width*100;

	set_power_marker(pcnt);
});


function pcnt2left(pcnt) {
	var tri = document.getElementById("power_triangle");
	var mrk = document.getElementById("power_marker");

	var x = pcnt/100*tri.width;
	return x - mrk.width/2; /* Not sure why there is the 4px offset */
}

function left2pcnt(left) {
	var tri = document.getElementById("power_triangle");
	var mrk = document.getElementById("power_marker");

	var x = left + mrk.width/2; /* Not sure why there is the 4px offset */
	var pcnt = x/tri.width*100
	return pcnt > 100 ? 100 : pcnt < 0 ? 0 : pcnt;
}


function set_power_marker(percentage) {
	var mrk = document.getElementById("power_marker");

	mrk.style.left = pcnt2left(percentage) + "px";

	document.getElementById("power_pcnt").innerHTML = Math.round(percentage);
	var microwave_wattage = 1200;
	document.getElementById("power_watts").innerHTML = Math.round(microwave_wattage*percentage/100);
}


document.getElementById("power_marker").onmousedown = function(event) {
	if (event.button) return; // Not left-button, ignore

	var start = event.pageX;

	var mrk = document.getElementById("power_marker");
	var abs_left = $("#power_triangle").offset().left+4; // TODO: 4px offset? why...
	var width = document.getElementById("power_triangle").offsetWidth;

	var left = parseFloat(mrk.style.left) || 0;

	document.onmousemove = function(e) {
		if (e.pageX < abs_left) {
			mrk.style.left = (left + abs_left-start)+"px";
		} else if (e.pageX > abs_left+width) {
			mrk.style.left = (left + abs_left-start+width)+"px";
		} else {
			mrk.style.left = (left + e.pageX-start)+"px";
		}
	}

	document.onmouseup = function(e) {
		document.onmousemove = document.onmouseup = null;
		set_power_marker( left2pcnt( parseFloat(mrk.style.left) || 0 ) );
	};
};

