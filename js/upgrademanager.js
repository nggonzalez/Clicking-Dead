/** ======= upgrademanager.js ========
 * upgrademanager keeps track of which upgrades have been unlocked,
 * and serves those upgrades as a JSON object back to the main
 * view for placement onto the upgrade screen.  upgrademanager
 * will also keep track of which achievements have been unlocked.
 */

var playerData = {};			// store the player data here.

// there are fewer things to store here as compared to the other
// webworkers, simply due to the nature of this particular webworker.

/**
 * respond to message requests from the main controller here.
 * this is the main message sequence of the webworker
 */
onmessage = function (event) {
	if (event.data.type == "purchase") {
		// handle all purchase requests and logic here



	} else if (event.data.type == "companions") {
		// open the companions tab.



	} else if (event.data.type == "weapons") {
		// open the weapons tab



	} else if (event.data.type == "upgrades") {
		// open the upgrades tab



	} else if (event.data.type == "achievements") { 
		// open the achievements tab.



	} else {
		// there should be no logic caught here.
	}
};



