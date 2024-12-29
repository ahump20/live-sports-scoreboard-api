const express = require('express');
const Redis = require('ioredis');
const redis_conn = new Redis({ host: '10.0.0.194', port: 6379 });

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const test_game_key = "test_game:001";

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

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
    try {
        const test_game = await redis_conn.hgetall(test_game_key);
        console.log(test_game);
        res.status(200).send(test_game);
    } catch (error) {
        console.error(error);
        res.status(500).send("Encountered an error while trying to access Redis DB: " + error);
    }
})