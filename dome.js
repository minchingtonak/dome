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

// ---------- CONFIGURATION ----------

// div.innerHTML : {a.innerHTML : a.href}
const sites = {
  Watch: {
    Plex: "https://app.plex.tv/desktop",
    Netflix: "https://www.netflix.com/browse",
    Twitch: "https://www.twitch.tv",
    YouTube: "https://www.youtube.com/"
  },
  Uni: {
    Canvas: "https://umich.instructure.com/login",
    "EECS Gitlab": "https://gitlab.eecs.umich.edu/",
    "eecs483.org": "https://piazza.com/umich/winter2020/eecs483/resources",
    "eecs485.org": "https://eecs485staff.github.io/eecs485.org/",
    Gradescope: "https://www.gradescope.com/",
    "Wolverine Access": "https://wolverineaccess.umich.edu"
  },
  IA: {
    Piazza: "https://piazza.com/class",
    MPrint: "https://mprint.umich.edu/",
    "OH Queue": "https://lobster.eecs.umich.edu/eecsoh/",
    "Drive (280)":
      "https://drive.google.com/drive/u/2/folders/1_AXJpe9W2qovqr68-KjcnyYMjukmykK5",
    Autograder: "https://autograder.io",
    "eecs280.org": "https://eecs280staff.github.io/eecs280.org/"
  },
  Social: {
    Reddit: "https://www.reddit.com/",
    Twitter: "https://twitter.com/?lang=en",
    GitHub: "https://github.com/",
    GroupMe: "https://web.groupme.com/chats",
    Messenger: "https://www.messenger.com"
  },
  Productivity: {
    Keep: "https://keep.google.com",
    Drive: "https://drive.google.com/drive/u/2/my-drive",
    Calendar: "https://calendar.google.com",
    akminch: "https://mail.google.com/mail/u/2/",
    "alec.minch": "https://mail.google.com/mail/u/0/",
    notathrowaway: "https://mail.google.com/mail/u/1/"
  },
  Misc: {
    Ally: "https://www.ally.com/",
    Fidelity: "https://www.fidelity.com/",
    "Last.fm": "https://last.fm/user/Slarrty",
    Amazon: "https://www.amazon.com/",
    rateyourmusic: "https://rateyourmusic.com/"
  }
};

const alt_names = {
  "eecs280.org": "programmingdatastructures",
  "eecs483.org": "compilers",
  "eecs485.org": "websystems"
};

function isAltName(site, name) {
  const s = alt_names[site];
  return s && s.includes(name);
}

const searchengine = "https://google.com/search"; // The search engine
const query = "q"; // The query variable name for the search engine

let pivotmatch = 0,
  totallinks = 0;
let prevsearchterm = "";

// ---------- BUILD PAGE ----------
function matchLinks(searchterm = prevsearchterm) {
  totallinks = 0;
  pivotmatch = searchterm == prevsearchterm ? pivotmatch : 0;
  prevsearchterm = searchterm;
  pivotbuffer = pivotmatch;
  // Clear links from previous query
  const p = document.getElementById("links");
  while (p.firstChild) p.removeChild(p.firstChild);

  let gmatches = false;
  // For each category in sites
  for (const cat of Object.keys(sites)) {
    let matches = false;
    // Create div to fill
    const section = document.createElement("div");
    section.id = cat;
    section.innerHTML = cat;
    section.className = "section";
    // Create div to put inside first div
    const inner = document.createElement("div");
    // For each site in the given category
    for (const site of Object.keys(sites[cat])) {
      // If query matches part of the site name
      const lct = searchterm.toLowerCase();
      if (
        !searchterm.length ||
        site.toLowerCase().includes(lct) ||
        isAltName(site, lct)
      ) {
        // Create a link
        const link = document.createElement("a");
        link.href = sites[cat][site];
        link.innerHTML = site; // link text is name of site
        // Handle up/down arrow keypresses
        if (!pivotbuffer++ && searchterm != "") {
          link.className = "selected";
          document.getElementById("action").action = sites[cat][site];
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
  let validlh, validip;
  if (searchterm.match(/lh\s*\d{1,5}/)) {
    // shortcut for localhost
    setDest("http://localhost:" + searchterm.match(/\d{1,5}/)[0]);
  } else if (
    !searchterm.includes(" ") &&
    (isValidURL(searchterm) ||
      (validlh = isLocalhost(searchterm)) ||
      (validip = isValidIP(searchterm)))
  ) {
    // If URL, Ip address, or localhost, go to the specified address
    if (!searchterm.match(/http(s)?:\/\//)) {
      let http = validlh || validip;
      if (searchterm.slice(-2) == "!!") {
        http = !http;
        searchterm = searchterm.slice(0, -2);
      }
      searchterm = "http" + (http ? "" : "s") + "://" + searchterm;
    }
    setDest(searchterm);
  } else if (!gmatches || searchterm == "") {
    // If no matches at all or blank searchbar, searchbar searches on specified search engine
    setDest(searchengine, query);
  }

  // Scale height to match search results
  document.getElementById("main").style.height =
    document.getElementById("main").children[0].offsetHeight + "px";
}

function setDest(dest, queryvar = "") {
  document.getElementById("action").action = dest;
  document.getElementById("action").children[0].name = queryvar;
}

document.onkeydown = function(e) {
  // If up/down arrow pressed switch selected accordingly
  if (e.keyCode == 37 || e.keyCode == 38) {
    pivotmatch = pivotmatch >= 0 ? 0 : pivotmatch + 1;
    matchLinks();
  } else if (e.keyCode == 39 || e.keyCode == 40) {
    pivotmatch =
      pivotmatch <= -totallinks + 1 ? -totallinks + 1 : pivotmatch - 1;
    matchLinks();
  }
  document.getElementById("action").children[0].focus();
};

document.getElementById("action").children[0].onkeypress = function(e) {
  if (e.keyCode == 38 || e.keyCode == 40) return false;
};

function displayClock() {
  const now = new Date();
  const clock =
    (now.getHours() < 10 ? "0" + now.getHours() : now.getHours()) +
    ":" +
    (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) +
    ":" +
    (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
  document.getElementById("clock").innerHTML = clock;
}

// Self explanatory, straight from StackOverflow
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Cycle hue of color palette
function cycleColor() {
  const new_hue = getRandomInt(10, 360);
  document.getElementsByTagName("html")[0].style.setProperty("--base", new_hue);
}

function isLocalhost(string) {
  return (
    string.match(
      /localhost(:(([1-9]\d{0,4})|0))?([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    ) != null
  );
}

function isValidIP(string) {
  return (
    string.match(
      /((([1-9]\d{0,2})|0)\.){3}((([1-9]\d{0,2})|0))(:(([1-9]\d{0,4})|0))?([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    ) != null
  );
}

function isValidURL(string) {
  return (
    string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    ) != null
  );
}

window.onload = matchLinks();
displayClock();
cycleColor();
setInterval(displayClock, 1000);
