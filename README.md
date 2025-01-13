# Live Sports Scoreboard API

## Description
A simple API build with Node.js and Express and containerized using Docker. It is one component of a project I have worked on using an Adafruit M4 MatrixPortal. In short, it is an LED scoreboard that can show live up-to-the-minute scores for the MLB and NFL. This is the API that is called by the scoreboard to get the live score data. There is also a set of python scripts that I run as cron jobs that is also needed as a part of the data pipeline for this project. The repository for those scripts [can be found here](https://github.com/nishs9/live-sports-score-update-service).

At the moment, all of the backend infrastructure required for this project is hosted on GCP. My goal is to self-host everything on my Raspberry Pi. As a side objective, I also want to document everything I build and add it to my Github.

## Setup [work in progress...]

First clone the repository:

```bash
git clone <repo-url>
cd live-sports-scoreboard-api
```

Right now I just have a couple of placeholder endpoints while I work on finishing migrating the code. Information about the endpoints will be added soon. To run the API with docker simply do the following.

```bash
docker-compose up --build
```

Visit `localhost:3000` to see the API up and running.

### API Endpoints
Below are the API's endpoints and some basic details about them:

- `/nfl/get-game-count`
- `/nfl/get-live-score/:id`
- `/mlb/get-game-count`
- `/mlb/get-live-score/:id`