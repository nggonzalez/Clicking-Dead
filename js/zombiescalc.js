/**
 * test of zombiescalc.js
 */

var playerData = {};			// object to keep player data in.

var iterSpeed = 50;			// iteration interval speed.

var zombies = 1;			// current number of zombies
var critZombies = 25;			// critical number of zombies for loss

var currMaxSupplies = 100000;		// current maximum supply count.

var currSupplies = 100000;		// the amount of supplies remaining
								// in the environment.
								
var supplies = 0;				// synchronously updated supply counter.

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
	
	// add the logic for the companions' scavenge stuff.
	
	var companionScavenge = 0;

	for (var i = 0; i < playerData.companions.length; i++) {
		companionScavenge += (playerData.companions[i].scavenge)/(1000/iterSpeed);
	}
	currSupplies -= companionScavenge;			// remove from environment.
	supplies += companionScavenge;

	// increase zombie spawn rate
	if (currCheckpoint < zombieCheckpoints.length &&
		cyclesElapsed * (iterSpeed/1000) > zombieCheckpoints[currCheckpoint]) {
		currCheckpoint++;
		zombieGenerationRate *= 1.25;			// proceed to the next checkpoint
		postMessage({
			type : "notification",
			message : "A mob of walkers is entering your location!"
		});
	}

	// spawn zombies
	if (Math.random() < zombieMultProb) { 
		zombies += zombieGenerationRate;
	}

	// kill zombies
	

	var companionWpl = 0;
	for (var i = 0; i < playerData.companions.length; i++) {
		companionWpl += playerData.companions[i].wpl;
	}
	// we now have a wpl for all of our combined people.
	
	var damageDone = 0;
	var suppliesUsed = 0;
	for (var i = 0; i < playerData.weapons.length; i++) {
		if (companionWpl - playerData.weapons[i].wpl >= 0 
			&& supplies + playerData.weapons[i].supply >= 0) {	// note .supply is neg.
			damageDone += playerData.weapons[i].damage;
			suppliesUsed += playerData.weapons[i].supply;
			companionWpl -= playerData.weapons[i].wpl;
		} else {
			break;
		}
	}
	var companionKills = damageDone/(1000/iterSpeed);
	zombies -= companionKills;

	supplies += suppliesUsed/(1000/iterSpeed);
	companionScavenge += suppliesUsed/(1000/iterSpeed);
	// pass UI update message
	var zombieVal = zombies / ( critZombies * Math.log(playerData.fortification));
	postMessage({
		type : "zombieReport",
		zombiesKilled : companionKills,
		perSecond : companionKills*(1000/iterSpeed),
		remainingZombiesPercent : zombieVal	
	});

	if (currSupplies > 0) {							// supplies remaining check.
		var supplyVal = currSupplies / currMaxSupplies;
		postMessage({
			type : "scavengeReport",
			amountScavenged : companionScavenge, 
			perSecond : companionScavenge*(1000/iterSpeed),
			remainingSuppliesPercent : supplyVal	// the new supply bar value.
		});
	}


}, iterSpeed);


/*
 * we will send the message here.  zombiescalc must support a variety of message protocols
 */
onmessage = function (event) {
	if(event.data.type == "update") {
		playerData = event.data.data;
		supplies = playerData.supplies;
	} else if (event.data.type == 'kill') {
		if (zombies <= 0) {
			return;
		}
		var tmpZombies = (zombies - playerData.personalDamage);
		zombies = Math.max(tmpZombies, 0);
		postMessage({
			type : "zombieReport",
			zombiesKilled : playerData.personalDamage,
			remainingZombiesPercent : zombies / (critZombies * Math.log(playerData.fortification))
		});
	} else if (event.data.type == 'scavenge') {
		if (currSupplies <= 0) {		// cannot gather resources if they are not there.
			return;
		}

		var tmpSupplies = (currSupplies - playerData.personalScavenge);
		currSupplies = Math.max(tmpSupplies, 0);
		supplies += playerData.personalScavenge;

		postMessage({
			type : "scavengeReport",
			amountScavenged : playerData.personalScavenge,
			remainingSuppliesPercent : currSupplies / currMaxSupplies
		});
	}
};
