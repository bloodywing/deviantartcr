SHELL := /usr/bin/env bash
CHROME := $(shell which google-chrome 2>/dev/null || which google-chrome-stable 2>/dev/null || which chromium 2>/dev/null || which chromium-browser 2>/dev/null || which chrome 2>/dev/null)
PEM := $(shell find . -maxdepth 1 -name "*.pem")
WEBEXT := ./node_modules/.bin/web-ext
BROWSERIFY := ./node_modules/.bin/browserify


all: release

js:
	"$(BROWSERIFY)" ./dacr/background.browserify.js > ./dacr/background.js
	"$(BROWSERIFY)" ./dacr/content-script.browserify.js > ./dacr/content-script.js

.PHONY: browser
browser: js
	mkdir -p browser
	cp dacr/*.js browser/
	cp dacr/*.png browser/
	rm --force browser/*.browserify.js
	cp dacr/manifest.json browser/

.PHONY: crx
crx: browser
	$(CHROME) --pack-extension=./browser

.PHONY: clean
clean:
	rm -f ./*.crx
	rm -f ./browser/manifest.json
	rm -f ./firefox.zip* ./browser/*.js
	rm -f ./app/{inject,background,content-script}.js

.PHONY: firefox
firefox: browser
	zip -jFS firefox browser/*


release: js firefox sign crx

.PHONY: npm
npm:
	npm install

run: npm
	"$(WEBEXT)" -s dacr --verbose run

.PHONY: sign
sign: firefox
	rm -f web-ext-artifacts/* > /dev/null
	"$(WEBEXT)" sign --api-key "$(WEB_EXT_API_KEY)" --api-secret "$(WEB_EXT_API_SECRET)" -s ./browser
	cp web-ext-artifacts/*.xpi web-ext-artifacts/latest.xpi