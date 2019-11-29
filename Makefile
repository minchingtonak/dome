minify: style.css dome.js index.orig.html
	uglifyjs dome.js > dome.min.js
	csso style.css > style.min.css
	html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true index.orig.html > index.html

.PHONY: tools
tools:
	sudo npm install -g mishoo/UglifyJS2#harmony html-minifier csso-cli