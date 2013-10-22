/*
 * Global Clicking Dead Javascript Object
 */
var ClickingDead = {};
ClickingDead.functionName = function () {};

/*
 * Window Load and initialization steps.
 */
$(window).load(function() {
	
	var worker = new Worker("/js/zombiescalc.js");

	worker.onmessage = function (event) {
		var message = event.data;
		var worker = event.target;
		alert("event returned");
	};

	$("body").on("click", "#testButton", function() {
		worker.postMessage("ping");
	});
});




