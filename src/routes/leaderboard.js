const router = require('express').Router();
const mysql = require('../database/mysql')
const cookieParser = require('cookie-parser');

// Global functions
const functions = require('../public/scripts/functions');
const nws = functions.nws;
const isLoggedIn = functions.isLoggedIn;
const getCurrentGuildId1 = functions.getCurrentGuildId1;
const findGuildById = functions.findGuildById;
const getAuthorization = functions.getAuthorization;

router.use(cookieParser());

module.exports = function (bot) {
    ////////////////////////////////////////////
    // Routes
    ////////////////////////////////////////////

    // Leaderboard
    router.get('/', isLoggedIn, (req, res) => {
        showLeaderboard(req, res);
    });

    // Guild leaderboard
    router.get('*', isLoggedIn, (req, res) => {
        showGuildLeaderboard(req, res);
    });

    ////////////////////////////////////////////
    // Async show-functions
    ////////////////////////////////////////////

    async function showLeaderboard(req, res) {
        try {
            // Disabled plugins
            let lvlDisabledGuilds = [];

            let sql = nws`SELECT *
                FROM guild_disabled_plugins
                WHERE plugin_id=${mysql.escape(7)}`; // level

            let disabledPlugins = await mysql.query(sql);
            disabledPlugins = disabledPlugins[0];

            disabledPlugins.forEach(disabledPlugin => {
                lvlDisabledGuilds.push(disabledPlugin.guild_id);
            });

            // Guilds
            let allGuilds = [];

            sql = nws`SELECT guild_id
                FROM guilds`;

            let guilds = await mysql.query(sql);
            guilds = guilds[0];

            guilds.forEach(guild => {
                allGuilds.push(guild.guild_id);
            });

            // Disabled categories
            let lvlDisabledModeration = [];

            sql = nws`SELECT *
                FROM guild_disabled_categories
                WHERE category_id=${mysql.escape(3)}`; // moderation

            let disabledCategories = await mysql.query(sql);
            disabledCategories = disabledCategories[0];

            disabledCategories.forEach(disabledCategory => {
                lvlDisabledModeration.push(disabledCategory.guild_id);
            });

            res.render('leaderboard', { req, bot, lvlDisabledGuilds, allGuilds, lvlDisabledModeration });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    async function showGuildLeaderboard(req, res) {
        try {
            let id = await getCurrentGuildId1(req);
            let guild = findGuildById(req.user.guilds, id);
            let botGuild;
            try {
                botGuild = await bot.guilds.fetch(id);
            } catch (err) {
                res.render('404', { req });
                return
            }

            // Guild was found & Servant is on this guild
            if (guild && botGuild) {
                // Disabled plugins
                let levelIsDisabled = false;

                let sql = nws`SELECT *
                    FROM guild_disabled_plugins
                    WHERE guild_id=${mysql.escape(guild.id)}
                    AND plugin_id=${mysql.escape(7)}`; // level

                let disabledPlugins = await mysql.query(sql);
                disabledPlugins = disabledPlugins[0];

                if (disabledPlugins.length > 0) levelIsDisabled = true;

                // Guilds
                let guildHasEntry = false;

                sql = nws`SELECT guild_id
                    FROM guilds
                    WHERE guild_id=${mysql.escape(guild.id)}`;

                let guilds = await mysql.query(sql);
                guilds = guilds[0];

                if (guilds.length > 0) guildHasEntry = true;

                // Level is enabled && guild has DB entry (because it's off by default)
                if (!levelIsDisabled && guildHasEntry) {
                    // Exps
                    sql = nws`SELECT user_id, exp
                        FROM user_exp
                        WHERE guild_id=${mysql.escape(guild.id)}
                        ORDER BY exp DESC`;

                    let exps = await mysql.query(sql);
                    exps = exps[0];

                    // Is authorized (to delete entries)
                    let isAuthorized = await getAuthorization(bot, req, id, mysql, bot);

                    // Guild object from client
                    let botGuild = bot.guilds.cache.get(id);

                    res.render('guild_leaderboard', { req, guild, exps, botGuild, isAuthorized, bot });
                } else res.render('404', { req });
            } else res.render('404', { req });
        } catch (err) {
            console.error(err);
            res.render('500', { req });
        }
    }

    return router;
};
