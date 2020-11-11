const router = require('express').Router();
const mysql = require('../database/mysql');
const moment = require('moment-timezone');
const cookieParser = require('cookie-parser');

// Global functions
const functions = require('../public/scripts/functions');
const nws = functions.nws;
const isLoggedIn = functions.isLoggedIn;
const getCurrentGuildId1 = functions.getCurrentGuildId1;
const getCurrentGuildId2 = functions.getCurrentGuildId2;
const getCurrentGuildId3 = functions.getCurrentGuildId3;
const findGuildById = functions.findGuildById;
const getAuthorization = functions.getAuthorization;
const getSupporterStatus = functions.getSupporterStatus;

router.use(cookieParser());

module.exports = (bot) => {
    ////////////////////////////////////////////
    // Routes
    ////////////////////////////////////////////

    // Dashboard
    router.get('/', isLoggedIn, (req, res) => {
        renderDashboard(req, res);
    });

    // Moderation - Auto Role
    router.get('*/moderation/auto-role', isLoggedIn, (req, res) => {
        renderModerationAutorole(req, res);
    });

    // Moderation - Best of Image
    router.get('*/moderation/best-of-image', isLoggedIn, (req, res) => {
        renderModerationBestOfImage(req, res);
    });

    // Moderation - Best of Quote
    router.get('*/moderation/best-of-quote', isLoggedIn, (req, res) => {
        renderModerationBestOfQuote(req, res);
    });

    // Moderation - Birthday
    router.get('*/moderation/birthday', isLoggedIn, (req, res) => {
        renderModerationBirthday(req, res);
    });

    // Moderation - Custom Commands
    router.get('*/moderation/custom-commands', isLoggedIn, (req, res) => {
        renderModerationCustomCommands(req, res);
    });

    // Moderation - Embed
    router.get('*/moderation/embed', isLoggedIn, (req, res) => {
        renderModerationEmbed(req, res);
    });

    // Moderation - Join
    router.get('*/moderation/join', isLoggedIn, (req, res) => {
        renderModerationJoin(req, res);
    });

    // Moderation - Leave
    router.get('*/moderation/leave', isLoggedIn, (req, res) => {
        renderModerationLeave(req, res);
    });

    // Moderation - Level
    router.get('*/moderation/level', isLoggedIn, (req, res) => {
        renderModerationLevel(req, res);
    });

    // Moderation - Livestream
    router.get('*/moderation/livestream', isLoggedIn, (req, res) => {
        renderModerationLivestream(req, res);
    });

    // Moderation - Log
    router.get('*/moderation/log', isLoggedIn, (req, res) => {
        renderModerationLog(req, res)
    });

    // Moderation - Media only Channel
    router.get('*/moderation/media-only-channel', isLoggedIn, (req, res) => {
        renderModerationMediaOnlyChannel(req, res);
    });

    // Moderation - Reaction Role
    router.get('*/moderation/reaction-role', isLoggedIn, (req, res) => {
        renderModerationReactionRole(req, res);
    });

    // Moderation - Voice Lobby
    router.get('*/moderation/voice-lobby', isLoggedIn, (req, res) => {
        renderModerationVoiceLobby(req, res);
    });

    // Moderation - 404
    router.get('*/moderation/*', isLoggedIn, (req, res) => {
        res.render('404', { req });
    });

    // Moderation
    router.get('*/moderation', isLoggedIn, (req, res) => {
        renderModeration(req, res);
    });

    // Utility
    router.get('*/utility', isLoggedIn, (req, res) => {
        renderUtility(req, res);
    });

    // Fun
    router.get('*/fun', isLoggedIn, (req, res) => {
        renderFun(req, res);
    });

    // Interaction
    router.get('*/interaction', isLoggedIn, (req, res) => {
        renderInteraction(req, res);
    });

    // Random
    router.get('*/random', isLoggedIn, (req, res) => {
        renderRandom(req, res);
    });

    // Guild dashboard
    router.get('*', isLoggedIn, (req, res) => {
        renderGuildDashboard(req, res);
    });

    ////////////////////////////////////////////
    // General
    ////////////////////////////////////////////

    async function getPrefix(req, mysql, guildId) {
        let prefix = '!';

        if (req.user) {
            try {
                let sql = nws`SELECT prefix
                    FROM guilds
                    WHERE guild_id=${mysql.escape(guildId)}`;

                let prefixes = await mysql.query(sql);
                prefixes = prefixes[0];

                if (prefixes.length > 0)
                    prefix = prefixes[0].prefix;
            } catch (err) {
                console.error(err);
            }
        }

        return prefix;
    }

    async function getOwnerGuilds(req, bot, mysql) {
        let guilds = req.user.guilds;
        let ownerGuilds = [];

        for (const guild of guilds) {
            let isAdmin = false;
            let isServantMod = false;

            let botGuild = bot.guilds.cache.get(guild.id);
            let botUser = bot.users.cache.get(req.user.discordId);

            if (botGuild && botUser) {
                let member = botGuild.members.cache.get(botUser.id);

                if (member) {
                    isAdmin = member.hasPermission("ADMINISTRATOR");

                    let sql = nws`SELECT *
                        FROM guild_mod_roles
                        WHERE guild_id=${mysql.escape(guild.id)}`;

                    let [rows, fields] = await mysql.query(sql);

                    let modRoleIds = [];
                    for (const row of rows) {
                        modRoleIds.push(row.role_id);
                    }

                    let memberRoleIds = [];
                    for (const role of member.roles.cache) {
                        memberRoleIds.push(role[0])
                    }

                    isServantMod = memberRoleIds.some(r => modRoleIds.includes(r));
                }
            }

            if (guild.owner || isAdmin || isServantMod) {
                ownerGuilds.push(guild);
            }
        }

        return ownerGuilds;
    }

    ////////////////////////////////////////////
    // Async render-functions
    ////////////////////////////////////////////

    async function renderDashboard(req, res) {
        try {
            // Is supporter
            let isSupporter = await getSupporterStatus(bot, req);

            // User data
            let sql = nws`SELECT u.prefix, u.color_code, u.bio, u.birthday, l.code, u.profile_bg_id
                FROM users as u
                INNER JOIN const_languages as l
                ON u.language_code=l.code
                WHERE user_id=${mysql.escape(req.user.discordId)}`;

            let userData = await mysql.query(sql);
            userData = userData[0];

            // Birthday guilds
            sql = nws`SELECT *
                FROM user_birthday_guilds
                WHERE user_id=${mysql.escape(req.user.discordId)}`;

            let birthdayGuilds = await mysql.query(sql);
            birthdayGuilds = birthdayGuilds[0];

            // Backgrounds
            sql = nws`SELECT *
                FROM const_profile_images`;

            let backgrounds = await mysql.query(sql);
            backgrounds = backgrounds[0];

            // Languages
            sql = nws`SELECT *
                FROM const_languages`;

            let languages = await mysql.query(sql);
            languages = languages[0];

            // Owner guilds
            let ownerGuilds = await getOwnerGuilds(req, bot, mysql);

            res.render('dashboard', {
                req, bot, mysql, userData, languages, birthdayGuilds, isSupporter, backgrounds, ownerGuilds
            });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationAutorole(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Autoroles
                let sql = nws`SELECT *
                    FROM guild_autoroles
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let autoRoles = await mysql.query(sql);
                autoRoles = autoRoles[0]

                // Disabled plugins
                sql = nws`SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(1)}`; // autorole

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('auto_role', { req, guild, bot, botGuild, autoRoles, disabledPlugins })
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationBestOfImage(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Bois
                let sql = nws`SELECT *
                    FROM guild_best_of_images
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let bois = await mysql.query(sql);
                bois = bois[0];

                // Disabled plugins
                sql = nws`SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)} 
                    AND plugin_id=${mysql.escape(2)}`; // bestofimage

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('best_of_image', { req, guild, bot, botGuild, bois, disabledPlugins })
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationBestOfQuote(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Boqs
                let sql = nws`SELECT *
                    FROM guild_best_of_quotes
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let boqs = await mysql.query(sql);
                boqs = boqs[0];

                // Disabled plugins
                sql = nws`SELECT id
                    FROM guild_disabled_plugins 
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(3)}`; // bestofquote

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('best_of_quote', { req, guild, bot, botGuild, boqs, disabledPlugins })
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationBirthday(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Guild birthdays
                let sql = nws`SELECT *
                    FROM guild_birthdays
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let guildBirthdays = await mysql.query(sql);
                guildBirthdays = guildBirthdays[0];

                // Disabled plugins
                sql = nws`SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(13)}`; // birthday

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Birthday roles
                sql = nws`SELECT *
                  FROM guild_birthday_roles
                  WHERE guild_id=${mysql.escape(guild.id)}`;

                let birthdayRoles = await mysql.query(sql);
                birthdayRoles = birthdayRoles[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('birthday', { req, guild, bot, botGuild, disabledPlugins, guildBirthdays, birthdayRoles });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationCustomCommands(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                let prefix = await getPrefix(req, mysql, id);
                let isSupporter = await getSupporterStatus(bot, req);

                // Color code
                let sql = nws`SELECT color_code
                    FROM users
                    WHERE user_id=${mysql.escape(req.user.discordId)}`;

                let colorCode = await mysql.query(sql);
                colorCode = colorCode[0];

                // Disabled plugins
                sql = nws`SELECT *
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(14)}`; // customcommands

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Custom commands
                sql = nws`SELECT *
                    FROM custom_commands
                    WHERE guild_id=${mysql.escape(guild.id)}
                    ORDER BY invoke ASC`;

                let ccs = await mysql.query(sql);
                ccs = ccs[0];

                // Amount custom commands
                let commandsAmount = ccs.length;

                // Custom command embeds
                sql = nws`SELECT *
                    FROM custom_commands_embeds AS e
                    INNER JOIN custom_commands AS c
                    ON e.cc_id=c.id
                    WHERE c.guild_id=${mysql.escape(guild.id)}`;

                let ccEmbeds = await mysql.query(sql);
                ccEmbeds = ccEmbeds[0];

                // Custom command fields
                sql = nws`SELECT *
                    FROM custom_commands_fields AS f
                    INNER JOIN custom_commands AS c
                    ON f.cc_id=c.id
                    WHERE c.guild_id=${mysql.escape(guild.id)}`;

                let ccFields = await mysql.query(sql);
                ccFields = ccFields[0];

                // Custom command aliases
                sql = nws`SELECT *
                    FROM custom_commands_aliases AS a
                    INNER JOIN custom_commands AS c
                    ON a.cc_id=c.id
                    WHERE c.guild_id=${mysql.escape(guild.id)}`;

                let ccAliases = await mysql.query(sql);
                ccAliases = ccAliases[0];

                // Timezones
                sql = nws`SELECT t.timezone
                    FROM guilds as g
                    INNER JOIN const_timezones AS t
                    ON g.timezone_id=t.id
                    WHERE g.guild_id=${mysql.escape(guild.id)}`;

                let timezones = await mysql.query(sql);
                timezones = timezones[0];

                let timestampTzFormats = [];

                if (ccEmbeds.length > 0) {
                    ccEmbeds.forEach(cce => {
                        let timestamp = cce.timestamp;
                        let timestampUtc = moment.tz(timestamp, "UTC");
                        let timezone = timezones.length > 0 ? timezones[0].timezone : "UTC";
                        let timestampTz = timestampUtc.clone().tz(timezone);

                        timestampTzFormats.push({
                            ccId: cce.cc_id,
                            tz: timestampTz.format()
                        });
                    });
                }

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('custom_commands', { req, prefix, guild, bot, botGuild, colorCode, isSupporter, disabledPlugins, timestampTzFormats, commandsAmount, ccs, ccEmbeds, ccFields, ccAliases });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationEmbed(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                let isSupporter = await getSupporterStatus(bot, req);

                // Color code
                let sql = nws`SELECT color_code
                    FROM users
                    WHERE user_id=${mysql.escape(req.user.discordId)}`;

                let colorCode = await mysql.query(sql);
                colorCode = colorCode[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);
                res.render('embed', { req, guild, bot, botGuild, colorCode, isSupporter })
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationJoin(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Joins
                let sql = nws`SELECT *
                    FROM guild_joins
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let joins = await mysql.query(sql);
                joins = joins[0];

                // Disabled plugins
                sql = nws`SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(5)}`; // join

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('join', { req, guild, bot, botGuild, joins, disabledPlugins })
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationLeave(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Joins
                let sql = nws`SELECT *
                    FROM guild_leaves
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let leaves = await mysql.query(sql);
                leaves = leaves[0];

                // Disabled plugins
                sql = nws`SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(6)}`; // leave

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('leave', { req, guild, bot, botGuild, leaves, disabledPlugins });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationLevel(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Guild levels
                let sql = nws`SELECT *
                    FROM guild_level
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let guildLevels = await mysql.query(sql);
                guildLevels = guildLevels[0];

                // Disabled plugins
                sql = nws`SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(7)}`; // level

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Level roles
                sql = nws`SELECT *
                    FROM guild_level_roles
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let levelRoles = await mysql.query(sql);
                levelRoles = levelRoles[0];

                // Guilds
                sql = nws`SELECT guild_id
                    FROM guilds
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let guilds = await mysql.query(sql);
                guilds = guilds[0];

                // Level toggle
                let levelToggle = '';
                if (guilds.length > 0 && disabledPlugins.length == 0) levelToggle = 'checked';

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('level', { req, guild, bot, botGuild, guildLevels, levelRoles, levelToggle });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationLivestream(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Guild livestreams
                let sql = nws`
                    SELECT *
                    FROM guild_livestreams
                    WHERE guild_id=${mysql.escape(guild.id)}
                `;

                let guildLivestreams = await mysql.query(sql);
                guildLivestreams = guildLivestreams[0];

                // Disabled plugins
                sql = nws`
                    SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(8)}
                `; // livestream

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Guild livestreamers
                sql = nws`
                    SELECT *
                    FROM guild_livestreamers
                    WHERE guild_id=${mysql.escape(guild.id)}
                `;

                let guildLivestreamers = await mysql.query(sql);
                guildLivestreamers = guildLivestreamers[0];

                // Guild livestream ping roles
                sql = nws`
                    SELECT *
                    FROM guild_livestream_ping_roles
                    WHERE guild_id=${mysql.escape(guild.id)}
                `;

                let guildLivestreamPingRoles = await mysql.query(sql);
                guildLivestreamPingRoles = guildLivestreamPingRoles[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('livestream', { req, guild, bot, botGuild, disabledPlugins, guildLivestreams, guildLivestreamers, guildLivestreamPingRoles });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationLog(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Logs
                let sql = nws`SELECT *
                    FROM guild_logs
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let logs = await mysql.query(sql);
                logs = logs[0];

                // Disabled plugins
                sql = nws`SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(9)}`; // log

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('log', { req, guild, bot, botGuild, logs, disabledPlugins });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationMediaOnlyChannel(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Media only channels
                let sql = nws`SELECT *
                    FROM guild_media_only_channels
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let mediaonlychannels = await mysql.query(sql);
                mediaonlychannels = mediaonlychannels[0];

                // Disabled plugins
                sql = nws`SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(10)}`; // mediaonlychannel

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Disabled features
                sql = nws`SELECT *
                    FROM guild_disabled_features
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND feature_id=${mysql.escape(5)}`; // media_only_warning

                let disabledFeatures = await mysql.query(sql);
                disabledFeatures = disabledFeatures[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('media_only_channel', { req, guild, bot, botGuild, mediaonlychannels, disabledPlugins, disabledFeatures });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationReactionRole(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                let isSupporter = await getSupporterStatus(bot, req);

                // Color code
                let sql = nws`SELECT color_code
                    FROM users
                    WHERE user_id=${mysql.escape(req.user.discordId)}`;

                let colorCode = await mysql.query(sql);
                colorCode = colorCode[0];

                // Disabled plugins
                sql = nws`SELECT *
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(11)}`; // reactionrole

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Reaction role messages
                sql = nws`SELECT *
                    FROM reaction_role_messages
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let rrMsgs = await mysql.query(sql);
                rrMsgs = rrMsgs[0];

                // Amount reaction roles
                let rrAmount = rrMsgs.length;

                // Reaction roles emojis
                sql = nws`SELECT *
                    FROM reaction_roles
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let rrRolesEmojis = await mysql.query(sql);
                rrRolesEmojis = rrRolesEmojis[0];

                // Reaction role fields
                sql = nws`SELECT *
                    FROM reaction_role_fields
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let rrFields = await mysql.query(sql);
                rrFields = rrFields[0];

                // Timezones
                sql = nws`SELECT t.timezone
                    FROM guilds as g
                    INNER JOIN const_timezones AS t
                    ON g.timezone_id=t.id
                    WHERE g.guild_id=${mysql.escape(guild.id)}`;

                let timezones = await mysql.query(sql);
                timezones = timezones[0];

                let timestampTzFormats = [];

                if (rrMsgs.length > 0) {
                    rrMsgs.forEach(rrMsg => {
                        let timestamp = rrMsg.timestamp;
                        let timestampUtc = moment.tz(timestamp, "UTC");
                        let timezone = timezones.length > 0 ? timezones[0].timezone : "UTC";
                        let timestampTz = timestampUtc.clone().tz(timezone);
                        timestampTzFormats.push({
                            msgId: rrMsg.msg_id,
                            tz: timestampTz.format()
                        });
                    });
                }

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                // Channels
                let channels = [];
                botGuild.channels.cache.forEach(channel => {
                    channels.push({
                        id: channel.id,
                        name: channel.name,
                        type: channel.type,
                        viewable: channel.viewable,
                        parentName: channel.parent ? channel.parent.name : ''
                    });
                });

                res.render('reaction_role', { req, guild, bot, botGuild, colorCode, isSupporter, disabledPlugins, rrMsgs, rrRolesEmojis, rrFields, timestampTzFormats, rrAmount, channels });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModerationVoiceLobby(req, res) {
        try {
            let id = getCurrentGuildId3(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Voice lobbies
                let sql = nws`SELECT *
                    FROM guild_voice_lobbies
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let voiceLobbies = await mysql.query(sql);
                voiceLobbies = voiceLobbies[0];

                // Disabled Plugins
                sql = nws`SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(12)}`; // voicelobby

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('voice_lobby', { req, guild, bot, botGuild, voiceLobbies, disabledPlugins });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderModeration(req, res) {
        try {
            let id = getCurrentGuildId2(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                let prefix = await getPrefix(req, mysql, id);

                // Disabled categories
                let sql = nws`SELECT *
                    FROM guild_disabled_categories
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND category_id=${mysql.escape(3)}`; // Moderation

                let disabledCategories = await mysql.query(sql);
                disabledCategories = disabledCategories[0];

                // Commands
                sql = nws`SELECT *
                    FROM const_commands
                    WHERE category_id=${mysql.escape(3)}
                    ORDER BY name ASC`; // Moderation

                let commands = await mysql.query(sql);
                commands = commands[0];

                // Disabled commands
                sql = nws`SELECT *
                    FROM guild_disabled_commands
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let disabledCommands = await mysql.query(sql);
                disabledCommands = disabledCommands[0];

                // Disabled plugins
                sql = nws`SELECT d.guild_id, p.name
                    FROM guild_disabled_plugins AS d
                    INNER JOIN const_plugins AS p
                    ON d.plugin_id=p.id
                    WHERE d.guild_id=${mysql.escape(guild.id)}`;

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                // Disabled levels
                sql = nws`SELECT id
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(7)}`; // level

                let disabledLevels = await mysql.query(sql);
                disabledLevels = disabledLevels[0];

                // Guilds
                sql = nws`SELECT guild_id
                    FROM guilds
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let guilds = await mysql.query(sql);
                guilds = guilds[0];

                // Level toggle
                let levelToggle = '';
                if (guilds.length > 0 && disabledLevels.length == 0) levelToggle = 'checked';

                res.render('moderation', { req, prefix, guild, disabledCategories, commands, disabledCommands, disabledPlugins, levelToggle });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderUtility(req, res) {
        try {
            let id = getCurrentGuildId2(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                let prefix = await getPrefix(req, mysql, id);

                // Disabled categories
                sql = nws`SELECT *
                    FROM guild_disabled_categories
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND category_id=${mysql.escape(4)}`; // Utility

                let disabledCategories = await mysql.query(sql);
                disabledCategories = disabledCategories[0];

                // Commands
                sql = nws`SELECT *
                    FROM const_commands
                    WHERE category_id=${mysql.escape(4)}
                    ORDER BY name ASC`; // Utility

                let commands = await mysql.query(sql);
                commands = commands[0];

                // Disabled commands
                sql = nws`SELECT *
                    FROM guild_disabled_commands
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let disabledCommands = await mysql.query(sql);
                disabledCommands = disabledCommands[0];

                res.render('utility', { req, prefix, guild, disabledCategories, commands, disabledCommands });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderFun(req, res) {
        try {
            let id = getCurrentGuildId2(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                let prefix = await getPrefix(req, mysql, id);

                // Disabled categories
                sql = nws`SELECT *
                    FROM guild_disabled_categories
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND category_id=${mysql.escape(5)}`; // Fun

                let disabledCategories = await mysql.query(sql);
                disabledCategories = disabledCategories[0];

                // Commands
                sql = nws`SELECT *
                    FROM const_commands
                    WHERE category_id=${mysql.escape(5)}
                    ORDER BY name ASC`; // Fun

                let commands = await mysql.query(sql);
                commands = commands[0];

                // Disabled commands
                sql = nws`SELECT *
                    FROM guild_disabled_commands
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let disabledCommands = await mysql.query(sql);
                disabledCommands = disabledCommands[0];

                res.render('fun', { req, prefix, guild, disabledCategories, commands, disabledCommands });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderInteraction(req, res) {
        try {
            let id = getCurrentGuildId2(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                let prefix = await getPrefix(req, mysql, id);

                // Disabled categories
                sql = nws`SELECT *
                    FROM guild_disabled_categories
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND category_id=${mysql.escape(6)}`; // Interaction

                let disabledCategories = await mysql.query(sql);
                disabledCategories = disabledCategories[0];

                // Commands
                sql = nws`SELECT *
                    FROM const_commands
                    WHERE category_id=${mysql.escape(6)}
                    ORDER BY name ASC`; // Interaction

                let commands = await mysql.query(sql);
                commands = commands[0];

                // Disabled commands
                sql = nws`SELECT *
                    FROM guild_disabled_commands
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let disabledCommands = await mysql.query(sql);
                disabledCommands = disabledCommands[0];

                res.render('interaction', { req, prefix, guild, disabledCategories, commands, disabledCommands });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderRandom(req, res) {
        try {
            let id = getCurrentGuildId2(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                let prefix = await getPrefix(req, mysql, id);

                // Disabled categories
                sql = nws`SELECT *
                    FROM guild_disabled_categories
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND category_id=${mysql.escape(7)}`; // Random

                let disabledCategories = await mysql.query(sql);
                disabledCategories = disabledCategories[0];

                // Commands
                sql = nws`SELECT *
                    FROM const_commands
                    WHERE category_id=${mysql.escape(7)}
                    ORDER BY name ASC`; // Random

                let commands = await mysql.query(sql);
                commands = commands[0];

                // Disabled commands
                sql = nws`SELECT *
                    FROM guild_disabled_commands
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let disabledCommands = await mysql.query(sql);
                disabledCommands = disabledCommands[0];

                res.render('random', { req, prefix, guild, disabledCategories, commands, disabledCommands });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function renderGuildDashboard(req, res) {
        try {
            let id = getCurrentGuildId1(req, res);
            let isAuthorized = await getAuthorization(bot, req, id, mysql);
            let guild = findGuildById(req.user.guilds, id);

            if (isAuthorized && req.user.discordId !== id && guild) {
                // Guilds
                let sql = nws`SELECT prefix, language_code, timezone_id
                    FROM guilds
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let guilds = await mysql.query(sql);
                guilds = guilds[0];

                // Disabled features
                sql = nws`SELECT *
                    FROM guild_disabled_features
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let disabledFeatures = await mysql.query(sql);
                disabledFeatures = disabledFeatures[0];

                // Disabled categories
                sql = nws`SELECT *
                    FROM guild_disabled_categories
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let disabledCategories = await mysql.query(sql);
                disabledCategories = disabledCategories[0];

                // Mod roles
                sql = nws`SELECT *
                    FROM guild_mod_roles
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let modRoles = await mysql.query(sql);
                modRoles = modRoles[0];

                // Timezones
                sql = nws`SELECT *
                    FROM const_timezones`;

                let timezones = await mysql.query(sql);
                timezones = timezones[0];

                // Languages
                sql = nws`SELECT *
                    FROM const_languages`;

                let languages = await mysql.query(sql);
                languages = languages[0];

                // Guild object from client
                let botGuild = bot.guilds.cache.get(guild.id);

                res.render('guild', { req, guild, guilds, disabledFeatures, disabledCategories, modRoles, timezones, botGuild, languages });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    return router;
};
