const express = require("express");
const app = express();
const mysql = require("mysql");
const port = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
/*const db = mysql.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b016b39f0eb8a4',
    password: 'ccbbce4c',
    database: 'heroku_207cf8762746b66'
});

db.connect(err => {
    if (err) {
        console.log(err);
        throw err;
    }
    else {
        console.log('Database OK');
    }
});*/

var db;

function handleDisconnect() {
    db = mysql.createConnection({
        host: 'us-cdbr-east-03.cleardb.com',
        user: 'b016b39f0eb8a4',
        password: 'ccbbce4c',
        database: 'heroku_207cf8762746b66'
    });

    db.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
        else {
            console.log('Database OK');
        }
    });

    db.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).send("<h1>Hello</h1>");
});

app.get('/api/getAll/:game', (req, res) => {
    const { game } = req.params;
    const query = 'SELECT * FROM user WHERE game=(?);';
    db.query(query, game, (err, result) => {
        if (err) { console.log('Err ' + err); return err; }
        console.log(result);
        res.send(result).status(200);
    })
})

app.get('/api/user/:userName/:game', (req, res) => {
    const { userName, game } = req.params;
    const query = 'SELECT * FROM user WHERE userName=(?) AND game=(?);';
    db.query(query, [userName, game], (err, result) => {
        if (err) { console.log('Err ' + err); return err; }
        console.log(result);
        res.send(result).status(200);
    })
})

app.post('/api/login', (req, res) => {
    const { userName, score, game } = req.body;
    const query = 'INSERT INTO user (userName, score, game) VALUES (?,?,?);';
    db.query(query, [userName, score, game], (err, result) => {
        if (err) { console.log('Err ' + err); return err; }
        console.log(result);
        res.send('Login new').status(200);
    })
})

app.put('/api/updateScore', (req, res) => {
    const { userName, score, game } = req.body;
    const query = 'UPDATE user SET score=(?) WHERE userName=(?) AND game=(?);';
    db.query(query, [score, userName, game], (err, result) => {
        if (err) { console.log('Err ' + err); return err; }
        console.log(result);
        res.send('Update score').status(200);
    })
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})
