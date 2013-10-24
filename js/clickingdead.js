/*
 * Global Clicking Dead Javascript Object
 */
var ClickingDead = {};

ClickingDead.workers = [];

ClickingDead.data = {};			// define the core data object for your
								// current game save.

ClickingDead.data = {			// define initial conditions for game state.
	personalDamage : 16,
	personalScavenge : 1,
	zombiesKilled : 0,
	supplies : 0,
	fortification : 1000,
	companions : [],
	weapons : [], 
	upgrades : [], 
	acheivements : []
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
	
	var zombieWorker = new Worker("/js/zombiescalc.js");
	zombieWorker.onmessage = function (event) {
		var message = event.data;			// here we will read in the zombie value.
		// update the progress bar.
		$(".zombieMeter").attr('value', message);
	};
	$("body").on("click", "#killZombieButton", function() {
		$("#zombies").append('<span class="positiveReinforcement zombies noSelect">+'+ClickingDead.data.personalDamage+'</span>');
		zombieWorker.postMessage({
			type: "kill"
		});
		ClickingDead.data.zombiesKilled += ClickingDead.data.personalDamage;

		$(".zombiesBox p.count").html(ClickingDead.data.zombiesKilled);
	});	
	ClickingDead.registerWorker(zombieWorker);		// register the web worker

	var scavengeWorker = new Worker("/js/scavengecalc.js");
	scavengeWorker.onmessage = function (event) {
		var message = event.data;
		$(".suppliesMeter").attr('value', message);
	};
	$("body").on("click", "#scavengeButton", function() {
		$("#scavenge").append('<span class="positiveReinforcement scavenge noSelect">+'+ClickingDead.data.personalScavenge+'</span>');
		scavengeWorker.postMessage({
			type: "scavenge"
		});

		ClickingDead.data.supplies += ClickingDead.data.personalScavenge;
		$(".scavengeBox p.count").html(ClickingDead.data.supplies);
	});	
	ClickingDead.registerWorker(scavengeWorker);	// register the scavenge worker

	var randomEventWorker = new Worker("/js/randomevent.js");
	randomEventWorker.onmessage = function (event) {
		var message = event.data;
		// handle the message here and post to the newsfeed.
		$("#news").prepend('<li class="newsItem breakTheStory"><span class="newsContent">' + message.message + '</span></li>');
		$("#news li:last").remove();
	};
	ClickingDead.registerWorker(randomEventWorker);	// register the random worker


	ClickingDead.updateWorkers();					// propogate changes.

	///////// SETTING UP THE ZOMBIE +1 buttons. ////////
	$(".zombiesBox p.count").html(ClickingDead.data.zombiesKilled);



	///////// SETTING UP THE SCAVENGE +1 button. ///////
	$(".scavengeBox p.count").html(ClickingDead.data.supplies);


});




