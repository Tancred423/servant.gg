const router = require('express').Router();
const mysql = require('../database/mysql')
const cookieParser = require('cookie-parser');

router.use(cookieParser());

module.exports = function (bot) {
    function isAuthorized(req, res, next) {
        if (req.user)
            next();
        else {
            res.cookie('redirect', req.originalUrl)
            res.redirect('/auth');
        }
    }

    router.get('/', isAuthorized, (req, res) => {
        var lvlDisabledGuilds = [];
        var allGuilds = [];
        var lvlDisabledModeration = [];

        var sql = "SELECT * FROM guild_disabled_plugins WHERE plugin_id=" + mysql.escape(7);
        mysql.query(sql, function (err, result_lvl) {
            if (err) res.render('404', { req });
            else {
                for (let i = 0; i < result_lvl.length; i++) {
                    lvlDisabledGuilds.push(result_lvl[i].guild_id);
                }

                sql = "SELECT guild_id FROM guilds";

                mysql.query(sql, function (err, result_guilds) {
                    if (err) res.render('404', { req });
                    else {
                        for (let i = 0; i < result_guilds.length; i++) {
                            allGuilds.push(result_guilds[i].guild_id);
                        }

                        sql = "SELECT * " +
                            "FROM guild_disabled_categories " +
                            "WHERE category_id=" + mysql.escape(3)

                        mysql.query(sql, function (err, disabled_categories) {
                            if (err) res.render('404', { req });
                            else {
                                for (let i = 0; i < disabled_categories.length; i++) {
                                    lvlDisabledModeration.push(disabled_categories[i].guild_id);
                                }

                                res.render('leaderboard', {
                                    req, bot, lvlDisabledGuilds, allGuilds, lvlDisabledModeration
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    router.get('*', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 1].split("?")[0];

        var rendered = false;
        var guilds = req.user.guilds;
        let guildFound = false;

        guilds.forEach(guild => {
            if (guild.id === id && id !== '264445053596991498') {
                guildFound = true;
                var botIsOnGuild = false;
                if (bot.guilds.cache.get(guild.id) !== undefined) botIsOnGuild = true;

                if (botIsOnGuild) {
                    var levelIsDisabled = false;
                    var guildHasEntry = false;

                    var sql = "SELECT * FROM guild_disabled_plugins WHERE guild_id=" + mysql.escape(guild.id) + " AND plugin_id='7'";
                    mysql.query(sql, function (err, result_lvl) {
                        if (err) res.render('404', { req });
                        else {
                            if (result_lvl.length > 0) levelIsDisabled = true;

                            sql = "SELECT guild_id FROM guilds WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, result_guilds) {
                                if (err) res.render('404', { req });
                                else {
                                    if (result_guilds.length > 0) guildHasEntry = true;

                                    if (!levelIsDisabled && guildHasEntry) {
                                        sql = "SELECT user_id, exp " +
                                            "FROM user_exp " +
                                            "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                            "ORDER BY exp DESC";

                                        mysql.query(sql, function (err, exps) {
                                            if (err) { console.log(err); res.render('404', { req }); }
                                            else {

                                                // Check if author is mod
                                                let isAuthorized = true;

                                                // Admin?
                                                let botUser = bot.users.cache.get(req.user.discordId);
                                                var botGuild = bot.guilds.cache.get(guild.id);

                                                let isAdmin = false;
                                                if (botGuild !== undefined && botUser !== undefined) {
                                                    let member = botGuild.member(botUser);
                                                    if (member === null) {
                                                        res.render('404', { req });
                                                        return;
                                                    } else isAdmin = member.hasPermission("ADMINISTRATOR");
                                                }

                                                // Servant-Moderator?
                                                let sql = "SELECT * " +
                                                    "FROM guild_mods " +
                                                    "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                                    "AND user_id=" + mysql.escape(req.user.discordId);
                                                let servantModGuilds = [];

                                                mysql.query(sql, function (err, result_mods) {
                                                    if (err) {
                                                        isAuthorized = false;
                                                    } else {
                                                        for (let i = 0; i < result_mods.length; i++) {
                                                            servantModGuilds.push(result_mods[i].guild_id);
                                                        }
                                                    }

                                                    let isServantMod = servantModGuilds.indexOf(guild.id) > -1;

                                                    if (botGuild.ownerID !== req.user.discordId && !isAdmin && !isServantMod) isAuthorized = false;

                                                    rendered = true;
                                                    res.render('guild_leaderboard', { req, guild, exps, botGuild, isAuthorized, bot });
                                                });
                                            }
                                        });
                                    } else {
                                        res.render('404', { req });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    res.render('404', { req });
                }
            }
        });

        if (!guildFound) {
            res.render('404', { req });
        }
    });

    return router;
};