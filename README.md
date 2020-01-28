# dome

Personalization and modification of dome startpage.

Modifications:
* Search bar input treated as a plain string instead of a regexp
* Random base color on page load
* If a URL, IP address, or localhost is entered into the search bar, it will redirect the browser to that address instead of searching it
* `https://` automatically prepended to valid URLs
* `http://` automatically prepended to valid IPs and localhost
* Add `!!` to the end of a valid address to toggle the protocol type
    * Toggle to `http://` for valid URLs
    * Toggle to `https://` for valid IPs and localhost

credit: https://gitlab.com/Capuno/dome
