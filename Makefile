
sources = $(wildcard src/*.ts)

.PHONY: all typescript

all: dist/view.js typescript

dist/view.js: $(sources)
	@node ./node_modules/.bin/rollup -c

typescript: $(sources)
	@tsc