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
	
	passiveScavengeRate : 0,	// this will be on a per second basis.	
	passiveKillRate : 0,		// this is on a per second basis.
	passiveZombieResistance : 1500,
	
	cyclesElapsed : 0
};

/**
 * this is a function to refresh the calculations that we are going to be
 * using to push back to the main controller.  This will minimize
 * the work done by the processor to execute our program.
 *
 * called every time the situation is refreshed or updated.
 */
var refreshCalculations = function () {
	var scaleFactor = (1000/ZombieCalc.data.iterSpeed);
	
	var companionScavenge = 0;

	for (var i = 0; i < playerData.companions.length; i++) {
		companionScavenge += (playerData.companions[i].scavenge)/(1000/ZombieCalc.data.iterSpeed);
	}
	ZombieCalc.data.currSupplies -= companionScavenge;			// remove from environment.



	// ZombieCalc.data.supplies += companionScavenge;

	var companionWpl = 0;
	for (var i = 0; i < playerData.companions.length; i++) {
		companionWpl += playerData.companions[i].wpl;
	}
	// we now have a wpl for all of our combined people.
	
	var damageDone = 0;
	var suppliesUsed = 0;
	for (var i = 0; i < playerData.weapons.length; i++) {
		if(i == 0) {
			playerData.weapons = playerData.weapons.sort(function(obj1, obj2) {
				// Descending: first damage greater than the previous
				return obj2.damage - obj1.damage;
			});
		}
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
	
	//ZombieCalc.data.zombies -= companionKills;

	//ZombieCalc.data.supplies += suppliesUsed/scaleFactor;
	
	companionScavenge += suppliesUsed/scaleFactor;


	ZombieCalc.data.passiveKillRate = companionKills;
	ZombieCalc.data.passiveScavengeRate = companionScavenge;
	ZombieCalc.data.passiveZombieResistance = ZombieCalc.data.critZombies * Math.log(playerData.fortification);
}

/*
 * main execution loop of the zombie generation, will be made more complex
 * as development on the game continues
 */
setInterval(function() {
	ZombieCalc.data.cyclesElapsed++;

	// increase zombie spawn rate
	if (ZombieCalc.data.cyclesElapsed % 1500 == 0) {
		ZombieCalc.data.zombieGenerationRate *= 2;			// proceed to the next checkpoint
		postMessage({
			type : "notification",
			message : "A mob of walkers is entering your location!"
		});
	}

	// spawn zombies.
	ZombieCalc.data.zombies += ZombieCalc.data.zombieGenerationRate;

	// consume resources.
	ZombieCalc.data.zombies -= ZombieCalc.data.passiveKillRate;

	// kill zombies.
	ZombieCalc.data.supplies += ZombieCalc.data.passiveScavengeRate;

	// pass UI update message
	var zombieVal = ZombieCalc.data.zombies / ZombieCalc.data.passiveZombieResistance;
	
	
	var supplyOverrun = 0;

	if (zombieVal >= 1) { 
		// then we got overrun! Start losing data.
		// supplyPerSecond = supplyPerSecond + " -.5%";
		supplyOverrun = 0.005 * ZombieCalc.data.supplies;
		ZombieCalc.data.supplies -= supplyOverrun;
	}

	var supplyPerSecond = (ZombieCalc.data.passiveScavengeRate - supplyOverrun)*(1000/ZombieCalc.data.iterSpeed);
	var supplyVal = 0;

	postMessage({
		type : "zombieReport",
		zombiesKilled : ZombieCalc.data.passiveKillRate,
		perSecond : ZombieCalc.data.passiveKillRate*(1000/ZombieCalc.data.iterSpeed),
		remainingZombiesPercent : zombieVal	
	});

	if (ZombieCalc.data.currSupplies > 0) {							// supplies remaining check.
		var supplyVal = ZombieCalc.data.currSupplies / ZombieCalc.data.currMaxSupplies;
		postMessage({
			type : "scavengeReport",
			amountScavenged : ZombieCalc.data.passiveScavengeRate - supplyOverrun, 
			perSecond : supplyPerSecond,
			remainingSuppliesPercent : supplyVal	// the new supply bar value.
		});
	}

	if (ZombieCalc.data.cyclesElapsed % 10 == 0) {
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
		refreshCalculations();
		
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
		ZombieCalc.data.supplies = playerData.supplies;
		refreshCalculations();
		//ZombieCalc = playerData.zombieCalcData;
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
	} else if (event.data.type == 'newLocationSupplyChange') {
		ZombieCalc.data.currMaxSupplies = event.data.supplies;
		ZombieCalc.data.currSupplies = event.data.supplies;
		ZombieCalc.data.supplies = 0;
		refreshCalculations();

	} else if (event.data.type == 'reloadCore') {
		ZombieCalc.data = event.data.data;
	}
};
