build:
	docker build -t jmdeldin/stuff .
shell:
	docker run -it -v `pwd`:/srv/stuff jmdeldin/stuff sh
run:
	docker run -it -p 4000:3000 -v `pwd`:/srv/stuff jmdeldin/stuff
