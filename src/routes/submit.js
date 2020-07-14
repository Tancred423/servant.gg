const router = require('express').Router();
const mysql = require('../database/mysql');
const Discord = require('discord.js');
const moment = require('moment-timezone');
const { getCharsetNumber } = require('mysql2/lib/connection_config');

module.exports = function (bot) {
    // Default
    router.get('/', (req, res) => {
        res.render('404', { req });
    });

    function hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    function getBoolean(string) {
        return string == 'true';
    }

    function getBlank(string) {
        return string == undefined ? "" : string;
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

    function checkInvokeUsage(guild_id, mysql, invoke_old, invoke_new, callback) {
        if (invoke_old === invoke_new) return callback(false);
        else {
            let sql = "SELECT id " +
                "FROM custom_commands " +
                "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                "AND invoke=" + mysql.escape(invoke_new);

            mysql.query(sql, function (err, invokes) {
                if (err) { console.log(err); return callback(true); }
                else if (invokes.length > 0) return callback(true);
                else return callback(false);
            });
        }
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


    // Guild Settings
    router.post('/guild', (req, res) => {
        const guild_id = req.body.guild_id;
        const prefix = req.body.prefix;
        const language = req.body.language;
        const timezone = req.body.timezone;
        const mod_roles = req.body.mod_roles;
        let mod_roles_split = mod_roles === '' ? '' : mod_roles.split('|');
        const achievements = req.body.achievements;
        const cmddeletion = req.body.cmddeletion;
        const eastereggs = req.body.eastereggs;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Check if user exists in db
                let sql = "SELECT guild_id" + " " +
                    "FROM guilds" + " " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        if (result.length > 0) {
                            // Update
                            let sql = "UPDATE guilds" + " " +
                                "SET prefix=" + mysql.escape(prefix) + ", " +
                                "language_code=" + mysql.escape(language) + ", " +
                                "timezone_id=" + mysql.escape(timezone) +
                                "WHERE guild_id=" + mysql.escape(guild_id);

                            mysql.query(sql, function (err, result) {
                                if (err) res.sendStatus(500);
                                else setModRoles(res, mod_roles_split, guild_id, achievements, cmddeletion, eastereggs);
                            });
                        } else {
                            // Insert
                            let sql = "INSERT INTO guilds (guild_id,prefix,language_code,timezone_id) " +
                                "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(prefix) + "," + mysql.escape(language) + "," + mysql.escape(timezone) + ")";

                            mysql.query(sql, function (err, result) {
                                if (err) res.sendStatus(500);
                                else {
                                    // Disable level and cmddeletion as we now have a guilds entry
                                    sql = "INSERT INTO guild_disabled_plugins (guild_id,plugin_id) " +
                                        "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(7) + ")";

                                    mysql.query(sql, function (err, result) {
                                        if (err) res.sendStatus(500);
                                        else {
                                            sql = "INSERT INTO guild_disabled_features (guild_id,feature_id) " +
                                                "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(4) + ")";

                                            mysql.query(sql, function (err, result) {
                                                if (err) res.sendStatus(500);
                                                else setModRoles(res, mod_roles_split, guild_id, achievements, cmddeletion, eastereggs)
                                            });
                                        }
                                    });
                                };
                            });
                        }
                    }
                });
            } else res.render('404', { req });
        });
    });

    function setModRoles(res, mod_roles_split, guild_id, achievements, cmddeletion, eastereggs) {
        // Guild settings were set. Now the mod roles will be updated
        // First, delete all
        let sql = "DELETE FROM guild_mod_roles " +
            "WHERE guild_id=" + mysql.escape(guild_id);

        mysql.query(sql, function (err, result) {
            if (err) { console.log(err); res.sendStatus(500); }
            else if (mod_roles_split === '') updateFeatureToggle(res, guild_id, achievements, cmddeletion, eastereggs);
            else {
                // Then add the selected ones
                let counter = 0;
                mod_roles_split.forEach(mod_Role => {
                    sql = "INSERT INTO guild_mod_roles (guild_id,role_id) " +
                        "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(mod_Role) + ")"

                    mysql.query(sql, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                        else if (counter == mod_roles_split.length - 1) updateFeatureToggle(res, guild_id, achievements, cmddeletion, eastereggs);
                        counter++;
                    });
                });
            }
        });
    }

    function updateFeatureToggle(res, guild_id, achievements, cmddeletion, eastereggs) {
        let stmt = "SELECT * " +
            "FROM guild_disabled_features AS d " +
            "INNER JOIN const_features AS f " +
            "ON d.feature_id=f.id "
        "WHERE d.guild_id=" + mysql.escape(guild_id);

        mysql.query(stmt, function (err, disabled_features) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                let db_achievements = true;
                let db_eastereggs = true;
                let db_cmddeletion = true;

                if (disabled_features.length > 0) {
                    for (let i = 0; i < disabled_features.length; i++) {
                        const dis_feature = disabled_features[i];
                        switch (dis_feature.name) {
                            case 'achievements':
                                db_achievements = false;
                                break;

                            case 'eastereggs':
                                db_eastereggs = false;
                                break;

                            case 'cmddeletion':
                                db_cmddeletion = false;
                                break;
                        }
                    }
                }

                if (!db_achievements && achievements === 'true') {
                    // enable it
                    stmt = "DELETE" + " " +
                        "FROM guild_disabled_features" + " " +
                        "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                        "AND feature_id=" + mysql.escape(1);

                    mysql.query(stmt, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                    });
                } else if (db_achievements && achievements === 'false') {
                    // disable it
                    stmt = "INSERT INTO guild_disabled_features (guild_id,feature_id)" + " " +
                        "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(1) + ")";

                    mysql.query(stmt, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                    });
                }

                if (!db_eastereggs && eastereggs === 'true') {
                    // enable it
                    stmt = "DELETE" + " " +
                        "FROM guild_disabled_features" + " " +
                        "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                        "AND feature_id=" + mysql.escape(2);

                    mysql.query(stmt, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                    });
                } else if (db_eastereggs && eastereggs === 'false') {
                    // disable it
                    stmt = "INSERT INTO guild_disabled_features (guild_id,feature_id)" + " " +
                        "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(2) + ")";

                    mysql.query(stmt, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                    });
                }

                if (!db_cmddeletion && cmddeletion === 'true') {
                    // enable it
                    stmt = "DELETE" + " " +
                        "FROM guild_disabled_features" + " " +
                        "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                        "AND feature_id=" + mysql.escape(4);

                    mysql.query(stmt, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                    });
                } else if (db_cmddeletion && cmddeletion === 'false') {
                    // disable it
                    stmt = "INSERT INTO guild_disabled_features (guild_id,feature_id)" + " " +
                        "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(4) + ")";

                    mysql.query(stmt, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                    });
                }

                setTimeout(() => {
                    if (!res.headersSent)
                        res.sendStatus(200);
                }, 1000);
            }
        });
    }

    // User Settings
    router.post('/user', (req, res) => {
        const user_id = req.user.discordId;
        let prefix = req.body.prefix;
        const language = req.body.language;
        const bio = req.body.bio;
        let birthday = req.body.birthday;
        if (!birthday) birthday = "0000-00-00";
        const bday_guilds = req.body.bday_guilds;
        let bday_guilds_split = bday_guilds === '' ? '' : bday_guilds.split('|');
        let color = req.body.color;
        if (!color) color = '#7289da';

        let bg_1 = req.body.bg_1;
        let bg_2 = req.body.bg_2;
        let bg_3 = req.body.bg_3;
        let bg_4 = req.body.bg_4;
        let bg_5 = req.body.bg_5;
        let bg_6 = req.body.bg_6;
        let bg_7 = req.body.bg_7;
        let bg_8 = req.body.bg_8;
        let bg_9 = req.body.bg_9;

        let profile_bg_id;
        if (bg_1 == 'true') profile_bg_id = 1;
        else if (bg_2 == 'true') profile_bg_id = 2;
        else if (bg_3 == 'true') profile_bg_id = 3;
        else if (bg_4 == 'true') profile_bg_id = 4;
        else if (bg_5 == 'true') profile_bg_id = 5;
        else if (bg_6 == 'true') profile_bg_id = 6;
        else if (bg_7 == 'true') profile_bg_id = 7;
        else if (bg_8 == 'true') profile_bg_id = 8;
        else if (bg_9 == 'true') profile_bg_id = 9;
        else profile_bg_id = 1;

        isSupporter(req, bot, function (isSupporter) {
            let sql = "SELECT user_id" + " " +
                "FROM users" + " " +
                "WHERE user_id=" + mysql.escape(user_id);

            mysql.query(sql, function (err, result) {
                if (err) { console.log(err); res.sendStatus(500); }
                else {
                    if (result.length > 0) {
                        if (!isSupporter && color != '#7289da') {
                            color = '#7289da';
                        }

                        if (!isSupporter && profile_bg_id != 1) {
                            profile_bg_id = 1;
                        }

                        // Update
                        let sql = "UPDATE users " +
                            "SET prefix=" + mysql.escape(prefix) + ", " +
                            "language_code=" + mysql.escape(language) + ", " +
                            "color_code=" + mysql.escape(color) + ", " +
                            "bio=" + mysql.escape(bio) + ", " +
                            "birthday=" + mysql.escape(birthday) + ", " +
                            "profile_bg_id=" + mysql.escape(profile_bg_id) + " " +
                            "WHERE user_id=" + mysql.escape(user_id);

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else setBdayGuilds(res, bday_guilds_split, user_id);
                        });
                    } else {
                        if (!isSupporter && (color != '#7289da')) color = '#7289da';

                        // Insert
                        let sql = "INSERT INTO users (user_id,prefix,language_code,color_code,bio,birthday,profile_bg_id) " +
                            "VALUES (" + mysql.escape(user_id) + "," + mysql.escape(prefix) + "," + mysql.escape(language) + "," + mysql.escape(color) + "," + mysql.escape(bio) + "," + mysql.escape(birthday) + "," + mysql.escape(profile_bg_id) + ")";

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else setBdayGuilds(res, bday_guilds_split, user_id);
                        });
                    }
                }
            });
        });
    });

    function setBdayGuilds(res, bday_guilds_split, user_id) {
        // User settings were set. Now the bday guilds will be updated
        // First, delete all
        let sql = "DELETE FROM user_birthday_guilds " +
            "WHERE user_id=" + mysql.escape(user_id);

        mysql.query(sql, function (err, result) {
            if (err) { console.log(err); res.sendStatus(500); }
            else if (bday_guilds_split === '') res.sendStatus(200);
            else {
                // Then add the selected ones
                let counter = 0;
                bday_guilds_split.forEach(bday_guild => {
                    sql = "INSERT INTO user_birthday_guilds (user_id,guild_id) " +
                        "VALUES (" + mysql.escape(user_id) + "," + mysql.escape(bday_guild) + ")"

                    mysql.query(sql, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                        else if (counter == bday_guilds_split.length - 1) res.sendStatus(200);
                        counter++;
                    });
                });
            }
        });
    }

    // Categories
    router.post('/category', (req, res) => {
        const guild_id = req.body.guild_id;
        const category = req.body.category;
        const checked = req.body.checked;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Get category id from database
                var sql = "SELECT *" + " " +
                    "FROM const_categories" + " " +
                    "WHERE name=" + mysql.escape(category);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        if (result.length > 0) {
                            var category_id = result[0].id;
                            // Check if category exists in db (= is disabled)
                            var sql = "SELECT *" + " " +
                                "FROM guild_disabled_categories" + " " +
                                "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                                "AND category_id=" + mysql.escape(category_id);

                            mysql.query(sql, function (err, disabled) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    if (disabled.length > 0) {
                                        // category is disabled
                                        if (checked === 'true') {
                                            // delete
                                            sql = "DELETE" + " " +
                                                "FROM guild_disabled_categories" + " " +
                                                "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                                                "AND category_id=" + mysql.escape(category_id);

                                            mysql.query(sql, function (err, result) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else res.sendStatus(200);
                                            });
                                        } else {
                                            res.sendStatus(200);
                                        }
                                    } else {
                                        // category is enabled
                                        if (checked === 'false') {
                                            // insert
                                            sql = "INSERT INTO guild_disabled_categories (guild_id,category_id)" + " " +
                                                "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(category_id) + ")";

                                            mysql.query(sql, function (err, result) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else res.sendStatus(200);
                                            });
                                        } else {
                                            res.sendStatus(200);
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            } else res.render('404', { req });
        });
    });

    // Plugins
    router.post('/autorole', (req, res) => {
        const guild_id = req.body.guild_id;
        let ar_1_val = req.body.ar_1_val;
        const ar_1_delay = req.body.ar_1_delay;
        let ar_2_val = req.body.ar_2_val;
        const ar_2_delay = req.body.ar_2_delay;
        let ar_3_val = req.body.ar_3_val;
        const ar_3_delay = req.body.ar_3_delay;
        let ar_4_val = req.body.ar_4_val;
        const ar_4_delay = req.body.ar_4_delay;
        let ar_5_val = req.body.ar_5_val;
        const ar_5_delay = req.body.ar_5_delay;
        let ar_6_val = req.body.ar_6_val;
        const ar_6_delay = req.body.ar_6_delay;
        let ar_7_val = req.body.ar_7_val;
        const ar_7_delay = req.body.ar_7_delay;
        let ar_8_val = req.body.ar_8_val;
        const ar_8_delay = req.body.ar_8_delay;
        let ar_9_val = req.body.ar_9_val;
        const ar_9_delay = req.body.ar_9_delay;
        let ar_10_val = req.body.ar_10_val;
        const ar_10_delay = req.body.ar_10_delay;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                if (ar_1_val === '0') ar_1_val = undefined;
                if (ar_2_val === '0') ar_2_val = undefined;
                if (ar_3_val === '0') ar_3_val = undefined;
                if (ar_4_val === '0') ar_4_val = undefined;
                if (ar_5_val === '0') ar_5_val = undefined;
                if (ar_6_val === '0') ar_6_val = undefined;
                if (ar_7_val === '0') ar_7_val = undefined;
                if (ar_8_val === '0') ar_8_val = undefined;
                if (ar_9_val === '0') ar_9_val = undefined;
                if (ar_10_val === '0') ar_10_val = undefined;

                // Check if data is ok
                let valArray = [];
                if (ar_1_val !== undefined) valArray.push(ar_1_val);
                if (ar_2_val !== undefined) valArray.push(ar_2_val);
                if (ar_3_val !== undefined) valArray.push(ar_3_val);
                if (ar_4_val !== undefined) valArray.push(ar_4_val);
                if (ar_5_val !== undefined) valArray.push(ar_5_val);
                if (ar_6_val !== undefined) valArray.push(ar_6_val);
                if (ar_7_val !== undefined) valArray.push(ar_7_val);
                if (ar_8_val !== undefined) valArray.push(ar_8_val);
                if (ar_9_val !== undefined) valArray.push(ar_9_val);
                if (ar_10_val !== undefined) valArray.push(ar_10_val);

                if (hasDuplicates(valArray)) {
                    res.sendStatus(403);
                } else {
                    // Delete all auto role settings
                    let sql = "DELETE FROM guild_autoroles " +
                        "WHERE guild_id=" + mysql.escape(guild_id);

                    mysql.query(sql, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                        else if (ar_1_val !== undefined
                            || ar_2_val !== undefined
                            || ar_3_val !== undefined
                            || ar_4_val !== undefined
                            || ar_5_val !== undefined
                            || ar_6_val !== undefined
                            || ar_7_val !== undefined
                            || ar_8_val !== undefined
                            || ar_9_val !== undefined
                            || ar_10_val !== undefined) {
                            // Insert all available data
                            let sqlArray = []
                            sqlArray.push('INSERT INTO guild_autoroles (guild_id,role_id,delay) VALUES ');

                            if (ar_1_val !== undefined) sqlArray.push("(" + mysql.escape(guild_id) + "," + mysql.escape(ar_1_val) + "," + mysql.escape(ar_1_delay === undefined ? 0 : ar_1_delay) + "), ");
                            if (ar_2_val !== undefined) sqlArray.push("(" + mysql.escape(guild_id) + "," + mysql.escape(ar_2_val) + "," + mysql.escape(ar_2_delay === undefined ? 0 : ar_2_delay) + "), ");
                            if (ar_3_val !== undefined) sqlArray.push("(" + mysql.escape(guild_id) + "," + mysql.escape(ar_3_val) + "," + mysql.escape(ar_3_delay === undefined ? 0 : ar_3_delay) + "), ");
                            if (ar_4_val !== undefined) sqlArray.push("(" + mysql.escape(guild_id) + "," + mysql.escape(ar_4_val) + "," + mysql.escape(ar_4_delay === undefined ? 0 : ar_4_delay) + "), ");
                            if (ar_5_val !== undefined) sqlArray.push("(" + mysql.escape(guild_id) + "," + mysql.escape(ar_5_val) + "," + mysql.escape(ar_5_delay === undefined ? 0 : ar_5_delay) + "), ");
                            if (ar_6_val !== undefined) sqlArray.push("(" + mysql.escape(guild_id) + "," + mysql.escape(ar_6_val) + "," + mysql.escape(ar_6_delay === undefined ? 0 : ar_6_delay) + "), ");
                            if (ar_7_val !== undefined) sqlArray.push("(" + mysql.escape(guild_id) + "," + mysql.escape(ar_7_val) + "," + mysql.escape(ar_7_delay === undefined ? 0 : ar_7_delay) + "), ");
                            if (ar_8_val !== undefined) sqlArray.push("(" + mysql.escape(guild_id) + "," + mysql.escape(ar_8_val) + "," + mysql.escape(ar_8_delay === undefined ? 0 : ar_8_delay) + "), ");
                            if (ar_9_val !== undefined) sqlArray.push("(" + mysql.escape(guild_id) + "," + mysql.escape(ar_9_val) + "," + mysql.escape(ar_9_delay === undefined ? 0 : ar_9_delay) + "), ");
                            if (ar_10_val !== undefined) sqlArray.push("(" + mysql.escape(guild_id) + "," + mysql.escape(ar_10_val) + "," + mysql.escape(ar_10_delay === undefined ? 0 : ar_10_delay) + "), ");

                            sql = sqlArray.join("");
                            sql = sql.substring(0, sql.length - 2);

                            mysql.query(sql, function (err, result) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    res.sendStatus(200);
                                }
                            });
                        } else {
                            res.sendStatus(200);
                        }
                    });
                }
            } else res.render('404', { req });
        });
    });

    router.post('/bestofimage', (req, res) => {
        const guild_id = req.body.guild_id;
        const percentage = req.body.percentage;
        const flat = req.body.flat;
        const tc_id = req.body.tc_id;
        const emoji = req.body.emoji;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Delete entry first
                sql = "DELETE FROM guild_best_of_images " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        // Then insert the new data
                        sql = "INSERT INTO guild_best_of_images (guild_id,tc_id,min_votes_flat,min_votes_percent,emoji) " +
                            "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(tc_id) + "," + mysql.escape(flat) + "," + mysql.escape(percentage) + "," + mysql.escape(emoji) + ")";

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else res.sendStatus(200);
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.post('/bestofquote', (req, res) => {
        const guild_id = req.body.guild_id;
        const percentage = req.body.percentage;
        const flat = req.body.flat;
        const tc_id = req.body.tc_id;
        const emoji = req.body.emoji;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Delete entry first
                sql = "DELETE FROM guild_best_of_quotes " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        // Then insert the new data
                        sql = "INSERT INTO guild_best_of_quotes (guild_id,tc_id,min_votes_flat,min_votes_percent,emoji) " +
                            "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(tc_id) + "," + mysql.escape(flat) + "," + mysql.escape(percentage) + "," + mysql.escape(emoji) + ")";

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else res.sendStatus(200);
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.post('/birthday', (req, res) => {
        const guild_id = req.body.guild_id;
        const servant_bday = req.body.servant_bday;
        const announcement_tc_id = req.body.announcement_tc_id;
        const list_tc_id = req.body.list_tc_id;
        const user_id = req.body.user_id;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                let sql = "SELECT * " +
                    "FROM guild_birthdays " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, birthdays) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        let guild = bot.guilds.cache.get(guild_id);
                        let channel = guild.channels.cache.get(list_tc_id);

                        if (birthdays.length > 0) {
                            let birthday = birthdays[0];
                            if (birthday.list_tc_id == list_tc_id) {
                                // Same channel, do not resend list
                                setBirthdayDb(res, mysql, guild_id, list_tc_id, birthday.list_msg_id, user_id, servant_bday, announcement_tc_id);
                            } else {
                                // Different channel, delete old message and send a new list in the new channel
                                let old_channel = guild.channels.cache.get(birthday.list_tc_id);
                                if (old_channel) {
                                    old_channel.messages.fetch(birthday.list_msg_id).then(old_message => {
                                        old_message.delete().then(old_message => {
                                            channel = guild.channels.cache.get(list_tc_id);
                                            sendBirthdayList(res, channel, mysql, guild, list_tc_id, user_id, servant_bday, announcement_tc_id);
                                        }).catch(err => {
                                            console.log(err);
                                            res.sendStatus(500);
                                        });
                                    }).catch(err => {
                                        if (err.code === Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                                            sendBirthdayList(res, channel, mysql, guild, list_tc_id, user_id, servant_bday, announcement_tc_id);
                                        } else {
                                            console.log(err);
                                            res.sendStatus(500);
                                        }
                                    });
                                } else {
                                    channel = guild.channels.cache.get(list_tc_id);
                                    sendBirthdayList(res, channel, mysql, guild, list_tc_id, user_id, servant_bday, announcement_tc_id);
                                }
                            }
                        } else sendBirthdayList(res, channel, mysql, guild, list_tc_id, user_id, servant_bday, announcement_tc_id);
                    }
                });
            } else res.sendStatus(200);
        });
    });

    function setBirthdayDb(res, mysql, guild_id, list_tc_id, message_id, user_id, servant_bday, announcement_tc_id) {
        // First delete DB entry
        let sql = "DELETE FROM guild_birthdays " +
            "WHERE guild_id=" + mysql.escape(guild_id);

        mysql.query(sql, function (err, result) {
            if (err) { console.log(err); res.sendStatus(500); }
            else {
                // Second insert data
                sql = "INSERT INTO guild_birthdays (guild_id,list_tc_id,list_msg_id,list_author_id,servant_bday,announcement_tc_id) " +
                    "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(list_tc_id) + "," + mysql.escape(message_id) + "," + mysql.escape(user_id) + "," + mysql.escape(getBoolean(servant_bday)) + "," + mysql.escape(announcement_tc_id) + ")";

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else res.sendStatus(200);
                });
            }
        });
    }

    function sendBirthdayList(res, channel, mysql, guild, list_tc_id, user_id, servant_bday, announcement_tc_id) {
        let guild_icon = null;
        if (guild.icon !== null) {
            guild_icon = "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon + ".png";
        }

        getUserColorCode(mysql, user_id, function (colorCode) {
            let embed = new Discord.MessageEmbed()
                .setColor(colorCode)
                .setAuthor(guild.name.endsWith('s') ? guild.name + "' birthdays" : guild.name + "'s birthdays", guild_icon, null)
                .setDescription("Add your birthday in the [dashboard](https://servant.gg/dashboard)!")
                .setFooter("As of", "https://i.imgur.com/PA3Xzgu.png")
                .setTimestamp(new Date());

            // Map: [user_id, birthday_countdown]
            getBirthdays(mysql, guild.id, servant_bday).then(birthdays => {
                getBirthdayCountdowns(birthdays, function (birthday_countdowns) {
                    if (birthday_countdowns.size == 0) {
                        embed.addField(".", "No birthdays were set.", false);
                    } else {
                        birthday_countdowns = sortMapByValue(birthday_countdowns);
                        let content_total_length = 0;

                        let content = "```c\n" +
                            "Countdown   Date       Name\n" +
                            "----------- ---------- ----------------\n";

                        for (let entry of birthday_countdowns.entries()) {
                            let key = entry[0];
                            let value = entry[1];

                            if (content.length >= 1024 - 57 - 3) {
                                content_total_length += content.length;
                                if (content_total_length > 6000) break;
                                else {
                                    embed.addField(".", content, false);
                                    content = '```c\n';
                                }
                            }

                            content +=
                                "in " + indentDays(value) + " " + (value == 1 ? "day " : "days") + " " + birthdays.get(key) + " " + bot.users.cache.get(key).username + "\n";
                        }

                        content +=
                            "```";

                        content_total_length += content.length;

                        if (content_total_length <= 6000) embed.addField(".", content, false);
                    }

                    if (channel) {
                        channel.send(embed).then(message => {
                            setBirthdayDb(res, mysql, guild.id, list_tc_id, message.id, user_id, servant_bday, announcement_tc_id);
                        }).catch(err => {
                            console.log(err);
                            res.sendStatus(500);
                        });
                    } else setBirthdayDb(res, mysql, guild.id, list_tc_id, 0, user_id, servant_bday, announcement_tc_id);
                });
            }).catch(console.error);
        });
    }

    function getUserColorCode(mysql, userId, callback) {
        let sql = "SELECT color_code " +
            "FROM users " +
            "WHERE user_id=" + mysql.escape(userId);

        let colorCode = '#7289DA';

        mysql.query(sql, function (err, users) {
            if (!err) {
                let tmpColorCode = users[0].color_code;
                if (tmpColorCode != '') colorCode = tmpColorCode;
            }

            callback(colorCode);
        });
    }


    function sortMapByValue(map) {
        let a = [];

        for (let x of map)
            a.push(x)

        a.sort((x, y) => (x[1] > y[1]) ? 1 : ((y[1] > x[1]) ? -1 : 0))

        return new Map(a);
    }

    function indentDays(days) {
        let str = days + '';
        let length = str.length;
        if (length === 3) return str;
        else if (length === 2) return ' ' + str;
        else if (length === 1) return '  ' + str;
        else return '   ';
    }

    async function getBirthdays(mysql, guild_id, servant_bday) {
        let sql = "SELECT user_id " +
            "FROM user_birthday_guilds " +
            "WHERE guild_id=" + mysql.escape(guild_id);

        let allowed_bday_user_ids = await mysql.query(sql);
        allowed_bday_user_ids.pop();

        let birthdays = new Map();

        if (getBoolean(servant_bday)) {
            birthdays.set(bot.user.id, "2018-04-06")
        }

        if (allowed_bday_user_ids.length > 0) {
            if (allowed_bday_user_ids[0].length != 0)
                for (const i in allowed_bday_user_ids) {
                    if (allowed_bday_user_ids.hasOwnProperty(i)) {
                        const user_ids = allowed_bday_user_ids[i];
                        const user_id = user_ids[0].user_id;

                        sql = "SELECT birthday " +
                            "FROM users " +
                            "WHERE user_id=" + mysql.escape(user_id);

                        let users = await mysql.query(sql);
                        users.pop();

                        if (users.length > 0) {
                            if (users[0].length != 0) {
                                let user_row = users[0];
                                const birthday = user_row[0].birthday;
                                birthdays.set(user_id, birthday);
                            }
                        }
                    }
                }
        }

        return Promise.resolve(birthdays);
    }


    function getBirthdayCountdowns(birthdays, callback) {
        let birthday_countdowns = new Map();

        if (birthdays) {
            if (birthdays.size > 0) {
                for (let entry of birthdays.entries()) {
                    let key = entry[0];
                    let value = entry[1];

                    let bday = new Date().getFullYear() + value.substring(4, value.lenth);
                    let moment_bday = moment(bday, "YYYY-MM-DD");

                    if (moment_bday.fromNow().endsWith('ago')) {
                        moment_bday.add(1, 'years');
                    }

                    let diff = moment_bday.diff(moment(), 'days') + 1;
                    if (diff == 365) diff = 0;

                    birthday_countdowns.set(key, diff);
                }
            }
        }

        return callback(new Map([...birthday_countdowns.entries()].sort((a, b) => a.value - b.value)));
    }

    router.post('/customcommands_normal', (req, res) => {
        const guild_id = req.body.guild_id;
        const invoke = req.body.invoke;
        const message = req.body.message;

        if (invoke.length > 100)
            invoke = invoke.substring(0, 100);

        if (message.length > 2000)
            message = message.substring(0, 2000);

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Check if < 100 commands
                let sql = "SELECT id " +
                    "FROM custom_commands " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, custom_commands) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else if (custom_commands.length >= 100) res.sendStatus(403);
                    else {
                        sql = "SELECT id " +
                            "FROM custom_commands " +
                            "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                            "AND invoke=" + mysql.escape(invoke);

                        mysql.query(sql, function (err, invokes) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else if (invokes.length > 0) res.sendStatus(406);
                            else {
                                // Insert new command
                                sql = "INSERT INTO custom_commands (guild_id,invoke,normal_msg) " +
                                    "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(invoke) + "," + mysql.escape(message) + ")";

                                mysql.query(sql, function (err, result) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else res.sendStatus(200);
                                });
                            }
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.post('/customcommands_embed', (req, res) => {
        const guild_id = req.body.guild_id;
        const invoke = req.body.invoke;

        const color = req.body.color;
        const author_icon = req.body.author_icon;
        const author_name = req.body.author_name;
        const author_link = req.body.author_link;
        const thumbnail = req.body.thumbnail;
        const title = req.body.title;
        const title_link = req.body.title_link;
        const description = req.body.description;

        const field_titles = req.body.field_titles;
        const field_descriptions = req.body.field_descriptions;
        const field_inlines = req.body.field_inlines;

        let field_titles_split = field_titles == undefined ? undefined : field_titles.split("$€%¥");
        let field_descriptions_split = field_descriptions == undefined ? undefined : field_descriptions.split("$€%¥");
        let field_inlines_split = field_inlines == undefined ? undefined : field_inlines.split("$€%¥");

        field_titles_split = field_titles_split == '' ? undefined : field_titles_split;
        field_descriptions_split = field_descriptions_split == '' ? undefined : field_descriptions_split;
        field_inlines_split = field_inlines_split == '' ? undefined : field_inlines_split;

        const image = req.body.image;
        const footer_icon = req.body.footer_icon;
        const footer_text = req.body.footer_text;
        const timestamp = req.body.timestamp;

        if (invoke.length > 100)
            invoke = invoke.substring(0, 100);

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Check if < 100 commands
                let sql = "SELECT id " +
                    "FROM custom_commands " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, custom_commands) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else if (custom_commands.length >= 100) res.sendStatus(403);
                    else {
                        sql = "SELECT id " +
                            "FROM custom_commands " +
                            "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                            "AND invoke=" + mysql.escape(invoke);

                        mysql.query(sql, function (err, invokes) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else if (invokes.length > 0) res.sendStatus(406);
                            else {
                                // Insert new command
                                sql = "INSERT INTO custom_commands (guild_id,invoke,normal_msg) " +
                                    "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(invoke) + ",'')";

                                mysql.query(sql, function (err, result) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else {
                                        sql = "SELECT t.timezone " +
                                            "FROM guilds AS g " +
                                            "INNER JOIN const_timezones AS t " +
                                            "ON g.timezone_id=t.id " +
                                            "WHERE g.guild_id=" + mysql.escape(guild_id);

                                        mysql.query(sql, function (err, timezones) {
                                            if (err) { console.log(err); res.sendStatus(500); }
                                            else {
                                                let timezone = timezones.length > 0 ? timezones[0].timezone : 'UTC';
                                                let timestamp_tz = moment.tz(timestamp, timezone);
                                                let timestamp_utc = timestamp_tz.clone().tz('UTC');
                                                timestamp_utc = timestamp == undefined ? "" : timestamp_utc;

                                                const cc_id = result.insertId;

                                                sql = "INSERT INTO custom_commands_embeds (cc_id,colorcode,author_name,author_url,author_icon_url,title,title_url,thumbnail_url,description,image_url,footer,footer_icon_url,timestamp) " +
                                                    "VALUES (" + mysql.escape(cc_id) + "," + mysql.escape(color) + "," + mysql.escape(getBlank(author_name)) + "," + mysql.escape(getBlank(author_link)) + "," + mysql.escape(getBlank(author_icon)) + "," + mysql.escape(getBlank(title)) + "," + mysql.escape(getBlank(title_link)) + "," + mysql.escape(getBlank(thumbnail)) + "," + mysql.escape(getBlank(description)) + "," + mysql.escape(getBlank(image)) + "," + mysql.escape(getBlank(footer_text)) + "," + mysql.escape(getBlank(footer_icon)) + "," + mysql.escape(timestamp_utc ? timestamp_utc.format() : "") + ")";

                                                mysql.query(sql, function (err, result) {
                                                    if (err) { console.log(err); purgeCustomCommand(res, mysql, cc_id); }
                                                    else addCcFields(res, mysql, cc_id, field_titles_split, field_descriptions_split, field_inlines_split);
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

    async function addCcFields(res, mysql, cc_id, field_titles_split, field_descriptions_split, field_inlines_split) {
        if (field_titles_split) {
            let i = 0;
            for (const field_title in field_titles_split) {
                sql = "INSERT INTO custom_commands_fields (cc_id,field_no,title,description,inline) " +
                    "VALUES (" + mysql.escape(cc_id) + "," + mysql.escape(i + 1) + "," + mysql.escape(field_titles_split[i]) + "," + mysql.escape(field_descriptions_split[i]) + "," + mysql.escape(field_inlines_split[i] == 'inline') + ");"

                await mysql.query(sql);
                i++;
            }
        }

        res.sendStatus(200);
    }

    function purgeCustomCommand(res, mysql, cc_id) {
        let sql = "DELETE FROM custom_commands " +
            "WHERE id=" + mysql.escape(cc_id);

        mysql.query(sql, function (err, result) {
            if (err) { console.log(err); res.sendStatus(500); }
            else {
                sql = "DELETE FROM custom_commands_embeds " +
                    "WHERE cc_id=" + mysql.escape(cc_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        sql = "DELETE FROM custom_commands_fields " +
                            "WHERE cc_id=" + mysql.escape(cc_id);

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else res.sendStatus(500);
                        });
                    }
                });
            }
        });
    }

    router.post('/customcommands_normal_edit', (req, res) => {
        const guild_id = req.body.guild_id;
        const invoke_old = req.body.invoke_old;
        const invoke_new = req.body.invoke_new;
        const message = req.body.message;

        if (invoke_new.length > 100)
            invoke_new = invoke_new.substring(0, 100);

        if (message.length > 2000)
            message = message.substring(0, 2000);

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                checkInvokeUsage(guild_id, mysql, invoke_old, invoke_new, function (invokeUsed) {
                    if (invokeUsed) res.sendStatus(406)
                    else {
                        // Update CC
                        let sql = "UPDATE custom_commands " +
                            "SET invoke=" + mysql.escape(invoke_new) + ", normal_msg=" + mysql.escape(message) + " " +
                            "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                            "AND invoke=" + mysql.escape(invoke_old);

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else {
                                // Get ccId
                                sql = "SELECT id " +
                                    "FROM custom_commands " +
                                    "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                                    "AND invoke=" + mysql.escape(invoke_new);

                                mysql.query(sql, function (err, ids) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else if (ids.length <= 0) res.sendStatus(500);
                                        else {
                                            let ccId = ids[0].id;

                                            // Delete Embeds
                                            sql = "DELETE FROM custom_commands_embeds " +
                                                "WHERE cc_id=" + mysql.escape(ccId);

                                            mysql.query(sql, function (err, result) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else {
                                                    // Delete Fields
                                                    sql = "DELETE FROM custom_commands_fields " +
                                                        "WHERE cc_id=" + mysql.escape(ccId);

                                                    mysql.query(sql, function (err, result) {
                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                        else res.sendStatus(200);
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.post('/customcommands_embed_edit', (req, res) => {
        const guild_id = req.body.guild_id;
        const invoke_old = req.body.invoke_old;
        const invoke_new = req.body.invoke_new;

        const color = req.body.color;
        const author_icon = req.body.author_icon;
        const author_name = req.body.author_name;
        const author_link = req.body.author_link;
        const thumbnail = req.body.thumbnail;
        const title = req.body.title;
        const title_link = req.body.title_link;
        const description = req.body.description;

        const field_titles = req.body.field_titles;
        const field_descriptions = req.body.field_descriptions;
        const field_inlines = req.body.field_inlines;

        let field_titles_split = field_titles == undefined ? undefined : field_titles.split("$€%¥");
        let field_descriptions_split = field_descriptions == undefined ? undefined : field_descriptions.split("$€%¥");
        let field_inlines_split = field_inlines == undefined ? undefined : field_inlines.split("$€%¥");

        field_titles_split = field_titles_split == '' ? undefined : field_titles_split;
        field_descriptions_split = field_descriptions_split == '' ? undefined : field_descriptions_split;
        field_inlines_split = field_inlines_split == '' ? undefined : field_inlines_split;

        const image = req.body.image;
        const footer_icon = req.body.footer_icon;
        const footer_text = req.body.footer_text;
        const timestamp = req.body.timestamp;

        if (invoke_new.length > 100)
            invoke_new = invoke_new.substring(0, 100);

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                checkInvokeUsage(guild_id, mysql, invoke_old, invoke_new, function (invokeUsed) {
                    if (invokeUsed) res.sendStatus(406)
                    else {
                        // Update CC
                        let sql = "UPDATE custom_commands " +
                            "SET invoke=" + mysql.escape(invoke_new) + ", normal_msg='' " +
                            "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                            "AND invoke=" + mysql.escape(invoke_old);

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else {
                                // Get ccId
                                sql = "SELECT id " +
                                    "FROM custom_commands " +
                                    "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                                    "AND invoke=" + mysql.escape(invoke_new);

                                mysql.query(sql, function (err, ids) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else if (ids.length <= 0) res.sendStatus(500);
                                    else {
                                        let ccId = ids[0].id;

                                        // Check if there is an entry in custom_commands_embeds to update, otherwise insert it (this happens if you update a cc from normal to embed message)
                                        sql = "SELECT id " +
                                            "FROM custom_commands_embeds " +
                                            "WHERE cc_id=" + mysql.escape(ccId);

                                        mysql.query(sql, function (err, result) {
                                            if (err) { console.log(err); res.sendStatus(500); }
                                            else {
                                                let hasEntry = result.length > 0;

                                                if (hasEntry) {
                                                    sql = "SELECT t.timezone " +
                                                        "FROM guilds AS g " +
                                                        "INNER JOIN const_timezones AS t " +
                                                        "ON g.timezone_id=t.id " +
                                                        "WHERE g.guild_id=" + mysql.escape(guild_id);

                                                    mysql.query(sql, function (err, timezones) {
                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                        else {
                                                            let timezone = timezones.length > 0 ? timezones[0].timezone : 'UTC';
                                                            let timestamp_tz = moment.tz(timestamp, timezone);
                                                            let timestamp_utc = timestamp_tz.clone().tz('UTC');
                                                            timestamp_utc = timestamp == undefined ? "" : timestamp_utc;

                                                            // Update CC Embeds
                                                            sql = "UPDATE custom_commands_embeds " +
                                                                "SET colorcode=" + mysql.escape(color) + ", author_name=" + mysql.escape(author_name) + ", author_url=" + mysql.escape(author_link) + ", author_icon_url=" + mysql.escape(author_icon) + ", title=" + mysql.escape(title) + ", title_url=" + mysql.escape(title_link) + ", thumbnail_url=" + mysql.escape(thumbnail) + ", description=" + mysql.escape(description) + ", image_url=" + mysql.escape(image) + ", footer=" + mysql.escape(footer_text) + ", footer_icon_url=" + mysql.escape(footer_icon) + ", timestamp=" + mysql.escape(timestamp_utc ? timestamp_utc.format() : "") + " " +
                                                                "WHERE cc_id=" + mysql.escape(ccId);

                                                            mysql.query(sql, function (err, result) {
                                                                if (err) { console.log(err); res.sendStatus(500); }
                                                                else {
                                                                    // To update the fields, we will just delete all and insert them new
                                                                    // Delete fields
                                                                    sql = "DELETE FROM custom_commands_fields " +
                                                                        "WHERE cc_id=" + mysql.escape(ccId);

                                                                    mysql.query(sql, function (err, result) {
                                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                                        else {
                                                                            // Insert new fields
                                                                            addCcFields(res, mysql, ccId, field_titles_split, field_descriptions_split, field_inlines_split);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    sql = "SELECT t.timezone " +
                                                        "FROM guilds AS g " +
                                                        "INNER JOIN const_timezones AS t " +
                                                        "ON g.timezone_id=t.id " +
                                                        "WHERE g.guild_id=" + mysql.escape(guild_id);

                                                    mysql.query(sql, function (err, timezones) {
                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                        else {
                                                            let timezone = timezones.length > 0 ? timezones[0].timezone : 'UTC';
                                                            let timestamp_tz = moment.tz(timestamp, timezone);
                                                            let timestamp_utc = timestamp_tz.clone().tz('UTC');
                                                            timestamp_utc = timestamp == undefined ? "" : timestamp_utc;

                                                            // Insert CC Embeds
                                                            sql = "INSERT INTO custom_commands_embeds (cc_id,colorcode,author_name,author_url,author_icon_url,title,title_url,thumbnail_url,description,image_url,footer,footer_icon_url,timestamp) " +
                                                                "VALUES (" + mysql.escape(ccId) + "," + mysql.escape(color) + "," + mysql.escape(getBlank(author_name)) + "," + mysql.escape(getBlank(author_link)) + "," + mysql.escape(getBlank(author_icon)) + "," + mysql.escape(getBlank(title)) + "," + mysql.escape(getBlank(title_link)) + "," + mysql.escape(getBlank(thumbnail)) + "," + mysql.escape(getBlank(description)) + "," + mysql.escape(getBlank(image)) + "," + mysql.escape(getBlank(footer_text)) + "," + mysql.escape(getBlank(footer_icon)) + "," + mysql.escape(timestamp_utc ? timestamp_utc.format() : "") + ")";

                                                            mysql.query(sql, function (err, result) {
                                                                if (err) { console.log(err); res.sendStatus(500); }
                                                                else {
                                                                    // To update the fields, we will just delete all and insert them new
                                                                    // Delete fields
                                                                    sql = "DELETE FROM custom_commands_fields " +
                                                                        "WHERE cc_id=" + mysql.escape(ccId);

                                                                    mysql.query(sql, function (err, result) {
                                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                                        else {
                                                                            // Insert new fields
                                                                            addCcFields(res, mysql, ccId, field_titles_split, field_descriptions_split, field_inlines_split);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
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

    router.post('/delete_customcommand', (req, res) => {
        const guild_id = req.body.guild_id;
        const invoke = req.body.invoke;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                let sql = "SELECT id " +
                    "FROM custom_commands " +
                    "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                    "AND invoke=" + mysql.escape(invoke);

                mysql.query(sql, function (err, ids) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        if (ids.length > 0) {
                            const id = ids[0].id;

                            sql = "DELETE FROM custom_commands " +
                                "WHERE id=" + mysql.escape(id);

                            mysql.query(sql, function (err, result) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "DELETE FROM custom_commands_embeds " +
                                        "WHERE cc_id=" + mysql.escape(id);

                                    mysql.query(sql, function (err, result) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            sql = "DELETE FROM custom_commands_fields " +
                                                "WHERE cc_id=" + mysql.escape(id);

                                            mysql.query(sql, function (err, result) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else res.sendStatus(200);
                                            });
                                        }
                                    });
                                }
                            });
                        } else res.sendStatus(500);
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.post('/embed', (req, res) => {
        const guild_id = req.body.guild_id;

        let botGuild = bot.guilds.cache.get(guild_id);

        const tc_id = req.body.tc_id;

        const color = req.body.color;

        const author_icon = req.body.author_icon;
        const author_name = req.body.author_name;
        const author_link = req.body.author_link;
        const thumbnail = req.body.thumbnail;
        const title = req.body.title;
        const title_link = req.body.title_link;
        const description = req.body.description;

        const field_titles = req.body.field_titles;
        const field_descriptions = req.body.field_descriptions;
        const field_inlines = req.body.field_inlines;

        let field_titles_split = field_titles == undefined ? undefined : field_titles.split("$€%¥");
        let field_descriptions_split = field_descriptions == undefined ? undefined : field_descriptions.split("$€%¥");
        let field_inlines_split = field_inlines == undefined ? undefined : field_inlines.split("$€%¥");

        if (field_titles_split != undefined) field_titles_split = field_titles_split == "" ? undefined : field_titles_split;
        if (field_descriptions_split != undefined) field_descriptions_split = field_descriptions_split == "" ? undefined : field_descriptions_split;
        if (field_inlines_split != undefined) field_inlines_split = field_inlines_split == "" ? undefined : field_inlines_split;

        const image = req.body.image;
        const footer_icon = req.body.footer_icon;
        const footer_text = req.body.footer_text;
        const timestamp = req.body.timestamp;

        isSupporter(req, bot, function (isSupporter) {
            get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
                if (is_authorized) {
                    let embed = new Discord.MessageEmbed()
                        .setColor(isSupporter ? color : "#7289da");

                    if (author_name != undefined) {
                        embed.setAuthor(author_name, author_icon == undefined ? null : author_icon, author_link == undefined ? null : author_link);
                    }

                    if (title != undefined) {
                        embed.setTitle(title);
                    }

                    if (title_link != undefined) {
                        embed.setURL(title_link);
                    }

                    if (thumbnail != undefined) {
                        embed.setThumbnail(thumbnail);
                    }

                    if (description != undefined) {
                        embed.setDescription(description);
                    }

                    if (field_titles_split != undefined && field_descriptions_split != undefined && field_inlines_split != undefined) {
                        for (let i = 0; i < field_titles_split.length; i++) {
                            const title = field_titles_split[i];
                            const description = field_descriptions_split[i];
                            const inline = field_inlines_split[i] == 'inline';

                            if (title != 'undefined' && description != 'undefined') {
                                embed.addField(title, description, inline);
                            }
                        }
                    }

                    if (image != undefined) {
                        embed.setImage(image);
                    }

                    if (footer_text != undefined) {
                        embed.setFooter(footer_text, footer_icon == undefined ? null : footer_icon);
                    }

                    if (timestamp != undefined) {
                        embed.setTimestamp(timestamp);
                    }

                    let tc = botGuild.channels.cache.get(tc_id);
                    if (tc !== undefined) {
                        tc.send(embed)
                            .then(() => res.sendStatus(200))
                            .catch(() => res.sendStatus(406));
                    } else res.sendStatus(403);
                } else res.render('404', { req });
            });
        });
    });

    router.post('/join', (req, res) => {
        const guild_id = req.body.guild_id;
        const join_msg = req.body.join_msg;
        const tc_id = req.body.tc_id;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Delete entry first
                sql = "DELETE FROM guild_joins " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        // Then insert the new data
                        sql = "INSERT INTO guild_joins (guild_id,tc_id,msg) " +
                            "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(tc_id) + "," + mysql.escape(join_msg) + ")";

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else res.sendStatus(200);
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.post('/leave', (req, res) => {
        const guild_id = req.body.guild_id;
        const leave_msg = req.body.leave_msg;
        const tc_id = req.body.tc_id;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Delete entry first
                sql = "DELETE FROM guild_leaves " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        // Then insert the new data
                        sql = "INSERT INTO guild_leaves (guild_id,tc_id,msg) " +
                            "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(tc_id) + "," + mysql.escape(leave_msg) + ")";

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else res.sendStatus(200);
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.post('/level', (req, res) => {
        const guild_id = req.body.guild_id;
        const notification = req.body.notification;
        const modifier = req.body.modifier;

        const levels = req.body.levels;
        const role_ids = req.body.role_ids;

        let levels_split = levels == undefined ? undefined : levels.split("$€%¥");
        let role_ids_split = role_ids == undefined ? undefined : role_ids.split("$€%¥");

        if (levels_split.length < 1) levels_split = undefined;
        else if (!levels_split[0]) levels_split = undefined;

        if (role_ids_split.length < 1) role_ids_split = undefined;
        else if (!role_ids_split[0]) role_ids_split = undefined;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // First, we will delete all current settings
                let sql = "DELETE FROM guild_level " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        sql = "DELETE FROM guild_level_roles " +
                            "WHERE guild_id=" + mysql.escape(guild_id);

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else {
                                // Second, we will enter the new data
                                sql = "INSERT INTO guild_level (guild_id,modifier,notification) " +
                                    "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(modifier) + "," + mysql.escape(getBoolean(notification)) + ")";

                                mysql.query(sql, function (err, result) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else if (levels_split != undefined && role_ids_split != undefined) {
                                        submit_level_roles(levels_split, role_ids_split, guild_id)
                                            .then(res.sendStatus(200))
                                            .catch(console.error)
                                    } else res.sendStatus(200);
                                });
                            }
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    async function submit_level_roles(levels_split, role_ids_split, guild_id) {
        let i = 0;
        for (const level of levels_split) {
            let role_id_string = role_ids_split[i] + '';
            let role_ids = role_id_string.split("|");

            for (const role_id of role_ids) {
                sql = "INSERT INTO guild_level_roles (guild_id,level,role_id) " +
                    "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(level) + "," + mysql.escape(role_id) + ")";

                await mysql.query(sql);
            };

            i++;
        };;
    }

    router.post('/livestream', (req, res) => {
        const guild_id = req.body.guild_id;
        const public_mode = req.body.public_mode;
        const streamer_roles = req.body.streamer_roles;
        const live_role = req.body.live_role;
        const livestream_ping_role = req.body.livestream_ping_role;
        const tc = req.body.tc;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // First delete all
                let sql = "DELETE FROM guild_livestreams " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        sql = "DELETE FROM guild_livestreamers " +
                            "WHERE guild_id=" + mysql.escape(guild_id);

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else {
                                // Second insert data
                                sql = "INSERT INTO guild_livestreams (guild_id,is_public,role_id,tc_id,ping_role_id) " +
                                    "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(getBoolean(public_mode)) + "," + mysql.escape(live_role) + "," + mysql.escape(tc) + "," + mysql.escape(livestream_ping_role) + ")";

                                mysql.query(sql, function (err, result) {
                                    if (err) { console.log(err); res.sendStatus(500); }
                                    else if (streamer_roles) {
                                        submit_livestream_roles(guild_id, streamer_roles)
                                            .then(res.sendStatus(200))
                                            .catch(console.error)
                                    } else res.sendStatus(200);
                                });
                            }
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    async function submit_livestream_roles(guild_id, streamer_roles) {
        let streamer_roles_split = streamer_roles.split('|');

        for (const role_id of streamer_roles_split) {
            let sql = "INSERT INTO guild_livestreamers (guild_id,role_id) " +
                "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(role_id) + ")";

            await mysql.query(sql);
        }
    }

    router.post('/log', (req, res) => {
        const guild_id = req.body.guild_id;
        const tc_id = req.body.tc_id;
        const msg_update = req.body.msg_update;
        const msg_delete = req.body.msg_delete;
        const category_create = req.body.category_create;
        const category_delete = req.body.category_delete;
        const vc_create = req.body.vc_create;
        const vc_delete = req.body.vc_delete;
        const vc_join = req.body.vc_join;
        const vc_move = req.body.vc_move;
        const vc_leave = req.body.vc_leave;
        const tc_create = req.body.tc_create;
        const tc_delete = req.body.tc_delete;
        const user_ban = req.body.user_ban;
        const user_unban = req.body.user_unban;
        const invite_create = req.body.invite_create;
        const invite_delete = req.body.invite_delete;
        const user_join = req.body.user_join;
        const user_leave = req.body.user_leave;
        const role_add = req.body.role_add;
        const role_remove = req.body.role_remove;
        const role_create = req.body.role_create;
        const role_delete = req.body.role_delete;
        const emote_add = req.body.emote_add;
        const emote_remove = req.body.emote_remove;
        const boost_count = req.body.boost_count;
        const boost_tier = req.body.boost_tier;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Delete entry first
                sql = "DELETE FROM guild_logs " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        // Then insert the new data
                        sql = "INSERT INTO guild_logs (guild_id,tc_id,msg_update,msg_delete,category_create,category_delete,tc_create,tc_delete,vc_create,vc_move,vc_delete,vc_join,vc_leave,user_ban,user_unban,invite_create,invite_delete,user_join,user_leave,role_add,role_remove,role_create,role_delete,emote_add,emote_remove,boost_count,boost_tier) " +
                            "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(tc_id) + "," +
                            mysql.escape(getBoolean(msg_update)) + "," +
                            mysql.escape(getBoolean(msg_delete)) + "," +
                            mysql.escape(getBoolean(category_create)) + "," +
                            mysql.escape(getBoolean(category_delete)) + "," +
                            mysql.escape(getBoolean(tc_create)) + "," +
                            mysql.escape(getBoolean(tc_delete)) + "," +
                            mysql.escape(getBoolean(vc_create)) + "," +
                            mysql.escape(getBoolean(vc_delete)) + "," +
                            mysql.escape(getBoolean(vc_join)) + "," +
                            mysql.escape(getBoolean(vc_move)) + "," +
                            mysql.escape(getBoolean(vc_leave)) + "," +
                            mysql.escape(getBoolean(user_ban)) + "," +
                            mysql.escape(getBoolean(user_unban)) + "," +
                            mysql.escape(getBoolean(invite_create)) + "," +
                            mysql.escape(getBoolean(invite_delete)) + "," +
                            mysql.escape(getBoolean(user_join)) + "," +
                            mysql.escape(getBoolean(user_leave)) + "," +
                            mysql.escape(getBoolean(role_add)) + "," +
                            mysql.escape(getBoolean(role_remove)) + "," +
                            mysql.escape(getBoolean(role_create)) + "," +
                            mysql.escape(getBoolean(role_delete)) + "," +
                            mysql.escape(getBoolean(emote_add)) + "," +
                            mysql.escape(getBoolean(emote_remove)) + "," +
                            mysql.escape(getBoolean(boost_count)) + "," +
                            mysql.escape(getBoolean(boost_tier)) + ")";

                        mysql.query(sql, function (err, result) {
                            if (err) { console.log(err); res.sendStatus(500); }
                            else res.sendStatus(200);
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    router.post('/mediaonlychannel', (req, res) => {
        const guild_id = req.body.guild_id;
        const moc_warning = req.body.moc_warning;
        const moc = req.body.moc;
        let moc_split = moc === '' ? '' : moc.split('|');

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // First, delete all
                let sql = "DELETE FROM guild_media_only_channels " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else if (moc_split === '') handle_moc_warning(res, moc_warning, guild_id);
                    else {
                        // Then add the selected ones
                        let counter = 0;
                        moc_split.forEach(moc_entry => {
                            sql = "INSERT INTO guild_media_only_channels (guild_id,tc_id) " +
                                "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(moc_entry) + ")";

                            mysql.query(sql, function (err, result) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else if (counter == moc_split.length - 1) handle_moc_warning(res, moc_warning, guild_id);
                                counter++;
                            });
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    function handle_moc_warning(res, moc_warning, guild_id) {
        // Delete disabled feature if exists
        let sql = "SELECT * " +
            "FROM guild_disabled_features " +
            "WHERE guild_id=" + mysql.escape(guild_id) + " " +
            "AND feature_id=" + mysql.escape(5);

        mysql.query(sql, function (err, disabled_features) {
            if (err) { console.log(err); res.sendStatus(500); }
            else {
                let is_disabled = disabled_features[0] != undefined;
                if (is_disabled && getBoolean(moc_warning)) {
                    // delete
                    sql = "DELETE FROM guild_disabled_features " +
                        "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                        "AND feature_id=" + mysql.escape(5);
                } else if (!is_disabled && !getBoolean(moc_warning)) {
                    // insert
                    sql = "INSERT INTO guild_disabled_features (guild_id,feature_id) " +
                        "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(5) + ")";
                } else res.sendStatus(200);

                if (!sql.startsWith("SELECT")) {
                    mysql.query(sql, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                        else res.sendStatus(200)
                    });
                }
            }
        });
    }

    router.post('/reactionrole_create', (req, res) => {
        const guild_id = req.body.guild_id;
        let botGuild = bot.guilds.cache.get(guild_id);

        const tc_id = req.body.tc_id;

        const color = req.body.color;

        const author_icon = req.body.author_icon;
        const author_name = req.body.author_name;
        const author_link = req.body.author_link;
        const thumbnail = req.body.thumbnail;
        const title = req.body.title;
        const title_link = req.body.title_link;
        const description = req.body.description;

        const field_titles = req.body.field_titles;
        const field_descriptions = req.body.field_descriptions;
        const field_inlines = req.body.field_inlines;

        let field_titles_split = field_titles == undefined ? undefined : field_titles.split("$€%¥");
        let field_descriptions_split = field_descriptions == undefined ? undefined : field_descriptions.split("$€%¥");
        let field_inlines_split = field_inlines == undefined ? undefined : field_inlines.split("$€%¥");

        field_titles_split = field_titles_split == '' ? undefined : field_titles_split;
        field_descriptions_split = field_descriptions_split == '' ? undefined : field_descriptions_split;
        field_inlines_split = field_inlines_split == '' ? undefined : field_inlines_split;

        const image = req.body.image;
        const footer_icon = req.body.footer_icon;
        const footer_text = req.body.footer_text;
        const timestamp = req.body.timestamp;

        const emojis = req.body.emojis;
        const roles = req.body.roles;

        isSupporter(req, bot, function (isSupporter) {
            get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
                if (is_authorized) {
                    let sql = "SELECT t.timezone " +
                        "FROM guilds AS g " +
                        "INNER JOIN const_timezones AS t " +
                        "ON g.timezone_id=t.id " +
                        "WHERE g.guild_id=" + mysql.escape(guild_id);

                    mysql.query(sql, function (err, timezones) {
                        if (err) { console.log(err); res.sendStatus(500); }
                        else {
                            let timezone = timezones.length > 0 ? timezones[0].timezone : 'UTC';
                            let timestamp_tz = moment.tz(timestamp, timezone);
                            let timestamp_utc = timestamp_tz.clone().tz('UTC');
                            timestamp_utc = timestamp == undefined ? "" : timestamp_utc;

                            let embed = new Discord.MessageEmbed()
                                .setColor(isSupporter ? color : "#7289da");

                            if (author_name != undefined) {
                                embed.setAuthor(author_name, author_icon == undefined ? null : author_icon, author_link == undefined ? null : author_link);
                            }

                            if (title != undefined) {
                                embed.setTitle(title);
                            }

                            if (title_link != undefined) {
                                embed.setURL(title_link);
                            }

                            if (thumbnail != undefined) {
                                embed.setThumbnail(thumbnail);
                            }

                            if (description != undefined) {
                                embed.setDescription(description);
                            }

                            if (field_titles_split != undefined && field_descriptions_split != undefined && field_inlines_split != undefined) {
                                for (let i = 0; i < field_titles_split.length; i++) {
                                    const title = field_titles_split[i];
                                    const description = field_descriptions_split[i];
                                    const inline = field_inlines_split[i] == 'inline';

                                    if (title != 'undefined' && description != 'undefined') {
                                        embed.addField(title, description, inline);
                                    }
                                }
                            }

                            if (image != undefined) {
                                embed.setImage(image);
                            }

                            if (footer_text != undefined) {
                                embed.setFooter(footer_text, footer_icon == undefined ? null : footer_icon);
                            }

                            if (timestamp != undefined) {
                                embed.setTimestamp(timestamp);
                            }

                            if (emojis != undefined && roles != undefined) {
                                let tc = botGuild.channels.cache.get(tc_id);
                                if (tc !== undefined) {
                                    tc.send(embed).then(message => {
                                        let emojis_split = emojis.split("$€%¥");
                                        emojis_split.forEach(emoji => {
                                            if (emoji != "") {
                                                message.react(emoji).catch(console.error);
                                            }
                                        });

                                        // DB
                                        let sql = "INSERT INTO reaction_role_messages (guild_id,tc_id,msg_id,colorcode,author_name,author_url,author_icon_url,title,title_url,thumbnail_url,description,image_url,footer,footer_icon_url,timestamp) " +
                                            "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(tc_id) + "," + mysql.escape(message.id) + "," + mysql.escape(color) + "," + mysql.escape(getBlank(author_name)) + "," + mysql.escape(getBlank(author_link)) + "," + mysql.escape(getBlank(author_icon)) + "," + mysql.escape(getBlank(title)) + "," + mysql.escape(getBlank(title_link)) + "," + mysql.escape(getBlank(thumbnail)) + "," + mysql.escape(getBlank(description)) + "," + mysql.escape(getBlank(image)) + "," + mysql.escape(getBlank(footer_text)) + "," + mysql.escape(getBlank(footer_icon)) + "," + mysql.escape(timestamp_utc ? timestamp_utc.format() : "") + ")";

                                        mysql.query(sql, function (err, result) {
                                            if (err) { console.log(err); res.sendStatus(500); }
                                            else {
                                                let roles_split = roles.split("$€%¥");
                                                for (let i = 0; i <= roles_split.length; i++) {
                                                    if (i == roles_split.length) {
                                                        // Loop Ende
                                                        if (field_titles_split) {
                                                            for (let i = 0; i <= field_titles_split.length; i++) {
                                                                if (i == field_titles_split.length) {
                                                                    res.sendStatus(200);
                                                                } else {
                                                                    sql = "INSERT INTO reaction_role_fields (msg_id,field_no,title,description,inline,guild_id,tc_id) " +
                                                                        "VALUES (" + mysql.escape(message.id) + "," + mysql.escape(i + 1) + "," + mysql.escape(field_titles_split[i]) + "," + mysql.escape(field_descriptions_split[i]) + "," + mysql.escape(field_inlines_split[i] == 'inline') + "," + mysql.escape(guild_id) + "," + mysql.escape(tc_id) + ");"

                                                                    mysql.query(sql, function (err, result) {
                                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                                        else { }
                                                                    });
                                                                }
                                                            }
                                                        } else res.sendStatus(200);
                                                    } else {
                                                        const role_entries = roles_split[i];
                                                        role_entries.split("|").forEach(role_id => {
                                                            if (role_id) {
                                                                sql = "INSERT INTO reaction_roles (msg_id,emoji,role_id,guild_id,tc_id) " +
                                                                    "VALUES (" + mysql.escape(message.id) + "," + mysql.escape(emojis_split[i]) + "," + mysql.escape(role_id) + "," + mysql.escape(guild_id) + "," + mysql.escape(tc_id) + ")";

                                                                mysql.query(sql, function (err, result) {
                                                                    if (err) { console.log(err); res.sendStatus(500); }
                                                                    else { }
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                    }).catch(() => res.sendStatus(406));
                                } else res.sendStatus(403);
                            } else res.sendStatus(500);
                        }
                    });
                } else res.render('404', { req });
            });
        });
    });

    router.post('/reactionrole_edit', (req, res) => {
        const guild_id = req.body.guild_id;
        let botGuild = bot.guilds.cache.get(guild_id);
        const msg_id = req.body.msg_id;

        const color = req.body.color;

        const author_icon = req.body.author_icon;
        const author_name = req.body.author_name;
        const author_link = req.body.author_link;
        const thumbnail = req.body.thumbnail;
        const title = req.body.title;
        const title_link = req.body.title_link;
        const description = req.body.description;

        const field_titles = req.body.field_titles;
        const field_descriptions = req.body.field_descriptions;
        const field_inlines = req.body.field_inlines;

        let field_titles_split = field_titles == undefined ? undefined : field_titles.split("$€%¥");
        let field_descriptions_split = field_descriptions == undefined ? undefined : field_descriptions.split("$€%¥");
        let field_inlines_split = field_inlines == undefined ? undefined : field_inlines.split("$€%¥");

        field_titles_split = field_titles_split == '' ? undefined : field_titles_split;
        field_descriptions_split = field_descriptions_split == '' ? undefined : field_descriptions_split;
        field_inlines_split = field_inlines_split == '' ? undefined : field_inlines_split;

        const image = req.body.image;
        const footer_icon = req.body.footer_icon;
        const footer_text = req.body.footer_text;
        const timestamp = req.body.timestamp;

        const emojis = req.body.emojis;
        const roles = req.body.roles;

        isSupporter(req, bot, function (isSupporter) {
            get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
                if (is_authorized) {
                    // 1. Get text channel ID from the database, in case the user force changed it.
                    let sql = "SELECT tc_id " +
                        "FROM reaction_role_messages " +
                        "WHERE msg_id=" + mysql.escape(msg_id);

                    mysql.query(sql, function (err, tc_ids) {
                        if (err) { console.log(err); res.sendStatus(500); }
                        else if (tc_ids.length < 1) { res.sendStatus(500); }
                        else {
                            let tc_id = tc_ids[0].tc_id;

                            // 2. Delete all database entries form this reaction role message.
                            let sql = "DELETE FROM reaction_role_messages " +
                                "WHERE msg_id=" + mysql.escape(msg_id); + "; ";

                            mysql.query(sql, function (err, result) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    sql = "DELETE FROM reaction_role_fields " +
                                        "WHERE msg_id=" + mysql.escape(msg_id); + "; ";
                                    mysql.query(sql, function (err, result) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            sql = "DELETE FROM reaction_roles " +
                                                "WHERE msg_id=" + mysql.escape(msg_id);

                                            mysql.query(sql, function (err, result) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else {
                                                    mysql.query(sql, function (err, result) {
                                                        if (err) { console.log(err); res.sendStatus(500); }
                                                        else {
                                                            // 3. Update the embed and its reactions.
                                                            sql = "SELECT t.timezone " +
                                                                "FROM guilds AS g " +
                                                                "INNER JOIN const_timezones AS t " +
                                                                "ON g.timezone_id=t.id " +
                                                                "WHERE g.guild_id=" + mysql.escape(guild_id);

                                                            mysql.query(sql, function (err, timezones) {
                                                                if (err) { console.log(err); res.sendStatus(500); }
                                                                else {
                                                                    let timezone = timezones.length > 0 ? timezones[0].timezone : 'UTC';
                                                                    let timestamp_tz = moment.tz(timestamp, timezone);
                                                                    let timestamp_utc = timestamp_tz.clone().tz('UTC');
                                                                    timestamp_utc = timestamp == undefined ? "" : timestamp_utc;

                                                                    let embed = new Discord.MessageEmbed()
                                                                        .setColor(isSupporter ? color : "#7289da");

                                                                    if (author_name != undefined) {
                                                                        embed.setAuthor(author_name, author_icon == undefined ? null : author_icon, author_link == undefined ? null : author_link);
                                                                    }

                                                                    if (title != undefined) {
                                                                        embed.setTitle(title);
                                                                    }

                                                                    if (title_link != undefined) {
                                                                        embed.setURL(title_link);
                                                                    }

                                                                    if (thumbnail != undefined) {
                                                                        embed.setThumbnail(thumbnail);
                                                                    }

                                                                    if (description != undefined) {
                                                                        embed.setDescription(description);
                                                                    }

                                                                    if (field_titles_split != undefined && field_descriptions_split != undefined && field_inlines_split != undefined) {
                                                                        for (let i = 0; i < field_titles_split.length; i++) {
                                                                            const title = field_titles_split[i];
                                                                            const description = field_descriptions_split[i];
                                                                            const inline = field_inlines_split[i] == 'inline';

                                                                            if (title != 'undefined' && description != 'undefined') {
                                                                                embed.addField(title, description, inline);
                                                                            }
                                                                        }
                                                                    }

                                                                    if (image != undefined) {
                                                                        embed.setImage(image);
                                                                    }

                                                                    if (footer_text != undefined) {
                                                                        embed.setFooter(footer_text, footer_icon == undefined ? null : footer_icon);
                                                                    }

                                                                    if (timestamp != undefined) {
                                                                        embed.setTimestamp(timestamp);
                                                                    }

                                                                    if (emojis != undefined && roles != undefined) {
                                                                        let tc = botGuild.channels.cache.get(tc_id);
                                                                        tc.messages.fetch(msg_id).then(message => {
                                                                            message.edit(embed).then(update_message => {
                                                                                let emojis_split = emojis.split("$€%¥");
                                                                                let emojis_to_ignore = [];
                                                                                message.reactions.cache.forEach(reaction => {
                                                                                    if (!emojis_split.includes(reaction.emoji.name)) {
                                                                                        reaction.remove();
                                                                                    } else {
                                                                                        emojis_to_ignore.push(reaction.emoji);
                                                                                    }
                                                                                });

                                                                                emojis_split.forEach(emoji => {
                                                                                    if (emoji != "" && !emojis_to_ignore.includes(emoji)) {
                                                                                        update_message.react(emoji).catch(console.error);
                                                                                    }
                                                                                });

                                                                                // 4. Enter update_message in database.
                                                                                let sql = "INSERT INTO reaction_role_messages (guild_id,tc_id,msg_id,colorcode,author_name,author_url,author_icon_url,title,title_url,thumbnail_url,description,image_url,footer,footer_icon_url,timestamp) " +
                                                                                    "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(tc_id) + "," + mysql.escape(update_message.id) + "," + mysql.escape(color) + "," + mysql.escape(getBlank(author_name)) + "," + mysql.escape(getBlank(author_link)) + "," + mysql.escape(getBlank(author_icon)) + "," + mysql.escape(getBlank(title)) + "," + mysql.escape(getBlank(title_link)) + "," + mysql.escape(getBlank(thumbnail)) + "," + mysql.escape(getBlank(description)) + "," + mysql.escape(getBlank(image)) + "," + mysql.escape(getBlank(footer_text)) + "," + mysql.escape(getBlank(footer_icon)) + "," + mysql.escape(timestamp_utc ? timestamp_utc.format() : "") + ")";

                                                                                mysql.query(sql, function (err, result) {
                                                                                    if (err) { console.log(err); res.sendStatus(500); }
                                                                                    else {
                                                                                        let roles_split = roles.split("$€%¥");
                                                                                        for (let i = 0; i <= roles_split.length; i++) {
                                                                                            if (i == roles_split.length) {
                                                                                                // Loop Ende
                                                                                                if (field_titles_split) {
                                                                                                    for (let i = 0; i <= field_titles_split.length; i++) {
                                                                                                        if (i == field_titles_split.length) {
                                                                                                            res.sendStatus(200);
                                                                                                        } else {
                                                                                                            sql = "INSERT INTO reaction_role_fields (msg_id,field_no,title,description,inline,guild_id) " +
                                                                                                                "VALUES (" + mysql.escape(update_message.id) + "," + mysql.escape(i + 1) + "," + mysql.escape(field_titles_split[i]) + "," + mysql.escape(field_descriptions_split[i]) + "," + mysql.escape(field_inlines_split[i] == 'inline') + "," + mysql.escape(guild_id) + ");"

                                                                                                            mysql.query(sql, function (err, result) {
                                                                                                                if (err) { console.log(err); res.sendStatus(500); }
                                                                                                                else { }
                                                                                                            });
                                                                                                        }
                                                                                                    }
                                                                                                } else res.sendStatus(200);
                                                                                            } else {
                                                                                                const role_entries = roles_split[i];
                                                                                                role_entries.split("|").forEach(role_id => {
                                                                                                    if (role_id) {
                                                                                                        sql = "INSERT INTO reaction_roles (msg_id,emoji,role_id,guild_id) " +
                                                                                                            "VALUES (" + mysql.escape(update_message.id) + "," + mysql.escape(emojis_split[i]) + "," + mysql.escape(role_id) + "," + mysql.escape(guild_id) + ")";

                                                                                                        mysql.query(sql, function (err, result) {
                                                                                                            if (err) { console.log(err); res.sendStatus(500); }
                                                                                                            else { }
                                                                                                        });
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }).catch(console.error);
                                                                        }).catch(console.error);
                                                                    } else res.sendStatus(500);
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
        });
    });

    router.post('/delete_reactionrole', (req, res) => {
        const guild_id = req.body.guild_id;
        const tc_id = req.body.tc_id;
        const msg_id = req.body.msg_id;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                bot.guilds.cache.get(guild_id).channels.cache.get(tc_id).messages.fetch(msg_id).then(message => {
                    message.delete();

                    let sql = "DELETE FROM reaction_role_messages " +
                        "WHERE msg_id=" + mysql.escape(msg_id);

                    mysql.query(sql, function (err, result) {
                        if (err) { console.log(err); res.sendStatus(500); }
                        else {
                            let sql = "DELETE FROM reaction_roles " +
                                "WHERE msg_id=" + mysql.escape(msg_id);

                            mysql.query(sql, function (err, result) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    let sql = "DELETE FROM reaction_role_fields " +
                                        "WHERE msg_id=" + mysql.escape(msg_id);

                                    mysql.query(sql, function (err, result) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            res.sendStatus(200);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }).catch(function (error) {
                    console.log(error);
                    res.sendStatus(500);
                });
            } else res.render('404', { req });
        });
    });

    router.post('/voicelobby', (req, res) => {
        const guild_id = req.body.guild_id;
        const lobbies = req.body.lobbies;
        let lobbies_split = lobbies === '' ? '' : lobbies.split('|');

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // First, delete all
                let sql = "DELETE FROM guild_voice_lobbies " +
                    "WHERE guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else if (lobbies_split === '') res.sendStatus(200);
                    else {
                        // Then add the selected ones
                        let counter = 0;
                        lobbies_split.forEach(lobby => {
                            sql = "INSERT INTO guild_voice_lobbies (guild_id,vc_id) " +
                                "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(lobby) + ")"

                            mysql.query(sql, function (err, result) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else if (counter == lobbies_split.length - 1) res.sendStatus(200);
                                counter++;
                            });
                        });
                    }
                });
            } else res.render('404', { req });
        });
    });

    // Command Toggles
    router.post('/command', (req, res) => {
        const guild_id = req.body.guild_id;
        const command = req.body.command;
        const checked = req.body.checked;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Get command id from database
                var sql = "SELECT *" + " " +
                    "FROM const_commands" + " " +
                    "WHERE name=" + mysql.escape(command);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        if (result.length > 0) {
                            var command_id = result[0].id;
                            // Check if command exists in db (= is disabled)
                            var sql = "SELECT *" + " " +
                                "FROM guild_disabled_commands" + " " +
                                "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                                "AND command_id=" + mysql.escape(command_id);

                            mysql.query(sql, function (err, disabled) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    if (disabled.length > 0) {
                                        // command is disabled
                                        if (checked === 'true') {
                                            // delete
                                            sql = "DELETE" + " " +
                                                "FROM guild_disabled_commands" + " " +
                                                "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                                                "AND command_id=" + mysql.escape(command_id);

                                            mysql.query(sql, function (err, result) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else res.sendStatus(200);
                                            });
                                        } else {
                                            res.sendStatus(200);
                                        }
                                    } else {
                                        // command is enabled
                                        if (checked === 'false') {
                                            // insert
                                            sql = "INSERT INTO guild_disabled_commands (guild_id,command_id)" + " " +
                                                "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(command_id) + ")";

                                            mysql.query(sql, function (err, result) {
                                                if (err) { console.log(err); res.sendStatus(500); }
                                                else res.sendStatus(200);
                                            });
                                        } else {
                                            res.sendStatus(200);
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            } else res.render('404', { req });
        });
    });

    // Plugin Toggles
    router.post('/plugin', (req, res) => {
        const guild_id = req.body.guild_id;
        const plugin = req.body.plugin;
        const checked = req.body.checked;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                // Get plugin id from database
                let sql = "SELECT *" + " " +
                    "FROM const_plugins" + " " +
                    "WHERE name=" + mysql.escape(plugin);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else {
                        if (result.length > 0) {
                            let plugin_id = result[0].id;
                            // Check if plugin exists in db (= is disabled)
                            sql = "SELECT * " +
                                "FROM guild_disabled_plugins " +
                                "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                                "AND plugin_id=" + mysql.escape(plugin_id);

                            mysql.query(sql, function (err, disabled) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else {
                                    // Check if guilds has entry. If not, create a default one
                                    // That is because leveling disabled per default, we need the guilds entry to determine if a plugin is on
                                    sql = "SELECT guild_id " +
                                        "FROM guilds " +
                                        "WHERE guild_id=" + mysql.escape(guild_id);

                                    mysql.query(sql, function (err, guild_entries) {
                                        if (err) { console.log(err); res.sendStatus(500); }
                                        else {
                                            if (guild_entries.length > 0) {
                                                // Do not create an entry
                                                set_disabled_plugin(mysql, guild_id, plugin_id, disabled, checked, res);
                                            } else {
                                                // Create default entry
                                                sql = "INSERT INTO guilds (guild_id,prefix,language_code,timezone_id) " +
                                                    "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape('!') + "," + mysql.escape('en_gb') + "," + mysql.escape(1) + ")"

                                                mysql.query(sql, function (err, result) {
                                                    if (err) { console.log(err); res.sendStatus(500); }
                                                    else {
                                                        // If we create a default entry from a plugin toggle, we also have to disable cmddletion by default.
                                                        sql = "INSERT INTO guild_disabled_features (guild_id,feature_id) " +
                                                            "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(4) + ")"

                                                        mysql.query(sql, function (err, result) {
                                                            if (err) { console.log(err); res.sendStatus(500); }
                                                            else set_disabled_plugin(mysql, guild_id, plugin_id, disabled, checked, res);
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    })
                                }
                            });
                        }
                    }
                });
            } else res.render('404', { req });
        });
    });

    function set_disabled_plugin(mysql, guild_id, plugin_id, disabled, checked, res) {
        if (disabled.length > 0) {
            // plugin is disabled
            if (checked === 'true') {
                // delete
                let sql = "DELETE" + " " +
                    "FROM guild_disabled_plugins" + " " +
                    "WHERE guild_id=" + mysql.escape(guild_id) + " " +
                    "AND plugin_id=" + mysql.escape(plugin_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else res.sendStatus(200);
                });
            } else {
                res.sendStatus(200);
            }
        } else {
            // plugin is enabled
            if (checked === 'false') {
                // insert
                let sql = "INSERT INTO guild_disabled_plugins (guild_id,plugin_id)" + " " +
                    "VALUES (" + mysql.escape(guild_id) + "," + mysql.escape(plugin_id) + ")";

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else res.sendStatus(200);
                });
            } else {
                res.sendStatus(200);
            }
        }
    }

    // Leaderboard
    router.post('/reset_member', (req, res) => {
        const guild_id = req.body.guild_id;
        const user_id = req.body.user_id;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            if (is_authorized) {
                let sql = "DELETE FROM user_exp " +
                    "WHERE user_id=" + mysql.escape(user_id) + " " +
                    "AND guild_id=" + mysql.escape(guild_id);

                mysql.query(sql, function (err, result) {
                    if (err) { console.log(err); res.sendStatus(500); }
                    else res.sendStatus(200);
                });
            } else res.render('404', { req });
        });
    });

    router.post('/reset_members', (req, res) => {
        const guild_id = req.body.guild_id;

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            let sql = "DELETE FROM user_exp " +
                "WHERE guild_id=" + mysql.escape(guild_id);

            mysql.query(sql, function (err, result) {
                if (err) { console.log(err); res.sendStatus(500); }
                else res.sendStatus(200);
            });
        });
    });

    router.post('/prune_members', (req, res) => {
        const guild_id = req.body.guild_id;
        let botGuild = bot.guilds.cache.get(guild_id);

        get_authorization(req, guild_id, mysql, bot, function (is_authorized) {
            let sql = "SELECT * " +
                "FROM user_exp " +
                "WHERE guild_id=" + mysql.escape(guild_id);

            mysql.query(sql, function (err, user_exps) {
                if (err) { console.log(err); res.sendStatus(500); }
                else {
                    for (let i = 0; i < user_exps.length; i++) {
                        const user_exp = user_exps[i];
                        const user_id = user_exp.user_id;

                        let member = botGuild.members.cache.get(user_id);
                        if (member === undefined) {
                            let sql = "DELETE FROM user_exp " +
                                "WHERE user_id=" + mysql.escape(user_id) + " " +
                                "AND guild_id=" + mysql.escape(guild_id);

                            mysql.query(sql, function (err, result) {
                                if (err) { console.log(err); res.sendStatus(500); }
                                else res.sendStatus(200);
                            });
                        }
                    }
                }
            });
        });
    });

    return router;
};