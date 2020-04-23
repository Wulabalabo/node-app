const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const passport=require('passport');

const app = express();

const users = require('./routes/api/users');
const profiles= require('./routes/api/profiles');

const port = process.env.PORT || 5000;
const db = require('./config/Keys').mongoURI;


app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

app.use(passport.initialize());
require("./config/passport")(passport);
//Conncet Mongodb
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Mongodb Connect!"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World !");
})

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "Content-Type");
    res.header("Access-Control-Allow-Origin", "PUT,POST,GET,DELETE,OPTIONS");
    next();
})


app.use("/api/users", users);
app.use("/api/profiles",profiles);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})