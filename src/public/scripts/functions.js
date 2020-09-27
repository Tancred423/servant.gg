module.exports = {
    ////////////////////////////////////////////
    // Basic js functions
    ////////////////////////////////////////////

    sortMapByValue: (map) => {
        let a = [];
        for (let x of map) a.push(x)
        a.sort((x, y) => (x[1] > y[1]) ? 1 : ((y[1] > x[1]) ? -1 : 0))
        return new Map(a);
    },

    hasDuplicates: (array) => {
        return new Set(array).size !== array.length;
    },

    getBoolean: (string) => {
        return string == 'true';
    },

    getBlank: (string) => {
        return string == undefined ? "" : string;
    },

    // No white space (removes unnecssary whitespaces from multi line template literals)
    nws: (strings, ...placeholders) => {
        let withSpace = strings.reduce((result, string, i) => (result + placeholders[i - 1] + string));
        return withSpace.replace(/$\n^\s*/gm, ' ');
    },

    ////////////////////////////////////////////
    // Express functions
    ////////////////////////////////////////////

    isLoggedIn: (req, res, next) => {
        if (req.user) next();
        else {
            res.cookie('redirect', req.originalUrl)
            res.redirect('/auth');
        }
    },

    getCurrentGuildId1: (req) => {
        let pathArray = req.originalUrl.split('/');
        return pathArray[pathArray.length - 1];
    },

    getCurrentGuildId2: (req) => {
        let pathArray = req.originalUrl.split('/');
        return pathArray[pathArray.length - 2];
    },

    getCurrentGuildId3: (req) => {
        let pathArray = req.originalUrl.split('/');
        return pathArray[pathArray.length - 3];
    },

    ////////////////////////////////////////////
    // Discord.js functions
    ////////////////////////////////////////////

    findGuildById: (guilds, id) => {
        let myGuild;
        guilds.forEach(guild => {
            if (guild.id == id) myGuild = guild;
        });
        return myGuild;
    },

    getAuthorization: async (bot, req, id, mysql) => {
        if (!req.user) return false;
        let botUser = bot.users.cache.get(req.user.discordId);
        let botGuild = bot.guilds.cache.get(id);
        let isAuthorized = false;

        if (botGuild) {
            // Owner?
            let isOwner = botGuild.ownerID == req.user.discordId;

            // Admin?
            let isAdmin = false;
            let member = undefined;

            if (botGuild && botUser) {
                member = botGuild.member(botUser);
                isAdmin = member.hasPermission("ADMINISTRATOR");
            }

            // Servant-Moderator?
            let isServantMod = false;

            let sql = module.exports.nws`SELECT *
                FROM guild_mod_roles
                WHERE guild_id=${mysql.escape(id)}`;

            let modRoleIdEntries = await mysql.query(sql);
            modRoleIdEntries = modRoleIdEntries[0];

            modRoleIdEntries.forEach(modRoleIdEntry => {
                if (member.roles.cache.get(modRoleIdEntry.role_id))
                    isServantMod = true;
            });

            // Authorized?
            if (isOwner || isAdmin || isServantMod) isAuthorized = true;
        }

        return isAuthorized;
    },

    getSupporterStatus: async (bot, req) => {
        let isSupporter = false;

        let servantsKingdom = await bot.guilds.fetch('436925371577925642');
        if (servantsKingdom) {
            let member = await servantsKingdom.members.fetch(req.user.discordId);
            if (member) {
                let memberRoles = member.roles.cache;
                if (memberRoles) {
                    memberRoles.forEach(memberRole => {
                        if (memberRole.id == '715557625244155994') {
                            isSupporter = true;
                        }
                    });
                }
            }
        }

        return isSupporter;
    },
}