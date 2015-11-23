// TODO: Make into a nice generic module
function time_dial(element, time, finished_callback) {
	var total_time = time;
	var timer = total_time; // counts down
	$("#time_dial").knob({
			change : function (value) {
				console.log("change : " + value);
				timer = total_time - Math.round(value);
			},
		/*
			release : function (value) {
				console.log("release : " + value);
			},
			cancel : function () {
				console.log("cancel : ", this);
			},
			format : function (value) {
				console.log("format : " + value);
			},
			*/

		'draw': function() {
			// this.cv sets position of wheel, relative to min and max values
			// this.i is input, used to set value of inside the wheel
			this.cv = total_time - timer;

			var mins = Math.floor(timer/60);
			var secs = timer%60;
			$(this.i).html("-"+mins+":"+((secs+'').length == 1 ? '0'+secs : secs));
		}
	}).trigger('configure', {
		"min":0,
		"max":total_time,
	});

	// Count down the time
	var timer_interval = setInterval(update_timer, 1000); // 1000ms
	function update_timer() {
		if (timer > 0) {
			timer = timer - 1;
			$("#time_dial").trigger('change');
		} else {
			clearInterval(timer_interval);
			finished_callback();
		}
	}

	function increment_time(knob, seconds) {
		total_time = total_time + seconds;
		timer = timer + seconds;
		$(knob).trigger('configure', { "max":total_time } );
	}

	// Manually trigger the draw on load, otherwise value could be left over from page reload
	$("#time_dial").trigger('change');
	$("#time_dial").on("click", function() { increment_time(this, 30) });
}
