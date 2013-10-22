/**
 * test of zombiescalc.js
 */

var playerData = {};			// object to keep player data in.

var zombies = 1;			// current number of zombies
var critZombies = 1000;			// critical number of zombies for loss

var zombieMultProb = .4;

setInterval(function() {
	Math.random() > zombieMultProb ? zombies += 2 : zombies++;
	var zombieVal = zombies / ( critZombies * Math.log(playerData.fortification));
	postMessage(zombieVal);
}, 10);


/*
 * we will send the message here.  zombiescalc must support a variety of message protocols
 */
onmessage = function (event) {
	if(event.data.type == "update") {
		playerData = event.data.data;
	} else if (event.data.type == 'kill') {
		zombies = (zombies - playerData.personalDamage > 0) ? 
				zombies - playerData.personalDamage : 0;
	}
	postMessage(event.data.type == 'kill');
};
