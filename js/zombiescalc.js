/**
 * test of zombiescalc.js
 */

var playerData = {};			// object to keep player data in.

var ZombieCalc = {}


ZombieCalc.data = {
	iterSpeed : 50,			// iteration interval speed.
	zombies : 100,			// current number of zombies
	critZombies : 2500,			// critical number of zombies for loss
	currMaxSupplies : 100000,		// current maximum supply count.
	currSupplies : 100000,		// the amount of supplies remaining
	supplies : 0,				// synchronously updated supply counter.
	zombieMultProb : .2,		// probability of zombies multiplying.
	zombieGenerationRate : 1,	// this will increase over time
	cyclesElapsed : 0
};

/*
 * main execution loop of the zombie generation, will be made more complex
 * as development on the game continues
 */
setInterval(function() {
	ZombieCalc.data.cyclesElapsed++;
	
	var scaleFactor = (1000/ZombieCalc.data.iterSpeed);


	// add the logic for the companions' scavenge stuff.
	
	var companionScavenge = 0;

	for (var i = 0; i < playerData.companions.length; i++) {
		companionScavenge += (playerData.companions[i].scavenge)/(1000/ZombieCalc.data.iterSpeed);
	}
	ZombieCalc.data.currSupplies -= companionScavenge;			// remove from environment.
	ZombieCalc.data.supplies += companionScavenge;

	// increase zombie spawn rate
	if (ZombieCalc.data.cyclesElapsed % 200 == 0 && Math.random < ZombieCalc.data.zombieMultProb) {
		ZombieCalc.data.zombieGenerationRate *= 2;			// proceed to the next checkpoint
		postMessage({
			type : "notification",
			message : "A mob of walkers is entering your location!"
		});
	}

	// spawn zombies
	if (Math.random() < ZombieCalc.data.zombieMultProb) { 
		ZombieCalc.data.zombies += ZombieCalc.data.zombieGenerationRate;
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
			&& ZombieCalc.data.supplies + playerData.weapons[i].supply >= 0) {	// note .supply is neg.
			damageDone += playerData.weapons[i].damage;
			suppliesUsed += playerData.weapons[i].supply;
			companionWpl -= playerData.weapons[i].wpl;
		} else {
			break;
		}
	}
	var companionKills = damageDone/scaleFactor;
	ZombieCalc.data.zombies -= companionKills;

	ZombieCalc.data.supplies += suppliesUsed/scaleFactor;
	companionScavenge += suppliesUsed/scaleFactor;
	// pass UI update message
	var zombieVal = ZombieCalc.data.zombies / ( ZombieCalc.data.critZombies * Math.log(playerData.fortification));
	postMessage({
		type : "zombieReport",
		zombiesKilled : companionKills,
		perSecond : companionKills*scaleFactor,
		remainingZombiesPercent : zombieVal	
	});

	if (ZombieCalc.data.currSupplies > 0) {							// supplies remaining check.
		var supplyVal = ZombieCalc.data.currSupplies / ZombieCalc.data.currMaxSupplies;
		postMessage({
			type : "scavengeReport",
			amountScavenged : companionScavenge, 
			perSecond : companionScavenge*scaleFactor,
			remainingSuppliesPercent : supplyVal	// the new supply bar value.
		});
	}

	if (ZombieCalc.data.cyclesElapsed % 1000 == 0) {
		postMessage({
			type : "saveUpdate",
			data : ZombieCalc
		});
	}
}, ZombieCalc.data.iterSpeed);


/*
 * we will send the message here.  zombiescalc must support a variety of message protocols
 */
onmessage = function (event) {
	if(event.data.type == "update") {
		playerData = event.data.data;
		ZombieCalc.data.supplies = playerData.supplies;
	} else if (event.data.type == 'kill') {
		if (ZombieCalc.data.zombies <= 0) {
			return;
		}
		var tmpZombies = (ZombieCalc.data.zombies - playerData.personalDamage);
		ZombieCalc.data.zombies = Math.max(tmpZombies, 0);
		postMessage({
			type : "zombieReport",
			zombiesKilled : playerData.personalDamage,
			remainingZombiesPercent : ZombieCalc.data.zombies / (ZombieCalc.data.critZombies * Math.log(playerData.fortification))
		});
	} else if (event.data.type == 'restore') {
		playerData = event.data.data;
		ZombieCalc = playerData.zombieCalcData;
	} else if (event.data.type == 'scavenge') {
		if (ZombieCalc.data.currSupplies <= 0) {		// cannot gather resources if they are not there.
			return;
		}

		var tmpSupplies = (ZombieCalc.data.currSupplies - playerData.personalScavenge);
		ZombieCalc.data.currSupplies = Math.max(tmpSupplies, 0);
		ZombieCalc.data.supplies += playerData.personalScavenge;

		postMessage({
			type : "scavengeReport",
			amountScavenged : playerData.personalScavenge,
			remainingSuppliesPercent : ZombieCalc.data.currSupplies / ZombieCalc.data.currMaxSupplies
		});
	} else if (event.data.type == 'reloadCore') {
		ZombieCalc.data = event.data.data;
	}
};
