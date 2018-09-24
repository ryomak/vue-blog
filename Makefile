deps:
	npm install
run:
	npm run dev
build:
	npm run build
deploy:
	make build
	firebase deploy
