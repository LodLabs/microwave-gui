// TODO: Make into a nice generic module
function time_dial(element, time) {
	$("#time_dial").knob({
		'remaining' : time,
		'min' : 0,
		'max' : time,

		// Can't seem to get a method in here and call it, so I play with this variable
		'adjust_time' : 0,

		'change' : function (value) {
			console.log("change : " + value);
			// TODO: Need to send this up to the server
			this.o.remaining = this.o.max - Math.round(value);
		},
		'adjust_time' : function (value) {
			console.log("adjusting");
			this.o.remaining += value;
			this.o.max += value;
			this.draw();
		},
		'draw': function() {
			// this.cv sets position of wheel, relative to min and max values
			// this.i is input, used to set value of inside the wheel
			if (this.o.adjust_time) {
				// adjust_time is a dodgy hack to let us change the time value from outside
				this.o.remaining += this.o.adjust_time;
				this.o.max += this.o.adjust_time;
				this.o.adjust_time = 0;
			}

			var remaining = this.o.remaining;
			this.cv = this.o.max - remaining;

			var mins = Math.floor(remaining/60);
			var secs = remaining%60;
			$(this.i).html("-"+mins+":"+((secs+'').length == 1 ? '0'+secs : secs));
		}
	});

	// Manually trigger the draw on load, otherwise value could be left over from page reload
	$("#time_dial").trigger('change');
}
