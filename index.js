const express = require('express');
const Redis = require('ioredis');
const { REDIS_SERVER_IP, REDIS_SERVER_PORT } = require('./secrets');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

const redis_conn = new Redis({ host: REDIS_SERVER_IP, port: REDIS_SERVER_PORT });
redis_conn.ping().then((res) => {
    console.log('Redis connection successful:', res);
});

app.get('/', async (req, res) => {
    res.status(200).send('Welcome to the NFL + MLB Live Scores API!');
});

app.get('/debug', async (req, res) => {
    res.status(200).send('API seems to be up and responding properly!')
});

app.get('/test-redis-conn', async (req, res) => {
    const test_game_key = "test_game:001";
    try {
        const test_game = await redis_conn.hgetall(test_game_key);
        console.log(test_game);
        res.status(200).send(test_game);
    } catch (error) {
        console.error(error);
        res.status(500).send("Encountered an error while trying to access Redis DB: " + error);
    }
})