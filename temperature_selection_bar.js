function t2y (v) {
	return Math.pow(v-30,1/1.8); // square-rootish
	return v-30; // linear
}

function temp_label (v) {
	temp_canvas = document.getElementById("temp_data");
	temp_ctx = temp_canvas.getContext("2d");
	var h = temp_canvas.offsetHeight;
	
	// Range from 150 to 30 degrees
	// Offset height to keep text within range
	h = h - 24;
	// var y = 12 + h - h/(150-30)*(v-30); // linear
	var y = 12 + h - h/t2y(150)*t2y(v);

	temp_ctx.font = "20px sans-serif";
	temp_ctx.fillStyle = "black";
	temp_ctx.textAlign = "right";
	temp_ctx.fillText(v+"°", canvas.offsetWidth-5, y+10); // +10 vertically centers text
}

temp_label(150);
temp_label(100);
temp_label(80);
temp_label(50);
temp_label(30);
