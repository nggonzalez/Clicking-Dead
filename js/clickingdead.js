/*
 * Global Clicking Dead Javascript Object
 */
var ClickingDead = {};

ClickingDead.workers = [];

ClickingDead.data = {};			// define the core data object for your
								// current game save.

ClickingDead.data = {			// define initial conditions for game state.
	personalDamage : 1,
	personalScavenge : 1,
	groupDamage : 1,
	groupScavenge : 1,
	fortification : 1
};
// maintaining the core data in a central location will allow for simpler save
// functions later, as well as simple synchronization across multiple web workers.

/**
 * adds a worker to the internal ClickingDead web worker array.
 */
ClickingDead.registerWorker = function(worker) { 
	ClickingDead.workers.push(worker);
};

/**
 * updates the data for all web workers associated with our current
 * ClickingDead instance
 */
ClickingDead.updateWorkers = function () {
	for(var i = 0; i < ClickingDead.workers.length; i++) {
		ClickingDead.workers[i].postMessage({					// post a JSON message.
			type: "update",				// denotes an update message.
			data: ClickingDead.data		// gives the worker complete new data.
		});
	}
};

/*
 * Window Load and initialization steps.
 */
$(window).load(function() {
	
	var zombieWorker= new Worker("/js/zombiescalc.js");

	zombieWorker.onmessage = function (event) {
		var message = event.data;			// here we will read in the zombie value.
		// update the progress bar.
		$(".zombieMeter").attr('value', message);
	};

	$("body").on("click", "#killZombieButton", function() {
		zombieWorker.postMessage({
			type: "kill"
		});
	});	
	ClickingDead.registerWorker(zombieWorker);		// register the web worker

	ClickingDead.data.fortification = 100;			// change some data.
	ClickingDead.updateWorkers();					// propogate changes.

	ClickingDead.data.personalDamage = 100;
	ClickingDead.updateWorkers();

});




