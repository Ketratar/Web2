'use strict';
//var http = require('http');
//var port = process.env.PORT || 1337;

//I need them ok
const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();
const jsonParser = express.json();

app.use(express.static(path.join(__dirname, '/public')));

//Path for JSON data
const filePath = "users.json";


//Test api is working??? Emm, ok, good, it's not working what I expected ;D
app.get("/api/users", function (req, res) {
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);
    res.send(users);
});

//GET with age filter, Just because I can
app.get("/api/users/search/:count", function (req, res) {
    const count = req.params.count;
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);
    var userslenght = Object.keys(users).length;
    var user = [];

    for (var i = 0; i < userslenght; i++) {
        if (users[i].age > count) {
            var data = {
                id: users[i].id,
                name: users[i].name,
                age: users[i].age
            };
            user.push(data);
        }
    }
    if (user)
        res.send(user);
    else
        res.status(404).send();
});

//Again test thing to check out how is work
app.get("/api/users/:id", function (req, res) {
    const id = req.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);
    var userslenght = Object.keys(users).length;

    let user = null;

    for (var i = 0; i < userslenght; i++) {
        if (users[i].id == id) {
            user = users[i];
            break;
        }
    }
    if (user)
        res.send(user)
    else
        res.status(404).send();
});

//POST adding something user familiar strange object thing
app.post("/api/users", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const userName = req.body.name;
    const userAge = req.body.age;
    let user = { name: userName, age: userAge };

    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
    var userslenght = Object.keys(users).length;

    //This block is so good, mmmm. Searches for unique ID, if it's [1, 7, 3, 2] and etc. It'll find ID that not in JSON file used
    var id = 1;
    while (1) {
        for (var i = 0; i < userslenght; i++) {
            if (users[i].id == id) {
                id++;
                i = -1;
            }
        }
        break;
    }

    //Getting ID to user
    user.id = id;
    //Pushing to object
    users.push(user);
    //Making things better, also hating JSON.* thing
    data = JSON.stringify(users);
    fs.writeFileSync("users.json", data);
    res.send(user);
});

// DELETE deletng with id, that's it ;D
app.delete("/api/users/:id", function (req, res) {

    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
    //index -1, because reasons
    let index = -1;
    //Seatching for ID
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        //Hhow the splice thing works again? I'm confused
        const user = users.splice(index, 1)[0];
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        // Sending deleted user
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});

//Changing user
app.put("/api/users", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    //Getting data
    const userId = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;

    //Reading data
    let data = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(data);
    var userslenght = Object.keys(users).length
    let user;
    //Finding data
    for (var i = 0; i < userslenght; i++) {
        if (users[i].id == userId) {
            user = users[i];
            break;
        }
    }
    // Changing logic is not good ;D
    if (user) {
        user.age = userAge;
        user.name = userName;
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else {
        res.status(404).send(user);
    }
});


// Emm, I dont want to talk about this
app.listen(1337);
console.log("We are starting!!!");
//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);