
sources = $(wildcard src/*.ts)

.PHONY: all typescript

all: typescript dist/view.js

dist/view.js: $(sources)
	@echo "Bundling @viewjs.di"
	@node ./node_modules/.bin/rollup -c

typescript: $(sources)
	@echo "Transpiling @viewjs/di .ts => .js "
	@tsc