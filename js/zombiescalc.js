/**
 * test of zombiescalc.js
 */

var playerData = {};			// object to keep player data in.

var iterSpeed = 10;			// iteration interval speed.

var zombies = 1;			// current number of zombies
var critZombies = 10000;			// critical number of zombies for loss

var zombieMultProb = .4;		// probability of zombies multiplying.

var zombieGenerationRate = 5;	// this will increase over time

/*
 * main execution loop of the zombie generation, will be made more complex
 * as development on the game continues
 */
setInterval(function() {


	// spawn zombies
	if (Math.random() < zombieMultProb) { 
		zombies += zombieGenerationRate;
	}

	// kill zombies
	var companionKills = 0;

	for (var i = 0; i < playerData.companions.length; i++) {
		companionKills += playerData.companions[i].damage/(1000/iterSpeed);
	}
	zombies -= companionKills

	// pass UI update message
	var zombieVal = zombies / ( critZombies * Math.log(playerData.fortification));
	postMessage({
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
			zombiesKilled : playerData.personalDamage,
			remainingZombiesPercent : zombies / (critZombies * Math.log(playerData.fortification))
		});
	}
};
