const express = require('express');
const req = require('express/lib/request');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

app.get('/', async (req, res) => {
    res.status(200).send('Welcome to the NFL + MLB Live Scores API!');
});

app.get('/debug', async (req, res) => {
    res.status(200).send('API seems to be up and responding properly!')
});