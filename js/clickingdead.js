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
		var message = event.data;			// here we will read in the zombie value.
		// update the progress bar.
		$(".zombieMeter").attr('value', message);
	};

	$("body").on("click", "#testButton", function() {
		worker.postMessage("ping");
	});
});




