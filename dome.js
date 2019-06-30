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
		"Netflix": "https://www.netflix.com/browse",
		"YouTube": "https://www.youtube.com/",
		"KissAnime": "https://kissanime.ac/",
		"RoosterTeeth FIRST": "https://fun.haus"
	},
	"Uni": {
		"Piazza": "https://piazza.com/class",
		"Canvas": "https://umich.instructure.com/login",
		"Gradescope": "https://www.gradescope.com/",
		"EECS Gitlab": "https://gitlab.eecs.umich.edu/",
		"Wolverine Access": "https://wolverineaccess.umich.edu"
	},
	"IA": {
		"MPrint": "https://mprint.umich.edu/",
		"280 Drive": "https://drive.google.com/drive/u/2/folders/1BXVRTCsy8Em4N_4NKP67G82yTr6EFCAE",
		"OH Queue": "https://lobster.eecs.umich.edu/eecsoh/",
		"Autograder": "https://autograder.io/web/courses",
		"280 Website": "https://eecs280staff.github.io/eecs280.org/"
	},
	"Social": {
		"Slack": "slack:",
		"Reddit": "https://www.reddit.com/",
		"Twitter": "https://twitter.com/?lang=en",
		"GitHub": "https://github.com/",
		"GroupMe": "https://web.groupme.com/chats",
		"Messenger": "https://www.messenger.com"
	},
	"Productivity": {
		"Keep": "https://keep.google.com",
		"Drive": "https://drive.google.com/drive/u/2/my-drive",
		"Calendar": "https://calendar.google.com",
		"akminch": "https://mail.google.com/mail/u/2/",
		"alec.minch": "https://mail.google.com/mail/u/0/",
		"notathrowaway": "https://mail.google.com/mail/u/1/"
	},
	"Misc": {
		"Ally": "https://www.ally.com/",
		"Spotify": "spotify:",
		"Fidelity": "https://www.fidelity.com/",
		"Last.fm": "https://last.fm/user/Slarrty",
		"Amazon": "https://www.amazon.com/",
		"LinkedIn": "https://www.linkedin.com/feed/"
	}
	/* "Games": { // To find the game ID check the url in the store page or the community page
	"CS:GO": "steam://run/730",
	"POSTAL 2": "steam://run/223470"
} */
};


var search = "https://google.com/search";		// The search engine
var query = "q";							    // The query variable name for the search engine

var pivotmatch = 0;
var totallinks = 0;
var prevregexp = "";

// ---------- BUILD PAGE ----------
function matchLinks(regex = prevregexp) {
	totallinks = 0;
	pivotmatch = regex == prevregexp ? pivotmatch : 0;
	prevregexp = regex;
	pivotbuffer = pivotmatch;
	// Clear links from previous query
	p = document.getElementById("links");
	while (p.firstChild) {
		p.removeChild(p.firstChild);
	}
	// match = new RegExp(regex ? regex : ".", "i"); // treats search term as regex
	gmatches = false; // kinda ugly, rethink
	// For each category in sites
	for (i = 0; i < Object.keys(sites).length; i++) {
		matches = false;
		sn = Object.keys(sites)[i]; // sn is the name of each category
		// Create div to fill
		section = document.createElement("div");
		section.id = sn;
		section.innerHTML = sn;
		section.className = "section";
		// Create div to put inside first div
		inner = document.createElement("div");
		// For each site in the given category
		for (l = 0; l < Object.keys(sites[sn]).length; l++) {
			ln = Object.keys(sites[sn])[l]; // ln is the name of each site
			// If query matches part of the site name
			// if (match.test(ln)) { // treats serach term as regex
			if (ln.toLowerCase().includes(regex.toLowerCase()) || regex.length == 0) {
				// Create a link
				link = document.createElement("a");
				link.href = sites[sn][ln];
				link.innerHTML = ln; // link text is name of site
				// Handle up/down arrow keypresses
				if (!pivotbuffer++ && regex != "") {
					link.className = "selected";
					document.getElementById("action").action = sites[sn][ln];
					document.getElementById("action").children[0].removeAttribute("name");
				}
				// Add link to inner div
				inner.appendChild(link);
				matches = true;
				gmatches = true;
				totallinks++;
			}
		}
		// Add inner div to outer div
		section.appendChild(inner);
		// If any matches in the given category, add to page
		matches ? p.appendChild(section) : false;
	}
	// If no matches at all or blank searchbar, searchbar searches on specified search engine
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

	// Scale height to match search results
	document.getElementById("main").style.height = document.getElementById("main").children[0].offsetHeight + "px";
}

document.onkeydown = function (e) {
	// If up/down arrow pressed switch selected acordingly
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
function getRandomInt(min, max/*, prev, range */) {
	min = Math.ceil(min);
	max = Math.floor(max);
	val = Math.floor(Math.random() * (max - min + 1)) + min;

	// if (val >= prev - range && val <= prev + range) {
	// 	return getRandomInt(min, max, prev, range);
	// }
	return val;
}

// Cycle hue of color palette
function cycleColor() {
	new_hue = getRandomInt(10, 360/* , prev_hue, 150 */);
	document.getElementsByTagName('html')[0].style.setProperty("--base", new_hue);
}

function isValidURL(string) {
	var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
	return res != null;
}

window.onload = matchLinks();
displayClock();
cycleColor();
setInterval(displayClock, 1000);
