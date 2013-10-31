/** ======= upgrademanager.js ========
 * upgrademanager keeps track of which upgrades have been unlocked,
 * and serves those upgrades as a JSON object back to the main
 * view for placement onto the upgrade screen.  upgrademanager
 * will also keep track of which achievements have been unlocked.
 */

var playerData = {};			// store the player data here.

// there are fewer things to store here as compared to the other
// webworkers, simply due to the nature of this particular webworker.

var UpgradeManager = {}

UpgradeManager.data = {
	locations : [],
	weapons : [], 
	upgrades : [],
	companions : []
};

//////// DEFINE ALL LOCATIONS ////////////////////////////////////
UpgradeManager.data.locations.push({
	type : "location",			
	name : "Atlanta",
	className : "atlanta",				
	desc : "First location",
	id : "L0",
	prereq : -1,
	supply : 25000,				
	kills : 2,					
});

UpgradeManager.data.locations.push({
	type : "location",			
	name : "Highway",
	className : "highway",				
	desc : "Second location",
	id : "L1",
	prereq : 0,
	supply : 25000,				
	kills : 10,					
});

UpgradeManager.data.locations.push({
	type : "location",			
	name : "CDC",
	className : "research",				
	desc : "Third location",
	id : "L2",
	prereq : 1,
	supply : 25000,				
	kills : 1000000,					
});

UpgradeManager.data.locations.push({
	type : "location",			
	name : "Forest",
	className : "woods",				
	desc : "Fourth location",
	id : "L3",
	prereq : 2,
	supply : 25000,				
	kills : 1000000,					
});


UpgradeManager.data.locations.push({
	type : "location",			
	name : "Warehouse",
	className : "warehouse",				
	desc : "Fifth location",
	id : "L4",
	prereq : 3,
	supply : 25000,				
	kills : 1000000,					
});


UpgradeManager.data.locations.push({
	type : "location",			
	name : "Farm",	
	className : "farm",			
	desc : "Sixth location",
	id : "L5",
	prereq : 4,
	supply : 25000,				
	kills : 1000000,					
});

UpgradeManager.data.locations.push({
	type : "location",			
	name : "Village",
	className : "village",				
	desc : "Seventh location",
	id : "L6",
	prereq : 5,
	supply : 25000,				
	kills : 1000000,					
});


UpgradeManager.data.locations.push({
	type : "location",			
	name : "Prison",
	className : "prison",				
	desc : "Eighth location",
	id : "L7",
	prereq : 6,
	supply : 25000,				
	kills : 1000000,					
});


//////// DEFINE ALL COMPANIONS //////////////////////////////////
// RICK. our first generation prototype.
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Sheriff Mick",				// name of the companion
	desc : "A natural born leader and killer of walkers.",
	id : "C0",
	scavenge : 95000,				// scavenge rate of the companion
	wpl : 12,					// weapon proficiency level of the companion
	prereqs : [-1, 12],
	price : 50000000000,					// supply cost of the companion.
	numOwned : 0
});

// Daryl
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Earyl",				// name of the companion
	desc : "An all around badass. Great at scavenging and killing walkers.",
	id : "C1",
	scavenge : 215000,				// scavenge rate of the companion
	wpl : 10,					// weapon proficiency level of the companion
	prereqs : [-1, 11],
	price : 220000000,					// supply cost of the companion.
	numOwned : 0
});

// Shane
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Deputy Thane",				// name of the companion
	desc : "A friend of Rick's. He is strong and a capable leader.",
	id : "C2",
	scavenge : 13000,				// scavenge rate of the companion
	wpl : 8,					// weapon proficiency level of the companion
	prereqs : [-1, 9],
	price : 650000000,					// supply cost of the companion.
	numOwned : 0
});

// Merle
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Serle",				// name of the companion
	desc : "Daryl's older brother. A redneck who is rough around the edges.",
	id : "C3",
	scavenge : 6500,				// scavenge rate of the companion
	wpl : 7,					// weapon proficiency level of the companion
	prereqs : [-1, 8],
	price : 6660000,					// supply cost of the companion.
	numOwned : 0
});

// Michonne
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Kichonne",				// name of the companion
	desc : "Attitude in human form! She scavenges and kills walkers with ease.",
	id : "C4",
	scavenge : 3000,				// scavenge rate of the companion
	wpl : 8,					// weapon proficiency level of the companion
	prereqs : [-1, 7],
	price : 5600000,					// supply cost of the companion.
	numOwned : 0
});

// Glenn
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Kenn",				// name of the companion
	desc : "Young, Asian guy who's quick on his feet. Perfect for scavenging.",
	id : "C5",
	scavenge : 15000,				// scavenge rate of the companion
	wpl : 5,					// weapon proficiency level of the companion
	prereqs : [-1, 6],
	price : 2400000,					// supply cost of the companion.
	numOwned : 0
});

// Carl
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Carlos",				// name of the companion
	desc : "Mick's youngest son. He is a good shot, but still has a lot to learn",
	id : "C6",
	scavenge : 1000,				// scavenge rate of the companion
	wpl : 4,					// weapon proficiency level of the companion
	prereqs : [-1, 5],
	price : 680000,					// supply cost of the companion.
	numOwned : 0
});

// Hershel
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Gershel",				// name of the companion
	desc : "A friendly, wise veterinarian. He is slow on his feet, however.",
	id : "C7",
	scavenge : 100,				// scavenge rate of the companion
	wpl : 2,					// weapon proficiency level of the companion
	prereqs : [-1, 4],
	price : 72000,					// supply cost of the companion.
	numOwned : 0
});

// Carol
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Carolina",				// name of the companion
	desc : "A tough woman capable of defending herself. She is a good teacher.",
	id : "C8",
	scavenge : 10,				// scavenge rate of the companion
	wpl : 3,					// weapon proficiency level of the companion
	prereqs : [-1, 3],
	price : 41000,					// supply cost of the companion.
	numOwned : 0
});

// Maggie
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Margaret",				// name of the companion
	desc : "Gershel's daughter.",
	id : "C9",
	scavenge : 50,				// scavenge rate of the companion
	wpl : 2,					// weapon proficiency level of the companion
	prereqs : [-1, 2],
	price : 28000,					// supply cost of the companion.
	numOwned : 0
});

// Andrea
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "Audrey",				// name of the companion
	desc : "Always acting out. She thinks she is better than she is.",
	id : "C10",
	scavenge : 25,				// scavenge rate of the companion
	wpl : 1,					// weapon proficiency level of the companion
	prereqs : [-1, 1],
	price : 10000,					// supply cost of the companion.
	numOwned : 0
});

// Anonymous Military
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "A Soldier",				// name of the companion
	desc : "A young, strong soldier.",
	id : "C11",
	scavenge : 10,				// scavenge rate of the companion
	wpl : 5,					// weapon proficiency level of the companion
	prereqs : [-1, 0],
	price : 500,					// supply cost of the companion.
	numOwned : 0
});

// Anonymous Civilian
UpgradeManager.data.companions.unshift({
	type : "companion",			// the type of item for disambiguation
	name : "A Civilian",				// name of the companion
	desc : "An ordinary person who has managed to survive.",
	id : "C12",
	scavenge : 5,				// scavenge rate of the companion
	wpl : 0,					// weapon proficiency level of the companion
	prereqs : [-1, -1],
	price : 150,					// supply cost of the companion.
	numOwned : 0
});


//////// DEFINE ALL WEAPONS ////////////////////////////////////
// Grenade Launcher
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Grenade Launcher",
	desc : "Create a shower of walker limbs from a distance.",
	id : "W0",
	noise : 30,					// as a percent
	damage : 1000,					// increases a single companion's stats.
	supply : -80,
	price : 234500000000,
	prereqs : [-1, 18],
	numOwned : 0
});

// Sniper Rifle
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Sniper Rifle",
	desc : "Kill walkers at a distance with this high-powered rifle.",
	id : "W1",
	wpl : 5,					// weapon proficiency level requried by companion
	damage : 25,					// increases a single companion's stats.
	supply : 5,
	price : 7864000500,
	prereqs : [-1, 17],
	numOwned : 0
});

// Rick's Magnum
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Rick's Magnum",
	desc : "Rick's six shot .44 magnum. Very powerful, but slow to reload.",
	id : "W2",
	wpl : 12,					// weapon proficiency level requried by companion
	damage : 80,					// increases a single companion's stats.
	supply : -10,
	price : 22000000000,
	prereqs : [-1, 16],
	numOwned : 0
});

// Cross Bow
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Daryl's Crossbow",
	desc : "The ultimate crossbow. Accurate and deadly.",
	id : "W3",
	wpl : 10,					// weapon proficiency level requried by companion
	damage : 60,					// increases a single companion's stats.
	supply : -4,
	price : 50000000000,
	prereqs : [-1, 15],
	numOwned : 0
});

// Katana
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Michonne's Katana",
	desc : "Slice through walkers like nothing.",
	id : "W4",
	wpl : 8,					// weapon proficiency level requried by companion
	damage : 30,					// increases a single companion's stats.
	supply : -1,
	price : 320000000000,
	prereqs : [-1, 14],
	numOwned : 0
});

// Compound Bow and arrow
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Compound Bow and Arrow",
	desc : "Carbon fiber bow and arrow. More accurate and easier to use.",
	id : "W5",
	wpl : 8,					// weapon proficiency level requried by companion
	damage : 8,					// increases a single companion's stats.
	supply : -2,
	price : 250000000,
	prereqs : [-1, 13],
	numOwned : 0
});

// Compound Bow and arrow
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Shotgun",
	desc : "Pump action shotgun.",
	id : "W6",
	wpl : 8,					// weapon proficiency level requried by companion
	damage : 100,					// increases a single companion's stats.
	supply : -20,
	price : 250000000,
	prereqs : [-1, 13],
	numOwned : 0
});

// M4
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "M4 Assualt Rifle",
	desc : "An accurate, automatic, assualt rifle. Light and quick.",
	id : "W7",
	wpl : 7,					// weapon proficiency level requried by companion
	damage : 15,					// increases a single companion's stats.
	supply : -4,
	price : 5600000,
	prereqs : [-1, 12],
	numOwned : 0
});

// Ak47
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "AK47",
	desc : "A durable, reliable automatic, assualt rifle.",
	id : "W8",
	wpl : 6,					// weapon proficiency level requried by companion
	damage : 15,					// increases a single companion's stats.
	supply : -5,
	price : 2500340,
	prereqs : [-1, 11],
	numOwned : 0
});


// Bow and arrow
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Classic Bow and Arrow",
	desc : "Hunt walkers with a wooden bow and arrows.",
	id : "W9",
	wpl : 6,					// weapon proficiency level requried by companion
	damage : 2,					// increases a single companion's stats.
	supply : -1,
	price : 1000000,
	prereqs : [-1, 10],
	numOwned : 0
});


// Glock
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Glock",
	desc : "Automatic pistol.",
	id : "W10",
	wpl : 5,					// weapon proficiency level requried by companion
	damage : 20,					// increases a single companion's stats.
	supply : -4,
	price : 895000,
	prereqs : [-1, 9],
	numOwned : 0
});

// Wrench
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Wrench",
	desc : "Bash walkers with a red wrench.",
	id : "W11",
	wpl : 0,					// weapon proficiency level requried by companion
	damage : 5,					// increases a single companion's stats.
	supply : -2,
	price : 785000,
	prereqs : [-1, 8],
	numOwned : 0
});

// Machete
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Bloody, Rusty Machete",
	desc : "Cut your way through a mob of walkers.",
	id : "W12",
	wpl : 2,					// weapon proficiency level requried by companion
	damage : 5,					// increases a single companion's stats.
	supply : -1,
	price : 320000,
	prereqs : [-1, 7],
	numOwned : 0
});

// Grenades
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Grenades",
	desc : "Blow up walkers with these basic grenades.",
	id : "W13",
	wpl : 4,					// weapon proficiency level requried by companion
	damage : 100,					// increases a single companion's stats.
	supply : -25,
	price : 220050,
	prereqs : [-1, 6],
	numOwned : 0
});

// Molotov Cocktails
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Molotov Cocktails",
	desc : "Set walkers ablaze with these fiery concotions.",
	id : "W14",
	wpl : 3,					// weapon proficiency level requried by companion
	damage : 10,					// increases a single companion's stats.
	supply : -5,
	price : 75000,
	prereqs : [-1, 5],
	numOwned : 0
});


// 9mm pistol
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "9mm Pistol",
	desc : "9mm pistol that is light and easy to use.",
	id : "W15",
	wpl : 1,					// weapon proficiency level requried by companion
	damage : 5,					// increases a single companion's stats.
	supply : -2,
	price : 52000,
	prereqs : [-1, 4],
	numOwned : 0
});

// Police Baton
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Police Baton",
	desc : "Metal police baton, perfect for bludgeoning walkers",
	id : "W16",
	wpl : 0,					// weapon proficiency level requried by companion
	damage : 6,					// increases a single companion's stats.
	supply : -1,
	price : 26000,
	prereqs : [-1, 3],
	numOwned : 0
});

// Crowbar
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Crowbar",
	desc : "Metal crowbar.",
	id : "W17",
	wpl : 0,					// weapon proficiency level requried by companion
	damage : 25,					// increases a single companion's stats.
	supply : -5,
	price : 7000,
	prereqs : [-1, 2],
	numOwned : 0
});

// Spear
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Wooden, Homemade Spear",
	desc : "Keep walkers at a distance with this sharp, wooden stick.",
	id : "W18",
	wpl : 0,					// weapon proficiency level requried by companion
	damage : 5,					// increases a single companion's stats.
	supply : -2,
	price : 2500,
	prereqs : [-1, 1],
	numOwned : 0
});


// Basic Kitchen Knife
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Basic Kitchen Knife",
	desc : "What it sounds like, a steak knife.",
	id : "W19",
	wpl : 0,					// weapon proficiency level requried by companion
	damage : 3,					// increases a single companion's stats.
	supply : -1,
	price : 160,
	prereqs : [-1, 0],
	numOwned : 0
});


// Pocket Knife
UpgradeManager.data.weapons.unshift({
	type : "weapons",
	name : "Pocket Knife",
	desc : "Get up close and personal.",
	id : "W20",
	wpl : 0,					// weapon proficiency level requried by companion
	damage : 1,					// increases a single companion's stats.
	supply : -0,
	price : 25,
	prereqs : [-1, -1],
	numOwned : 0
});


//////// DEFINE ALL UPGRADES ///////////////////////////////////
// Sheriff Hat
UpgradeManager.data.upgrades.unshift({
	type : "upgrades",
	id : "U0",
	name : "Rick's Sheriff Hat",
	desc : "You know who's the boss.  Kill walkers in style.",
	price : 10000000000,
	upgrade : "personalDamageUpgrade",
	prereqs : [-1, 6],
	numOwned : 0
});

UpgradeManager.data.upgrades.unshift({
	type : "upgrades",
	id : "U1",
	name : "Daryl's Motorcyle",
	desc : "Scavenge more effectively as you can move around more quickly",
	price : 369500000,
	upgrade : "personalScavengeUpgrade",
	prereqs : [-1, 5],
	numOwned : 0
});

UpgradeManager.data.upgrades.unshift({
	type : "upgrades",
	id : "U2",
	name : "Rick's Sheriff Badge",
	desc : "Bring the law to the walkers - increase your damage by 10%. Also makes your UpgradeManager.data.companions slightly more effective.",
	price : 89500000,
	upgrade : "personalDamageUpgrade",
	prereqs : [-1, 4],
	numOwned : 0
});

// Nerves of Steel
UpgradeManager.data.upgrades.unshift({
	type : "upgrades",
	id : "U3",
	name : "Nerves of Steel",
	desc : "You have nerves of steel and are less likely to be overrun by the walkers",
	price : 68000000,
	upgrade : "fortificationUpgrade",
	prereqs : [-1, 3],
	numOwned : 0
});

// Foraging Book
UpgradeManager.data.upgrades.unshift({
	type : "upgrades",
	id : "U4",
	name : "Foraging Book",
	desc : "A book that teaches you how to forage more effectively",
	price : 3400000,
	upgrade : "personalScavengeUpgrade",
	prereqs : [-1, 2],
	numOwned : 0
});


UpgradeManager.data.upgrades.unshift({
	type : "upgrades",
	id : "U5",
	name : "Water Bottles",
	desc : "Stay hydrated while scavenging. Increase companion scavenging by 5%.",
	price : 530000,
	upgrade : "companionScavengeUpgrade",
	prereqs : [-1, 1],
	numOwned : 0
});

UpgradeManager.data.upgrades.unshift({
	type : "upgrades",
	id : "U6",
	name : "Radios",
	desc : "Increase communication between companions. Increases scavenge by 2%.",
	price : 475000,
	upgrade : "companionScavengeUpgrade",
	prereqs : [-1, 0],
	numOwned : 0
});

UpgradeManager.data.upgrades.unshift({
	type : "upgrades",
	id : "U7",
	name : "Defense Classes",
	desc : "Increases companions' WPL by 1.",
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

		for(var i = 0; i < UpgradeManager.data.weapons.length && type == ""; i++) {	// linear search
			if(UpgradeManager.data.weapons[i].id == event.data.id) { 
				if (event.data.currSupplies >= UpgradeManager.data.weapons[i].price) {
					UpgradeManager.data.weapons[i].numOwned++;
					type = "weapons";
					targetEntry = UpgradeManager.data.weapons[i];
					break;
				}
			}
		}

		for(var i = 0; i < UpgradeManager.data.companions.length && type == ""; i++) {	// linear search
			if(UpgradeManager.data.companions[i].id == event.data.id) { 
				if (event.data.currSupplies >= UpgradeManager.data.companions[i].price) {
					UpgradeManager.data.companions[i].numOwned++;
					type = "companions";
					targetEntry = UpgradeManager.data.companions[i];
					break;
				}
			}
		}

		for(var i = 0; i < UpgradeManager.data.upgrades.length && type == ""; i++) {	// linear search
			if(UpgradeManager.data.upgrades[i].id == event.data.id) { 
				if (event.data.currSupplies >= UpgradeManager.data.upgrades[i].price) {
					UpgradeManager.data.upgrades[i].numOwned++;
					type = "upgrades";
					targetEntry = UpgradeManager.data.upgrades[i];
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
				backupData : UpgradeManager.data,
				value : targetEntry
			});
		}
	} else if (event.data.type == "companions") {
		// open the companions tab.
		
		tmpCompanions = [];
		for (var i = 0; i < UpgradeManager.data.companions.length; i++) {
			if (UpgradeManager.data.companions[i].prereqs[0] == -1) {			// location matches.
				var fulfilled = true;
				if (UpgradeManager.data.companions[i].prereqs[0] != -1
					&& playerData.currLocation.substring(1,2) != UpgradeManager.data.companions[i].prereqs[0] + "") {
					fulfilled = false;
				}
				for (var j = 1; j < UpgradeManager.data.companions[i].prereqs.length; j++) {
					var tmpVal = UpgradeManager.data.companions[i].prereqs[j];
					if (tmpVal >= 0 && UpgradeManager.data.companions[tmpVal].numOwned <= 0) {
						fulfilled = false;
					}
				}
				if(fulfilled) {
					tmpCompanions.unshift(UpgradeManager.data.companions[i]);
				}
			}
		}

		postMessage({
			type : "companions",
			data : tmpCompanions
		});
	} else if (event.data.type == "weapons") {
		// open the weapons tab
		tmpWeapons = [];
		for (var i = 0; i < UpgradeManager.data.weapons.length; i++) {
			if (UpgradeManager.data.weapons[i].prereqs[0] == -1) {			// location matches.
				var fulfilled = true;
				if (UpgradeManager.data.weapons[i].prereqs[0] != -1
					&& playerData.currLocation.substring(1,2) != UpgradeManager.data.weapons[i].prereqs[0] + "") {
					fulfilled = false;
				}
				for (var j = 1; j < UpgradeManager.data.weapons[i].prereqs.length; j++) {
					var tmpVal = UpgradeManager.data.weapons[i].prereqs[j];
					if (tmpVal >= 0 && UpgradeManager.data.weapons[tmpVal].numOwned <= 0) {
						fulfilled = false;
					}
				}
				if(fulfilled) {
					tmpWeapons.unshift(UpgradeManager.data.weapons[i]);
				}
			}
		}

		postMessage({
			type : "weapons",
			data : tmpWeapons
		});

	} else if (event.data.type == "upgrades") {
		// open the upgrades tab
		tmpUpgrades = [];
		for (var i = 0; i < UpgradeManager.data.upgrades.length; i++) {
			if (UpgradeManager.data.upgrades[i].prereqs[0] == -1) {			// location matches.
				var fulfilled = true;
				if (UpgradeManager.data.upgrades[i].prereqs[0] != -1
					&& playerData.currLocation.substring(1,2) != UpgradeManager.data.upgrades[i].prereqs[0] + "") {
					fulfilled = false;
				}
				for (var j = 1; j < UpgradeManager.data.upgrades[i].prereqs.length; j++) {
					var tmpVal = UpgradeManager.data.upgrades[i].prereqs[j];
					if (tmpVal >= 0 && UpgradeManager.data.upgrades[tmpVal].numOwned <= 0) {
						fulfilled = false;
					}
				}
				if(fulfilled) {
					tmpUpgrades.unshift(UpgradeManager.data.upgrades[i]);
				}
			}
		}

		postMessage({
			type : "upgrades",
			data : tmpUpgrades
		});
	} else if (event.data.type == "achievements") { 
		// open the achievements tab.

	} else if (event.data.type == "update") {
		playerData = event.data.data;
		// there should be no logic caught here.
	} else if (event.data.type == "restore") {
		playerData = event.data.data;
		UpgradeManager.data = playerData.upgradeManagerData;
	} else if (event.data.type == "unlockLocation") {
		var currentLocation = -1;
		var currentLocationId = event.data.currentLocation.id;
		var nextLocation = {};
		
		for (var i = 0; i < UpgradeManager.data.locations.length; i++) {
			if(currentLocationId == UpgradeManager.data.locations[i].id) {
				currentLocation = i;
				break;
			}
		}

		if (UpgradeManager.data.locations[currentLocation].kills > event.data.zombiesKilled) {
			return;									// not enough kills
		}

		for (var i = 0; i < UpgradeManager.data.locations.length; i++) {
			if (UpgradeManager.data.locations[i].prereq == currentLocation) {
				nextLocation = UpgradeManager.data.locations[i];
				break;
			}
		}
		if(nextLocation != {}) {
			postMessage({
				type : "unlockLocation",
				locationObject : nextLocation
			});
		}
		return;
	}
};



