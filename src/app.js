global.devMode = true;

require('dotenv').config({ path: devMode ? 'D:/OneDrive/Documents/Programming/SERVANT GROUP/servant.gg/.env' : '/var/www/servant.gg/.env' });
require('./strategies/discordstrategy');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const db = require('./database/database');
const path = require('path');
const mongoose = require('mongoose');
const { Client } = require('discord.js');
const bodyParser = require('body-parser');
const fs = require('fs');

// Discord.JS
var bot = new Client();

bot.on('ready', () => {
    console.log(`Bot logged in as ${bot.user.tag}`);
});

bot.login(process.env.CLIENT_TOKEN);

// MongoDB
db.then(() => console.log('MongoDB connected!')).catch(err => console.log(err));

// Express
// Routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard')(bot);
const submitRoute = require('./routes/submit')(bot);
const leaderboardRoute = require('./routes/leaderboard')(bot);

app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    resave: false,
    name: 'discord.oauth2',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware Routes
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);
app.use('/submit', submitRoute);
app.use('/leaderboard', leaderboardRoute);

app.get('/', (req, res) => {
    res.render('home', { req });
});

app.get('/help', (req, res) => {
    res.render('help', { req });
});

app.get('/faq', (req, res) => {
    res.render('faq', { req });
});

app.get('/donate', (req, res) => {
    res.render('donate', { req });
});

app.get('/statistics', (req, res) => {
    // Get the json from Servant
    fs.readFile(process.env.PATH_TO_SERVER_LOG, 'utf8', function (err, json) {
        if (err) res.render('404', { req });
        else {
            const jsonUnsorted = JSON.parse(json);

            // Cut the keys so they only show the date
            // Duplicate keys will be eliminated automatically
            const jsonSubstring = {};

            Object.keys(jsonUnsorted).forEach((key) => {
                const keyCut = key.substring(0, 10);
                const value = jsonUnsorted[key];

                jsonSubstring[keyCut] = value;
            });

            // Sort the object by key (chronologically)
            const jsonSorted = {};

            Object.keys(jsonSubstring).sort().forEach((key) => {
                const value = jsonSubstring[key];

                jsonSorted[key] = value;
            });

            // Convert object to required arrays 'labels' and 'data'
            const labels = [];
            const data = [];

            Object.keys(jsonSorted).forEach((key) => {
                const value = jsonSorted[key];

                if (value > 0) {
                    labels.push(key);
                    data.push(value);
                }
            });

            res.render('statistics', { req, labels, data });
        }
    });
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    res.status(404).render('404', { req });
});

app.listen(PORT, () => {
    console.log(`Websocket connected on port ${PORT}`);
});