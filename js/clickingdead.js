/*
 * Global Clicking Dead Javascript Object
 */
var ClickingDead = {};
ClickingDead.functionName = function () {};


/*
 * Window Load and initialization steps.
 */
$(window).load(function() {
	alert("hello world");

	$("body").on("click", "#testButton", function() {
		alert("I got clicked bro");
	});
});



/*
 * Window Load Variables
 */




