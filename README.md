# URL Shortener

A fully dockerized, self-hostable link shortening web application.

Built with NodeJS, TypeScript, and MongoDB.

<p align="center">
  <img src="https://github.com/jengmicah/url-shortener/blob/master/images/demo.gif?raw=true" alt="demo gif">
</p>

## Features

- Validation upon creation (duplicates, invalid URLs, redirect loops, etc.)
- Dockerized NodeJS and MongoDB
- Live reload and compilation of TypeScript files

## Potential Features

- Custom URL expiry
- User registration to add/modify/delete URL redirects
- Rate limiting
- Click/Impression tracking

## Quick Start

- Clone this repo: git clone https://github.com/jengmicah/url-shortener.git
- Duplicate `.env.example` and rename to `.env`
  - Set `SERVER_URI` to server host
    - Note that the port of `SERVER_URI` corresponds with the exposed **host** port in `docker-compose.yml` (**host**:container)
    - The exposed port in `Dockerfile` corresponds with the exposed **container** port in `docker-compose.yml` (host:**container**) as well as the server port specified in `src/index.ts`.
  - Set `NODE_ENV` to `development` or `production`
- Run `./_build.sh` to run the `docker-compose.yml`
