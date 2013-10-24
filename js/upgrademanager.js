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
	prereqs : [-1, -1],
	price : 45,					// supply cost of the companion.
	numOwned : 0
});

// PAUL. our test person
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Paul",				// name of the companion
	desc : "trying out a new guy",
	id : "C1",
	scavenge : 4,				// scavenge rate of the companion
	damage : 4,					// damage rate of the companion
	supply : -2,				// amount he "eats"
	prereqs : [-1, -1],
	price : 1,					// supply cost of the companion.
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
	prereqs : [-1, -1],
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
	prereqs : [-1, -1],
	numOwned : 0
});

// Paul's Magnum
weapons.push({
	type : "weapons",
	name : "Paul's Magnum",
	desc : "just a little bit more flavor text to write",
	id : "W2",
	noise : 5,					// as a percent
	damage : 5,					// increases a single companion's stats.
	supply : -1,
	price : 5,
	prereqs : [-1, -1],
	numOwned : 0
});

//////// DEFINE ALL UPGRADES ///////////////////////////////////
var upgrades = [];

// Nerves of Steel
upgrades.push({
	type : "upgrades",
	name : "Nerves of Steel",
	desc : "you have nerves of steel and are less likely to be overrun by the zombies",
	price : 15,
	upgrade : [function(data) {
		data.fortification += 10;
		return data;
	}],
	prereqs : [-1, -1],
	numOwned : 0
});




/**
 * respond to message requests from the main controller here.
 * this is the main message sequence of the webworker
 */
onmessage = function (event) {
	if (event.data.type == "purchase") {
		// handle all purchase requests and logic here
		var type = "";
		var targetEntry;

		for(var i = 0; i < weapons.length && type == ""; i++) {	// linear search
			if(weapons[i].id == event.data.id) { 
				if (event.data.currSupplies >= weapons[i].price) {
					weapons[i].numOwned++;
					type = "weapons";
					targetEntry = weapons[i];
					break;
				}
			}
		}

		for(var i = 0; i < companions.length && type == ""; i++) {	// linear search
			if(companions[i].id == event.data.id) { 
				if (event.data.currSupplies >= companions[i].price) {
					companions[i].numOwned++;
					type = "companions";
					targetEntry = companions[i];
					break;
				}
			}
		}

		for(var i = 0; i < upgrades.length && type == ""; i++) {	// linear search
			if(upgrades[i].id == event.data.id) { 
				if (event.data.currSupplies >= upgrades[i].price) {
					upgrades[i].owned = true;
					type = "upgrades";
					targetEntry = upgrades[i];
					break;
				}
			}
		}
		
		// we now have the entry and the type of the searched code.
		if (type == "") {
			return;				// no such entry was found
		} else {
			postMessage({
				type : "purchase",
				domain : type,
				cost : targetEntry.price,
				value : targetEntry
			});
		}
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
		postMessage({
			type : "upgrades",
			data : upgrades
		});
	} else if (event.data.type == "achievements") { 
		// open the achievements tab.



	} else if (event.data.type == "update") {
		playerData = event.data.data;
		// there should be no logic caught here.
	}
};



