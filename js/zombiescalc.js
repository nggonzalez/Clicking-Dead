/**
 * test of zombiescalc.js
 */
var zombieVal = 0;			// this is the global prob of there
					// being a zombie


setInterval(function() {
	zombieVal =  (zombieVal + 0.01) % 1;
	postMessage(zombieVal);
}, 10);

onmessage = function (event) { 
	setTimeout(function(){postMessage(1);}, 1000);
};
