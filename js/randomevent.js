/* ======= randomevent.js =======
 *
 * a webworker definition javascript file that generates random events
 * for the Clicking-Dead web game.
 */

var playerData = {};			// object to keep player data in.

var allPossibleEvents = []; 		// all possible events that could happen.

var iterSpeed = 1000;			// iteration interval speed.
var eventProb = 0.1;			// event occurence probability

///////// GAME CORE ////////////////////////////////////////////
// define all random events that can happen in this code block
//
					



//////////////// END RANDEVENT DEFINITIONS//////////////////////

setInterval(function() { 
	if(Math.random() < eventProb) {
		if(Math.random() < 0.5) {
			postMessage({			// placeholder message
				type : "flavor",
				message : "Zombies are taking over Atlanta.  Hide yo' wife, hide yo' kids"
			});
		} else {
			postMessage({			// placeholder message
				type : "flavor",
				message : "Welcome to the Clicking Dead"
			});
		}
	}
}, iterSpeed);


/*
 * manage messages passed from the main Clicking-Dead thread.
 */
onmessage = function (event) {
	if(event.data.type == "update") {
		playerData = event.data.data;
	}
};
