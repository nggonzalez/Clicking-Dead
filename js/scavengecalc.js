/**
 * test of scavengecalc.js
 */

var playerData = {};			// object to keep player data in.

var iterSpeed = 100;			// iteration interval speed.

var currMaxSupplies = 100;		// current maximum supply count.

var currSupplies = 100;			// the amount of supplies remaining
								// in the environment.
								
var supplyDecayProb = 0.05;		// probability of supply decaying after
								// a single time interval.

/*
 * main execution loop of the zombie generation, will be made more complex
 * as development on the game continues
 */
setInterval(function() {
	// we will allow for the eventual decay of supplies in the region,
	// reducing the amount of supplies gained by a scavenge call.
	if(Math.random() < supplyDecayProb) {
		currSupplies--;
		var supplyVal = currSupplies / currMaxSupplies;
		postMessage(supplyVal);				// the new supply bar value.
	}
}, iterSpeed);

/*
 * we will send the message here.  zombiescalc must support a variety of message protocols
 */
onmessage = function (event) {
	if(event.data.type == "update") {
		playerData = event.data.data;
	} else if (event.data.type == 'scavenge') {
		var tmpSupplies = (currSupplies - playerData.personalScavenge);
		currSupplies = Math.max(tmpSupplies, 0);
		postMessage(currSupplies/currMaxSupplies);
	}
};
