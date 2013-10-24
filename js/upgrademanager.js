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
	name : "Sheriff Rick",				// name of the companion
	desc : "A natural born leader and killer of zombies.",
	id : "C0",
	scavenge : 95000,				// scavenge rate of the companion
	damage : 100000,					// damage rate of the companion
	supply : -2,				// amount he "eats"
	prereqs : [-1, -1],
	price : 50000000000,					// supply cost of the companion.
	numOwned : 0
});

// Daryl
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Daryl",				// name of the companion
	desc : "An all around badass. Great at scavenging and killing zombies.",
	id : "C1",
	scavenge : 215000,				// scavenge rate of the companion
	damage : 50000,					// damage rate of the companion
	supply : -2,				// amount he "eats"
	prereqs : [-1, -1],
	price : 220000000,					// supply cost of the companion.
	numOwned : 0
});

// Shane
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Deputy Shane",				// name of the companion
	desc : "A friend of Rick's. He is strong and a capable leader.",
	id : "C2",
	scavenge : 13000,				// scavenge rate of the companion
	damage : 25000,					// damage rate of the companion
	supply : -2,				// amount he "eats"
	prereqs : [-1, -1],
	price : 650000000,					// supply cost of the companion.
	numOwned : 0
});

// Merle
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Merle",				// name of the companion
	desc : "Daryl's older brother. A redneck who is rough around the edges.",
	id : "C3",
	scavenge : 2500,				// scavenge rate of the companion
	damage : 32000,					// damage rate of the companion
	supply : -2,				// amount he "eats"
	prereqs : [-1, -1],
	price : 6660000,					// supply cost of the companion.
	numOwned : 0
});

// Michonne
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Michonne",				// name of the companion
	desc : "Attitude in human form! She scavenges and kills zombies with ease.",
	id : "C4",
	scavenge : 3000,				// scavenge rate of the companion
	damage : 5000,					// damage rate of the companion
	supply : -2,				// amount he "eats"
	prereqs : [-1, -1],
	price : 5600000,					// supply cost of the companion.
	numOwned : 0
});

// Glenn
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Glenn",				// name of the companion
	desc : "Young, Asian guy who's quick on his feet. Perfect for scavenging.",
	id : "C5",
	scavenge : 15000,				// scavenge rate of the companion
	damage : 200,					// damage rate of the companion
	supply : -1,				// amount he "eats"
	prereqs : [-1, -1],
	price : 2400000,					// supply cost of the companion.
	numOwned : 0
});

// Carl
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Carl",				// name of the companion
	desc : "Rick's youngest son. He is a good shot, but still has a lot to learn",
	id : "C6",
	scavenge : 1000,				// scavenge rate of the companion
	damage : 500,					// damage rate of the companion
	supply : -2,				// amount he "eats"
	prereqs : [-1, -1],
	price : 680000,					// supply cost of the companion.
	numOwned : 0
});

// Hershel
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Hershel",				// name of the companion
	desc : "A friendly, wise veterinarian. He is slow on his feet, however.",
	id : "C7",
	scavenge : 100,				// scavenge rate of the companion
	damage : 10,					// damage rate of the companion
	supply : 10,				// amount he "eats"
	prereqs : [-1, -1],
	price : 72000,					// supply cost of the companion.
	numOwned : 0
});

// Carol
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Carol",				// name of the companion
	desc : "A tough woman capable of defending herself and others. She is a good teacher.",
	id : "C8",
	scavenge : 10,				// scavenge rate of the companion
	damage : 500,					// damage rate of the companion
	supply : -1,				// amount he "eats"
	prereqs : [-1, -1],
	price : 41000,					// supply cost of the companion.
	numOwned : 0
});

// Maggie
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Maggie",				// name of the companion
	desc : "Hershel's daughter.",
	id : "C9",
	scavenge : 50,				// scavenge rate of the companion
	damage : 350,					// damage rate of the companion
	supply : -1,				// amount he "eats"
	prereqs : [-1, -1],
	price : 28000,					// supply cost of the companion.
	numOwned : 0
});

// Andrea
companions.push({
	type : "companion",			// the type of item for disambiguation
	name : "Andrew",				// name of the companion
	desc : "Always acting out. She thinks she is better than she is.",
	id : "C10",
	scavenge : 10,				// scavenge rate of the companion
	damage : 20,					// damage rate of the companion
	supply : -10,				// amount he "eats"
	prereqs : [-1, -1],
	price : 10000,					// supply cost of the companion.
	numOwned : 0
});


//////// DEFINE ALL WEAPONS ////////////////////////////////////
var weapons = [];

// Grenade Launcher
weapons.push({
	type : "weapons",
	name : "Grenade Launcher",
	desc : "Create a shower of zombie limbs from a distance.",
	id : "W0",
	noise : 30,					// as a percent
	damage : 1000,					// increases a single companion's stats.
	supply : -80,
	price : 234500000000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Sniper Rifle
weapons.push({
	type : "weapons",
	name : "Sniper Rifle",
	desc : "Keep zombies at a distance with this super powerful, long range rifle.",
	id : "W1",
	noise : 20,					// as a percent
	damage : 25,					// increases a single companion's stats.
	supply : 5,
	price : 7864000500,
	prereqs : [-1, -1],
	numOwned : 0
});

// Rick's Magnum
weapons.push({
	type : "weapons",
	name : "Rick's Magnum",
	desc : "Rick's six shot .44 magnum. Very powerful, but slow to reload.",
	id : "W2",
	noise : 10,					// as a percent
	damage : 80,					// increases a single companion's stats.
	supply : -10,
	price : 22000000000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Cross Bow
weapons.push({
	type : "weapons",
	name : "Daryl's Crossbow",
	desc : "The ultimate crossbow. Accurate and deadly.",
	id : "W3",
	noise : 0,					// as a percent
	damage : 60,					// increases a single companion's stats.
	supply : -4,
	price : 50000000000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Katana
weapons.push({
	type : "weapons",
	name : "Michonne's Katana",
	desc : "Slice through zombies like nothing.",
	id : "W4",
	noise : 0,					// as a percent
	damage : 30,					// increases a single companion's stats.
	supply : -1,
	price : 320000000000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Compound Bow and arrow
weapons.push({
	type : "weapons",
	name : "Compound Bow and Arrow",
	desc : "Carbon fiber bow and arrow. More accurate and easier to use.",
	id : "W5",
	noise : 0,					// as a percent
	damage : 8,					// increases a single companion's stats.
	supply : -2,
	price : 250000000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Ak47
weapons.push({
	type : "weapons",
	name : "AK47",
	desc : "A durable, reliable automatic, assualt rifle.",
	id : "W6",
	noise : 8,					// as a percent
	damage : 15,					// increases a single companion's stats.
	supply : -5,
	price : 2500340,
	prereqs : [-1, -1],
	numOwned : 0
});

// M4
weapons.push({
	type : "weapons",
	name : "M4 Assualt Rifle",
	desc : "An accurate, automatic, assualt rifle. Light and quick.",
	id : "W7",
	noise : 6,					// as a percent
	damage : 15,					// increases a single companion's stats.
	supply : -4,
	price : 5600000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Bow and arrow
weapons.push({
	type : "weapons",
	name : "Classic Bow and Arrow",
	desc : "Go back into prehistoric times and hunt zombies with classic bows and arrows.",
	id : "W8",
	noise : 0,					// as a percent
	damage : 2,					// increases a single companion's stats.
	supply : -1,
	price : 1000000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Wrench
weapons.push({
	type : "weapons",
	name : "Wrench",
	desc : "Bash zombies with a red wrench.",
	id : "W9",
	noise : 2,					// as a percent
	damage : 5,					// increases a single companion's stats.
	supply : -2,
	price : 7851000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Glock
weapons.push({
	type : "weapons",
	name : "Glock",
	desc : "Automatic pistol.",
	id : "W10",
	noise : 4,					// as a percent
	damage : 20,					// increases a single companion's stats.
	supply : -4,
	price : 895000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Machete
weapons.push({
	type : "weapons",
	name : "Bloody, Rusty Machete",
	desc : "Cut your way through a mob of zombies.",
	id : "W11",
	noise : 0,					// as a percent
	damage : 5,					// increases a single companion's stats.
	supply : -1,
	price : 320000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Grenades
weapons.push({
	type : "weapons",
	name : "Grenades",
	desc : "Blow up a zombie with these basic grenades.",
	id : "W12",
	noise : 30,					// as a percent
	damage : 100,					// increases a single companion's stats.
	supply : -25,
	price : 220050,
	prereqs : [-1, -1],
	numOwned : 0
});

// Molotov Cocktails
weapons.push({
	type : "weapons",
	name : "Molotov Cocktails",
	desc : "Set zombies ablaze with these fiery concotions.",
	id : "W13",
	noise : 5,					// as a percent
	damage : 10,					// increases a single companion's stats.
	supply : -5,
	price : 46000,
	prereqs : [-1, -1],
	numOwned : 0
});


// 9mm pistol
weapons.push({
	type : "weapons",
	name : "9mm Pistol",
	desc : "9mm pistol that is light and easy to use.",
	id : "W14",
	noise : 4,					// as a percent
	damage : 5,					// increases a single companion's stats.
	supply : -2,
	price : 52000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Police Baton
weapons.push({
	type : "weapons",
	name : "Police Baton",
	desc : "Metal police baton, perfect for bludgeoning zombies",
	id : "W15",
	noise : 1,					// as a percent
	damage : 6,					// increases a single companion's stats.
	supply : -1,
	price : 26000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Crowbar
weapons.push({
	type : "weapons",
	name : "Crowbar",
	desc : "Metal crowbar.",
	id : "W16",
	noise : 20,					// as a percent
	damage : 25,					// increases a single companion's stats.
	supply : -5,
	price : 7000,
	prereqs : [-1, -1],
	numOwned : 0
});

// Spear
weapons.push({
	type : "weapons",
	name : "Wooden, Homemade Spear",
	desc : "Keep zombies at a distance with this sharp, wooden stick.",
	id : "W17",
	noise : 0,					// as a percent
	damage : 5,					// increases a single companion's stats.
	supply : -2,
	price : 2500,
	prereqs : [-1, -1],
	numOwned : 0
});


// Basic Kitchen Knife
weapons.push({
	type : "weapons",
	name : "Basic Kitchen Knife",
	desc : "What it sounds like, a steak knife. Get up close and personal",
	id : "W18",
	noise : 0,					// as a percent
	damage : 1,					// increases a single companion's stats.
	supply : 0,
	price : 650,
	prereqs : [-1, -1],
	numOwned : 0
});


// Pocket Knife
weapons.push({
	type : "weapons",
	name : "Pocket Knife",
	desc : "Sharp, small knife to kill zombies with in an up close and personal way.",
	id : "W19",
	noise : 0,					// as a percent
	damage : 1,					// increases a single companion's stats.
	supply : -1,
	price : 300,
	prereqs : [-1, -1],
	numOwned : 0
});


//////// DEFINE ALL UPGRADES ///////////////////////////////////
var upgrades = [];

var nervesOfSteelUpgrade = 1;

// Sheriff Hat
upgrades.push({
	type : "upgrades",
	id : "U0",
	name : "Rick's Sheriff Hat",
	desc : "You know who's the boss.  Kill zombies in style.",
	price : 10000000000,
	upgrade : "hatUpgrade",
	prereqs : [-1, -1],
	numOwned : 0
});

upgrades.push({
	type : "upgrades",
	id : "U1",
	name : "Daryl's Motorcyle",
	desc : "Scavenge more effectively as you can move around more quickly",
	price : 36900000,
	upgrade : "basicScavengerUpgrade",
	prereqs : [-1, -1],
	numOwned : 0
});

upgrades.push({
	type : "upgrades",
	id : "U2",
	name : "Rick's Sheriff Badge",
	desc : "Bring the law to the zombies - increase your damage by 10%. Also makes your companions slightly more effective.",
	price : 8900000,
	upgrade : "sheriffBadgeUpgrade",
	prereqs : [-1, -1],
	numOwned : 0
});

// Nerves of Steel
upgrades.push({
	type : "upgrades",
	id : "U3",
	name : "Nerves of Steel",
	desc : "You have nerves of steel and are less likely to be overrun by the zombies",
	price : 25000000,
	upgrade : "nervesOfSteelUpgrade",
	prereqs : [-1, -1],
	numOwned : 0
});

// Foraging Book
upgrades.push({
	type : "upgrades",
	id : "U4",
	name : "Foraging Book",
	desc : "A book that teaches you how to forage more effectively",
	price : 340000,
	upgrade : "basicScavengerUpgrade",
	prereqs : [-1, -1],
	numOwned : 0
});


upgrades.push({
	type : "upgrades",
	id : "U5",
	name : "Water Bottles",
	desc : "Stay hydrated while scavenging. Increase scavenging by 2%.",
	price : 530000,
	upgrade : "basicScavengerUpgrade",
	prereqs : [-1, -1],
	numOwned : 0
});

upgrades.push({
	type : "upgrades",
	id : "U6",
	name : "Radios",
	desc : "Increase communication between companions. Reduces chance of death by a small percentage.",
	price : 475000,
	upgrade : "companionDeathRiskUpgrade",
	prereqs : [-1, -1],
	numOwned : 0
});

upgrades.push({
	type : "upgrades",
	id : "U7",
	name : "Defense Classes",
	desc : "Increases companions' damage by a small percentage.",
	price : 25000,
	upgrade : "companionDamageUpgrade",
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
					upgrades[i].numOwned++;
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



