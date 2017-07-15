build:
	docker build -t jmdeldin/stuff .
run:
	docker run -it -p 4000:3000 -v `pwd`:/srv/stuff jmdeldin/stuff
