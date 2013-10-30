/*
 * Global Clicking Dead Javascript Object
 */
var ClickingDead = {};

ClickingDead.workers = [];

ClickingDead.data = {};			// define the core data object for your
								// current game save.

ClickingDead.data = {			// define initial conditions for game state.
	personalDamage : 1,
	personalScavenge : 15,
	companionDamage : 0,
	companionScavenge : 0,
	companionConsumption : 0,
	currLocation : 0,
	zombiesKilled : 0,
	supplies : 0,
	fortification : 100,
	companions : [],
	weapons : [], 
	upgrades : [],
	acheivements : [],
	zombieCalcData : {},
	upgradeManagerData : {},
};



// maintaining the core data in a central location will allow for simpler save
// functions later, as well as simple synchronization across multiple web workers.

//// SHIM for function handles /////////

var fortificationUpgrade = function(data) {
	data.fortification += 10;
	return data;
};

var personalDamageUpgrade = function(data) {
	data.personalDamage += 10;
	return data;
};

var personalScavengeUpgrade = function(data) {
	data.personalScavenge += 10;
	return data;
};

var companionScavengeUpgrade = function(data) {
	data.companionScavenge += 10;
	return data;
};

var companionDamageUpgrade = function(data) {
	data.companionDamage += 10;
	return data;
};

var companionConsumptionUpgrade = function(data) {
	data.companionConsumption += 10;
	return data;
};

//////// end shim for function handles//


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

ClickingDead.restoreWorkers = function () {

	$(".zombiesBox p.count").html(Math.floor(ClickingDead.data.zombiesKilled));
	$(".scavengeBox p.count").html(Math.floor(ClickingDead.data.supplies));
	for(var i = 0; i < ClickingDead.workers.length; i++) {
		ClickingDead.workers[i].postMessage({					// post a JSON message.
			type: "restore",				// denotes an update message.
			data: ClickingDead.data		// gives the worker complete new data.
		});
	}
};


/**
 * No doubletap zoom function.
 */

 (function($) {
$.fn.nodoubletapzoom = function() {
    $(this).bind('touchstart', function preventZoom(e){
        var t2 = e.timeStamp;
        var t1 = $(this).data('lastTouch') || t2;
        var dt = t2 - t1;
        var fingers = e.originalEvent.touches.length;
        $(this).data('lastTouch', t2);
        if (!dt || dt > 500 || fingers > 1){
            return; // not double-tap
        }
        e.preventDefault(); // double tap - prevent the zoom
        // also synthesize click events we just swallowed up
        $(e.target).trigger('click');
    });
};
})(jQuery);

/**
 * function to initialize all of our variables and stuff.
 */
var initialize = function () {

	// set the local storage autosave interval.

	setInterval(function () {
		$("#news").prepend('<li class="newsItem breakTheStory bonusPost"><span class="newsContent">your game has been autosaved!</span></li>');
		if($("#news li").length > 4) {
			$("#news li:last").remove();
		}
		localStorage.setItem("data", JSON.stringify(ClickingDead.data));
	}, 5000);

	// this should allow for autosave


	var zombieWorker = new Worker("/js/zombiescalc.js");

	zombieWorker.onmessage = function (event) {
		var message = event.data;			// here we will read in the zombie value.
		// update the progress bar.
		if (message.type == "zombieReport") {
			$(".zombieMeter").attr('value', message.remainingZombiesPercent);
			ClickingDead.data.zombiesKilled += message.zombiesKilled;
			$(".zombiesBox p.count").html(Math.floor(ClickingDead.data.zombiesKilled));
			if (message.perSecond != undefined
				&& $(".zombiesBox .perSecondCount").html() != Math.floor(message.perSecond))
				$(".zombiesBox .perSecondCount").html(Math.floor(message.perSecond));
		} else if (message.type == "scavengeReport") {
			$(".suppliesMeter").attr('value', message.remainingSuppliesPercent);
			ClickingDead.data.supplies += message.amountScavenged;
			ClickingDead.data.supplies = Math.max(0, ClickingDead.data.supplies);
			$(".scavengeBox p.count").html(Math.floor(ClickingDead.data.supplies));
			if (message.perSecond != undefined
				&& $(".scavengeBox .perSecondCount").html() != Math.floor(message.perSecond))
				$(".scavengeBox .perSecondCount").html(Math.floor(message.perSecond));
		} else if (message.type == "notification") {
			$("#news").prepend('<li class="newsItem breakTheStory dangerPost"><span class="newsContent">' + message.message + '</span></li>');
			if($("#news li").length > 4) {
				$("#news li:last").remove();
			}
		} else if (message.type == "saveUpdate") {
			ClickingDead.data.zombieCalcData = message.data;
		}
	};

	$("body").on("click", "#killZombieButton", function() {
		$("#zombies").append('<span class="positiveReinforcement zombies noSelect">+'+ClickingDead.data.personalDamage+'</span>');
		zombieWorker.postMessage({
			type: "kill"
		});
	});	
	ClickingDead.registerWorker(zombieWorker);		// register the web worker

	$("body").on("click", "#scavengeButton", function() {
		$("#scavenge").append('<span class="positiveReinforcement scavenge noSelect">+'+ClickingDead.data.personalScavenge+'</span>');
		zombieWorker.postMessage({
			type: "scavenge"
		});
	});	

	var randomEventWorker = new Worker("/js/randomevent.js");
	randomEventWorker.onmessage = function (event) {
		var message = event.data;
		// handle the message here and post to the newsfeed.
		$("#news").prepend('<li class="newsItem breakTheStory flavorPost"><span class="newsContent">' + message.message + '</span></li>');
			if($("#news li").length > 4) {
				$("#news li:last").remove();
			}
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
				htmlBuild += '<p><span class="attribute">Damage: '+elems[i].damage+'/sec</span>';
				htmlBuild += '<span class="attribute">Supply: '+elems[i].supply+'/sec</span>';
				htmlBuild += '<span class="attribute">WPL: '+elems[i].wpl+' required</span>';
				htmlBuild += '</p></div>';
				htmlBuild += '<div class="purchaseInfoWrapper"><span class="buttons"><button type="button" class="purchaseButton sell noSelect">Sell</button><button type="button" class="purchaseButton buy noSelect">Buy</button></span><span class="priceWrapper"><p class="price">';
				htmlBuild += elems[i].price + ' supplies</p></span>';
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
				htmlBuild += '<span class="attribute">WPL: '+elems[i].wpl+'</span>';
				htmlBuild += '</p></div>';
				htmlBuild += '<div class="purchaseInfoWrapper"><span class="buttons"><button type="button" class="purchaseButton sell noSelect">Sell</button><button type="button"  class="purchaseButton buy noSelect">Buy</button></span><span class="priceWrapper"><p class="price">';
				htmlBuild += elems[i].price + ' supplies</p></span>';
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
					htmlBuild += elems[i].price + ' supplies</p></span>';
				} else {
					htmlBuild += '<p class="purchased">&#x2714;</p>';
				}
				htmlBuild += '</div></li>';
				$("#itemsList").append(htmlBuild);
			}
		} else if (event.data.type == "purchase") {
			ClickingDead.data.supplies = ClickingDead.data.supplies - event.data.cost;	// pay the price
			ClickingDead.data.supplies = Math.max(ClickingDead.data.supplies, 0);
			
			$("#news").prepend('<li class="newsItem breakTheStory flavorPost"><span class="newsContent">' + "you just purchased " + event.data.value.name + '</span></li>');
			if($("#news li").length > 4) {
				$("#news li:last").remove();
			}

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

			// add updateManagerSnapshot.
			ClickingDead.upgradeManagerData = event.data.backupData;

			ClickingDead.updateWorkers();
		} else if (event.data.type == "unlockLocation") {
			if ($("#moveOn").hasClass("hidden")) {
				$("#moveOn").removeClass("hidden");
				$("#moveOn").attr("data-nextLocation", event.data.locationObject.className);
			}
		}

		setInterval(function() {
			upgradeManagerWorker.postMessage({			// ask for reload.
				type : "unlockLocation",
				zombiesKilled: ClickingDead.data.zombiesKilled,
				currentLocation: ClickingDead.data.currLocation
			});
		}, 10000);

		$("body").on("click", "#moveOn", function(e) {
			var currentLocation = $(".backgroundImage.currentLocation");
			$(currentLocation).removeClass("currentLocation").addClass("leaveLocation");

			var nextLocationClass = $(this).attr("data-nextLocation");
			var nextLocation = $(".backgroundImage." + nextLocationClass);
			$(nextLocation).removeClass("hidden").addClass("moveToLocation");

			console.log("Clicked arrow " + ClickingDead.data.currLocation);
			(ClickingDead.data.currLocation)++;

			$(this).addClass("hidden");

			setTimeout(function() {
				$(currentLocation).addClass("hidden").removeClass("leaveLocation");
				$(nextLocation).addClass("currentLocation").removeClass("moveToLocation");
			}, 6000);
			e.stopImmediatePropagation()
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


	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 		$("body").nodoubletapzoom();
	}
}

/*
 * Window Load and initialization steps.
 */
$(window).load(function() {
	// add logic here to load from local storage.

	var loaded = localStorage["data"];			// try to load our data from localStorage;

	if (loaded == undefined) {
		$('body').on('click', ".blackout", function() { 
			$('.blackout').remove();
			initialize();
			$("#companions").click();
		});
	} else {
		$('.blackout').remove();
		initialize();
		$("#companions").click();
		debugger;
		ClickingDead.data = JSON.parse(loaded);
		//ClickingDead.restoreWorkers();
	}
});




