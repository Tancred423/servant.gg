const router = require('express').Router();
const mysql = require('../database/mysql');
const moment = require('moment-timezone');
const cookieParser = require('cookie-parser');
const { authorize } = require('passport');

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

    function getPrefix(req, mysql, guildId, callback) {
        let prefix = '!';

        if (req.user) {
            let sql = "SELECT prefix " +
                "FROM guilds " +
                "WHERE guild_id=" + mysql.escape(guildId);

            mysql.query(sql, function (err, prefixes) {
                if (err)
                    console.log(err);
                else if (prefixes.length > 0)
                    prefix = prefixes[0].prefix;

                if (prefix == '') prefix = '!';

                return callback(prefix);
            });
        } else return callback(prefix);
    }

    function get_authorization(req, id, mysql, bot, callback) {
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

    function isSupporter(req, bot, callback) {
        let isSupporter = false;

        let sk = bot.guilds.cache.get('436925371577925642');
        if (sk != undefined) {
            let member = sk.members.cache.get(req.user.discordId);
            if (member != undefined) {
                let memberRoles = member.roles.cache;
                if (memberRoles != undefined) {
                    memberRoles.forEach(memberRole => {
                        if (memberRole.id == '715557625244155994') {
                            isSupporter = true;
                        }
                    });
                }
            }
        }

        callback(isSupporter);
    }

    async function get_owner_guilds(req, bot, mysql) {
        let guilds = req.user.guilds;
        let ownerGuilds = [];

        for (const guild of guilds) {
            let isAdmin = false;
            let isServantMod = false;

            let botGuild = bot.guilds.cache.get(guild.id);
            let botUser = bot.users.cache.get(req.user.discordId);

            if (botGuild !== undefined && botUser !== undefined) {
                let member = botGuild.members.cache.get(botUser.id);

                if (member !== undefined) {
                    isAdmin = member.hasPermission("ADMINISTRATOR");

                    let sql = "SELECT * FROM guild_mod_roles WHERE guild_id=" + mysql.escape(guild.id);
                    let [rows, fields] = await mysql.query(sql);

                    let mod_role_ids = [];
                    for (const row of rows) {
                        mod_role_ids.push(row.role_id);
                    }

                    let member_role_ids = [];
                    for (const role of member.roles.cache) {
                        member_role_ids.push(role[0])
                    }

                    isServantMod = member_role_ids.some(r => mod_role_ids.includes(r));
                }
            }

            if (guild.owner || isAdmin || isServantMod) {
                ownerGuilds.push(guild);
            }
        }

        return ownerGuilds;
    }

    router.get('/', isAuthorized, (req, res) => {
        isSupporter(req, bot, function (isSupporter) {
            let sql = "SELECT u.prefix, u.color_code, u.bio, u.birthday, l.code, u.profile_bg_id " +
                "FROM users as u " +
                "INNER JOIN const_languages as l " +
                "ON u.language_code=l.code " +
                "WHERE user_id=" + mysql.escape(req.user.discordId);

            mysql.query(sql, function (err, result) {
                if (err) throw err;
                else {
                    sql = "SELECT * " +
                        "FROM user_birthday_guilds " +
                        "WHERE user_id=" + mysql.escape(req.user.discordId);

                    mysql.query(sql, function (err, bday_guilds) {
                        if (err) throw err;
                        else {
                            sql = "SELECT * " +
                                "FROM const_profile_images"

                            mysql.query(sql, function (err, bgs) {
                                if (err) throw err;
                                else {
                                    sql = "SELECT * " +
                                        "FROM const_languages";

                                    mysql.query(sql, function (err, languages) {
                                        if (err) throw err;
                                        else {
                                            get_owner_guilds(req, bot, mysql)
                                                .then(ownerGuilds => {
                                                    res.render('dashboard', {
                                                        req, result, bot, mysql, bday_guilds, bgs, languages, ownerGuilds, isSupporter
                                                    });
                                                }).catch(console.error);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    });

    router.get('*/moderation/autorole', isAuthorized, (req, res) => {
        let pathArray = req.originalUrl.split('/');
        let id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    let guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_autoroles " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, autoroles) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(1);

                                    mysql.query(sql, function (err, disabled_plugins) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            let botGuild = bot.guilds.cache.get(guild.id);
                                            res.render('autorole', { req, guild, bot, botGuild, autoroles, disabled_plugins })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.get('*/moderation/bestofimage', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_best_of_images " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, bois) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(2);

                                    mysql.query(sql, function (err, disabled_plugins) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            let botGuild = bot.guilds.cache.get(guild.id);
                                            res.render('bestofimage', { req, guild, bot, botGuild, bois, disabled_plugins })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.get('*/moderation/bestofquote', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_best_of_quotes " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, boqs) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(3);

                                    mysql.query(sql, function (err, disabled_plugins) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            let botGuild = bot.guilds.cache.get(guild.id);
                                            res.render('bestofquote', { req, guild, bot, botGuild, boqs, disabled_plugins })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.get('*/moderation/birthday', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_birthdays " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, guild_birthdays) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(13);

                                    mysql.query(sql, function (err, disabled_plugins) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            let botGuild = bot.guilds.cache.get(guild.id);
                                            res.render('birthday', { req, guild, bot, botGuild, disabled_plugins, guild_birthdays });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.get('*/moderation/customcommands', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        isSupporter(req, bot, function (isSupporter) {
            get_authorization(req, id, mysql, bot, function (is_authorized) {
                if (is_authorized) {
                    getPrefix(req, mysql, id, function (prefix) {
                        if (req.user.discordId !== id) {
                            var guilds = req.user.guilds;
                            guilds.forEach(guild => {
                                if (guild.id === id) {
                                    sql = "SELECT color_code " +
                                        "FROM users " +
                                        "WHERE user_id=" + mysql.escape(req.user.discordId);

                                    mysql.query(sql, function (err, color_code) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            sql = "SELECT * " +
                                                "FROM guild_disabled_plugins " +
                                                "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                                "AND plugin_id=" + mysql.escape(14);

                                            mysql.query(sql, function (err, disabled_plugins) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else {
                                                    sql = "SELECT * " +
                                                        "FROM custom_commands " +
                                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                                        "ORDER BY invoke ASC";

                                                    mysql.query(sql, function (err, ccs) {
                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                        else {
                                                            sql = "SELECT * " +
                                                                "FROM custom_commands_embeds AS e " +
                                                                "INNER JOIN custom_commands AS c " +
                                                                "ON e.cc_id=c.id " +
                                                                "WHERE c.guild_id=" + mysql.escape(guild.id);

                                                            mysql.query(sql, function (err, ccEmbeds) {
                                                                if (err) { console.log(err); res.sendStatus(500); }
                                                                else {
                                                                    sql = "SELECT * " +
                                                                        "FROM custom_commands_fields AS f " +
                                                                        "INNER JOIN custom_commands AS c " +
                                                                        "ON f.cc_id=c.id " +
                                                                        "WHERE c.guild_id=" + mysql.escape(guild.id);

                                                                    mysql.query(sql, function (err, ccFields) {
                                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                                        else {
                                                                            sql = "SELECT t.timezone " +
                                                                                "FROM guilds as g " +
                                                                                "INNER JOIN const_timezones AS t " +
                                                                                "ON g.timezone_id=t.id " +
                                                                                "WHERE g.guild_id=" + mysql.escape(guild.id);

                                                                            mysql.query(sql, function (err, timezones) {
                                                                                if (err) { console.log(err); res.sendStatus(500); }
                                                                                else {
                                                                                    let commandsAmount = ccs.length;

                                                                                    let timestamp_tz_formats = [];

                                                                                    if (ccEmbeds.length > 0) {
                                                                                        ccEmbeds.forEach(cce => {
                                                                                            let timestamp = cce.timestamp;
                                                                                            let timestamp_utc = moment.tz(timestamp, "UTC");
                                                                                            let timezone = timezones.length > 0 ? timezones[0].timezone : "UTC";
                                                                                            let timestamp_tz = timestamp_utc.clone().tz(timezone);

                                                                                            timestamp_tz_formats.push({
                                                                                                cc_id: cce.cc_id,
                                                                                                tz: timestamp_tz.format()
                                                                                            });
                                                                                        });
                                                                                    }

                                                                                    let botGuild = bot.guilds.cache.get(guild.id);
                                                                                    res.render('customcommands', { req, prefix, guild, bot, botGuild, color_code, isSupporter, disabled_plugins, timestamp_tz_formats, commandsAmount, ccs, ccEmbeds, ccFields });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else res.render('404', { req });
                    });
                } else res.render('404', { req });
            });
        });
    });

    router.get('*/moderation/embed', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        isSupporter(req, bot, function (isSupporter) {
            get_authorization(req, id, mysql, bot, function (is_authorized) {
                if (is_authorized) {
                    if (req.user.discordId !== id) {
                        var guilds = req.user.guilds;
                        guilds.forEach(guild => {
                            if (guild.id === id) {

                                sql = "SELECT color_code " +
                                    "FROM users " +
                                    "WHERE user_id=" + mysql.escape(req.user.discordId);

                                mysql.query(sql, function (err, color_code) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else {
                                        let botGuild = bot.guilds.cache.get(guild.id);
                                        res.render('embed', { req, guild, bot, botGuild, color_code, isSupporter })
                                    }
                                });
                            }
                        });
                    }
                } else res.render('404', { req });
            });
        });
    });

    router.get('*/moderation/join', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_joins " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, joins) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(5);

                                    mysql.query(sql, function (err, disabled_plugins) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            let botGuild = bot.guilds.cache.get(guild.id);
                                            res.render('join', { req, guild, bot, botGuild, joins, disabled_plugins })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.get('*/moderation/leave', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_leaves " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, leaves) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(6);

                                    mysql.query(sql, function (err, disabled_plugins) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            let botGuild = bot.guilds.cache.get(guild.id);
                                            res.render('leave', { req, guild, bot, botGuild, leaves, disabled_plugins })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.get('*/moderation/level', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_level " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, guild_levels) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(7);

                                    mysql.query(sql, function (err, disabledLevels) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            sql = "SELECT * " +
                                                "FROM guild_level_roles " +
                                                "WHERE guild_id=" + mysql.escape(guild.id);

                                            mysql.query(sql, function (err, level_roles) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else {
                                                    sql = "SELECT guild_id " +
                                                        "FROM guilds " +
                                                        "WHERE guild_id=" + mysql.escape(guild.id);

                                                    mysql.query(sql, function (err, guilds) {
                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                        else {
                                                            let levelToggle = '';
                                                            if (guilds.length > 0 && disabledLevels.length == 0) levelToggle = 'checked';

                                                            let botGuild = bot.guilds.cache.get(guild.id);
                                                            res.render('level', { req, guild, bot, botGuild, guild_levels, level_roles, levelToggle });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.get('*/moderation/livestream', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_livestreams " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, guild_livestreams) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(8);

                                    mysql.query(sql, function (err, disabled_plugins) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            sql = "SELECT * " +
                                                "FROM guild_livestreamers " +
                                                "WHERE guild_id=" + mysql.escape(guild.id);

                                            mysql.query(sql, function (err, guild_livestreamers) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else {
                                                    let botGuild = bot.guilds.cache.get(guild.id);
                                                    res.render('livestream', { req, guild, bot, botGuild, disabled_plugins, guild_livestreams, guild_livestreamers });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.get('*/moderation/log', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_logs " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, logs) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(9);

                                    mysql.query(sql, function (err, disabled_plugins) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            let botGuild = bot.guilds.cache.get(guild.id);
                                            res.render('log', { req, guild, bot, botGuild, logs, disabled_plugins })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.get('*/moderation/mediaonlychannel', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_media_only_channels " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, mediaonlychannels) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(10);

                                    mysql.query(sql, function (err, disabled_plugins) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            sql = "SELECT * " +
                                                "FROM guild_disabled_features " +
                                                "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                                "AND feature_id=" + mysql.escape(5);

                                            mysql.query(sql, function (err, disabled_features) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else {
                                                    let botGuild = bot.guilds.cache.get(guild.id);
                                                    res.render('mediaonlychannel', { req, guild, bot, botGuild, mediaonlychannels, disabled_plugins, disabled_features })
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.get('*/moderation/reactionrole', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        isSupporter(req, bot, function (isSupporter) {
            get_authorization(req, id, mysql, bot, function (is_authorized) {
                if (is_authorized) {
                    if (req.user.discordId !== id) {
                        var guilds = req.user.guilds;
                        guilds.forEach(guild => {
                            if (guild.id === id) {

                                sql = "SELECT color_code " +
                                    "FROM users " +
                                    "WHERE user_id=" + mysql.escape(req.user.discordId);

                                mysql.query(sql, function (err, color_code) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else {
                                        sql = "SELECT * " +
                                            "FROM guild_disabled_plugins " +
                                            "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                            "AND plugin_id=" + mysql.escape(11);

                                        mysql.query(sql, function (err, disabled_plugins) {
                                            if (err) { console.log(err); res.sendStatus(500); }
                                            else {
                                                sql = "SELECT * " +
                                                    "FROM reaction_role_messages " +
                                                    "WHERE guild_id=" + mysql.escape(guild.id);

                                                mysql.query(sql, function (err, rr_msgs) {
                                                    if (err) { console.log(err); res.sendStatus(500); }
                                                    else {
                                                        sql = "SELECT * " +
                                                            "FROM reaction_roles " +
                                                            "WHERE guild_id=" + mysql.escape(guild.id);

                                                        mysql.query(sql, function (err, rr_roles_emojis) {
                                                            if (err) { console.log(err); res.sendStatus(500); }
                                                            else {
                                                                sql = "SELECT * " +
                                                                    "FROM reaction_role_fields " +
                                                                    "WHERE guild_id=" + mysql.escape(guild.id);

                                                                mysql.query(sql, function (err, rr_fields) {
                                                                    if (err) { console.log(err); res.sendStatus(500); }
                                                                    else {
                                                                        sql = "SELECT t.timezone " +
                                                                            "FROM guilds as g " +
                                                                            "INNER JOIN const_timezones AS t " +
                                                                            "ON g.timezone_id=t.id " +
                                                                            "WHERE g.guild_id=" + mysql.escape(guild.id);

                                                                        mysql.query(sql, function (err, timezones) {
                                                                            if (err) { console.log(err); res.sendStatus(500); }
                                                                            else {
                                                                                let timestamp_tz_formats = [];

                                                                                if (rr_msgs.length > 0) {
                                                                                    rr_msgs.forEach(rr_msg => {
                                                                                        let timestamp = rr_msg.timestamp;
                                                                                        let timestamp_utc = moment.tz(timestamp, "UTC");
                                                                                        let timezone = timezones.length > 0 ? timezones[0].timezone : "UTC";
                                                                                        let timestamp_tz = timestamp_utc.clone().tz(timezone);
                                                                                        timestamp_tz_formats.push({
                                                                                            msg_id: rr_msg.msg_id,
                                                                                            tz: timestamp_tz.format()
                                                                                        });
                                                                                    });
                                                                                }

                                                                                let rrAmount = rr_msgs.length;
                                                                                let botGuild = bot.guilds.cache.get(guild.id);

                                                                                let channels = [];
                                                                                botGuild.channels.cache.forEach(channel => {
                                                                                    channels.push({
                                                                                        id: channel.id,
                                                                                        name: channel.name,
                                                                                        type: channel.type,
                                                                                        viewable: channel.viewable,
                                                                                        parent_name: channel.parent ? channel.parent.name : ''
                                                                                    });
                                                                                });

                                                                                res.render('reactionrole', { req, guild, bot, botGuild, color_code, isSupporter, disabled_plugins, rr_msgs, rr_roles_emojis, rr_fields, timestamp_tz_formats, rrAmount, channels });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else res.render('404', { req });
                } else res.render('404', { req });
            });
        });
    });

    router.get('*/moderation/voicelobby', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 3];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (req.user.discordId !== id) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            let sql = "SELECT * " +
                                "FROM guild_voice_lobbies " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, voicelobbies) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT id " +
                                        "FROM guild_disabled_plugins " +
                                        "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                        "AND plugin_id=" + mysql.escape(12);

                                    mysql.query(sql, function (err, disabled_plugins) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            let botGuild = bot.guilds.cache.get(guild.id);
                                            res.render('voicelobby', { req, guild, bot, botGuild, voicelobbies, disabled_plugins })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });


    // Moderation - 404
    router.get('*/moderation/*', isAuthorized, (req, res) => {
        res.render('404', { req });
    });

    router.get('*/moderation', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 2];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                getPrefix(req, mysql, id, function (prefix) {
                    var guilds = req.user.guilds;
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            sql = "SELECT * " +
                                "FROM guild_disabled_categories " +
                                "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                "AND category_id=" + mysql.escape(3);

                            mysql.query(sql, function (err, disabled_categories) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "SELECT * " +
                                        "FROM const_commands " +
                                        "WHERE category_id=" + mysql.escape(3);

                                    mysql.query(sql, function (err, commands) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            sql = "SELECT * " +
                                                "FROM guild_disabled_commands " +
                                                "WHERE guild_id=" + mysql.escape(guild.id);
                                            mysql.query(sql, function (err, disabled_commands) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else {
                                                    sql = "SELECT d.guild_id, p.name " +
                                                        "FROM guild_disabled_plugins AS d " +
                                                        "INNER JOIN const_plugins AS p " +
                                                        "ON d.plugin_id=p.id " +
                                                        "WHERE d.guild_id=" + mysql.escape(guild.id);

                                                    mysql.query(sql, function (err, disabled_plugins) {
                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                        else {
                                                            sql = "SELECT id " +
                                                                "FROM guild_disabled_plugins " +
                                                                "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                                                "AND plugin_id=" + mysql.escape(7); // Level

                                                            mysql.query(sql, function (err, disabledLevels) {
                                                                if (err) { console.log(err); res.sendStatus(500); }
                                                                else {
                                                                    sql = "SELECT guild_id " +
                                                                        "FROM guilds " +
                                                                        "WHERE guild_id=" + mysql.escape(guild.id);

                                                                    mysql.query(sql, function (err, guilds) {
                                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                                        else {
                                                                            let levelToggle = '';
                                                                            if (guilds.length > 0 && disabledLevels.length == 0) levelToggle = 'checked';
                                                                            res.render('moderation', { req, prefix, guild, disabled_categories, commands, disabled_commands, disabled_plugins, levelToggle });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            } else res.render('404', { req });
        });
    });

    router.get('*/utility', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 2];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                getPrefix(req, mysql, id, function (prefix) {
                    if (req.user.discordId !== id) {
                        var guilds = req.user.guilds;
                        guilds.forEach(guild => {
                            if (guild.id === id) {
                                sql = "SELECT * " +
                                    "FROM guild_disabled_categories " +
                                    "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                    "AND category_id=" + mysql.escape(4);

                                mysql.query(sql, function (err, disabled_categories) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else {
                                        sql = "SELECT * " +
                                            "FROM const_commands " +
                                            "WHERE category_id=" + mysql.escape(4);

                                        mysql.query(sql, function (err, commands) {
                                            if (err) { console.log(err); res.sendStatus(500); }
                                            else {
                                                sql = "SELECT * " +
                                                    "FROM guild_disabled_commands " +
                                                    "WHERE guild_id=" + mysql.escape(guild.id);
                                                mysql.query(sql, function (err, disabled_commands) {
                                                    if (err) { console.log(err); res.sendStatus(500); }
                                                    else {
                                                        res.render('utility', { req, prefix, guild, disabled_categories, commands, disabled_commands });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.get('*/fun', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 2];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                getPrefix(req, mysql, id, function (prefix) {
                    if (req.user.discordId !== id) {
                        var guilds = req.user.guilds;
                        guilds.forEach(guild => {
                            if (guild.id === id) {
                                sql = "SELECT * " +
                                    "FROM guild_disabled_categories " +
                                    "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                    "AND category_id=" + mysql.escape(5);

                                mysql.query(sql, function (err, disabled_categories) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else {
                                        sql = "SELECT * " +
                                            "FROM const_commands " +
                                            "WHERE category_id=" + mysql.escape(5);

                                        mysql.query(sql, function (err, commands) {
                                            if (err) { console.log(err); res.sendStatus(500); }
                                            else {
                                                sql = "SELECT * " +
                                                    "FROM guild_disabled_commands " +
                                                    "WHERE guild_id=" + mysql.escape(guild.id);
                                                mysql.query(sql, function (err, disabled_commands) {
                                                    if (err) { console.log(err); res.sendStatus(500); }
                                                    else {
                                                        res.render('fun', { req, prefix, guild, disabled_categories, commands, disabled_commands });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.get('*/interaction', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 2];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                getPrefix(req, mysql, id, function (prefix) {
                    if (req.user.discordId !== id) {
                        var guilds = req.user.guilds;
                        guilds.forEach(guild => {
                            if (guild.id === id) {
                                sql = "SELECT * " +
                                    "FROM guild_disabled_categories " +
                                    "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                    "AND category_id=" + mysql.escape(6);

                                mysql.query(sql, function (err, disabled_categories) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else {
                                        sql = "SELECT * " +
                                            "FROM const_commands " +
                                            "WHERE category_id=" + mysql.escape(6);

                                        mysql.query(sql, function (err, commands) {
                                            if (err) { console.log(err); res.sendStatus(500); }
                                            else {
                                                sql = "SELECT * " +
                                                    "FROM guild_disabled_commands " +
                                                    "WHERE guild_id=" + mysql.escape(guild.id);
                                                mysql.query(sql, function (err, disabled_commands) {
                                                    if (err) { console.log(err); res.sendStatus(500); }
                                                    else {
                                                        res.render('interaction', { req, prefix, guild, disabled_categories, commands, disabled_commands });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.get('*/random', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 2];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                getPrefix(req, mysql, id, function (prefix) {
                    if (req.user.discordId !== id) {
                        var guilds = req.user.guilds;
                        guilds.forEach(guild => {
                            if (guild.id === id) {
                                sql = "SELECT * " +
                                    "FROM guild_disabled_categories " +
                                    "WHERE guild_id=" + mysql.escape(guild.id) + " " +
                                    "AND category_id=" + mysql.escape(7);

                                mysql.query(sql, function (err, disabled_categories) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else {
                                        sql = "SELECT * " +
                                            "FROM const_commands " +
                                            "WHERE category_id=" + mysql.escape(7);

                                        mysql.query(sql, function (err, commands) {
                                            if (err) { console.log(err); res.sendStatus(500); }
                                            else {
                                                sql = "SELECT * " +
                                                    "FROM guild_disabled_commands " +
                                                    "WHERE guild_id=" + mysql.escape(guild.id);
                                                mysql.query(sql, function (err, disabled_commands) {
                                                    if (err) { console.log(err); res.sendStatus(500); }
                                                    else {
                                                        res.render('random', { req, prefix, guild, disabled_categories, commands, disabled_commands });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.get('*', isAuthorized, (req, res) => {
        var pathArray = req.originalUrl.split('/');
        var id = pathArray[pathArray.length - 1].split("?")[0];

        get_authorization(req, id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                var rendered = false;
                var guilds = req.user.guilds;

                if (guilds === undefined)
                    res.render('404', { req });
                else {
                    guilds.forEach(guild => {
                        if (guild.id === id) {
                            rendered = true;

                            var sql = "SELECT prefix, language_code, timezone_id " +
                                "FROM guilds " +
                                "WHERE guild_id=" + mysql.escape(guild.id);

                            mysql.query(sql, function (err, guilds) {
                                if (err) throw err;
                                else {
                                    sql = "SELECT * " +
                                        "FROM guild_disabled_features " +
                                        "WHERE guild_id=" + mysql.escape(guild.id);

                                    mysql.query(sql, function (err, disabled_features) {
                                        if (err) throw err;
                                        else {
                                            sql = "SELECT * " +
                                                "FROM guild_disabled_categories " +
                                                "WHERE guild_id=" + mysql.escape(guild.id);

                                            mysql.query(sql, function (err, disabled_categories) {
                                                if (err) throw err;
                                                else {
                                                    sql = "SELECT * " +
                                                        "FROM guild_mod_roles " +
                                                        "WHERE guild_id=" + mysql.escape(guild.id);

                                                    mysql.query(sql, function (err, mod_roles) {
                                                        if (err) throw err;
                                                        else {
                                                            sql = "SELECT * " +
                                                                "FROM const_timezones";

                                                            mysql.query(sql, function (err, timezones) {
                                                                if (err) throw err;
                                                                else {
                                                                    sql = "SELECT * " +
                                                                        "FROM const_languages";

                                                                    mysql.query(sql, function (err, languages) {
                                                                        if (err) throw err;
                                                                        else {
                                                                            let botGuild = bot.guilds.cache.get(guild.id);
                                                                            res.render('guild', { req, guild, guilds, disabled_features, disabled_categories, mod_roles, timezones, botGuild, languages });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    return router;
};