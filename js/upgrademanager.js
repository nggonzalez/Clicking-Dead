/** ======= upgrademanager.js ========
 * upgrademanager keeps track of which upgrades have been unlocked,
 * and serves those upgrades as a JSON object back to the main
 * view for placement onto the upgrade screen.  upgrademanager
 * will also keep track of which achievements have been unlocked.
 */

var playerData = {};			// store the player data here.

// there are fewer things to store here as compared to the other
// webworkers, simply due to the nature of this particular webworker.


//////// DEFINE ALL COMPANIONS //////////////////////////////////
var companions = [];

// RICK. our first generation prototype.
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Rick",				// name of the companion
	desc : "Wild-eyed mountain man Rick.",
	id : "C0",
	scavenge : 4,				// scavenge rate of the companion
	damage : 4,					// damage rate of the companion
	supply : -2,				// amount he "eats"
	price : 100,
	prereq : -1,
	price : 45,					// supply cost of the companion.
	numOwned : 0
});

//////// DEFINE ALL WEAPONS ////////////////////////////////////
var weapons = [];

// Rick's Magnum
weapons.push({
	type : "weapons",
	name : "Rick's Magnum",
	desc : "Rick's crazy-looking magnum.  Go pop some zombies.",
	id : "W0",
	noise : 5,					// as a percent
	damage : 5,					// increases a single companion's stats.
	supply : -1,
	price : 150,
	prereq : -1,
	numOwned : 0
});

// Joey's Magnum
weapons.push({
	type : "weapons",
	name : "Joey's Magnum",
	desc : "just a little bit more flavor text to write",
	id : "W1",
	noise : 5,					// as a percent
	damage : 5,					// increases a single companion's stats.
	supply : -1,
	price : 250,
	prereq : -1,
	numOwned : 0
});


//////// DEFINE ALL UPGRADES ///////////////////////////////////
var upgrades = [];

// Nerves of Steel
upgrades.push({
	type : "upgrades",
	name : "Nerves of Steel",
});




/**
 * respond to message requests from the main controller here.
 * this is the main message sequence of the webworker
 */
onmessage = function (event) {
	if (event.data.type == "purchase") {
		// handle all purchase requests and logic here



	} else if (event.data.type == "companions") {
		// open the companions tab.
		postMessage({
			type : "companions",
			data : companions
		});
	} else if (event.data.type == "weapons") {
		// open the weapons tab
		postMessage({
			type : "weapons",
			data : weapons
		});

	} else if (event.data.type == "upgrades") {
		// open the upgrades tab



	} else if (event.data.type == "achievements") { 
		// open the achievements tab.



	} else {
		// there should be no logic caught here.
	}
};



