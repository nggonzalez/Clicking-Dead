/**
 * test of scavengecalc.js
 */

var playerData = {};			// object to keep player data in.

var iterSpeed = 100;			// iteration interval speed.

var currMaxSupplies = 100000;		// current maximum supply count.

var currSupplies = 100000;		// the amount of supplies remaining
								// in the environment.
								
// var baseConsumption = 1; 	// Doesn't make sense, very hard at the beginning
								// I think we may be trying to do too much
/*
 * main execution loop of the zombie generation, will be made more complex
 * as development on the game continues
 */
setInterval(function() {
	// we will allow for the eventual decay of supplies in the region,
	// reducing the amount of supplies gained by a scavenge call.
	
	if (currSupplies <= 0) {
		return;					// exit out if you run out of resources.
	}

	var companionScavenge = 0;

	for (var i = 0; i < playerData.companions.length; i++) {
		companionScavenge += (playerData.companions[i].scavenge)/(1000/iterSpeed);	
	}
	currSupplies -= companionScavenge;

	// now deal with consumption problems.
	
	/******************************** IMPORTANT ******************************/
	// Removing companion consumption because, looking at it now, it looks unnatural
	// and arbitrary. Also, it seems like we're doing too much and 
	// missing a connection with the zombie killing.
	/*
	companionScavenge -= baseConsumption/(1000/iterSpeed);
	for (var i = 0; i < playerData.companions.length; i++) { 
		companionScavenge += playerData.companions[i].supply/(1000/iterSpeed);
	}
	*/

	for (var i = 0; i < playerData.weapons.length; i++) {
		companionScavenge += playerData.weapons[i].supply/(1000/iterSpeed);
	}

	var supplyVal = currSupplies / currMaxSupplies;
	postMessage({
		amountScavenged : companionScavenge, 
		remainingSuppliesPercent : supplyVal	// the new supply bar value.
	});	
	
}, iterSpeed);

/*
 * we will send the message here.  zombiescalc must support a variety of message protocols
 */
onmessage = function (event) {
	if(event.data.type == "update") {
		playerData = event.data.data;
	} else if (event.data.type == 'scavenge') {
		if (currSupplies <= 0) {		// cannot gather resources if they are not there.
			return;
		}

		var tmpSupplies = (currSupplies - playerData.personalScavenge);
		currSupplies = Math.max(tmpSupplies, 0);
		postMessage({
			amountScavenged : playerData.personalScavenge,
			remainingSuppliesPercent : currSupplies / currMaxSupplies
		});
	}
};
