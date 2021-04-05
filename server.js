const express = require('express');
var faker = require('faker');
const bcrypt = require("bcrypt");
const cors = require("cors");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors())

const database = {
    users: [
        {
            id: '1234',
            name: 'bruce',
            email: 'b@mail.com',
            password: 'huhuhu',
            entries: 20,
            joined: new Date()
        },
        {
            id: '1235',
            name: 'sue',
            email: 's@mail.com',
            password: 'ehchc',
            entries: 2,
            joined: new Date()
        }
    ]
}

app.get('/', ((req, res) => {
    res.send(database.users);
}))

app.post('/signin', ((req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json('success')
    } else {
        res.status(400).json('please register!')
    }
}))

app.post('/register', ((req, res) => {
    const {email, name, password} = req.body;
    const id = faker.datatype.uuid();

    bcrypt.hash(password, 10, function (err, hash){
        console.log(hash);
    })

    database.users.push({
        id: id,
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length - 1]);
}));

app.get('/profile/:id', ((req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('user not found');
    }
}))

app.put('/image', ((req, res) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('user not found');
    }

}))

app.listen(port, () => {
    console.log('listening on port: ', port);
})