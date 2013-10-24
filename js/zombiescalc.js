/**
 * test of zombiescalc.js
 */

var playerData = {};			// object to keep player data in.

var iterSpeed = 10;			// iteration interval speed.

var zombies = 1;			// current number of zombies
var critZombies = 25;			// critical number of zombies for loss

var zombieMultProb = .02;		// probability of zombies multiplying.

var zombieGenerationRate = 1;	// this will increase over time

var zombieCheckpoints = [10, 20, 40, 60, 1000, 4000, 10000];

var currCheckpoint = 0;

var cyclesElapsed = 0;

/*
 * main execution loop of the zombie generation, will be made more complex
 * as development on the game continues
 */
setInterval(function() {
	cyclesElapsed++;
	
	// increase zombie spawn rate
	if (currCheckpoint < zombieCheckpoints.length &&
		cyclesElapsed * (iterSpeed/1000) > zombieCheckpoints[currCheckpoint]) {
		currCheckpoint++;
		zombieGenerationRate *= 1.25;			// proceed to the next checkpoint
		postMessage({
			type : "notification",
			message : "MOAR zombeez are coming"
		});
	}

	// spawn zombies
	if (Math.random() < zombieMultProb) { 
		zombies += zombieGenerationRate;
	}

	// kill zombies
	var companionKills = 0;

	for (var i = 0; i < playerData.companions.length; i++) {
		companionKills += playerData.companions[i].damage/(1000/iterSpeed);
	}
	zombies -= companionKills;

	// pass UI update message
	var zombieVal = zombies / ( critZombies * Math.log(playerData.fortification));
	postMessage({
		type : "report",
		zombiesKilled : companionKills,
		remainingZombiesPercent : zombieVal	
	});
}, iterSpeed);


/*
 * we will send the message here.  zombiescalc must support a variety of message protocols
 */
onmessage = function (event) {
	if(event.data.type == "update") {
		playerData = event.data.data;
	} else if (event.data.type == 'kill') {
		if (zombies <= 0) {
			return;
		}
		var tmpZombies = (zombies - playerData.personalDamage);
		zombies = Math.max(tmpZombies, 0);
		postMessage({
			type : "report",
			zombiesKilled : playerData.personalDamage,
			remainingZombiesPercent : zombies / (critZombies * Math.log(playerData.fortification))
		});
	}
};
