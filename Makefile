start.css:
	sass style.scss start.css

start.min.css:
	sass style.scss start.min.css --style compressed

thermometer_C.css:
	sass thermometer_C.scss thermometer_C.css

thermometer_C.min.css:
	sass thermometer_C.scss thermometer_C.min.css --style compressed

.phony: watch-css
watch-css:
	sass --watch style.scss:start.css thermometer_C.scss:thermometer_C.css
