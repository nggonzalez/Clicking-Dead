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
	companionDamage : 1,
	companionScavenge : 1,
	companionConsumption : 1,
	zombiesKilled : 0,
	supplies : 100,
	fortification : 10,
	companions : [],
	weapons : [], 
	upgrades : [],
	acheivements : []
};
// maintaining the core data in a central location will allow for simpler save
// functions later, as well as simple synchronization across multiple web workers.


//// SHIM for function handles /////////

var nervesOfSteelUpgrade = function(data) {
	data.personalDamage += 10;
	return data;
};












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
		if (message.type == "report") {
			$(".zombieMeter").attr('value', message.remainingZombiesPercent);
			ClickingDead.data.zombiesKilled += message.zombiesKilled;
			$(".zombiesBox p.count").html(Math.floor(ClickingDead.data.zombiesKilled));
		} else if (message.type == "notification") {
			$("#news").prepend('<li class="newsItem breakTheStory dangerPost"><span class="newsContent">' + message.message + '</span></li>');
			$("#news li:last").remove();
		}
	};

	$("body").on("click", "#killZombieButton", function() {
		$("#zombies").append('<span class="positiveReinforcement zombies noSelect">+'+ClickingDead.data.personalDamage+'</span>');
		zombieWorker.postMessage({
			type: "kill"
		});
	});	
	ClickingDead.registerWorker(zombieWorker);		// register the web worker


	var scavengeWorker = new Worker("/js/scavengecalc.js");
	scavengeWorker.onmessage = function (event) {
		var message = event.data;
		$(".suppliesMeter").attr('value', message.remainingSuppliesPercent);
		ClickingDead.data.supplies += message.amountScavenged;
		ClickingDead.data.supplies = Math.max(0, ClickingDead.data.supplies);
		$(".scavengeBox p.count").html(Math.floor(ClickingDead.data.supplies));
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
		$("#news").prepend('<li class="newsItem breakTheStory flavorPost"><span class="newsContent">' + message.message + '</span></li>');
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
				htmlBuild += '<h2>'+elems[i].name+'</h2>';
				htmlBuild += '<p><span class="description">'+elems[i].desc+'</span></p>';
				htmlBuild += '<p><span class="attribute">Noise: '+elems[i].noise+'%</span>';
				htmlBuild += '<span class="attribute">Damage: '+elems[i].damage+'/sec</span>';
				htmlBuild += '<span class="attribute">Supply: '+elems[i].supply+'/sec</span>';
				htmlBuild += '</p></div>';
				htmlBuild += '<div class="purchaseInfoWrapper"><span class="buttons"><button type="button" class="purchaseButton sell noSelect">Sell</button><button type="button" class="purchaseButton buy noSelect">Buy</button></span><span class="priceWrapper"><p class="price">';
				htmlBuild += elems[i].price + '</p></span>';
				htmlBuild += '<span class="countWrapper"><p class="count">'+elems[i].numOwned+'</p></span></div></li>';
				// we have now added a weapon list element.
				$("#itemsList").append(htmlBuild);
			}
		} else if (event.data.type == "companions") {
			$("#itemsList").empty();				// clear itemslist.
			for (var i = 0; i < elems.length; i++) {
				var htmlBuild = '<li class="upgradeItem" data-id="'+elems[i].id+'"><div class="generalInfoWrapper">';
				htmlBuild += '<h2>'+elems[i].name+'</h2>';
				htmlBuild += '<p><span class="description">'+elems[i].desc+'</span></p>';
				htmlBuild += '<p><span class="attribute">Scavenge: '+elems[i].scavenge+'/sec</span>';
				htmlBuild += '<span class="attribute">Damage: '+elems[i].damage+'/sec</span>';
				htmlBuild += '<span class="attribute">Supply: '+elems[i].supply+'/sec</span>';
				htmlBuild += '</p></div>';
				htmlBuild += '<div class="purchaseInfoWrapper"><span class="buttons"><button type="button" class="purchaseButton sell noSelect">Sell</button><button type="button"  class="purchaseButton buy noSelect">Buy</button></span><span class="priceWrapper"><p class="price">';
				htmlBuild += elems[i].price + '</p></span>';
				htmlBuild += '<span class="countWrapper"><p class="count">'+elems[i].numOwned+'</p></span></div></li>';
				// we have now added a weapon list element.
				$("#itemsList").append(htmlBuild);
			}
		} else if (event.data.type == "upgrades") {
			$("#itemsList").empty();				// clear itemsList
			for (var i = 0; i < elems.length; i++) {
				var htmlBuild = '<li class="upgradeItem" data-id="'+elems[i].id+'"><div class="generalInfoWrapper">';
				htmlBuild += '<h2>'+elems[i].name+'</h2>';
				htmlBuild += '<p><span class="description">'+elems[i].desc+'</span></p>';
				htmlBuild += '</div>';
				htmlBuild += '<div class="purchaseInfoWrapper">';
				if (elems[i].numOwned <= 0) {
					htmlBuild += '<button type="button"  class="purchaseButton buy noSelect">Buy</button></span><span class="priceWrapper"><p class="price">';
					htmlBuild += elems[i].price + '</p></span>';
				}
				$("#itemsList").append(htmlBuild);
			}
		} else if (event.data.type == "purchase") {
			ClickingDead.data.supplies = ClickingDead.data.supplies - event.data.cost;	// pay the price
			ClickingDead.data.supplies = Math.max(ClickingDead.data.supplies, 0);
			
			if (event.data.domain == "weapons") {				// add value.
				ClickingDead.data.weapons.push(event.data.value);
			} else if (event.data.domain == "companions") {
				ClickingDead.data.companions.push(event.data.value);
			} else if (event.data.domain == "upgrades") {


				ClickingDead.data.upgrades.push(event.data.value);
				ClickingDead.data = eval(event.data.value.upgrade + '(ClickingDead.data);');
				ClickingDead.updateWorkers();
			}
			upgradeManagerWorker.postMessage({			// ask for reload.
				type : event.data.domain
			});
			$(".scavengeBox p.count").html(Math.floor(ClickingDead.data.supplies));
			ClickingDead.updateWorkers();
		}

		$("body").on("click", "#moveOn", function() {
			var currentLocation = $(".backgroundImage.currentLocation");
			$(currentLocation).removeClass("currentLocation").addClass("leaveLocation");

			var nextLocation = $(".backgroundImage.highway");
			$(nextLocation).removeClass("hidden").addClass("moveToLocation");

			$(this).addClass("hidden");
		});
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

	$("body").on("click", "#upgrades", function() {
		upgradeManagerWorker.postMessage({
			type : "upgrades"
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


	$("body").on("click", "#moveOn", function() {
		var nextLocation = $(".backgroundImage.highway");
		$(nextLocation).addClass("moveToLocation");
		$(nextLocation).removeClass("hidden");
	
		var currentLocation = $(".backgroundImage.currentLocation");
		$(currentLocation).removeClass("currentLocation").addClass("leaveLocation");

		$(this).addClass("hidden");
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




