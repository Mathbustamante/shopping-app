const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const passport = require("passport");
const path = require('path');

const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));


//Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
//Initialize routes

app.use('/api', require('./My-app-backend/routes/api'));

//Serve static assets
if (process.env.NODE_ENV == 'production') {
    app.use(express.static('my-app/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'my-app', 'build', 'index.html'))
    })
}

// app.listen(process.env.PORT, process.env.IP);

app.listen(port, () => console.log("Server started"));
