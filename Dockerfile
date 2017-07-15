FROM ubuntu:zesty
LABEL maintainer "dev@jmdeldin.com"

RUN apt-get update -qq && apt-get upgrade -yqq
RUN apt-get install -yqq nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

# for flow
RUN apt-get install -yqq ocaml libelf-dev

EXPOSE 3000
VOLUME /srv/stuff
WORKDIR /srv/stuff
CMD ["npm", "start"]
