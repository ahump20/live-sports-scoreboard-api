const express = require('express');
const Redis = require('ioredis');
const { REDIS_SERVER_IP, REDIS_SERVER_PORT } = require('./secrets');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

const nfl_redis_conn = new Redis({ host: REDIS_SERVER_IP, port: REDIS_SERVER_PORT, db:0 });
nfl_redis_conn.ping().then((res) => {
    console.log('Redis connection to NFL DB is successful:', res);
});

const mlb_redis_conn = new Redis({ host: REDIS_SERVER_IP, port: REDIS_SERVER_PORT, db:1 });
mlb_redis_conn.ping().then((res) => {
    console.log('Redis connection to MLB DB is successful:', res);
});

app.get('/', async (req, res) => {
    res.status(200).send('Welcome to the NFL + MLB Live Scores API!');
});

app.get('/debug', async (req, res) => {
    res.status(200).send('API seems to be up and responding properly!')
});

app.get('/test-redis-conn', async (req, res) => {
    const test_game_key = "nfl_game:1";
    try {
        const test_game = await nfl_redis_conn.hgetall(test_game_key);
        console.log(test_game);
        res.status(200).send(test_game);
    } catch (error) {
        console.error(error);
        res.status(500).send("Encountered an error while trying to access Redis DB: " + error);
    }
})

app.get('/nfl/get-game-count', async (req, res) => {
    try {
        const nfl_game_count = await nfl_redis_conn.hgetall('nfl_game_count');
        console.log(nfl_game_count);
        res.status(200).json({game_count: nfl_game_count["game_count"]});
    } catch (error) {
        console.error(error);
        res.status(500).send("Encountered an error while trying to get game count from DB: " + error);
    }
});

const convertNoneToNull = (value) => {
    return (value.toLowerCase() == 'none') ? null : value;
}

app.get('/nfl/get-live-score/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const game = await nfl_redis_conn.hgetall(`nfl_game:${id}`);
        const response_json = {
            away_team: game["away_team"],
            away_team_id: game["away_team_id"],
            away_score: game["away_score"],
            away_record: game["away_record"],
            home_team: game["home_team"],
            home_team_id: game["home_team_id"],
            home_score: game["home_score"],
            home_record: game["home_record"],
            display_game_state: game["display_game_state"],
            game_state: game["game_state"],
            possession_info: convertNoneToNull(game["possession_info"]),
        }
        console.log(response_json);
        res.status(200).json(response_json);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.get('/mlb/get-game-count', async (req, res) => {
    try {
        const mlb_game_count = await mlb_redis_conn.hgetall('mlb_game_count');
        console.log(mlb_game_count);
        res.status(200).json({game_count: mlb_game_count["game_count"]});
    } catch (error) {
        console.error(error);
        res.status(500).send("Encountered an error while trying to get game count from DB: " + error);
    }
});

const convertStringToBoolean = (value) => {
    return (value.toLowerCase() === 'true');
}

app.get('/mlb/get-live-score/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const game = await mlb_redis_conn.hgetall(`mlb_game:${id}`);
        const response_json = {
            away_team: game["away_team"],
            home_team: game["home_team"],
            away_score: game["away_score"],
            home_score: game["home_score"],
            inning: game["inning"],
            current_state: game["current_state"],
            first_base: convertStringToBoolean(game["first_base"]),
            second_base: convertStringToBoolean(game["second_base"]),
            third_base: convertStringToBoolean(game["third_base"])
        };
        console.log(response_json);
        res.status(200).json(response_json);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});