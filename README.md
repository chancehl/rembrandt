# rembrandt

## Overview

Rembrandt is a [Discord](https://discord.com/) bot that helps teach your server about art history and appreciation. It will periodically send the server random paintings, artifacts and sculptures within the [Metropolitan Museum of Art] collection with accompanying information on the piece.

<img src="./rembrandt.jpg" height="400" />

## Running the bot locally

### Prerequisites

To run the bot you'll need the following:

-   [nodejs](https://nodejs.org/en/) version 16+
-   [docker](https://www.docker.com/) and the [docker compose](https://docs.docker.com/compose/) plugin
-   [redis](https://redis.io/)
-   a [discord bot token](https://discord.com/developers) (see below)

### Creating a discord application and bot

When the "official" Rembrandt bot joins your server, it will be hosted and running via my own application with my own client keys and secrets. However, since those are private, you'll need one of your own to run the bot.

1. To do that, go to [Discord developer portal](https://discord.com/developers) and click the "new application" button. Give it any name you want (perhaps "Rembrandt"?) and then wait to be redirected to the application page.
2. Click the "bot" tab on the left and then click the "add bot" button
3. After you've given it a name and a description click the "reveal token" button (or copy token). **Treat this token like a password.** Don't store it anywhere, don't give it to anyone, etc.
4. Lastly, create a `.env` file in the root of the directory and add a line that looks like: `DISCORD_BOT_TOKEN=your_token_goes_here`. Make sure never to commit this file.

### Running the bot

First, run `npm install` to install the dependencies you need to run this project. Then proceed with either the running locally or runnning on a docker container steps.

#### On your machine

Run `npm run dev:watch` to start the bot in watch mode. This is useful for developing, but if you plan to not make any changes to the code, you can compile the code and then run the bot via `npm run build && npm run start`. The redis cache will also need to be started in order for the bot to function. Run `npm run start:redis` (this is a long running process, so run this in a new terminal window) to start the redis cache.

Bot logs will be printed to the console.

#### Within a docker container

Run `docker compose up --build` within the root of the project to compose a new docker container from the `node:alpine` and `redis` images.

You can run `docker logs rembrandt-bot-1 -f` to see the logs for the bot.

## Commands

| Command | Options          | Notes                                                       |
| ------- | ---------------- | ----------------------------------------------------------- |
| /art    | query (optional) | Artwork will be picked at random unless a query is provided |

## Roadmap

✨ In progress
