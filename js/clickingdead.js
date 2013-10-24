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

/**
 * function to initialize all of our variables and stuff.
 */
var initialize = function () {
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
		alert(message.remainingSuppliesPercent);
		$(".suppliesMeter").attr('value', message.remainingSuppliesPercent);
		ClickingDead.data.supplies += message.amountScavenged;
		$(".scavengeBox p.count").html(ClickingDead.data.supplies);
	};
	



	$("body").on("click", "#scavengeButton", function() {
		$("#scavenge").append('<span class="positiveReinforcement scavenge noSelect">+'+ClickingDead.data.personalScavenge+'</span>');
		scavengeWorker.postMessage({
			type: "scavenge"
		});
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

	var upgradeManagerWorker = new Worker("/js/upgrademanager.js");
	upgradeManagerWorker.onmessage = function (event) {
		var elems = event.data.data;
		if (event.data.type == "weapons") {			// use the weapons data format.
			$("#itemsList").empty();				// clear itemslist.
			for (var i = 0; i < elems.length; i++) {
				var htmlBuild = '<li class="upgradeItem" data-id="'+elems[i].id+'"><div class="generalInfoWrapper">';
				htmlBuild = htmlBuild + '<h2>'+elems[i].name+'</h2>';
				htmlBuild = htmlBuild + '<p><span class="description">'+elems[i].desc+'</span></p>';
				htmlBuild = htmlBuild + '<p><span class="attribute">Noise: '+elems[i].noise+'%</span>';
				htmlBuild = htmlBuild + '<span class="attribute">Damage: '+elems[i].damage+'/sec</span>';
				htmlBuild = htmlBuild + '<span class="attribute">Supply: '+elems[i].supply+'/sec</span>';
				htmlBuild = htmlBuild + '</p></div>';
				htmlBuild = htmlBuild + '<div class="purchaseInfoWrapper"><span class="buttons"><div class="purchaseButton sell">Sell</div><div class="purchaseButton buy">Buy</div></span><span class="priceWrapper"><p class="price">';
				htmlBuild = htmlBuild +	elems[i].price + '</p></span>';
				htmlBuild = htmlBuild + '<span class="countWrapper"><p class="count">'+elems[i].numOwned+'</p></span></div></li>';
				// we have now added a weapon list element.
				$("#itemsList").append(htmlBuild);
			}
		} else if (event.data.type == "companions") {
			$("#itemsList").empty();				// clear itemslist.
			for (var i = 0; i < elems.length; i++) {
				var htmlBuild = '<li class="upgradeItem" data-id="'+elems[i].id+'"><div class="generalInfoWrapper">';
				htmlBuild = htmlBuild + '<h2>'+elems[i].name+'</h2>';
				htmlBuild = htmlBuild + '<p><span class="description">'+elems[i].desc+'</span></p>';
				htmlBuild = htmlBuild + '<p><span class="attribute">Scavenge: '+elems[i].scavenge+'/sec</span>';
				htmlBuild = htmlBuild + '<span class="attribute">Damage: '+elems[i].damage+'/sec</span>';
				htmlBuild = htmlBuild + '<span class="attribute">Supply: '+elems[i].supply+'/sec</span>';
				htmlBuild = htmlBuild + '</p></div>';
				htmlBuild = htmlBuild + '<div class="purchaseInfoWrapper"><span class="buttons"><div class="purchaseButton sell">Sell</div><div class="purchaseButton buy">Buy</div></span><span class="priceWrapper"><p class="price">';
				htmlBuild = htmlBuild +	elems[i].price + '</p></span>';
				htmlBuild = htmlBuild + '<span class="countWrapper"><p class="count">'+elems[i].numOwned+'</p></span></div></li>';
				// we have now added a weapon list element.
				$("#itemsList").append(htmlBuild);
			}
		} else if (event.data.type == "upgrades") {
			// holder for upgrades text.

		} else if (event.data.type == "purchase") {
			ClickingDead.data.supplies = ClickingDead.data.supplies - event.data.cost;	// pay the price

			if (event.data.domain == "weapons") {				// add value.
				ClickingDead.data.weapons.push(event.data.value);
			} else if (event.data.domain == "companions") {
				ClickingDead.data.companions.push(event.data.value);
			} else if (event.data.domain == "upgrades") { 
				ClickingDead.data.upgrades.push(event.data.value);
			}
			upgradeManagerWorker.postMessage({			// ask for reload.
				type : event.data.domain
			});
			$(".scavengeBox p.count").html(ClickingDead.data.supplies);
			ClickingDead.updateWorkers();
		}
	}

	ClickingDead.updateWorkers();					// propogate changes.

	///////// SETTING UP THE ZOMBIE +1 buttons. ////////
	$(".zombiesBox p.count").html(ClickingDead.data.zombiesKilled);

	///////// SETTING UP THE SCAVENGE +1 button. ///////
	$(".scavengeBox p.count").html(ClickingDead.data.supplies);
	
	///////// SET UP SIDE BUTTONS //////////////////////
	
	/////////// Weapons ////////////
	
	$("body").on("click", "#weapons", function() {
		upgradeManagerWorker.postMessage({				// load the weapons tab.
			type : "weapons"
		});
	});

	$("body").on("click", "#companions", function() {
		upgradeManagerWorker.postMessage({
			type : "companions"
		});
	});

	$("body").on("click", "#itemsList .buy", function(event) {
		var boughtId = $(event.target).closest(".upgradeItem").data("id");
		// from here we will send a buy request to the upgrade manager
		upgradeManagerWorker.postMessage({
			type : "purchase",
			id : boughtId,
			currSupplies : ClickingDead.data.supplies
		});
	});
}

/*
 * Window Load and initialization steps.
 */
$(window).load(function() {
	$('body').on('click', ".blackout", function() { 
		$('.blackout').remove();
		initialize();
	});
});




