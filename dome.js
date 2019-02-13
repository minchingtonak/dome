/*
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2018 Jaume Fuster i Claris
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

// "Thus, programs must be written for people to read, and only incidentally for machines to execute."
// TODO: Commenting.


// ---------- CONFIGURATION ----------

// div.innerHTML : {a.innerHTML : a.href}
var sites = {
	"Watch": {
		"YouTube": "https://www.youtube.com/",
		"Netflix": "https://www.netflix.com/browse",
		"KissAnime": "https://kissanime.ac/",
		"RoosterTeeth FIRST": "https://fun.haus"
	},
	"Uni": {
		"Piazza": "https://piazza.com/class",
		"Canvas": "https://umich.instructure.com/login",
		"EECS 201": "https://csprag.herokuapp.com/schedule",
		"EECS 280": "https://eecs280staff.github.io/eecs280.org/",
		"201 Gitlab": "https://gitlab.umich.edu/",
		"Gradescope": "https://www.gradescope.com/",
		"EECS Gitlab": "https://gitlab.eecs.umich.edu/",
		"Wolverine Access": "https://wolverineaccess.umich.edu"
	},
	"Channels": {
		"Pyro": "https://www.youtube.com/user/Pyrocynical/videos",
		"Funhaus": "https://www.youtube.com/channel/UCboMX_UNgaPBsUOIgasn3-Q/videos",
		"Dave Lee": "https://www.youtube.com/channel/UCVYamHliCI9rw1tHR1xbkfw/videos",
		"Philip DeFranco": "https://www.youtube.com/user/sxephil/videos",
		"Linus Tech Tips": "https://www.youtube.com/user/LinusTechTips/videos",
		"Marques Brownlee": "https://www.youtube.com/user/marquesbrownlee/videos"
	},
	"Social": {
		"Reddit": "https://www.reddit.com/",
		"GitHub": "https://github.com/",
		"Last.fm": "https://last.fm/user/Slarrty",
		"Twitter": "https://twitter.com/?lang=en",
		"Messenger": "https://www.messenger.com"
	},
	"Finance": {
		"Ally": "https://www.ally.com/",
		"Amazon": "https://www.amazon.com/",
		"Fidelity": "https://www.fidelity.com/"
	},
	"Productivity": {
		"Drive": "https://drive.google.com/drive/u/2/my-drive",
		"Keep": "https://keep.google.com",
		"Calendar": "https://calendar.google.com",
		"akminch": "https://mail.google.com/mail/u/2/",
		"alec.minch": "https://mail.google.com/mail/u/0/",
		"notathrowaway899": "https://mail.google.com/mail/u/1/"
	}
	/* "Games": { // To find the game ID check the url in the store page or the community page
		"CS:GO": "steam://run/730",
		"POSTAL 2": "steam://run/223470"
	} */
};

function isValidURL(string) {
	var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
	if (res == null)
		return false;
	else
		return true;
}

var search = "https://google.com/search";		// The search engine
var query = "q";							// The query variable name for the search engine

var pivotmatch = 0;
var totallinks = 0;
var prevregexp = "";

// ---------- BUILD PAGE ----------
function matchLinks(regex = prevregexp) {
	totallinks = 0;
	pivotmatch = regex == prevregexp ? pivotmatch : 0;
	prevregexp = regex;
	pivotbuffer = pivotmatch;
	// CLEAR LINKS FROM PREVIOUS QUERY
	p = document.getElementById("links");
	while (p.firstChild) {
		p.removeChild(p.firstChild);
	}
	match = new RegExp(regex ? regex : ".", "i");
	gmatches = false; // kinda ugly, rethink
	// FOR EACH CATEGORY OF SITE
	for (i = 0; i < Object.keys(sites).length; i++) {
		matches = false;
		sn = Object.keys(sites)[i]; // sn is the name of each category
		// CREATE DIV TO FILL
		section = document.createElement("div");
		section.id = sn;
		section.innerHTML = sn;
		section.className = "section";
		// CREATE DIV TO PUT INSIDE FIRST DIV
		inner = document.createElement("div");
		// FOR EACH SITE IN THE GIVEN CATEGORY
		for (l = 0; l < Object.keys(sites[sn]).length; l++) {
			ln = Object.keys(sites[sn])[l]; // ln is the name of each site
			// IF QUERY MATCHES PART OF SITE NAME
			if (match.test(ln)) {
				// CREATE A LINK
				link = document.createElement("a");
				link.href = sites[sn][ln];
				link.innerHTML = ln; // link text is name of site
				// HANDLE UP/DOWN ARROW KEY PRESSES
				if (!pivotbuffer++ && regex != "") {
					link.className = "selected";
					document.getElementById("action").action = sites[sn][ln];
					document.getElementById("action").children[0].removeAttribute("name");
				}
				// ADD LINK TO INNER DIV
				inner.appendChild(link);
				matches = true;
				gmatches = true;
				totallinks++;
			}
		}
		// ADD INNER DIV TO OUTER DIV
		section.appendChild(inner);
		// IF ANY MATCHES IN GIVEN CATEGORY, ADD TO PAGE
		matches ? p.appendChild(section) : false;
	}
	// IF NO MATCHES AT ALL OR BLANK SEARCHBAR, SEARCHBAR SEARCHES ON DUCKDUCKGO
	if (isValidURL(regex) && !regex.match(" ")) {
		if (regex.indexOf('https://') == -1 && regex.indexOf('http://') == -1) {
			regex = 'https://' + regex;
		}
		document.getElementById("action").action = regex;
		document.getElementById("action").children[0].name = "";
	} else if (!gmatches || regex == "") {
		document.getElementById("action").action = search;
		document.getElementById("action").children[0].name = query;
	}

	if (regex.toLowerCase() == "steam") {
		document.getElementById("action").action = "steam:";
		document.getElementById("action").children[0].name = "";
	} else if (regex.toLowerCase() == "spotify") {
		document.getElementById("action").action = "spotify:";
		document.getElementById("action").children[0].name = "";
	} else if (regex.toLowerCase() == "slack") {
		document.getElementById("action").action = "slack:";
		document.getElementById("action").children[0].name = "";
	}

	// SCALE HEIGHT TO MATCH SEARCH RESULTS
	document.getElementById("main").style.height = document.getElementById("main").children[0].offsetHeight + "px";
}

document.onkeydown = function (e) {
	// IF UP/DOWN ARROW PRESSED SWITCH SELECTED ACCORDINGLY
	if (e.keyCode == 37 || e.keyCode == 38) {
		pivotmatch = pivotmatch >= 0 ? 0 : pivotmatch + 1;
		matchLinks();
	} else if (e.keyCode == 39 || e.keyCode == 40) {
		pivotmatch = pivotmatch <= -totallinks + 1 ? -totallinks + 1 : pivotmatch - 1;
		matchLinks();
	}
	document.getElementById("action").children[0].focus();
}

document.getElementById("action").children[0].onkeypress = function (e) {
	if (e.key == "ArrowDown" || e.key == "ArrowUp") {
		return false;
	}
}

function displayClock() {
	now = new Date();
	clock = (now.getHours() < 10 ? "0" + now.getHours() : now.getHours()) + ":"
		+ (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) + ":"
		+ (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
	document.getElementById("clock").innerHTML = clock;
}

// Self explanatory, straight from StackOverflow
function getRandomInt(min, max, prev, range) {
	min = Math.ceil(min);
	max = Math.floor(max);
	val = Math.floor(Math.random() * (max - min + 1)) + min;

	if (val >= prev - range && val <= prev + range) {
		return getRandomInt(min, max, prev, range);
	}
	return val;
}

var first = true;
// Seems like a jank way to do this, change later?
function changeTransitionTime() {
	if (first) {
		document.getElementsByTagName('html')[0].style.setProperty("--transtime", "7000ms");
		first = false;
	}
}

// Cycle hue of color palette
var prev_hue = 0;
function cycleColor() {
	new_hue = getRandomInt(10, 360, prev_hue, 150);
	document.getElementsByTagName('html')[0].style.setProperty("--base", new_hue);
	prev_hue = new_hue;
	console.log(prev_hue);
}

window.onload = matchLinks();
displayClock();
cycleColor();
setInterval(displayClock, 1000);
setInterval(cycleColor, 11000);
setInterval(changeTransitionTime, 5000);
