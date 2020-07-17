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

    function getAuthorization(req, id, mysql, bot, callback) {
        let botUser = bot.users.cache.get(req.user.discordId);
        let botGuild = bot.guilds.cache.get(id);
        let is_authorized = false;

        if (botGuild !== undefined) {
            // Owner?
            let isOwner = botGuild.ownerID == req.user.discordId;

            // Admin?
            let isAdmin = false;
            let member = undefined;

            if (botGuild !== undefined && botUser !== undefined) {
                member = botGuild.member(botUser);
                isAdmin = member.hasPermission("ADMINISTRATOR");
            }

            // Servant-Moderator?
            let isServantMod = false;

            let sql = "SELECT * " +
                "FROM guild_mod_roles " +
                "WHERE guild_id=" + mysql.escape(id);

            mysql.query(sql, function (err, modRoleIdEntries) {
                if (err) {
                    console.log(err);
                    callback(false);
                } else {
                    modRoleIdEntries.forEach(modRoleIdEntry => {
                        if (member.roles.cache.get(modRoleIdEntry.role_id) !== undefined)
                            isServantMod = true;
                    });

                    // Authorized?
                    if (isOwner || isAdmin || isServantMod) is_authorized = true;

                    return callback(is_authorized);
                }
            });
        } else callback(is_authorized);
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
                                                getAuthorization(req, id, mysql, bot, function (isAuthorized) {
                                                    let botGuild = bot.guilds.cache.get(id);
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