const express = require("express");
const app = express();
const mysql = require("mysql");
const port = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
const db = mysql.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b25fb3de5c9f9a',
    password: 'd0e8f95a',
    database: 'heroku_e96f41d4a80c60c'
});

db.connect(err => {
    if (err) {
        console.log(err);
        return err;
    }
    else {
        console.log('Database OK');
    }
})

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).send("<h1>Hello</h1>");
});

app.get('/api/getAll/:game', (req, res) => {
    const { game } = req.params;
    const query = 'SELECT * FROM swarwars_memorygame.user WHERE game=(?);';
    db.query(query, game, (err, result) => {
        if (err) { console.log('Err ' + err); return err; }
        console.log(result);
        res.send(result).status(200);
    })
})

app.get('/api/user/:userName/:game', (req, res) => {
    const { userName, game } = req.params;
    const query = 'SELECT * FROM swarwars_memorygame.user WHERE userName=(?) AND game=(?);';
    db.query(query, [userName, game], (err, result) => {
        if (err) { console.log('Err ' + err); return err; }
        console.log(result);
        res.send(result).status(200);
    })
})

app.post('/api/login', (req, res) => {
    const { userName, score, game } = req.body;
    const query = 'INSERT INTO swarwars_memorygame.user (userName, score, game) VALUES (?,?,?);';
    db.query(query, [userName, score, game], (err, result) => {
        if (err) { console.log('Err ' + err); return err; }
        console.log(result);
        res.send('Login new').status(200);
    })
})

app.put('/api/updateScore', (req, res) => {
    const { userName, score, game } = req.body;
    const query = 'UPDATE swarwars_memorygame.user SET score=(?) WHERE userName=(?) AND game=(?);';
    db.query(query, [score, userName, game], (err, result) => {
        if (err) { console.log('Err ' + err); return err; }
        console.log(result);
        res.send('Update score').status(200);
    })
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})