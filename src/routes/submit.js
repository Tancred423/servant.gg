const router = require('express').Router();
const mysql = require('../database/mysql');
const Discord = require('discord.js');
const moment = require('moment-timezone');

// Global functions
const functions = require('../public/scripts/functions');
const sortMapByValue = functions.sortMapByValue;
const hasDuplicates = functions.hasDuplicates;
const getBoolean = functions.getBoolean;
const getBlank = functions.getBlank;
const nws = functions.nws;
const isLoggedIn = functions.isLoggedIn;
const getAuthorization = functions.getAuthorization;
const getSupporterStatus = functions.getSupporterStatus;

module.exports = function (bot) {
    ////////////////////////////////////////////
    // Routes
    ////////////////////////////////////////////

    // Submit (not a valid url)
    router.get('/', isLoggedIn, (req, res) => {
        res.render('404', { req });
    });

    // Guild settings
    router.post('/guild-settings', isLoggedIn, (req, res) => {
        submitGuild(req, res);
    });

    // User settings
    router.post('/user-settings', isLoggedIn, (req, res) => {
        submitUser(req, res);
    });

    // Auto role
    router.post('/auto-role', isLoggedIn, (req, res) => {
        submitAutoRole(req, res);
    });

    // Best of image
    router.post('/best-of-image', isLoggedIn, (req, res) => {
        submitBestOfImage(req, res);
    });

    // Best of quote
    router.post('/best-of-quote', isLoggedIn, (req, res) => {
        submitBestOfQuote(req, res);
    });

    // Birthday
    router.post('/birthday', isLoggedIn, (req, res) => {
        submitBirthday(req, res);
    });

    // Custom Commands Normal
    router.post('/custom-commands-normal', isLoggedIn, (req, res) => {
        submitCustomCommandsNormal(req, res);
    });

    // Custom Commands Embed
    router.post('/custom-commands-embed', isLoggedIn, (req, res) => {
        submitCustomCommandsEmbed(req, res);
    });

    // Custom Commands Normal - Edit
    router.post('/custom-commands-normal-edit', isLoggedIn, (req, res) => {
        submitCustomCommandsNormalEdit(req, res);
    });

    // Custom Commands Embed - Edit
    router.post('/custom-commands-embed-edit', isLoggedIn, (req, res) => {
        submitCustomCommandsEmbedEdit(req, res);
    });

    // Custom Commands - Delete
    router.post('/custom-commands-delete', isLoggedIn, (req, res) => {
        submitCustomCommandsDelete(req, res);
    });

    // Embed
    router.post('/embed', isLoggedIn, (req, res) => {
        submitEmbed(req, res);
    });

    // Join
    router.post('/join', isLoggedIn, (req, res) => {
        submitJoin(req, res);
    });

    // Leave
    router.post('/leave', isLoggedIn, (req, res) => {
        submitLeave(req, res);
    });

    // Level
    router.post('/level', isLoggedIn, (req, res) => {
        submitLevel(req, res);
    });

    // Livestream
    router.post('/livestream', isLoggedIn, (req, res) => {
        submitLivestream(req, res);
    });

    // Log
    router.post('/log', isLoggedIn, (req, res) => {
        submitLog(req, res);
    });

    // MediaOnlyChannel
    router.post('/media-only-channel', isLoggedIn, (req, res) => {
        submitMediaOnlyChannel(req, res);
    });

    // Reaction Role - Create
    router.post('/reaction-role-create', isLoggedIn, (req, res) => {
        submitReactionRoleCreate(req, res);
    });

    // Reaction Role - Edit
    router.post('/reaction-role-edit', isLoggedIn, (req, res) => {
        submitReactionRoleEdit(req, res);
    });

    // Reaction Role - Delete
    router.post('/reaction-role-delete', isLoggedIn, (req, res) => {
        submitReactionRoleDelete(req, res);
    });

    // Voice Lobby
    router.post('/voice-lobby', isLoggedIn, (req, res) => {
        submitVoiceLobby(req, res);
    });

    // Category Toggles
    router.post('/category-toggle', isLoggedIn, (req, res) => {
        submitCategoryToggle(req, res);
    });

    // Command Toggles
    router.post('/command-toggle', isLoggedIn, (req, res) => {
        submitCommandToggle(req, res);
    });

    // Plugin Toggles
    router.post('/plugin-toggle', isLoggedIn, (req, res) => {
        submitPluginToggle(req, res);
    });

    // Leaderboard - Reset Member (ONE)
    router.post('/leaderboard-reset-member', isLoggedIn, (req, res) => {
        submitLeaderboardResetMember(req, res);
    });

    // Leaderboard - Reset Members (ALL)
    router.post('/leaderboard-reset-members', isLoggedIn, (req, res) => {
        submitLeaderboardResetMembers(req, res);
    });

    // Leaderboard - Prune Members (Those, that left the guild)
    router.post('/leaderboard-prune-members', isLoggedIn, (req, res) => {
        submitLeaderboardPruneMembers(req, res);
    });

    ////////////////////////////////////////////
    // General
    ////////////////////////////////////////////

    async function invokeAlreadyUsed(guildId, mysql, invokeOld, invokeNew) {
        if (invokeOld === invokeNew) return false;
        else {
            try {
                let sql = nws`SELECT id
                    FROM custom_commands
                    WHERE guild_id=${mysql.escape(guildId)}
                    AND invoke=${mysql.escape(invokeNew)}`;

                let invokes = await mysql.query(sql);
                return invokes[0].length > 0;
            } catch (err) {
                console.error(err);
                return true;
            }
        }
    }

    async function getUserColorCode(mysql, userId) {
        try {
            let sql = nws`SELECT color_code
                FROM users
                WHERE user_id=${mysql.escape(userId)}`;

            let colorCode = '#7289DA';

            let users = await mysql.query(sql);
            users = users[0];

            let tmpColorCode = users[0].color_code;
            if (tmpColorCode != '') colorCode = tmpColorCode;

            return colorCode;
        } catch (err) {
            console.error(err);
            return '#7289DA';
        }
    }

    function indentDays(days) {
        let str = days + '';
        let length = str.length;
        if (length === 3) return str;
        else if (length === 2) return ' ' + str;
        else if (length === 1) return '  ' + str;
        else return '   ';
    }

    async function getBirthdays(mysql, guildId, servantBday) {
        let sql = nws`SELECT user_id
            FROM user_birthday_guilds
            WHERE guild_id=${mysql.escape(guildId)}`;

        let allowedBdayUserIds = await mysql.query(sql);
        allowedBdayUserIds = allowedBdayUserIds[0];

        let birthdays = new Map();

        if (getBoolean(servantBday)) {
            birthdays.set(bot.user.id, "2018-04-06")
        }

        if (allowedBdayUserIds.length > 0) {
            for (const userIds of allowedBdayUserIds) {
                const userId = userIds.user_id;

                sql = nws`SELECT birthday
                    FROM users
                    WHERE user_id=${mysql.escape(userId)}`;

                let users = await mysql.query(sql);
                users = users[0];

                if (users.length > 0) {
                    const birthday = users[0].birthday;
                    birthdays.set(userId, birthday);
                }
            }
        }

        return birthdays;
    }

    function getBirthdayCountdowns(birthdays) {
        let birthdayCountdowns = new Map();

        if (birthdays) {
            if (birthdays.size > 0) {
                for (let entry of birthdays.entries()) {
                    let key = entry[0];
                    let value = entry[1];

                    let bday = new Date().getFullYear() + value.substring(4, value.lenth);
                    let momentBday = moment(bday, "YYYY-MM-DD");

                    if (momentBday.fromNow().endsWith('ago')) {
                        momentBday.add(1, 'years');
                    }

                    let diff = momentBday.diff(moment(), 'days') + 1;
                    if (diff == 365) diff = 0;

                    birthdayCountdowns.set(key, diff);
                }
            }
        }

        return new Map([...birthdayCountdowns.entries()].sort((a, b) => a.value - b.value));
    }

    function getCommandNamesAndAliases() {
        return new Array(
            // Standard
            "botinfo", "about",
            "help", "h",
            "ping", "pong", "latency",
            "supporter", "patreon", "patron", "donation", "donate", "serverboost", "boost",
            // Moderation
            "clear", "clean", "remove", "delete", "purge",
            "editembed",
            // Utility
            "customcommands", "customcommand",
            "giveaway",
            "poll", "vote", "voting",
            "quickpoll", "quickvote", "quickvoting",
            "rate", "rating",
            "remindme", "alarm",
            "signup", "event",
            "timezone",
            // Fun
            "achievements", "achievement",
            "avatar", "ava",
            "baguette",
            "bubblewrap", "bubble", "wrap", "pop",
            "coinflip", "cointoss",
            "commands", "mostusedcommands", "mostusedcommand", "muc",
            "flip", "unflip",
            "love", "ship",
            "mirror", "unmirror",
            "profile", "level",
            "tictactoe", "ttt",
            // Interaction
            "beg", "please", "pls", "plz",
            "birthday", "bday", "happybirthday", "happybday",
            "bite", "nibble", "nom", "munch",
            "bully", "booli",
            "cheers", "toast", "prost", "prosit",
            "cookie", "biscuit",
            "cop", "police", "jail", "arrest",
            "dab", "yeet",
            "f", "respect", "respects",
            "flex",
            "highfive",
            "hug", "cuddle",
            "kiss", "smooch",
            "lick",
            "pat", "pet",
            "poke", "boop",
            "shame", "cersei",
            "slap", "hit", "punch",
            "wave", "greet",
            "wink",
            // Random
            "random", "imgur",
            "bird", "birb",
            "cat", "catto",
            "dog", "doggo",
            "fennec",
            "fox",
            "frog", "froggo", "anet",
            "koala",
            "panda",
            "pikachu", "pika",
            "redpanda",
            "sloth", "hirik0",
            "wolf", "wulf"
        );
    }

    ////////////////////////////////////////////
    // Async submit-functions
    ////////////////////////////////////////////

    async function submitGuild(req, res) {
        try {
            const guildId = req.body.guildId;
            const prefix = req.body.prefix;
            const language = req.body.language;
            const timezone = req.body.timezone;
            const modRoles = req.body.modRoles.split('|');
            const achievements = req.body.achievements;
            const cmddeletion = req.body.cmddeletion;
            const eastereggs = req.body.eastereggs;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Guilds
                let sql = nws`SELECT guild_id
                    FROM guilds
                    WHERE guild_id=${mysql.escape(guildId)}`;

                let guilds = await mysql.query(sql);
                guilds = guilds[0];

                if (guilds.length > 0) {
                    // Update
                    sql = nws`UPDATE guilds
                        SET prefix=${mysql.escape(prefix)},
                        language_code=${mysql.escape(language)},
                        timezone_id=${mysql.escape(timezone)}
                        WHERE guild_id=${mysql.escape(guildId)}`;

                    await mysql.query(sql);
                } else {
                    // Insert
                    sql = nws`INSERT INTO guilds (guild_id,prefix,language_code,timezone_id)
                        VALUES (${mysql.escape(guildId)},${mysql.escape(prefix)},${mysql.escape(language)},${mysql.escape(timezone)})`;

                    await mysql.query(sql);

                    // Disable level as we now have a guilds entry
                    sql = nws`INSERT INTO guild_disabled_plugins (guild_id,plugin_id)
                        VALUES (${mysql.escape(guildId)},${mysql.escape(7)})`; // level

                    await mysql.query(sql);

                    // Disable cmddeletion as we now have a guilds entry
                    sql = nws`INSERT INTO guild_disabled_features (guild_id,feature_id)
                        VALUES (${mysql.escape(guildId)},${mysql.escape(4)})`; // cmddeletion

                    await mysql.query(sql);
                }

                // Update mod roles
                // First, delete all
                sql = nws`DELETE FROM guild_mod_roles
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                if (modRoles) {
                    // Then add the selected ones
                    for (const modRole of modRoles) {
                        sql = nws`INSERT INTO guild_mod_roles (guild_id,role_id)
                            VALUES (${mysql.escape(guildId)},${mysql.escape(modRole)})`;

                        await mysql.query(sql);
                    }
                }

                // Update feature toggles
                sql = nws`SELECT *
                    FROM guild_disabled_features AS d
                    INNER JOIN const_features AS f
                    ON d.feature_id=f.id
                    WHERE d.guild_id=${mysql.escape(guildId)}`;

                let disabledFeatures = await mysql.query(sql);
                disabledFeatures = disabledFeatures[0];

                let dbAchievements = true;
                let dbEastereggs = true;
                let dbCmddeletion = true;

                if (disabledFeatures.length > 0) {
                    for (const disabledFeature of disabledFeatures) {
                        switch (disabledFeature.name) {
                            case 'achievements':
                                dbAchievements = false;
                                break;

                            case 'eastereggs':
                                dbEastereggs = false;
                                break;

                            case 'cmddeletion':
                                dbCmddeletion = false;
                                break;
                        }
                    }
                }

                if (!dbAchievements && achievements === 'true') {
                    // enable it
                    sql = nws`DELETE
                        FROM guild_disabled_features
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND feature_id=${mysql.escape(1)}`; // achievements

                    await mysql.query(sql);
                } else if (dbAchievements && achievements === 'false') {
                    // disable it
                    sql = nws`INSERT INTO guild_disabled_features (guild_id,feature_id)
                        VALUES (${mysql.escape(guildId)},${mysql.escape(1)})`; // achievements

                    await mysql.query(sql);
                }

                if (!dbEastereggs && eastereggs === 'true') {
                    // enable it
                    sql = nws`DELETE
                        FROM guild_disabled_features
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND feature_id=${mysql.escape(2)}`; // eastereggs

                    await mysql.query(sql);
                } else if (dbEastereggs && eastereggs === 'false') {
                    // disable it
                    sql = nws`INSERT INTO guild_disabled_features (guild_id,feature_id)
                        VALUES (${mysql.escape(guildId)},${mysql.escape(2)})`; // eastereggs

                    await mysql.query(sql);
                }

                if (!dbCmddeletion && cmddeletion === 'true') {
                    // enable it
                    sql = nws`DELETE
                        FROM guild_disabled_features
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND feature_id=${mysql.escape(4)}`; // cmddeletion

                    await mysql.query(sql);
                } else if (dbCmddeletion && cmddeletion === 'false') {
                    // disable it
                    sql = nws`INSERT INTO guild_disabled_features (guild_id,feature_id)
                        VALUES (${mysql.escape(guildId)},${mysql.escape(4)})`; // cmddeletion

                    await mysql.query(sql);
                }

                res.sendStatus(200);
            } else res.sendStatus(403);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitUser(req, res) {
        try {
            if (req.user) {
                const userId = req.user.discordId;
                let prefix = req.body.prefix;
                const language = req.body.language;
                const bio = req.body.bio;
                let birthday = req.body.birthday;
                if (!birthday) birthday = "0000-00-00";
                const bdayGuilds = req.body.bdayGuilds;
                let bdayGuildsSplit = bdayGuilds === '' ? '' : bdayGuilds.split('|');
                let color = req.body.color;
                if (!color) color = '#7289da';

                let bg1 = req.body.bg1;
                let bg2 = req.body.bg2;
                let bg3 = req.body.bg3;
                let bg4 = req.body.bg4;
                let bg5 = req.body.bg5;
                let bg6 = req.body.bg6;
                let bg7 = req.body.bg7;
                let bg8 = req.body.bg8;
                let bg9 = req.body.bg9;

                let profileBgId;
                if (bg1 == 'true') profileBgId = 1;
                else if (bg2 == 'true') profileBgId = 2;
                else if (bg3 == 'true') profileBgId = 3;
                else if (bg4 == 'true') profileBgId = 4;
                else if (bg5 == 'true') profileBgId = 5;
                else if (bg6 == 'true') profileBgId = 6;
                else if (bg7 == 'true') profileBgId = 7;
                else if (bg8 == 'true') profileBgId = 8;
                else if (bg9 == 'true') profileBgId = 9;
                else profileBgId = 1;

                let isSupporter = await getSupporterStatus(bot, req);

                // Users
                let sql = nws`SELECT user_id
                    FROM users
                    WHERE user_id=${mysql.escape(userId)}`;

                let users = await mysql.query(sql);
                users = users[0];

                // Stopping hax0rs
                if (!isSupporter && color !== '#7289da') color = '#7289da';
                if (!isSupporter && profileBgId !== 1) profileBgId = 1;

                if (users.length > 0) {
                    // Update
                    sql = nws`UPDATE users
                        SET prefix=${mysql.escape(prefix)},
                        language_code=${mysql.escape(language)},
                        color_code=${mysql.escape(color)},
                        bio=${mysql.escape(bio)},
                        birthday=${mysql.escape(birthday)},
                        profile_bg_id=${mysql.escape(profileBgId)}
                        WHERE user_id=${mysql.escape(userId)}`;

                    await mysql.query(sql);
                } else {
                    // Insert
                    sql = nws`INSERT INTO users (user_id,prefix,language_code,color_code,bio,birthday,profile_bg_id)
                        VALUES (${mysql.escape(userId)},${mysql.escape(prefix)},${mysql.escape(language)},${mysql.escape(color)},${mysql.escape(bio)},${mysql.escape(birthday)},${mysql.escape(profileBgId)})`;

                    await mysql.query(sql);
                }

                // Set birthday guilds
                // First, delete all
                sql = nws`DELETE FROM user_birthday_guilds
                    WHERE user_id=${mysql.escape(userId)}`;

                await mysql.query(sql);

                if (bdayGuildsSplit !== '') {
                    // Then add the selected ones
                    for (const bdayGuild of bdayGuildsSplit) {
                        sql = nws`INSERT INTO user_birthday_guilds (user_id,guild_id)
                            VALUES (${mysql.escape(userId)},${mysql.escape(bdayGuild)})`;

                        await mysql.query(sql);
                    }
                }

                res.sendStatus(200);
            } else res.sendStatus(500);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitAutoRole(req, res) {
        try {
            const guildId = req.body.guildId;
            let ar1Val = req.body.ar1Val;
            const ar1Delay = req.body.ar1Delay;
            let ar2Val = req.body.ar2Val;
            const ar2Delay = req.body.ar2Delay;
            let ar3Val = req.body.ar3Val;
            const ar3Delay = req.body.ar3Delay;
            let ar4Val = req.body.ar4Val;
            const ar4Delay = req.body.ar4Delay;
            let ar5Val = req.body.ar5Val;
            const ar5Delay = req.body.ar5Delay;
            let ar6Val = req.body.ar6Val;
            const ar6Delay = req.body.ar6Delay;
            let ar7Val = req.body.ar7Val;
            const ar7Delay = req.body.ar7Delay;
            let ar8Val = req.body.ar8Val;
            const ar8Delay = req.body.ar8Delay;
            let ar9Val = req.body.ar9Val;
            const ar9Delay = req.body.ar9Delay;
            let ar10Val = req.body.ar10Val;
            const ar10Delay = req.body.ar10Delay;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                if (ar1Val === '0') ar1Val = undefined;
                if (ar2Val === '0') ar2Val = undefined;
                if (ar3Val === '0') ar3Val = undefined;
                if (ar4Val === '0') ar4Val = undefined;
                if (ar5Val === '0') ar5Val = undefined;
                if (ar6Val === '0') ar6Val = undefined;
                if (ar7Val === '0') ar7Val = undefined;
                if (ar8Val === '0') ar8Val = undefined;
                if (ar9Val === '0') ar9Val = undefined;
                if (ar10Val === '0') ar10Val = undefined;

                // Check if data is ok
                let valArray = [];
                if (ar1Val) valArray.push(ar1Val);
                if (ar2Val) valArray.push(ar2Val);
                if (ar3Val) valArray.push(ar3Val);
                if (ar4Val) valArray.push(ar4Val);
                if (ar5Val) valArray.push(ar5Val);
                if (ar6Val) valArray.push(ar6Val);
                if (ar7Val) valArray.push(ar7Val);
                if (ar8Val) valArray.push(ar8Val);
                if (ar9Val) valArray.push(ar9Val);
                if (ar10Val) valArray.push(ar10Val);

                if (!hasDuplicates(valArray)) {
                    // Delete all auto role settings
                    let sql = nws`DELETE FROM guild_autoroles
                        WHERE guild_id=${mysql.escape(guildId)}`;

                    await mysql.query(sql);
                    if (ar1Val || ar2Val || ar3Val || ar4Val || ar5Val || ar6Val || ar7Val || ar8Val || ar9Val || ar10Val) {
                        // Insert all available data
                        sql = nws`INSERT INTO guild_autoroles (guild_id,role_id,delay) VALUES `;

                        if (ar1Val) sql += nws`(${mysql.escape(guildId)},${mysql.escape(ar1Val)},${mysql.escape(ar1Delay ? ar1Delay : 0)}), `;
                        if (ar2Val) sql += nws`(${mysql.escape(guildId)},${mysql.escape(ar2Val)},${mysql.escape(ar2Delay ? ar2Delay : 0)}), `;
                        if (ar3Val) sql += nws`(${mysql.escape(guildId)},${mysql.escape(ar3Val)},${mysql.escape(ar3Delay ? ar3Delay : 0)}), `;
                        if (ar4Val) sql += nws`(${mysql.escape(guildId)},${mysql.escape(ar4Val)},${mysql.escape(ar4Delay ? ar4Delay : 0)}), `;
                        if (ar5Val) sql += nws`(${mysql.escape(guildId)},${mysql.escape(ar5Val)},${mysql.escape(ar5Delay ? ar5Delay : 0)}), `;
                        if (ar6Val) sql += nws`(${mysql.escape(guildId)},${mysql.escape(ar6Val)},${mysql.escape(ar6Delay ? ar6Delay : 0)}), `;
                        if (ar7Val) sql += nws`(${mysql.escape(guildId)},${mysql.escape(ar7Val)},${mysql.escape(ar7Delay ? ar7Delay : 0)}), `;
                        if (ar8Val) sql += nws`(${mysql.escape(guildId)},${mysql.escape(ar8Val)},${mysql.escape(ar8Delay ? ar8Delay : 0)}), `;
                        if (ar9Val) sql += nws`(${mysql.escape(guildId)},${mysql.escape(ar9Val)},${mysql.escape(ar9Delay ? ar9Delay : 0)}), `;
                        if (ar10Val) sql += nws`(${mysql.escape(guildId)},${mysql.escape(ar10Val)},${mysql.escape(ar10Delay ? ar10Delay : 0)}), `;

                        sql = sql.substring(0, sql.length - 2);

                        await mysql.query(sql);
                    }

                    res.sendStatus(200);
                } else res.sendStatus(406);
            } else res.sendStatus(403);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitBestOfImage(req, res) {
        try {
            const guildId = req.body.guildId;
            const percentage = req.body.percentage;
            const flat = req.body.flat;
            const tcId = req.body.tcId;
            const emoji = req.body.emoji;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Delete entry first
                let sql = nws`DELETE FROM guild_best_of_images
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                // Then insert the new data
                sql = nws`INSERT INTO guild_best_of_images (guild_id,tc_id,min_votes_flat,min_votes_percent,emoji)
                    VALUES (${mysql.escape(guildId)},${mysql.escape(tcId)},${mysql.escape(flat)},${mysql.escape(percentage)},${mysql.escape(emoji)})`;

                await mysql.query(sql);

                res.sendStatus(200);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitBestOfQuote(req, res) {
        try {
            const guildId = req.body.guildId;
            const percentage = req.body.percentage;
            const flat = req.body.flat;
            const tcId = req.body.tcId;
            const emoji = req.body.emoji;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Delete entry first
                sql = nws`DELETE FROM guild_best_of_quotes
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                // Then insert the new data
                sql = nws`INSERT INTO guild_best_of_quotes (guild_id,tc_id,min_votes_flat,min_votes_percent,emoji)
                    VALUES (${mysql.escape(guildId)},${mysql.escape(tcId)},${mysql.escape(flat)},${mysql.escape(percentage)},${mysql.escape(emoji)})`;

                await mysql.query(sql);

                res.sendStatus(200);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitBirthday(req, res) {
        try {
            const guildId = req.body.guildId;
            const servantBday = req.body.servantBday;
            const announcementTcId = req.body.announcementTcId;
            const listTcId = req.body.listTcId;
            const userId = req.body.userId;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Birthdays
                let sql = nws`SELECT *
                    FROM guild_birthdays
                    WHERE guild_id=${mysql.escape(guildId)}`;

                let birthdays = await mysql.query(sql);
                birthdays = birthdays[0];


                let guild = await bot.guilds.fetch(guildId);
                let channel = guild.channels.cache.get(listTcId);


                if (birthdays.length > 0) {
                    // Has birthdays
                    let birthday = birthdays[0];
                    if (birthday.list_tc_id == listTcId) {
                        // Save changes to db
                        await setBirthdayDb(res, mysql, guildId, listTcId, birthday.list_msg_id, userId, servantBday, announcementTcId);
                        return; // Do not send a list
                    } else {
                        // Channels changes, so we delete the old message
                        let oldChannel = guild.channels.cache.get(birthday.list_tc_id);
                        if (oldChannel) {
                            // Delete list from old channel
                            try {
                                let oldMessage = await oldChannel.messages.fetch(birthday.list_msg_id);
                                await oldMessage.delete();
                            } catch (err) {
                                if (err.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                                    console.log(err);
                                    res.sendStatus(500);
                                }
                            }
                        }
                    }
                }

                // Send Birthday List
                let guildIcon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null;

                let colorCode = await getUserColorCode(mysql, userId);

                let embed = new Discord.MessageEmbed()
                    .setColor(colorCode)
                    .setAuthor(guild.name.endsWith('s') ? `${guild.name}' birthdays` : `${guild.name}'s birthdays`, guildIcon, null)
                    .setDescription("Add your birthday in the [dashboard](https://servant.gg/dashboard)!")
                    .setFooter("As of", "https://i.imgur.com/PA3Xzgu.png")
                    .setTimestamp(new Date());

                let birthdays2 = await getBirthdays(mysql, guild.id, servantBday);
                let birthdayCountdowns = await getBirthdayCountdowns(birthdays2);

                if (birthdayCountdowns.size === 0) {
                    // No birthdays
                    embed.addField(".", "No birthdays were set.", false);
                } else {
                    birthdayCountdowns = sortMapByValue(birthdayCountdowns);
                    let contentTotalLength = 0;

                    let content = "```c\n" +
                        "Countdown   Date       Name\n" +
                        "----------- ---------- ----------------\n";

                    for (let entry of birthdayCountdowns.entries()) {
                        let key = entry[0];
                        let value = entry[1];

                        if (content.length >= 1024 - 57 - 3) {
                            contentTotalLength += content.length;
                            if (contentTotalLength > 6000) break;
                            else {
                                embed.addField(".", content, false);
                                content = '```c\n';
                            }
                        }

                        content +=
                            `in ${indentDays(value)} ${(value == 1 ? "day " : "days")} ${birthdays2.get(key)} ${bot.users.cache.get(key).username}\n`;
                    }

                    content +=
                        "```";

                    contentTotalLength += content.length;

                    if (contentTotalLength <= 6000) embed.addField(".", content, false);
                }

                let messageId = 0;
                if (channel) {
                    let message = await channel.send(embed);
                    messageId = message.id;
                }

                setBirthdayDb(res, mysql, guild.id, listTcId, messageId, userId, servantBday, announcementTcId);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function setBirthdayDb(res, mysql, guildId, listTcId, messageId, userId, servantBday, announcementTcId) {
        try {
            let sql = nws`DELETE FROM guild_birthdays
                WHERE guild_id=${mysql.escape(guildId)}`;

            await mysql.query(sql);

            sql = nws`INSERT INTO guild_birthdays (guild_id,list_tc_id,list_msg_id,list_author_id,servant_bday,announcement_tc_id)
                VALUES (${mysql.escape(guildId)},${mysql.escape(listTcId)},${mysql.escape(messageId)},${mysql.escape(userId)},${mysql.escape(getBoolean(servantBday))},${mysql.escape(announcementTcId)})`;

            await mysql.query(sql);

            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitCustomCommandsNormal(req, res) {
        let ccId;

        try {
            const guildId = req.body.guildId;
            const invoke = req.body.invoke;
            const aliases = JSON.parse(req.body.aliases);
            const message = req.body.message;

            if (invoke.length > 100)
                invoke = invoke.substring(0, 100);

            if (message.length > 2000)
                message = message.substring(0, 2000);

            var commandNames = getCommandNamesAndAliases();
            var conflict = false;

            if (commandNames.includes(invoke)) {
                conflict = true;
            }

            aliases.forEach(alias => {
                if (commandNames.includes(alias))
                    conflict = true;
            });

            if (conflict) {
                res.sendStatus(409);
            } else {
                const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

                if (isAuthorized) {
                    // Check if < 100 custom commands
                    let sql = nws`SELECT id
                        FROM custom_commands
                        WHERE guild_id=${mysql.escape(guildId)}`;

                    let customCommands = await mysql.query(sql);

                    // Check if custom command with this invoke already exists
                    sql = nws`SELECT id
                        FROM custom_commands
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND invoke=${mysql.escape(invoke)}`;

                    let invokes = await mysql.query(sql);

                    if (customCommands.length >= 100) res.sendStatus(403);
                    else if (invokes[0].length > 0) res.sendStatus(406);
                    else {
                        // Insert new custom command
                        sql = nws`INSERT INTO custom_commands (guild_id,invoke,normal_msg)
                            VALUES (${mysql.escape(guildId)},${mysql.escape(invoke)},${mysql.escape(message)})`;

                        let result = await mysql.query(sql);
                        ccId = result[0].insertId;

                        // Insert aliases
                        for (const alias of aliases) {
                            if (alias.length > 100)
                                alias = alias.substring(0, 100);

                            // Check if custom command with this alias as invoke exists
                            sql = nws`SELECT id
                                FROM custom_commands
                                WHERE guild_id=${mysql.escape(guildId)}
                                AND invoke=${mysql.escape(alias)}`;

                            let invokes = await mysql.query(sql);
                            if (invokes[0].length > 0) continue;

                            // Check if a custom command already has this alias
                            sql = nws`SELECT *
                                FROM custom_commands_aliases AS a
                                INNER JOIN custom_commands AS c
                                ON c.id=a.cc_id
                                WHERE c.guild_id=${mysql.escape(guildId)}
                                AND a.alias=${mysql.escape(alias)}`;

                            let otherAliases = await mysql.query(sql);
                            if (otherAliases[0].length > 0) continue;

                            // Insert Alias
                            sql = nws`INSERT INTO custom_commands_aliases (cc_id,alias)
                                VALUES (${mysql.escape(ccId)},${mysql.escape(alias)})`;

                            await mysql.query(sql);
                        }

                        res.sendStatus(200);
                    }
                } else res.render('404', { req });
            }
        } catch (err) {
            console.error(err);
            purgeCustomCommand(mysql, ccId);
            res.sendStatus(500);
        }
    }

    async function submitCustomCommandsEmbed(req, res) {
        let ccId;

        try {
            const guildId = req.body.guildId;
            const invoke = req.body.invoke;
            const aliases = JSON.parse(req.body.aliases);

            const color = req.body.color;
            const authorIcon = req.body.authorIcon;
            const authorName = req.body.authorName;
            const authorLink = req.body.authorLink;
            const thumbnail = req.body.thumbnail;
            const title = req.body.title;
            const titleLink = req.body.titleLink;
            const description = req.body.description;

            const fieldTitles = JSON.parse(req.body.fieldTitles);
            const fieldDescriptions = JSON.parse(req.body.fieldDescriptions);
            const fieldInlines = JSON.parse(req.body.fieldInlines);

            const image = req.body.image;
            const footerIcon = req.body.footerIcon;
            const footerText = req.body.footerText;
            const timestamp = req.body.timestamp;

            if (invoke.length > 100)
                invoke = invoke.substring(0, 100);

            var commandNames = getCommandNamesAndAliases();
            var conflict = false;

            if (commandNames.includes(invoke)) {
                conflict = true;
            }

            aliases.forEach(alias => {
                if (commandNames.includes(alias))
                    conflict = true;
            });

            if (conflict) {
                res.sendStatus(409);
            } else {
                const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

                if (isAuthorized) {
                    // Check if < 100 custom commands
                    let sql = nws`SELECT id
                    FROM custom_commands
                    WHERE guild_id=${mysql.escape(guildId)}`;

                    let customCommands = await mysql.query(sql);

                    // Check if custom command with this invoke already exists
                    sql = nws`SELECT id
                    FROM custom_commands
                    WHERE guild_id=${mysql.escape(guildId)}
                    AND invoke=${mysql.escape(invoke)}`;

                    let invokes = await mysql.query(sql);

                    if (customCommands.length >= 100) res.sendStatus(403);
                    else if (invokes[0].length > 0) res.sendStatus(406);
                    else {
                        // Insert new custom command
                        sql = nws`INSERT INTO custom_commands (guild_id,invoke,normal_msg)
                        VALUES (${mysql.escape(guildId)},${mysql.escape(invoke)},'')`;

                        let result = await mysql.query(sql);
                        ccId = result[0].insertId;

                        // Insert aliases
                        for (const alias of aliases) {
                            if (alias.length > 100)
                                alias = alias.substring(0, 100);

                            // Check if custom command with this alias as invoke exists
                            sql = nws`SELECT id
                            FROM custom_commands
                            WHERE guild_id=${mysql.escape(guildId)}
                            AND invoke=${mysql.escape(alias)}`;

                            let invokes = await mysql.query(sql);
                            if (invokes[0].length > 0) continue;

                            // Check if a custom command already has this alias
                            sql = nws`SELECT *
                            FROM custom_commands_aliases AS a
                            INNER JOIN custom_commands AS c
                            ON c.id=a.cc_id
                            WHERE c.guild_id=${mysql.escape(guildId)}
                            AND a.alias=${mysql.escape(alias)}`;

                            let otherAliases = await mysql.query(sql);
                            if (otherAliases[0].length > 0) continue;

                            // Insert Alias
                            sql = nws`INSERT INTO custom_commands_aliases (cc_id,alias)
                            VALUES (${mysql.escape(ccId)},${mysql.escape(alias)})`;

                            await mysql.query(sql);
                        }

                        // Get guild's timezone
                        sql = nws`SELECT t.timezone
                        FROM guilds AS g
                        INNER JOIN const_timezones AS t
                        ON g.timezone_id=t.id
                        WHERE g.guild_id=${mysql.escape(guildId)}`;

                        let timezones = await mysql.query(sql);
                        let timezone = timezones.length > 0 ? timezones[0].timezone : 'UTC';
                        let timestampTz = moment.tz(timestamp, timezone);
                        let timestampUtc = timestampTz.clone().tz('UTC');
                        timestampUtc = timestamp == undefined ? "" : timestampUtc;

                        sql = nws`INSERT INTO custom_commands_embeds (cc_id,colorcode,author_name,author_url,author_icon_url,title,title_url,thumbnail_url,description,image_url,footer,footer_icon_url,timestamp)
                        VALUES (${mysql.escape(ccId)},${mysql.escape(color)},${mysql.escape(getBlank(authorName))},${mysql.escape(getBlank(authorLink))},${mysql.escape(getBlank(authorIcon))},${mysql.escape(getBlank(title))},${mysql.escape(getBlank(titleLink))},${mysql.escape(getBlank(thumbnail))},${mysql.escape(getBlank(description))},${mysql.escape(getBlank(image))},${mysql.escape(getBlank(footerText))},${mysql.escape(getBlank(footerIcon))},${mysql.escape(timestampUtc ? timestampUtc.format() : "")})`;

                        await mysql.query(sql);

                        if (fieldTitles) {
                            for (const i in fieldTitles) {
                                let fieldTitle = fieldTitles[i];
                                let fieldDescription = fieldDescriptions[i];
                                let fieldInline = fieldInlines[i];

                                if (fieldTitles.length > 256)
                                    fieldTitle = fieldTitle.substring(0, 256);

                                if (fieldDescription.length > 1024)
                                    fieldDescription = fieldDescription.substring(0, 1024);

                                sql = nws`INSERT INTO custom_commands_fields (cc_id,field_no,title,description,inline)
                                VALUES (${mysql.escape(ccId)},${mysql.escape(i + 1)},${mysql.escape(fieldTitle)},${mysql.escape(fieldDescription)},${mysql.escape(fieldInline == 'inline')})`;

                                await mysql.query(sql);
                            }
                        }

                        res.sendStatus(200);
                    }
                } else res.render('404', { req });
            }
        } catch (err) {
            console.error(err);
            purgeCustomCommand(mysql, ccId);
            res.sendStatus(500);
        }
    }

    async function purgeCustomCommand(mysql, ccId) {
        if (ccId) {
            try {
                let sql = nws`DELETE FROM custom_commands
                    WHERE id=${mysql.escape(ccId)}`;

                await mysql.query(sql);

                sql = nws`DELETE FROM custom_commands_embeds
                    WHERE cc_id=${mysql.escape(ccId)}`;

                await mysql.query(sql);

                sql = nws`DELETE FROM custom_commands_fields
                    WHERE cc_id=${mysql.escape(ccId)}`;

                await mysql.query(sql);

                sql = nws`DELETE FROM custom_commands_aliases
                    WHERE cc_id=${mysql.escape(ccId)}`;

                await mysql.query(sql);
            } catch (err) {
                console.error(err);
            }
        }
    }

    async function submitCustomCommandsNormalEdit(req, res) {
        try {
            const guildId = req.body.guildId;
            const invokeOld = req.body.invokeOld;
            const invokeNew = req.body.invokeNew;
            const aliases = JSON.parse(req.body.aliases);
            const message = req.body.message;

            if (invokeNew.length > 100)
                invokeNew = invokeNew.substring(0, 100);

            if (message.length > 2000)
                message = message.substring(0, 2000);

            var commandNames = getCommandNamesAndAliases();
            var conflict = false;

            if (commandNames.includes(invokeNew)) {
                conflict = true;
            }

            aliases.forEach(alias => {
                if (commandNames.includes(alias))
                    conflict = true;
            });

            if (conflict) {
                res.sendStatus(409);
            } else {
                const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

                if (isAuthorized) {
                    let alreadyUsed = await invokeAlreadyUsed(guildId, mysql, invokeOld, invokeNew);

                    if (alreadyUsed) res.sendStatus(406);
                    else {
                        // Update Custom Command
                        let sql = nws`UPDATE custom_commands
                        SET invoke=${mysql.escape(invokeNew)}, normal_msg=${mysql.escape(message)}
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND invoke=${mysql.escape(invokeOld)}`;

                        await mysql.query(sql);

                        // Get ccId
                        sql = nws`SELECT id
                        FROM custom_commands
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND invoke=${mysql.escape(invokeNew)}`;

                        let ids = await mysql.query(sql);
                        ids = ids[0];

                        if (ids.length <= 0) res.sendStatus(500);
                        else {
                            let ccId = ids[0].id;

                            // Delete Embeds
                            sql = nws`DELETE FROM custom_commands_embeds
                            WHERE cc_id=${mysql.escape(ccId)}`;

                            await mysql.query(sql);

                            // Delete Fields
                            sql = nws`DELETE FROM custom_commands_fields
                            WHERE cc_id=${mysql.escape(ccId)}`;

                            await mysql.query(sql);

                            // Update Aliases
                            sql = nws`DELETE FROM custom_commands_aliases
                            WHERE cc_id=${mysql.escape(ccId)}`;

                            await mysql.query(sql);

                            for (const alias of aliases) {
                                if (alias.length > 100) {
                                    alias = alias.substring(0, 100);
                                }

                                // Check if custom command with this alias as invoke exists
                                sql = nws`SELECT id
                                FROM custom_commands
                                WHERE guild_id=${mysql.escape(guildId)}
                                AND invoke=${mysql.escape(alias)}`;

                                let invokes = await mysql.query(sql);
                                if (invokes[0].length > 0) continue;

                                // Check if a custom command already has this alias
                                sql = nws`SELECT *
                                FROM custom_commands_aliases AS a
                                INNER JOIN custom_commands AS c
                                ON c.id=a.cc_id
                                WHERE c.guild_id=${mysql.escape(guildId)}
                                AND a.alias=${mysql.escape(alias)}`;

                                let otherAliases = await mysql.query(sql);
                                if (otherAliases[0].length > 0) continue;

                                // Insert Alias
                                sql = nws`INSERT INTO custom_commands_aliases (cc_id,alias)
                                VALUES (${mysql.escape(ccId)},${mysql.escape(alias)})`;

                                await mysql.query(sql);
                            }

                            res.sendStatus(200);
                        }
                    }
                } else res.render('404', { req });
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitCustomCommandsEmbedEdit(req, res) {
        let ccId;

        try {
            const guildId = req.body.guildId;
            const invokeOld = req.body.invokeOld;
            const invokeNew = req.body.invokeNew;
            const aliases = JSON.parse(req.body.aliases);

            const color = req.body.color;
            const authorIcon = req.body.authorIcon;
            const authorName = req.body.authorName;
            const authorLink = req.body.authorLink;
            const thumbnail = req.body.thumbnail;
            const title = req.body.title;
            const titleLink = req.body.titleLink;
            const description = req.body.description;

            const fieldTitles = JSON.parse(req.body.fieldTitles);
            const fieldDescriptions = JSON.parse(req.body.fieldDescriptions);
            const fieldInlines = JSON.parse(req.body.fieldInlines);

            const image = req.body.image;
            const footerIcon = req.body.footerIcon;
            const footerText = req.body.footerText;
            const timestamp = req.body.timestamp;

            if (invokeNew.length > 100)
                invokeNew = invokeNew.substring(0, 100);

            var commandNames = getCommandNamesAndAliases();
            var conflict = false;

            if (commandNames.includes(invokeNew)) {
                conflict = true;
            }

            aliases.forEach(alias => {
                if (commandNames.includes(alias))
                    conflict = true;
            });

            if (conflict) {
                res.sendStatus(409);
            } else {
                const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

                if (isAuthorized) {
                    let alreadyUsed = await invokeAlreadyUsed(guildId, mysql, invokeOld, invokeNew);

                    if (alreadyUsed) res.sendStatus(406);
                    else {
                        // Update Custom Command
                        let sql = nws`UPDATE custom_commands
                        SET invoke=${mysql.escape(invokeNew)}, normal_msg=''
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND invoke=${mysql.escape(invokeOld)}`;

                        await mysql.query(sql);

                        // Get ccId
                        sql = nws`SELECT id
                        FROM custom_commands
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND invoke=${mysql.escape(invokeNew)}`;

                        let ids = await mysql.query(sql);
                        ids = ids[0];

                        if (ids.length <= 0) res.sendStatus(500);
                        else {
                            ccId = ids[0].id;

                            // Get guild's timezone
                            sql = nws`SELECT t.timezone
                            FROM guilds AS g
                            INNER JOIN const_timezones AS t
                            ON g.timezone_id=t.id
                            WHERE g.guild_id=${mysql.escape(guildId)}`;

                            let timezones = await mysql.query(sql);
                            let timezone = timezones.length > 0 ? timezones[0].timezone : 'UTC';
                            let timestampTz = moment.tz(timestamp, timezone);
                            let timestampUtc = timestampTz.clone().tz('UTC');
                            timestampUtc = timestamp == undefined ? "" : timestampUtc;

                            // Check if there is an entry in custom_commands_embeds to update, otherwise insert it (this happens if you update a cc from normal to embed message)
                            sql = nws`SELECT id
                            FROM custom_commands_embeds
                            WHERE cc_id=${mysql.escape(ccId)}`;

                            let result = await mysql.query(sql);
                            let hasEntry = result[0].length > 0;

                            if (hasEntry) {
                                // Update CC Embeds
                                sql = nws`UPDATE custom_commands_embeds
                                SET colorcode=${mysql.escape(color)}, author_name=${mysql.escape(authorName)}, author_url=${mysql.escape(authorLink)}, author_icon_url=${mysql.escape(authorIcon)}, title=${mysql.escape(title)}, title_url=${mysql.escape(titleLink)}, thumbnail_url=${mysql.escape(thumbnail)}, description=${mysql.escape(description)}, image_url=${mysql.escape(image)}, footer=${mysql.escape(footerText)}, footer_icon_url=${mysql.escape(footerIcon)}, timestamp=${mysql.escape(timestampUtc ? timestampUtc.format() : "")}
                                WHERE cc_id=${mysql.escape(ccId)}`;

                                await mysql.query(sql);
                            } else {
                                // Insert CC Embeds
                                sql = nws`INSERT INTO custom_commands_embeds (cc_id,colorcode,author_name,author_url,author_icon_url,title,title_url,thumbnail_url,description,image_url,footer,footer_icon_url,timestamp)
                                VALUES (${mysql.escape(ccId)},${mysql.escape(color)},${mysql.escape(getBlank(authorName))},${mysql.escape(getBlank(authorLink))},${mysql.escape(getBlank(authorIcon))},${mysql.escape(getBlank(title))},${mysql.escape(getBlank(titleLink))},${mysql.escape(getBlank(thumbnail))},${mysql.escape(getBlank(description))},${mysql.escape(getBlank(image))},${mysql.escape(getBlank(footerText))},${mysql.escape(getBlank(footerIcon))},${mysql.escape(timestampUtc ? timestampUtc.format() : "")})`;

                                await mysql.query(sql);
                            }

                            // To update the fields, we will just delete all and insert them new
                            // Delete fields
                            sql = nws`DELETE FROM custom_commands_fields
                            WHERE cc_id=${mysql.escape(ccId)}`;

                            await mysql.query(sql);

                            // Insert fields
                            if (fieldTitles) {
                                for (const i in fieldTitles) {
                                    let fieldTitle = fieldTitles[i];
                                    let fieldDescription = fieldDescriptions[i];
                                    let fieldInline = fieldInlines[i];

                                    if (fieldTitles.length > 256)
                                        fieldTitle = fieldTitle.substring(0, 256);

                                    if (fieldDescription.length > 1024)
                                        fieldDescription = fieldDescription.substring(0, 1024);

                                    sql = nws`INSERT INTO custom_commands_fields (cc_id,field_no,title,description,inline)
                                    VALUES (${mysql.escape(ccId)},${mysql.escape(i + 1)},${mysql.escape(fieldTitle)},${mysql.escape(fieldDescription)},${mysql.escape(fieldInline == 'inline')})`;

                                    await mysql.query(sql);
                                }
                            }

                            // Update Aliases
                            sql = nws`DELETE FROM custom_commands_aliases
                            WHERE cc_id=${mysql.escape(ccId)}`;

                            await mysql.query(sql);

                            for (const alias of aliases) {
                                if (alias.length > 100) {
                                    alias = alias.substring(0, 100);
                                }

                                // Check if custom command with this alias as invoke exists
                                sql = nws`SELECT id
                                FROM custom_commands
                                WHERE guild_id=${mysql.escape(guildId)}
                                AND invoke=${mysql.escape(alias)}`;

                                let invokes = await mysql.query(sql);
                                if (invokes[0].length > 0) continue;

                                // Check if a custom command already has this alias
                                sql = nws`SELECT *
                                FROM custom_commands_aliases AS a
                                INNER JOIN custom_commands AS c
                                ON c.id=a.cc_id
                                WHERE c.guild_id=${mysql.escape(guildId)}
                                AND a.alias=${mysql.escape(alias)}`;

                                let otherAliases = await mysql.query(sql);
                                if (otherAliases[0].length > 0) continue;

                                // Insert Alias
                                sql = nws`INSERT INTO custom_commands_aliases (cc_id,alias)
                                VALUES (${mysql.escape(ccId)},${mysql.escape(alias)})`;

                                await mysql.query(sql);
                            }

                            res.sendStatus(200);
                        }
                    }
                } else res.render('404', { req });
            }
        } catch (err) {
            console.error(err);
            purgeCustomCommand(mysql, ccId);
            res.sendStatus(500);
        }
    }

    async function submitCustomCommandsDelete(req, res) {
        try {
            const guildId = req.body.guildId;
            const invoke = req.body.invoke;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Get ccId
                let sql = nws`SELECT id
                    FROM custom_commands
                    WHERE guild_id=${mysql.escape(guildId)}
                    AND invoke=${mysql.escape(invoke)}`;

                let ids = await mysql.query(sql);
                ids = ids[0];

                if (ids.length > 0) {
                    const ccId = ids[0].id;

                    sql = nws`DELETE FROM custom_commands
                        WHERE id=${mysql.escape(ccId)}`;

                    await mysql.query(sql);

                    sql = nws`DELETE FROM custom_commands_embeds
                        WHERE cc_id=${mysql.escape(ccId)}`;

                    await mysql.query(sql);

                    sql = nws`DELETE FROM custom_commands_fields
                        WHERE cc_id=${mysql.escape(ccId)}`;

                    await mysql.query(sql);

                    sql = nws`DELETE FROM custom_commands_aliases
                        WHERE cc_id=${mysql.escape(ccId)}`;

                    await mysql.query(sql);

                    res.sendStatus(200);
                } else res.sendStatus(500);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitEmbed(req, res) {
        try {
            const guildId = req.body.guildId;

            let botGuild = bot.guilds.cache.get(guildId);

            const tcId = req.body.tcId;

            const color = req.body.color;

            const authorIcon = req.body.authorIcon;
            const authorName = req.body.authorName;
            const authorLink = req.body.authorLink;
            const thumbnail = req.body.thumbnail;
            const title = req.body.title;
            const titleLink = req.body.titleLink;
            const description = req.body.description;

            const fieldTitles = JSON.parse(req.body.fieldTitles);
            const fieldDescriptions = JSON.parse(req.body.fieldDescriptions);
            const fieldInlines = JSON.parse(req.body.fieldInlines);

            const image = req.body.image;
            const footerIcon = req.body.footerIcon;
            const footerText = req.body.footerText;
            const timestamp = req.body.timestamp;

            const isSupporter = await getSupporterStatus(bot, req);
            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                let embed = new Discord.MessageEmbed()
                    .setColor(isSupporter ? color : "#7289da");

                if (authorName)
                    embed.setAuthor(authorName, authorIcon == undefined ? null : authorIcon, authorLink == undefined ? null : authorLink);

                if (title)
                    embed.setTitle(title);

                if (titleLink)
                    embed.setURL(titleLink);

                if (thumbnail)
                    embed.setThumbnail(thumbnail);

                if (description)
                    embed.setDescription(description);

                if (fieldTitles && fieldDescriptions && fieldInlines) {
                    for (const i in fieldTitles) {
                        const title = fieldTitles[i];
                        const description = fieldDescriptions[i];
                        const inline = fieldInlines[i] == 'inline';

                        if (title && description)
                            embed.addField(title, description, inline);
                    }
                }

                if (image != undefined) {
                    embed.setImage(image);
                }

                if (footerText != undefined) {
                    embed.setFooter(footerText, footerIcon == undefined ? null : footerIcon);
                }

                if (timestamp != undefined) {
                    embed.setTimestamp(timestamp);
                }

                let tc = botGuild.channels.cache.get(tcId);
                if (tc) {
                    tc.send(embed)
                        .then(() => res.sendStatus(200))
                        .catch(() => res.sendStatus(406));
                } else res.sendStatus(403);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitJoin(req, res) {
        try {
            const guildId = req.body.guildId;
            const joinMsg = req.body.joinMsg;
            const tcId = req.body.tcId;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Delete entry first
                sql = nws`DELETE FROM guild_joins
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                // Then insert the new data
                sql = nws`INSERT INTO guild_joins (guild_id,tc_id,msg)
                    VALUES (${mysql.escape(guildId)},${mysql.escape(tcId)},${mysql.escape(joinMsg)})`;

                await mysql.query(sql);

                res.sendStatus(200);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitLeave(req, res) {
        try {
            const guildId = req.body.guildId;
            const leaveMsg = req.body.leaveMsg;
            const tcId = req.body.tcId;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Delete entry first
                sql = nws`DELETE FROM guild_leaves
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                // Then insert the new data
                sql = nws`INSERT INTO guild_leaves (guild_id,tc_id,msg)
                    VALUES (${mysql.escape(guildId)},${mysql.escape(tcId)},${mysql.escape(leaveMsg)})`;

                mysql.query(sql);

                res.sendStatus(200)
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitLevel(req, res) {
        try {
            const guildId = req.body.guildId;
            const notification = req.body.notification;
            const modifier = req.body.modifier;

            const levels = JSON.parse(req.body.levels);
            const roleIds = JSON.parse(req.body.roleIds);

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // First, we will delete all current settings
                let sql = nws`DELETE FROM guild_level
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                sql = nws`DELETE FROM guild_level_roles
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                // Second, we will enter the new data
                sql = nws`INSERT INTO guild_level (guild_id,modifier,notification)
                    VALUES (${mysql.escape(guildId)},${mysql.escape(modifier)},${mysql.escape(getBoolean(notification))})`;

                await mysql.query(sql);

                if (levels != undefined && roleIds != undefined) {
                    for (const i in levels) {
                        const level = levels[i];
                        const roleIdString = roleIds[i];
                        const subRoleIds = roleIdString.split('|');

                        for (const roleId of subRoleIds) {
                            // Check if current level already has that role id
                            // This may happen if the user puts two or more level roles with the same level and same role
                            sql = nws`SELECT role_id
                                FROM guild_level_roles
                                WHERE guild_id=${mysql.escape(guildId)}
                                AND level=${mysql.escape(level)}
                                AND role_id=${mysql.escape(roleId)}`;

                            let roleIdsDb = await mysql.query(sql);
                            roleIdsDb = roleIdsDb[0];

                            if (roleIdsDb.length > 0) continue;

                            sql = nws`INSERT INTO guild_level_roles (guild_id,level,role_id)
                                VALUES (${mysql.escape(guildId)},${mysql.escape(level)},${mysql.escape(roleId)})`;

                            await mysql.query(sql);
                        }
                    }
                }

                res.sendStatus(200);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitLivestream(req, res) {
        try {
            const guildId = req.body.guildId;
            const publicMode = req.body.publicMode;
            const streamerRolesString = req.body.streamerRoles;
            const liveRole = req.body.liveRole;
            const livestreamPingRole = req.body.livestreamPingRole;
            const tc = req.body.tc;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // First delete all
                let sql = nws`DELETE FROM guild_livestreams
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                sql = nws`DELETE FROM guild_livestreamers
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                // Second insert data
                sql = nws`INSERT INTO guild_livestreams (guild_id,is_public,role_id,tc_id,ping_role_id)
                    VALUES (${mysql.escape(guildId)},${mysql.escape(getBoolean(publicMode))},${mysql.escape(liveRole)},${mysql.escape(tc)},${mysql.escape(livestreamPingRole)})`;

                await mysql.query(sql);

                if (streamerRolesString) {
                    const streamerRoles = streamerRolesString.split('|');

                    for (const roleId of streamerRoles) {
                        let sql = nws`INSERT INTO guild_livestreamers (guild_id,role_id)
                            VALUES (${mysql.escape(guildId)},${mysql.escape(roleId)})`;

                        await mysql.query(sql);
                    }
                }

                res.sendStatus(200)
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitLog(req, res) {
        try {
            const guildId = req.body.guildId;
            const tcId = req.body.tcId;
            const msgUpdate = req.body.msgUpdate;
            const msgDelete = req.body.msgDelete;
            const categoryCreate = req.body.categoryCreate;
            const categoryDelete = req.body.categoryDelete;
            const vcCreate = req.body.vcCreate;
            const vcDelete = req.body.vcDelete;
            const vcJoin = req.body.vcJoin;
            const vcMove = req.body.vcMove;
            const vcLeave = req.body.vcLeave;
            const tcCreate = req.body.tcCreate;
            const tcDelete = req.body.tcDelete;
            const userBan = req.body.userBan;
            const userUnban = req.body.userUnban;
            const inviteCreate = req.body.inviteCreate;
            const inviteDelete = req.body.inviteDelete;
            const userJoin = req.body.userJoin;
            const userLeave = req.body.userLeave;
            const roleAdd = req.body.roleAdd;
            const roleRemove = req.body.roleRemove;
            const roleCreate = req.body.roleCreate;
            const roleDelete = req.body.roleDelete;
            const emoteAdd = req.body.emoteAdd;
            const emoteRemove = req.body.emoteRemove;
            const boostCount = req.body.boostCount;
            const boostTier = req.body.boostTier;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Delete entry first
                sql = nws`DELETE FROM guild_logs
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                // Then insert the new data
                sql = nws`INSERT INTO guild_logs (guild_id,tc_id,msg_update,msg_delete,category_create,category_delete,tc_create,tc_delete,vc_create,vc_delete,vc_join,vc_move,vc_leave,user_ban,user_unban,invite_create,invite_delete,user_join,user_leave,role_add,role_remove,role_create,role_delete,emote_add,emote_remove,boost_count,boost_tier)
                    VALUES (${mysql.escape(guildId)},${mysql.escape(tcId)},
                    ${mysql.escape(getBoolean(msgUpdate))},
                    ${mysql.escape(getBoolean(msgDelete))},
                    ${mysql.escape(getBoolean(categoryCreate))},
                    ${mysql.escape(getBoolean(categoryDelete))},
                    ${mysql.escape(getBoolean(tcCreate))},
                    ${mysql.escape(getBoolean(tcDelete))},
                    ${mysql.escape(getBoolean(vcCreate))},
                    ${mysql.escape(getBoolean(vcDelete))},
                    ${mysql.escape(getBoolean(vcJoin))},
                    ${mysql.escape(getBoolean(vcMove))},
                    ${mysql.escape(getBoolean(vcLeave))},
                    ${mysql.escape(getBoolean(userBan))},
                    ${mysql.escape(getBoolean(userUnban))},
                    ${mysql.escape(getBoolean(inviteCreate))},
                    ${mysql.escape(getBoolean(inviteDelete))},
                    ${mysql.escape(getBoolean(userJoin))},
                    ${mysql.escape(getBoolean(userLeave))},
                    ${mysql.escape(getBoolean(roleAdd))},
                    ${mysql.escape(getBoolean(roleRemove))},
                    ${mysql.escape(getBoolean(roleCreate))},
                    ${mysql.escape(getBoolean(roleDelete))},
                    ${mysql.escape(getBoolean(emoteAdd))},
                    ${mysql.escape(getBoolean(emoteRemove))},
                    ${mysql.escape(getBoolean(boostCount))},
                    ${mysql.escape(getBoolean(boostTier))})`;

                await mysql.query(sql);

                res.sendStatus(200);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitMediaOnlyChannel(req, res) {
        try {
            const guildId = req.body.guildId;
            const mocWarning = req.body.mocWarning;
            const mocString = req.body.moc;
            const mocs = mocString.split('|');

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // First, delete all
                let sql = nws`DELETE FROM guild_media_only_channels
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                // Then add the selected ones
                for (const moc of mocs) {
                    sql = nws`INSERT INTO guild_media_only_channels (guild_id,tc_id)
                        VALUES (${mysql.escape(guildId)},${mysql.escape(moc)})`;

                    await mysql.query(sql);
                }

                // Moc warning

                // Delete disabled feature if exists
                sql = nws`SELECT *
                    FROM guild_disabled_features
                    WHERE guild_id=${mysql.escape(guildId)}
                    AND feature_id=${mysql.escape(5)}`; // media_only_warning

                let disabledFeatures = await mysql.query(sql);
                disabledFeatures = disabledFeatures[0];

                let isDisabled = disabledFeatures[0] != undefined;
                if (isDisabled && getBoolean(mocWarning)) {
                    // Delete
                    sql = nws`DELETE FROM guild_disabled_features
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND feature_id=${mysql.escape(5)}`;

                    await mysql.query(sql);
                } else if (!isDisabled && !getBoolean(mocWarning)) {
                    // Insert
                    sql = nws`INSERT INTO guild_disabled_features (guild_id,feature_id)
                        VALUES (${mysql.escape(guildId)},${mysql.escape(5)})`; // media_only_warning

                    await mysql.query(sql);
                }

                res.sendStatus(200)
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitReactionRoleCreate(req, res) {
        try {
            const guildId = req.body.guildId;
            let botGuild = bot.guilds.cache.get(guildId);

            const tcId = req.body.tcId;

            const color = req.body.color;

            const authorIcon = req.body.authorIcon;
            const authorName = req.body.authorName;
            const authorLink = req.body.authorLink;
            const thumbnail = req.body.thumbnail;
            const title = req.body.title;
            const titleLink = req.body.titleLink;
            const description = req.body.description;

            const fieldTitles = JSON.parse(req.body.fieldTitles);
            const fieldDescriptions = JSON.parse(req.body.fieldDescriptions);
            const fieldInlines = JSON.parse(req.body.fieldInlines);

            const image = req.body.image;
            const footerIcon = req.body.footerIcon;
            const footerText = req.body.footerText;
            const timestamp = req.body.timestamp;

            const emojis = JSON.parse(req.body.emojis);
            const roles = JSON.parse(req.body.roles);

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);
            const isSupporter = await getSupporterStatus(bot, req);

            if (isAuthorized) {
                let sql = nws`SELECT t.timezone
                    FROM guilds AS g
                    INNER JOIN const_timezones AS t
                    ON g.timezone_id=t.id
                    WHERE g.guild_id=${mysql.escape(guildId)}`;

                let timezones = await mysql.query(sql);
                timezones = timezones[0];
                let timezone = timezones.length > 0 ? timezones[0].timezone : 'UTC';
                let timestampTz = moment.tz(timestamp, timezone);
                let timestampUtc = timestampTz.clone().tz('UTC');
                timestampUtc = timestamp == undefined ? "" : timestampUtc;

                let embed = new Discord.MessageEmbed()
                    .setColor(isSupporter ? color : "#7289da");

                if (authorName) embed.setAuthor(authorName, authorIcon == undefined ? null : authorIcon, authorLink == undefined ? null : authorLink);
                if (title) embed.setTitle(title);
                if (titleLink) embed.setURL(titleLink);
                if (thumbnail) embed.setThumbnail(thumbnail);
                if (description) embed.setDescription(description);
                if (fieldTitles && fieldDescriptions) {
                    for (const i in fieldTitles) {
                        const title = fieldTitles[i];
                        const description = fieldDescriptions[i];
                        const inline = fieldInlines[i];

                        if (title && description)
                            embed.addField(title, description, inline);
                    }
                }
                if (image) embed.setImage(image);
                if (footerText) embed.setFooter(footerText, footerIcon == undefined ? null : footerIcon);
                if (timestamp) embed.setTimestamp(timestamp);
                if (emojis && roles) {
                    let tc = botGuild.channels.cache.get(tcId);
                    if (tc) {
                        let message;
                        try {
                            message = await tc.send(embed);
                        } catch (err) {
                            res.sendStatus(406);
                            return;
                        }

                        for (const emoji of emojis) {
                            if (emoji) await message.react(emoji);
                        }

                        // DB
                        let sql = nws`INSERT INTO reaction_role_messages (guild_id,tc_id,msg_id,colorcode,author_name,author_url,author_icon_url,title,title_url,thumbnail_url,description,image_url,footer,footer_icon_url,timestamp)
                            VALUES (${mysql.escape(guildId)},${mysql.escape(tcId)},${mysql.escape(message.id)},${mysql.escape(color)},${mysql.escape(getBlank(authorName))},${mysql.escape(getBlank(authorLink))},${mysql.escape(getBlank(authorIcon))},${mysql.escape(getBlank(title))},${mysql.escape(getBlank(titleLink))},${mysql.escape(getBlank(thumbnail))},${mysql.escape(getBlank(description))},${mysql.escape(getBlank(image))},${mysql.escape(getBlank(footerText))},${mysql.escape(getBlank(footerIcon))},${mysql.escape(timestampUtc ? timestampUtc.format() : "")})`;

                        await mysql.query(sql);

                        for (const i in roles) {
                            const role = roles[i];
                            const emoji = emojis[i];

                            for (const roleId of role.split('|')) {
                                if (roleId) {
                                    // Check if this message already has this role for this emoji
                                    // This may happen if the user adds multiple reaction roles with the same emoji and same roles multiple times
                                    sql = nws`SELECT id
                                        FROM reaction_roles
                                        WHERE msg_id=${mysql.escape(message.id)}
                                        AND emoji=${mysql.escape(emoji)}
                                        AND role_id=${mysql.escape(roleId)}`;

                                    const reactionRolesDb = await mysql.query(sql);

                                    if (reactionRolesDb[0].length > 0) continue;

                                    sql = nws`INSERT INTO reaction_roles (msg_id,emoji,role_id,guild_id,tc_id)
                                        VALUES (${mysql.escape(message.id)},${mysql.escape(emoji)},${mysql.escape(roleId)},${mysql.escape(guildId)},${mysql.escape(tcId)})`;

                                    await mysql.query(sql);
                                }
                            }
                        }

                        if (fieldTitles) {
                            for (const i in fieldTitles) {
                                const title = fieldTitles[i];
                                const description = fieldDescriptions[i];
                                const inline = fieldInlines[i];

                                sql = nws`INSERT INTO reaction_role_fields (msg_id,field_no,title,description,inline,guild_id,tc_id)
                                    VALUES (${mysql.escape(message.id)},${mysql.escape(i + 1)},${mysql.escape(title)},${mysql.escape(description)},${mysql.escape(inline == 'inline')},${mysql.escape(guildId)},${mysql.escape(tcId)})`;

                                await mysql.query(sql);
                            }

                            res.sendStatus(200);
                        } else res.sendStatus(200);
                    } else res.sendStatus(403);
                } else res.sendStatus(500);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitReactionRoleEdit(req, res) {
        try {
            const guildId = req.body.guildId;
            let botGuild = bot.guilds.cache.get(guildId);
            const msgId = req.body.msgId;

            const color = req.body.color;

            const authorIcon = req.body.authorIcon;
            const authorName = req.body.authorName;
            const authorLink = req.body.authorLink;
            const thumbnail = req.body.thumbnail;
            const title = req.body.title;
            const titleLink = req.body.titleLink;
            const description = req.body.description;

            const fieldTitles = JSON.parse(req.body.fieldTitles);
            const fieldDescriptions = JSON.parse(req.body.fieldDescriptions);
            const fieldInlines = JSON.parse(req.body.fieldInlines);

            const image = req.body.image;
            const footerIcon = req.body.footerIcon;
            const footerText = req.body.footerText;
            const timestamp = req.body.timestamp;

            const emojis = JSON.parse(req.body.emojis);
            const roles = JSON.parse(req.body.roles);

            const isSupporter = await getSupporterStatus(bot, req);
            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // 1. Get text channel ID from the database, in case the user force changed it.
                let sql = nws`SELECT tc_id
                    FROM reaction_role_messages
                    WHERE msg_id=${mysql.escape(msgId)}`;

                let tcIds = await mysql.query(sql);
                tcIds = tcIds[0];

                if (tcIds.length > 0) {
                    let tcId = tcIds[0].tc_id;

                    // 2. Delete all database entries form this reaction role message.
                    sql = nws`DELETE FROM reaction_role_messages
                        WHERE msg_id=${mysql.escape(msgId)}`;

                    await mysql.query(sql);

                    sql = nws`DELETE FROM reaction_role_fields
                        WHERE msg_id=${mysql.escape(msgId)}`;

                    await mysql.query(sql);

                    sql = nws`DELETE FROM reaction_roles
                        WHERE msg_id=${mysql.escape(msgId)}`;

                    await mysql.query(sql);

                    // 3. Update the embed and its reactions.
                    sql = nws`SELECT t.timezone
                        FROM guilds AS g
                        INNER JOIN const_timezones AS t
                        ON g.timezone_id=t.id
                        WHERE g.guild_id=${mysql.escape(guildId)}`;

                    let timezones = await mysql.query(sql);
                    timezones = timezones[0];

                    let timezone = timezones.length > 0 ? timezones[0].timezone : 'UTC';
                    let timestampTz = moment.tz(timestamp, timezone);
                    let timestampUtc = timestampTz.clone().tz('UTC');
                    timestampUtc = timestamp ? "" : timestampUtc;

                    let embed = new Discord.MessageEmbed()
                        .setColor(isSupporter ? color : "#7289da");

                    if (authorName) embed.setAuthor(authorName, authorIcon ? null : authorIcon, authorLink ? null : authorLink);
                    if (title) embed.setTitle(title);
                    if (titleLink) embed.setURL(titleLink);
                    if (thumbnail) embed.setThumbnail(thumbnail);
                    if (description) embed.setDescription(description);
                    if (fieldTitles && fieldDescriptions && fieldInlines) {
                        for (const i in fieldTitles) {
                            const title = fieldTitles[i];
                            const description = fieldDescriptions[i];
                            const inline = fieldInlines[i] == 'inline';

                            if (title && description) embed.addField(title, description, inline);
                        }
                    }
                    if (image) embed.setImage(image);
                    if (footerText) embed.setFooter(footerText, footerIcon ? null : footerIcon);
                    if (timestamp) embed.setTimestamp(timestamp);
                    if (emojis && roles) {
                        let tc = botGuild.channels.cache.get(tcId);
                        let message = await tc.messages.fetch(msgId);
                        let updatedMessage = await message.edit(embed);

                        let emojisToIgnore = [];
                        for (let [key, reaction] of message.reactions.cache) {
                            if (!emojis.includes(reaction.emoji.name)) await reaction.remove();
                            else emojisToIgnore.push(reaction.emoji);
                        }

                        for (const emoji of emojis) {
                            if (emoji && !emojisToIgnore.includes(emoji))
                                await updatedMessage.react(emoji);
                        }

                        // 4. Enter updatedMessage in database.
                        sql = nws`INSERT INTO reaction_role_messages (guild_id,tc_id,msg_id,colorcode,author_name,author_url,author_icon_url,title,title_url,thumbnail_url,description,image_url,footer,footer_icon_url,timestamp)
                            VALUES (${mysql.escape(guildId)},${mysql.escape(tcId)},${mysql.escape(updatedMessage.id)},${mysql.escape(color)},${mysql.escape(getBlank(authorName))},${mysql.escape(getBlank(authorLink))},${mysql.escape(getBlank(authorIcon))},${mysql.escape(getBlank(title))},${mysql.escape(getBlank(titleLink))},${mysql.escape(getBlank(thumbnail))},${mysql.escape(getBlank(description))},${mysql.escape(getBlank(image))},${mysql.escape(getBlank(footerText))},${mysql.escape(getBlank(footerIcon))},${mysql.escape(timestampUtc ? timestampUtc.format() : "")})`;

                        await mysql.query(sql);

                        for (const i in roles) {
                            const role = roles[i];
                            for (const roleId of role.split('|')) {
                                if (roleId) {
                                    sql = nws`INSERT INTO reaction_roles (msg_id,emoji,role_id,guild_id)
                                        VALUES (${mysql.escape(updatedMessage.id)},${mysql.escape(emojis[i])},${mysql.escape(roleId)},${mysql.escape(guildId)})`;

                                    await mysql.query(sql);
                                }
                            }
                        }

                        if (fieldTitles) {
                            for (const i in fieldTitles) {
                                const fieldTitle = fieldTitles[i];
                                const fieldDescription = fieldDescriptions[i];
                                const fieldInline = fieldInlines[i] === 'inline';

                                sql = nws`INSERT INTO reaction_role_fields (msg_id,field_no,title,description,inline,guild_id)
                                    VALUES (${mysql.escape(updatedMessage.id)},${mysql.escape(i + 1)},${mysql.escape(fieldTitle)},${mysql.escape(fieldDescription)},${mysql.escape(fieldInline)},${mysql.escape(guildId)})`;

                                await mysql.query(sql);
                            }
                        }

                        res.sendStatus(200)
                    } else res.sendStatus(500);
                } else res.sendStatus(500);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitReactionRoleDelete(req, res) {
        try {
            const guildId = req.body.guildId;
            const tcId = req.body.tcId;
            const msgId = req.body.msgId;

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                let guild = await bot.guilds.fetch(guildId);
                let tc = guild.channels.cache.get(tcId);
                let message = await tc.messages.fetch(msgId);

                await message.delete();

                let sql = nws`DELETE FROM reaction_role_messages
                    WHERE msg_id=${mysql.escape(msgId)}`;

                await mysql.query(sql);

                sql = nws`DELETE FROM reaction_roles
                    WHERE msg_id=${mysql.escape(msgId)}`;

                await mysql.query(sql);

                sql = nws`DELETE FROM reaction_role_fields
                    WHERE msg_id=${mysql.escape(msgId)}`;

                await mysql.query(sql);

                res.sendStatus(200);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitVoiceLobby(req, res) {
        try {
            const guildId = req.body.guildId;
            const lobbies = req.body.lobbies.split('|');
            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // First, delete all
                let sql = nws`DELETE FROM guild_voice_lobbies
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                if (lobbies.length > 0) {
                    // Then add the selected ones
                    for (const lobby of lobbies) {
                        sql = nws`INSERT INTO guild_voice_lobbies (guild_id,vc_id)
                            VALUES (${mysql.escape(guildId)},${mysql.escape(lobby)})`;

                        await mysql.query(sql);
                    }
                }

                res.sendStatus(200);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitCategoryToggle(req, res) {
        try {
            const guildId = req.body.guildId;
            const category = req.body.category;
            const checked = req.body.checked === 'true';
            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Get category id from database
                var sql = nws`SELECT *
                    FROM const_categories
                    WHERE name=${mysql.escape(category)}`;

                let categories = await mysql.query(sql);
                categories = categories[0];

                if (categories.length > 0) {
                    var categoryId = categories[0].id;

                    // Check if category exists in db (= is disabled)
                    var sql = nws`SELECT *
                        FROM guild_disabled_categories
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND category_id=${mysql.escape(categoryId)}`;

                    let disabledCategories = await mysql.query(sql);
                    disabledCategories = disabledCategories[0];

                    if (disabledCategories.length > 0) {
                        // category is disabled
                        if (checked) {
                            // delete
                            sql = nws`DELETE
                                FROM guild_disabled_categories
                                WHERE guild_id=${mysql.escape(guildId)}
                                AND category_id=${mysql.escape(categoryId)}`;

                            await mysql.query(sql);
                        }
                    } else {
                        // category is enabled
                        if (!checked) {
                            // insert
                            sql = nws`INSERT INTO guild_disabled_categories (guild_id,category_id)
                                VALUES (${mysql.escape(guildId)},${mysql.escape(categoryId)})`;

                            await mysql.query(sql);
                        }
                    }

                    res.sendStatus(200);
                } else res.sendStatus(500);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitCommandToggle(req, res) {
        try {
            const guildId = req.body.guildId;
            const command = req.body.command;
            const checked = req.body.checked === 'true';
            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Get command id from database
                let sql = nws`SELECT *
                    FROM const_commands
                    WHERE name=${mysql.escape(command)}`;

                let commands = await mysql.query(sql);
                commands = commands[0];

                if (commands.length > 0) {
                    let commandId = commands[0].id;

                    // Check if command exists in db (= is disabled)
                    sql = nws`SELECT *
                        FROM guild_disabled_commands
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND command_id=${mysql.escape(commandId)}`;

                    let disabledCommands = await mysql.query(sql);
                    disabledCommands = disabledCommands[0];

                    if (disabledCommands.length > 0) {
                        // command is disabled
                        if (checked) {
                            // delete
                            sql = nws`DELETE
                                FROM guild_disabled_commands
                                WHERE guild_id=${mysql.escape(guildId)}
                                AND command_id=${mysql.escape(commandId)}`;

                            await mysql.query(sql);
                        }
                    } else {
                        // command is enabled
                        if (!checked) {
                            // insert
                            sql = nws`INSERT INTO guild_disabled_commands (guild_id,command_id)
                                VALUES (${mysql.escape(guildId)},${mysql.escape(commandId)})`;

                            await mysql.query(sql);
                        }
                    }

                    res.sendStatus(200);
                } else res.sendStatus(500);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitPluginToggle(req, res) {
        try {
            const guildId = req.body.guildId;
            const plugin = req.body.plugin;
            const checked = req.body.checked === 'true';
            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                // Get plugin id from database
                let sql = nws`SELECT *
                    FROM const_plugins
                    WHERE name=${mysql.escape(plugin)}`;

                let plugins = await mysql.query(sql);
                plugins = plugins[0];

                if (plugins.length > 0) {
                    let pluginId = plugins[0].id;

                    // Check if plugin exists in db (= is disabled)
                    sql = nws`SELECT *
                        FROM guild_disabled_plugins
                        WHERE guild_id=${mysql.escape(guildId)}
                        AND plugin_id=${mysql.escape(pluginId)}`;

                    let disabledPlugins = await mysql.query(sql);
                    disabledPlugins = disabledPlugins[0];

                    // Check if guilds has entry. If not, create a default one
                    // That is because leveling disabled per default, we need the guilds entry to determine if a plugin is on
                    sql = nws`SELECT guild_id
                        FROM guilds
                        WHERE guild_id=${mysql.escape(guildId)}`;

                    let guilds = await mysql.query(sql);
                    guilds = guilds[0];

                    if (guilds.length === 0) {
                        // Create default entry
                        sql = nws`INSERT INTO guilds (guild_id,prefix,language_code,timezone_id)
                            VALUES (${mysql.escape(guildId)},${mysql.escape('!')},${mysql.escape('en_gb')},${mysql.escape(1)})`;

                        await mysql.query(sql);

                        // If we create a default entry from a plugin toggle, we also have to disable cmddletion by default.
                        sql = nws`INSERT INTO guild_disabled_features (guild_id,feature_id)
                            VALUES (${mysql.escape(guildId)},${mysql.escape(4)})`; // cmddeletion

                        await mysql.query(sql);
                    }

                    // Set disabled plugins
                    if (disabledPlugins.length > 0) {
                        // plugin is disabled
                        if (checked) {
                            // delete
                            sql = nws`DELETE
                                FROM guild_disabled_plugins
                                WHERE guild_id=${mysql.escape(guildId)}
                                AND plugin_id=${mysql.escape(pluginId)}`;

                            await mysql.query(sql);
                        }
                    } else {
                        // plugin is enabled
                        if (!checked) {
                            // insert
                            sql = nws`INSERT INTO guild_disabled_plugins (guild_id,plugin_id)
                                VALUES (${mysql.escape(guildId)},${mysql.escape(pluginId)})`;

                            await mysql.query(sql);
                        }
                    }

                    res.sendStatus(200);
                } else res.sendStatus(500);
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitLeaderboardResetMember(req, res) {
        try {
            const guildId = req.body.guildId;
            const userId = req.body.userId;
            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                let sql = nws`DELETE FROM user_exp
                    WHERE user_id=${mysql.escape(userId)}
                    AND guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                res.sendStatus(200)
            } else res.sendStatus(403);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitLeaderboardResetMembers(req, res) {
        try {
            const guildId = req.body.guildId;
            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                let sql = nws`DELETE FROM user_exp
                    WHERE guild_id=${mysql.escape(guildId)}`;

                await mysql.query(sql);

                res.sendStatus(200);
            } else res.sendStatus(403);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async function submitLeaderboardPruneMembers(req, res) {
        try {
            const guildId = req.body.guildId;
            const botGuild = await bot.guilds.fetch(guildId);

            const isAuthorized = await getAuthorization(bot, req, guildId, mysql);

            if (isAuthorized) {
                let sql = nws`SELECT *
                    FROM user_exp
                    WHERE guild_id=${mysql.escape(guildId)}`;

                let userExps = await mysql.query(sql);
                userExps = userExps[0];

                for (const userExp of userExps) {
                    const userId = userExp.user_id;

                    const member = botGuild.members.cache.get(userId);
                    if (member === undefined) {
                        sql = nws`DELETE FROM user_exp
                            WHERE user_id=${mysql.escape(userId)}
                            AND guild_id=${mysql.escape(botGuild.id)}`;

                        await mysql.query(sql);
                    }
                }

                res.sendStatus(200);
            } else res.sendStatus(403);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    return router;
};
