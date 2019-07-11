const Discord = require('discord.js'); // by Venesay
const bot = new Discord.Client();
const fs = require("fs");
const Logger = require('./objects/logger');

let requests = JSON.parse(fs.readFileSync("./database/requests.json", "utf8"));
let blacklist = JSON.parse(fs.readFileSync("./database/blacklist names.json", "utf8"));
let reqrem = JSON.parse(fs.readFileSync("./database/requests remove.json", "utf8"));

let version = "8.0";
let hideobnova = true;
let levelhigh = 0;
let lasttestid = 'net';

const cooldowncommand = new Set();
const report_cooldown = new Set();
const dspanel = new Set();
const nrpnames = new Set(); // Невалидные ники будут записаны в nrpnames
const sened = new Set(); // Уже отправленные запросы будут записаны в sened
const support_cooldown = new Set(); // Запросы от игроков.
const snyatie = new Set(); // Уже отправленные запросы на снятие роли быдут записаны в snyatie

let antislivsp1 = new Set();
let antislivsp2 = new Set();

let setembed_general = ["не указано", "не указано", "не указано", "не указано", "не указано", "не указано", "не указано"];
let setembed_fields = ["нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет"];
let setembed_addline = ["нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет"];

let serverid = '531454559038734356'

punishment_rep = ({
    "mute": "Вы были замучены в текстовых каналах.",
    "kick": "Вы были отключены от Discord-сервера.",
})

tags = ({
    "ПРА-ВО": "⋆ The Board of State ⋆",
    "ГЦЛ": "⋆ The Board of State ⋆",
    "АШ": "⋆ The Board of State ⋆",
    "ЦБ": "⋆ The Board of State ⋆",

    "FBI": "⋆ Department of Justice ⋆",
    "ФБР": "⋆ Department of Justice ⋆",
    "LSPD": "⋆ Department of Justice ⋆",
    "ЛСПД": "⋆ Department of Justice ⋆",
    "SFPD": "⋆ Department of Justice ⋆",
    "СФПД": "⋆ Department of Justice ⋆",
    "LVPD": "⋆ Department of Justice ⋆",
    "ЛВПД": "⋆ Department of Justice ⋆",
    "SWAT": "⋆ Department of Justice ⋆",
    "СВАТ": "⋆ Department of Justice ⋆",
    "RCPD": "⋆ Department of Justice ⋆",
    "РКПД": "⋆ Department of Justice ⋆",

    "LSA": "⋆ Department of Defence ⋆",
    "ЛСА": "⋆ Department of Defence ⋆",
    "SFA": "⋆ Department of Defence ⋆",
    "СФА": "⋆ Department of Defence ⋆",
    "LS-A": "⋆ Department of Defence ⋆",
    "ЛС-А": "⋆ Department of Defence ⋆",
    "SF-A": "⋆ Department of Defence ⋆",
    "СФ-А": "⋆ Department of Defence ⋆",
    "ТСР": "⋆ Department of Defence ⋆",
    "ТЮРЬМА": "⋆ Department of Defence ⋆",

    "LSMC": "⋆ Department of Health ⋆",
    "ЛСМЦ": "⋆ Department of Health ⋆",
    "SFMC": "⋆ Department of Health ⋆",
    "СФМЦ": "⋆ Department of Health ⋆",
    "LVMC": "⋆ Department of Health ⋆",
    "ЛВМЦ": "⋆ Department of Health ⋆",

    "R-LS": "⋆ Mass Media ⋆",
    "RLS": "⋆ Mass Media ⋆",
    "Р-ЛС": "⋆ Mass Media ⋆",
    "РЛС": "⋆ Mass Media ⋆",
    "R-SF": "⋆ Mass Media ⋆",
    "RSF": "⋆ Mass Media ⋆",
    "Р-СФ": "⋆ Mass Media ⋆",
    "РСФ": "⋆ Mass Media ⋆",
    "R-LV": "⋆ Mass Media ⋆",
    "RLV": "⋆ Mass Media ⋆",
    "Р-ЛВ": "⋆ Mass Media ⋆",
    "РЛВ": "⋆ Mass Media ⋆",

    "WMC": "⋆ Warlock MC ⋆",
    "W-MC": "⋆ Warlock MC ⋆",
    "RM": "⋆ Russian Mafia ⋆",
    "РМ": "⋆ Russian Mafia ⋆",
    "LCN": "⋆ La Cosa Nostra ⋆",
    "ЛКН": "⋆ La Cosa Nostra ⋆",
    "YAKUZA": "⋆ Yakuza ⋆",
    "ЯКУДЗА": "⋆ Yakuza ⋆",

    "GROVE": "⋆ Grove Street Gang ⋆",
    "ГРУВ": "⋆ Grove Street Gang ⋆",
    "BALLAS": "⋆ East Side Ballas Gang ⋆",
    "БАЛЛАС": "⋆ East Side Ballas Gang ⋆",
    "VAGOS": "⋆ Vagos Gang ⋆",
    "ВАГОС": "⋆ Vagos Gang ⋆",
    "NW": "⋆ Night Wolfs ⋆",
    "НВ": "⋆ Night Wolfs ⋆",
    "RIFA": "⋆ Rifa Gang ⋆",
    "РИФА": "⋆ Rifa Gang ⋆",
    "AZTEC": "⋆ Aztecas Gang ⋆",  
    "АЦТЕК": "⋆ Aztecas Gang ⋆",  
});

let manytags = [
"ПРА-ВО",
"ГЦЛ",
"АШ",
"ЦБ",

"FBI",
"ФБР",
"LSPD",
"ЛСПД",
"SFPD",
"СФПД",
"LVPD",
"ЛВПД",
"SWAT",
"СВАТ",
"RCPD",
"РКПД",

"LSA",
"ЛСА",
"SFA",
"СФА",
"LS-A",
"ЛС-А",
"SF-A",
"СФ-А",
"ТСР",
"ТЮРЬМА",

"LSMC",
"ЛСМЦ",
"SFMC",
"СФМЦ",
"LVMC",
"ЛВМЦ",

"R-LS",
"RLS",
"Р-ЛС",
"РЛС",
"R-SF",
"RSF",
"Р-СФ",
"РСФ",
"R-LV",
"RLV",
"Р-ЛВ",
"РЛВ",

"WMC",
"W-MC",
"RM",
"РМ",
"LCN",
"ЛКН",
"YAKUZA",
"ЯКУДЗА",

"GROVE",
"ГРУВ",
"BALLAS",
"БАЛЛАС",
"VAGOS",
"ВАГОС",
"AZTEC",  
"АЦТЕК",
"RIFA",
"РИФА",
"NW",
"НВ",
];
let rolesgg = ["⋆ The Board of State ⋆", "⋆ Department of Justice ⋆", "⋆ Department of Defence ⋆", "⋆ Department of Health ⋆", "⋆ Mass Media ⋆", "⋆ Warlock MC ⋆", "⋆ Russian Mafia ⋆", "⋆ La Cosa Nostra ⋆", "⋆ Yakuza ⋆", "⋆ Grove Street Gang ⋆", "⋆ East Side Ballas Gang ⋆", "⋆ Vagos Gang ⋆", "⋆ Aztecas Gang ⋆", "⋆ Rifa Gang ⋆", "⋆ Night Wolfs ⋆"]
let canremoverole = ["✫Deputy Leader✫", "✵Leader✵", "✮Ministers✮", "✔ Helper ✔"];

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

async function check_gifts(){
    setInterval(() => {
        let server = bot.guilds.get(serverid);
        if (server){
            let general = server.channels.find(c => c.name == '💖общенице💖');
            let titan = server.roles.find(r => r.name == '⚡ TITAN ⚡');
            let warrior = server.roles.find(r => r.name == '✮ Night Warrior ✮');
            let spectator = server.roles.find(r => r.name == '💚 Модератор 💚');
            if (titan && warrior){
                connection.query(`SELECT * FROM \`presents\` WHERE \`server\` = '531454559038734356'`, async (err, gifts) => {
                    if (gifts.length != 0){
                        gifts.forEach(async gift => {
                            let user = server.members.get(gift.user);
                            if (user){
                                let date = (new Date().valueOf() + 10800000) - new Date(`${gift.date}`).valueOf();
                                if (+gift.type == 0){
                                    if (date >= 86400000){
                                        if (user.roles.some(r => r.id != titan.id)){
                                            let data = new Date(+new Date().valueOf() + 10800000);
                                            if (data.getHours() != 0 && data.getHours() != 1 && data.getHours() != 2 && data.getHours() != 3){
                                                user.addRole(titan);
                                                await connection.query(`DELETE FROM \`presents\` WHERE \`server\` = '${gift.server}' AND \`user\` = '${gift.user}' AND \`type\` = '${gift.type}'`);
                                                user.send(`${user}, \`вам была выдана роль ${titan.name} за вручение подарков!\``);
                                            }
                                        }
                                    }
                                }else if (+gift.type == 1){
                                    if (date >= 172800000){
                                        if (user.roles.some(r => r.id != warrior.id)){
                                            let data = new Date(+new Date().valueOf() + 10800000);
                                            if (data.getHours() == 0 && data.getHours() == 1 && data.getHours() == 2 && data.getHours() == 3){
                                                user.addRole(warrior);
                                                await connection.query(`DELETE FROM \`presents\` WHERE \`server\` = '${gift.server}' AND \`user\` = '${gift.user}' AND \`type\` = '${gift.type}'`);
                                                user.send(`${user}, \`вам была выдана роль ${warrior.name} за вручение подарков!\``);
                                            }
                                        }
                                    } 
                                }
                            }
                        });
                    }
                });
                let data = new Date(+new Date().valueOf() + 10800000);
                let night_warrior = server.channels.find(c => c.name == 'night-warrior');
                let titan_chat = server.channels.find(c => c.name == 'titan');
                night_warrior.permissionOverwrites.forEach(perm => {
                    if (perm.id == warrior.id){
                        let permissions = new Discord.Permissions(perm.allow);
                        if (data.getHours() != 0 && data.getHours() != 1 && data.getHours() != 2 && data.getHours() != 3){
                            if (permissions.has("SEND_MESSAGES") || permissions.has("ADD_REACTIONS") || permissions.has("USE_EXTERNAL_EMOJIS") || permissions.has("READ_MESSAGE_HISTORY")){
                                night_warrior.overwritePermissions(warrior, {
                                    // GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: true,
                                    ATTACH_FILES: true,
                                    READ_MESSAGE_HISTORY: false,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: false,
                                    ADD_REACTIONS: false,
                                });
                                night_warrior.send(`<@&${warrior.id}>, \`ночной чат открыт только ночью! Сейчас он закрывается!\``);
                            }
                        }else{
                            if (!permissions.has("SEND_MESSAGES") || !permissions.has("ADD_REACTIONS") || !permissions.has("USE_EXTERNAL_EMOJIS") || !permissions.has("READ_MESSAGE_HISTORY")){
                                night_warrior.overwritePermissions(warrior, {
                                    // GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: true,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: true,
                                    ATTACH_FILES: true,
                                    READ_MESSAGE_HISTORY: true,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: true,
                                    ADD_REACTIONS: true,
                                });
                                night_warrior.send(`<@&${warrior.id}>, \`ночной чат открыт!\``);
                            }
                        }
                    }else if (perm.id == spectator.id){
                        let permissions = new Discord.Permissions(perm.allow);
                        if (data.getHours() != 0 && data.getHours() != 1 && data.getHours() != 2 && data.getHours() != 3){
                            if (permissions.has("SEND_MESSAGES") || permissions.has("ADD_REACTIONS") || permissions.has("USE_EXTERNAL_EMOJIS")){
                                night_warrior.overwritePermissions(spectator, {
                                    // GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: true,
                                    ATTACH_FILES: true,
                                    READ_MESSAGE_HISTORY: true,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: false,
                                    ADD_REACTIONS: false,
                                });
                            }
                        }else{
                            if (!permissions.has("SEND_MESSAGES") || !permissions.has("ADD_REACTIONS") || !permissions.has("USE_EXTERNAL_EMOJIS")){
                                night_warrior.overwritePermissions(spectator, {
                                    // GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: true,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: true,
                                    ATTACH_FILES: true,
                                    READ_MESSAGE_HISTORY: true,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: true,
                                    ADD_REACTIONS: true,
                                });
                            }
                        }
                    }
                });

                titan_chat.permissionOverwrites.forEach(perm => {
                    if (perm.id == titan.id){
                        let permissions = new Discord.Permissions(perm.allow);
                        if (data.getHours() == 0 && data.getHours() == 1 && data.getHours() == 2 && data.getHours() == 3){
                            if (permissions.has("SEND_MESSAGES") || permissions.has("ADD_REACTIONS") || permissions.has("USE_EXTERNAL_EMOJIS") || permissions.has("READ_MESSAGE_HISTORY")){
                                titan_chat.overwritePermissions(titan, {
                                    // GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: true,
                                    ATTACH_FILES: true,
                                    READ_MESSAGE_HISTORY: false,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: false,
                                    ADD_REACTIONS: false,
                                });
                                titan_chat.send(`<@&${titan.id}>, \`чат открыт только утром, днем и вечером! Сейчас он закрывается!\``);
                            }
                        }else{
                            if (!permissions.has("SEND_MESSAGES") || !permissions.has("ADD_REACTIONS") || !permissions.has("USE_EXTERNAL_EMOJIS") || !permissions.has("READ_MESSAGE_HISTORY")){
                                titan_chat.overwritePermissions(titan, {
                                    // GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: true,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: true,
                                    ATTACH_FILES: true,
                                    READ_MESSAGE_HISTORY: true,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: true,
                                    ADD_REACTIONS: true,
                                });
                                titan_chat.send(`<@&${titan.id}>, \`чат открыт!\``);
                            }
                        }
                    }else if (perm.id == spectator.id){
                        let permissions = new Discord.Permissions(perm.allow);
                        if (data.getHours() == 0 && data.getHours() == 1 && data.getHours() == 2 && data.getHours() == 3){
                            if (permissions.has("SEND_MESSAGES") || permissions.has("ADD_REACTIONS") || permissions.has("USE_EXTERNAL_EMOJIS")){
                                titan_chat.overwritePermissions(spectator, {
                                    // GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: true,
                                    ATTACH_FILES: true,
                                    READ_MESSAGE_HISTORY: true,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: false,
                                    ADD_REACTIONS: false,
                                });
                            }
                        }else{
                            if (!permissions.has("SEND_MESSAGES") || !permissions.has("ADD_REACTIONS") || !permissions.has("USE_EXTERNAL_EMOJIS")){
                                titan_chat.overwritePermissions(spectator, {
                                    // GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: true,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: true,
                                    ATTACH_FILES: true,
                                    READ_MESSAGE_HISTORY: true,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: true,
                                    ADD_REACTIONS: true,
                                });
                            }
                        }
                    }
                });
            }
        }
    }, 60000);
}

async function update_sellers(){
    setInterval(() => {
        let server = bot.guilds.get('531454559038734356');
        if (!server) return
        let channel = server.channels.find(c => c.name == 'buy-dashboard');
        if (!channel) return
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`status\` = '1' AND \`amount\` > 0 AND \`server\` = '531454559038734356'`, async (err, result, fields) => {
            channel.fetchMessages({limit: 1}).then(async messages => {
                let names = [];
                let cost = [];
                let amount = [];
                result.forEach(res => {
                    names.push(res.name);
                    cost.push(res.cost);
                    amount.push(res.amount);
                });
                const table = new Discord.RichEmbed();
                table.setTitle(`**Ассортимент Discord-сервера**`);
                table.setDescription(`**В данном канале вы можете приобрести товары у администрации discord-сервера! В качестве цены указана валюта - Discord Point (₯).\nКоманда для покупки товара: /buy [название товара]**`);
                table.setColor(`#0601ff`);
                if (names.length > 0) table.addField(`Название товара`, `${names.join('\n')}`, true);
                if (amount.length > 0) table.addField(`В наличии`, `${amount.join('\n')}`, true);
                if (cost.length > 0) table.addField(`Цена`, `${cost.join(' ₯\n')} ₯`, true);
                table.setFooter(`© Сopyright 2019`, server.icon_url);
                let msg = messages.first();
                if (!msg){
                    channel.send(table);
                }else{
                    msg.edit(table);
                }
            });
        });
    }, 20000)
}

function checknick (member, role, startnum, endnum, bot, message){
    if (member.roles.some(r => [role].includes(r.name))){
        let ruletagst = startnum
        let ruletagend = endnum
        let rpname = false;
        for (i in manytags){
            if (i >= ruletagst && i <= ruletagend)
            if (member.displayName.toUpperCase().includes(manytags[i])) rpname = true;
        }
        if (!rpname){
            if (!nrpnames.has(member.id)){
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        member.removeRole(rolerem).then(() => {	
                            setTimeout(function(){
                                if(member.roles.has(rolerem)){
                                    member.removeRole(rolerem);
                                }
                            }, 5000);
                        }).catch(console.error);
                    }
                }
                nrpnames.add(member.id)
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max + 1);
    return Math.floor(Math.random() * (max - min)) + min;
}

function hook(channel, message, webhook_name, name, time, avatar) {
    if (!channel) return console.log('Канал не выбран.');
    if (!message) return console.log('Сообщение не указано.');
    if (!webhook_name) return console.log('ВебХук не найден.');
    if (!avatar) avatar = 'https://i.imgur.com/SReVrGM.png';
    channel.fetchWebhooks().then(webhook => {
        let foundHook = webhook.find(web => web.name == webhook_name)
        if (!foundHook){
            channel.createWebhook(webhook_name, avatar).then(webhook => {
                webhook.send(message, {
                    "username": name,
                    "avatarURL": avatar,
                }).then(msg => {
                    if (time) msg.delete(time)
                })
            })
        }else{
            foundHook.send(message, {
                "username": name,
                "avatarURL": avatar,
            }).then(msg => {
                if (time) msg.delete(time)
            })
        }
    })
}

const warn_cooldown = new Set();
const support_loop = new Set(); 
const fbi_dostup = new Set();
fbi_dostup.add("349846714892419074");
fbi_dostup.add("349846714892419074");

bot.login(process.env.token);
bot.on('ready', () => {
    console.log("Бот был успешно запущен!");
    bot.user.setActivity('за порядком', { type: "WATCHING" });
    require('./plugins/remote_access').start(bot); // Подгрузка плагина удаленного доступа.
});

bot.on('message', async message => {
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.guild.id != serverid && message.guild.id != "532206892240601088") return
    if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн!`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    if (message.author.id == bot.user.id) return
    if (message.content.startsWith("-+ban")) lasttestid = message.author.id;
    
    let re = /(\d+(\.\d)*)/i;
	
    const authorrisbot = new Discord.RichEmbed()
    .setAuthor(`© 2019 Oye Bot™`, `https://i.imgur.com/V80KM2u.jpg`)
    
    if (!support_loop.has(message.guild.id) && message.channel.name != "🌀саппорт🌀"){
        support_loop.add(message.guild.id)
        setTimeout(() => {
            if (support_loop.has(message.guild.id)) support_loop.delete(message.guild.id);
        }, 600000);
        message.guild.channels.forEach(async channel => {
            if (channel.name.startsWith('ticket-')){
                if (message.guild.channels.find(c => c.id == channel.parentID).name == 'Корзина'){
                    let log_channel = message.guild.channels.find(c => c.name == "🚽reports-log🚽");
                    channel.fetchMessages({limit: 1}).then(async messages => {
                        if (messages.size == 1){
                            messages.forEach(async msg => {
                                let s_now = new Date().valueOf() - 86400000;
                                if (msg.createdAt.valueOf() < s_now){
                                    let archive_messages = [];
                                    await channel.fetchMessages({limit: 100}).then(async messagestwo => {
                                        messagestwo.forEach(async msgcopy => {
                                            let date = new Date(+msgcopy.createdAt.valueOf() + 10800000);
                                            let formate_date = `[${date.getFullYear()}-` + 
                                            `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
                                            `${date.getDate().toString().padStart(2, '0')} ` + 
                                            `${date.getHours().toString().padStart(2, '0')}-` + 
                                            `${date.getMinutes().toString().padStart(2, '0')}-` + 
                                            `${date.getSeconds().toString().padStart(2, '0')}]`;
                                            if (!msgcopy.embeds[0]){
                                                archive_messages.push(`${formate_date} ${msgcopy.member.displayName}: ${msgcopy.content}`);
                                            }else{
                                                archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msgcopy.embeds[0].fields[1].value}`);
                                                archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msgcopy.embeds[0].fields[0].value}`);
                                                archive_messages.push(`${formate_date} ${msgcopy.member.displayName}: ${msgcopy.content}`);
                                            }
                                        });
                                    });
                                    let i = archive_messages.length - 1;
                                    while (i>=0){
                                        await fs.appendFileSync(`./${channel.name}.txt`, `${archive_messages[i]}\n`);
                                        i--
                                    }
                                    await log_channel.send(`\`[SYSTEM]\` \`Канал ${channel.name} был удален. [24 часа в статусе 'Закрыт']\``, { files: [ `./${channel.name}.txt` ] });
                                    channel.delete();
                                    fs.unlinkSync(`./${channel.name}.txt`);
                                }
                            });
                        }
                    });
                }else if(message.guild.channels.find(c => c.id == channel.parentID).name == 'Активные жалобы'){
                    let log_channel = message.guild.channels.find(c => c.name == "🔑чат-модераторов🔑");
                    channel.fetchMessages({limit: 1}).then(messages => {
                        if (messages.size == 1){
                            messages.forEach(msg => {
                                let s_now = new Date().valueOf() - 18000000;
                                if (msg.createdAt.valueOf() < s_now){
                                    log_channel.send(`\`[SYSTEM]\` \`Жалоба\` <#${channel.id}> \`уже более 5-ти часов ожидает проверки!\``);
                                    channel.send(`\`[SYSTEM]\` \`Привет! Я напомнил модераторам про твое обращение!\``)
                                }
                            });
                        }
                    });
                }
            }
        });
        // UNWARN SYSTEM
        let dataserver = bot.guilds.find(g => g.id == "532206892240601088");
        dataserver.channels.forEach(async channel => {
            if (channel.type=="text"){
                if (channel.name != 'administration' && channel.name != 'accounts' && channel.name != 'bad-words' && channel.name != 'err-code' && channel.name != 'config'){
                    await channel.fetchMessages({limit: 1}).then(async messages => {
                        if (messages.size == 1){
                            messages.forEach(async sacc => {
                                let str = sacc.content;
                                let moderation_level = str.split('\n')[0].match(re)[0];
                                let moderation_warns = str.split('\n')[1].match(re)[0];
                                let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
                                let moderation_reason = [];
                                let user_reason = [];
                                let moderation_time = [];
                                let user_time = [];
                                let moderation_give = [];
                                let user_give = [];
            
                                let circle = 0;
                                while (+moderation_warns > circle){
                                    moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
                                    moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
                                    moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
                                    circle++;
                                }
                
                                circle = 0;
				let rem = 0;
                                while (+user_warns > circle){
                                    let myDate = new Date().valueOf();
                                    if (+str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1] > myDate){
                                        user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                                        user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                                        user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                                    }else{
					rem++
                                        let genchannel = message.guild.channels.find(c => c.name == "💖общенице💖");
                                        genchannel.send(`<@${channel.name}>, \`вам было снято одно предупреждение. [Прошло 3 дня]\``, authorrisbot);
                                    }
                                    circle++;
                                }
				user_warns = +user_warns - +rem;
                                let text_end = `Уровень модератора: ${moderation_level}\n` + 
                                `Предупреждения модератора: ${moderation_warns}`;
                                for (var i = 0; i < moderation_reason.length; i++){
                                    text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
                                }
                                text_end = text_end + `\nПредупреждений: ${+user_warns}`;
                                for (var i = 0; i < user_reason.length; i++){
                                    text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
                                }
                                if (+moderation_level == 0 && +moderation_warns == 0 && +user_warns == 0){
                                    channel.delete();
                                }else{
                                    sacc.edit(text_end);
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    
    if (message.channel.name == "🌀саппорт🌀"){
        if (message.member.bot) return message.delete();
        if (support_cooldown.has(message.author.id)) {
            return message.delete();
        }
        support_cooldown.add(message.author.id);
        setTimeout(() => {
            if (support_cooldown.has(message.author.id)) support_cooldown.delete(message.author.id);
        }, 300000);
        let id_mm;
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "532206892240601088");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                await message.channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message){
            await message.channel.send(`` +
            `**Приветствую! Вы попали в канал поддержки Discord сервера сообщетсва omg. your eyes.**\n` +
            `**Тут Вы сможете задать вопрос модераторам сервера!**\n\n` +
            `**Количество вопросов за все время: 0**\n` +
            `**Необработанных модераторами: 0**\n` +
            `**Вопросы на рассмотрении: 0**\n` +
            `**Закрытых: 0**`).then(async msg => {
                db_channel.send(`MESSAGEID: ${msg.id}`)
                rep_message = await message.channel.fetchMessage(msg.id);
            });
        }
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
	const imageemb = new Discord.RichEmbed()
        .setImage("https://imgur.com/LKDbJeM.gif")
        rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки Discord сервера сообщетсва omg. your eyes.**\n` +
            `**Тут Вы сможете задать вопрос модераторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${+info_rep[0] + 1}**\n` +
            `**Необработанных модераторами: ${+info_rep[1] + 1}**\n` +
            `**Вопросы на рассмотрении: ${info_rep[2]}**\n` +
            `**Закрытых: ${info_rep[3]}**`, imageemb)
        let s_category = message.guild.channels.find(c => c.name == "Активные жалобы");
        if (!s_category) return message.delete(3000);
        await message.guild.createChannel(`ticket-${+info_rep[0] + 1}`).then(async channel => {
            message.delete();    
            await channel.setParent(s_category.id);
            await channel.setTopic('Жалоба в обработке.')
            let moderator_role = await message.guild.roles.find(r => r.name == '💜 Саппорт 💜');
            await channel.overwritePermissions(moderator_role, {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
            })  
            await channel.overwritePermissions(message.member, {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
            })  
            await channel.overwritePermissions(message.guild.roles.find(r => r.name == "@everyone"), {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
            })  
            channel.send(`<@${message.author.id}> \`для команды поддержки\` <@&${moderator_role.id}>`, {embed: {
            color: 3447003,
            title: "Обращение к поддержке Discord",
            fields: [{
                name: "Отправитель",
                value: `**Пользователь:** <@${message.author.id}>`,
            },{
                name: "Суть обращения",
                value: `${message.content}`,
            }]
            }});
            let sp_chat_get = message.guild.channels.find(c => c.name == "🚽reports-log🚽");
            await sp_chat_get.send(`\`[CREATE]\` <@${message.author.id}> \`создал обращение к поддержке:\` <#${channel.id}>`);
            message.channel.send(`<@${message.author.id}>, \`обращение составлено. Нажмите на\` <#${channel.id}>`).then(msg => msg.delete(15000));
        });
    }

    if (message.content.startsWith('/gift')){
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.reply(`\`укажите пользователя, которому нужно отправить подарок!\` :gift: `);
            return message.delete();
        }
        if (!message.member.roles.some(r => r.name == '⚡ TITAN ⚡')){
            message.reply(`\`у вас нет подарков. недоступно.\``);
            return message.delete();
        }
        if (user.roles.some(r => r.name == '⚡ TITAN ⚡')){
            message.reply(`\`у пользователя уже есть этот подарок!\``);
            return message.delete();
        }
        let date = new Date(+new Date().valueOf() + 10800000);
        if (date.getHours() == 0 && date.getHours() == 1 && date.getHours() == 2 && date.getHours() == 3){
            message.reply(`\`данный подарок нужно дарить в дневное время суток.\``);
            return message.delete();
        }
            let general = message.guild.channels.find(c => c.name == '💖общенице💖');
            let role = message.guild.roles.find(r => r.name == '⚡ TITAN ⚡');
            user.addRole(role);
            message.member.removeRole(role);
            if (general) general.send(`${user}, \`пользователь\` ${message.member} \`подарил вам роль\` <@&${role.id}>!`);
            return message.delete();
        }

        if (message.content.startsWith('/night_gift')){
            let user = message.guild.member(message.mentions.users.first());
            if (!user){
                message.reply(`\`укажите пользователя, которому нужно отправить подарок!\` :gift: `);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.name == '✮ Night Warrior ✮')){
                message.reply(`\`у вас нет подарков. недоступно.\``);
                return message.delete();
            }
            if (user.roles.some(r => r.name == '✮ Night Warrior ✮')){
                message.reply(`\`у пользователя уже есть этот подарок!\``);
                return message.delete();
            }
            let date = new Date(+new Date().valueOf() + 10800000);
            if (date.getHours() != 0 && date.getHours() != 1 && date.getHours() != 2 && date.getHours() != 3){
                message.reply(`\`данный подарок нужно дарить в ночное время суток.\``);
                return message.delete();
            }
                let general = message.guild.channels.find(c => c.name == '💖общенице💖');
                let role = message.guild.roles.find(r => r.name == '✮ Night Warrior ✮');
                user.addRole(role);
                message.member.removeRole(role);
                if (general) general.send(`${user}, \`пользователь\` ${message.member} \`подарил вам роль\` <@&${role.id}>!`);
                return message.delete();
        }

    if (message.content == '/hold'){
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.' || message.channel.topic == 'Жалоба на рассмотрении.') return message.delete();
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "532206892240601088");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                let ticket_channel = message.guild.channels.find(c => c.name == '🌀саппорт🌀');
                await ticket_channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message) return message.delete();
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
	const imageemb = new Discord.RichEmbed()
        .setImage("https://imgur.com/LKDbJeM.gif")
        rep_message.edit(`` +
        `**Приветствую! Вы попали в канал поддержки Discord сервера сообщества omg. your eyes.**\n` +
        `**Тут Вы сможете задать вопрос модераторам сервера!**\n\n` +
        `**Количество вопросов за все время: ${info_rep[0]}**\n` +
        `**Необработанных модераторами: ${+info_rep[1] - 1}**\n` +
        `**Вопросы на рассмотрении: ${+info_rep[2] + 1}**\n` +
        `**Закрытых: ${info_rep[3]}**`, imageemb)
        let s_category = message.guild.channels.find(c => c.name == "Жалобы на рассмотрении");
        if (!s_category) return message.delete(3000);
        await message.channel.setParent(s_category.id);
        let sp_chat_get = message.guild.channels.find(c => c.name == "🚽reports-log🚽");
        message.channel.setTopic('Жалоба на рассмотрении.')
        if (memberid != 'не найден'){
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'На рассмотрении'. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[HOLD]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
        }else{
            message.channel.send(`\`[STATUS]\` \`Данной жалобе был установлен статус: 'На рассмотрении'. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[HOLD]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
        }
        message.delete();
    }
	
        if (message.content.startsWith("/newsp")){
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.delete();
        const args = message.content.slice(`/newsp`).split(/ +/);
        if (!args[1]){
            message.reply(`\`укажите день! '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`укажите название месяца! '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (!args[3]){
            message.reply(`\`укажите ссылку на заявку! '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (args[1] > 31 || args[1] < 1 || args[2] > 12 || args[2] < 1){
            message.reply(`\`У нас всего 12 месяцев и 31 день. '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (args[2] == 1) args[2] = 'января';
        if (args[2] == 2) args[2] = 'февраля';
        if (args[2] == 3) args[2] = 'марта';
        if (args[2] == 4) args[2] = 'апреля';
        if (args[2] == 5) args[2] = 'мая';
        if (args[2] == 6) args[2] = 'июня';
        if (args[2] == 7) args[2] = 'июля';
        if (args[2] == 8) args[2] = 'августа';
        if (args[2] == 9) args[2] = 'сентября';
        if (args[2] == 10) args[2] = 'октября';
        if (args[2] == 11) args[2] = 'ноября';
        if (args[2] == 12) args[2] = 'декабря';
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.delete();
        let textforobz = "**  ╔┓┏╦━━╦┓╔┓╔━━╗ @everyone\n  ║┗┛║┗━╣┃║┃║╯╰║ @everyone\n  ║┏┓║┏━╣┗╣┗╣╰╯║ @everyone\n  ╚┛┗╩━━╩━╩━╩━━╝ @everyone**";
        const embed = new Discord.RichEmbed()
	.setAuthor(`© 2019 Oye Bot™`, `https://i.imgur.com/V80KM2u.jpg`, "https://vk.com/omgyoureyes")
        .setTitle("**Заявления на пост модератора Discord сервера**")
        .setColor("#FF8E01")
        .setDescription("**Мы вернулись, что бы обрадовать вас! Ведь " + args[1] + " " + args[2] + " пройдет набор на пост Модератора нашего Discord сервера!\nВы сможете стать одним из нас, почуствовать себя в роли модератора, последить за пользователями, а так же получить доступ к супер секретным функциям нашего Discord сервера. Все, что вам нужно будет делать, это наводить порядок на нашем Discord сервере и помогать пользователям!**")
        .setFooter("Предоставил: Создатель всея Discord'a", "https://cdn.discordapp.com/avatars/349846714892419074/3491e24e7e1916637401d061502fc7e0.png?size=128")
        .setImage("https://i.imgur.com/nFD61xf.gif")
        .setTimestamp()
        .addBlankField(false)
        .addField("**Что нужно, что бы попасть к нам?**", `**1) Вам нужно будет знать правила нашего Discord сервера! Если вы хотите стать модератором, то вы должны знать за что идут наказания. Не правда ли?\n2) Вам нужно понимать систему модерирования. Ведь просто ходить по каналам и орать на нарушителя "Прекрати!" будет выглядить глупо.\n3) Наметить себе будущую должность. Один модератор не может за всем уследить, кто-то может следить за чатом, когда другой сидит в канале и поет песни для наших участников сервера Discord.\n4) Быть дружелюбным и разумным! Одна из самых главных особенностей! Мы же помогаем игрокам! И даже если у них что-то сломалось и они нафлудят в чат, более разумным будет удалить сообщение от пользователя, чем выдать мут за флуд!\n5) Не делать того, что не нужно! В будущем вы можете модерировать свой текстовой канал! ~~И делать обзвоны на редактора канала.~~ Стоп-стоп-стоп.. Зачем? Вы не справляетесь? Вам нужно лишнее внимание?! Пожалуй этого делать не стоит!**`)
        .addBlankField(false)
        .addField("**Требования к участникам**", "**1) Не состоять в черном списке нашего Discord сервера [!]\n2) Быть активным участником нашего Discord сервера.\n3) У вас не должно быть грубых нарушений.\n4) Быть адекватным, коммуникабельным, ответственным.**")
        .addBlankField(false)
        .addField("**Дополнительные ссылки**", "**Оставить заявление вы можете нажав на [выделенный текст](" + args[3] + ").**");
        message.channel.send(textforobz, {embed});
        return message.delete()
    }

    if (message.content == '/active'){
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.' || message.channel.topic != 'Жалоба на рассмотрении.') return message.delete();
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "532206892240601088");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                let ticket_channel = message.guild.channels.find(c => c.name == '🌀саппорт🌀');
                await ticket_channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message) return message.delete();
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
	const imageemb = new Discord.RichEmbed()
        .setImage("https://imgur.com/LKDbJeM.gif")
        rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки Discord сервера сообщества omg. your eyes.**\n` +
            `**Тут Вы сможете задать вопрос модераторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${info_rep[0]}**\n` +
            `**Необработанных модераторами: ${+info_rep[1] + 1}**\n` +
            `**Вопросы на рассмотрении: ${+info_rep[2] - 1}**\n` +
            `**Закрытых: ${info_rep[3]}**`, imageemb)
        let s_category = message.guild.channels.find(c => c.name == "Активные жалобы");
        if (!s_category) return message.delete(3000);
        await message.channel.setParent(s_category.id);
        let sp_chat_get = message.guild.channels.find(c => c.name == "🚽reports-log🚽");
        message.channel.setTopic('Жалоба в обработке.');
        if (memberid != 'не найден'){
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'В обработке'. Источник: ${message.member.displayName}\``);
        }else{
            message.channel.send(`\`[STATUS]\` \`Данной жалобе был установлен статус: 'В обработке'. Источник: ${message.member.displayName}\``);
        }
        sp_chat_get.send(`\`[UNWAIT]\` \`Модератор ${message.member.displayName} убрал жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
        message.delete();
    }
    
    if (message.content == '/toadmin'){
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == '��алоба закрыта.') return message.delete();
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '💜 Саппорт 💜'), {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
        })  

        await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '@everyone'), {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
        })     
        let replog = message.guild.channels.find(c => c.name == "🚽reports-log🚽");
        let role = message.guild.roles.find(r => r.name == '💘 Одмен 💘');
        let notify = message.guild.channels.find(c => c.name == '💡уведомления💡');
        if (memberid != 'не найден'){        
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`ваше обращение было передано администрации. Источник: ${message.member.displayName}\``);
        }else{
            message.channel.send(`\`[STATUS]\` \`Данное обращение было передано администрации. Источник: ${message.member.displayName}\``);
        }
        message.channel.send(`\`[ADMIN]\` <@&${role.id}>, \`данная жалоба была передана Вам!\``);
        replog.send(`\`[ADMIN]\` \`Модератор ${message.member.displayName} передал жалобу\` <#${message.channel.id}> \`администрации.\``);
        message.delete();
        if (notify) notify.send(`\`Модератор ${message.member.displayName} передал жалобу\` <#${message.channel.id}> \`администрации\` (<@&${role.id}>), \`Вам необходимо срочно отреагировать!\``);
    }

    if (message.content == '/close'){
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.') return message.delete();
        let full_support = false;
        let s_category = message.guild.channels.find(c => c.name == "Корзина");
        if (!s_category) return message.delete(3000);
        await message.channel.setParent(s_category.id).catch(err => {
            full_support = true;
        });
        if (full_support){
            message.reply(`\`корзина заполнена! Повторите попытку чуть позже!\``).then(msg => msg.delete(12000));
            return message.delete();  
        }
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
            memberid = await perm.id;
            }
        });
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "532206892240601088");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                let ticket_channel = message.guild.channels.find(c => c.name == '🌀саппорт🌀');
                await ticket_channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message) return message.delete();
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
	let imageemb = new Discord.RichEmbed()
	.setAuthor(`© 2019 Oye Bot™`, `https://i.imgur.com/V80KM2u.jpg`, "https://vk.com/omgyoureyes")
        .setImage("https://imgur.com/LKDbJeM.gif");
        if (message.channel.topic == 'Жалоба на рассмотрении.'){
            rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки Discord сервера сообщества omg. your eyes.**\n` +
            `**Тут Вы сможете задать вопрос модераторам!**\n\n` +
            `**Количество вопросов за все время: ${info_rep[0]}**\n` +
            `**Необработанных модераторами: ${info_rep[1]}**\n` +
            `**Вопросы на рассмотрении: ${+info_rep[2] - 1}**\n` +
            `**Закрытых: ${+info_rep[3] + 1}**`, imageemb)
        }else{
            rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки Discord сервера сообщества omg. your eyes.**\n` +
            `**Тут Вы сможете задать вопрос модераторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${info_rep[0]}**\n` +
            `**Необработанных модераторами: ${+info_rep[1] - 1}**\n` +
            `**Вопросы на рассмотрении: ${info_rep[2]}**\n` +
            `**Закрытых: ${+info_rep[3] + 1}**`, imageemb)
        }
        if (memberid != 'не найден'){
            await message.channel.overwritePermissions(message.guild.members.find(m => m.id == memberid), {
                // GENERAL PERMISSIONS
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false,
                // TEXT PERMISSIONS
                VIEW_CHANNEL: true,
                SEND_MESSAGES: false,
                SEND_TTS_MESSAGES: false,
                MANAGE_MESSAGES: false,
                EMBED_LINKS: false,
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                ADD_REACTIONS: false,
            })
            
            await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '💜 Саппорт 💜'), {
                // GENERAL PERMISSIONS
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false,
                // TEXT PERMISSIONS
                VIEW_CHANNEL: true,
                SEND_MESSAGES: false,
                SEND_TTS_MESSAGES: false,
                MANAGE_MESSAGES: false,
                EMBED_LINKS: false,
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                ADD_REACTIONS: false,
            })  
        }
        let sp_chat_get = message.guild.channels.find(c => c.name == "🚽reports-log🚽");
        message.channel.setTopic('Жалоба закрыта.');
        if (memberid != 'не найден'){
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'Закрыта'. Источник: ${message.member.displayName}\``);
        }else{
            message.channel.send(`\`[STATUS]\` \`Данной жалобе был установлен статус: 'Закрыта'. Источник: ${message.member.displayName}\``);
        }
        sp_chat_get.send(`\`[CLOSE]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'Закрыта'.\``);
        message.delete();
    }
    
    if (message.content.startsWith(`/run`)){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.delete();
        const args = message.content.slice(`/run`).split(/ +/);
        let cmdrun = args.slice(1).join(" ");
        eval(cmdrun);
    }
	
    if (message.content == '/reset_ddos'){
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.reply(`нет прав.`)
        levelhigh = 0;
        message.channel.send(`\`[SYSTEM]\` \`Уровень опасности сервера был установлен на 0. Источник: ${message.member.displayName}\``)
    }
    
    if (message.content.toLowerCase().startsWith(`/bug`)){
        const args = message.content.slice('/bug').split(/ +/);
        if (!args[1]){
            message.reply(`\`привет! Для отправки отчета об ошибках используй: /bug [текст]\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        let bugreport = args.slice(1).join(" ");
        if (bugreport.length < 5 || bugreport.length > 1300){
            message.reply(`\`нельзя отправить запрос с длинной меньше 5 или больше 1300 символов!\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        let author_bot = message.guild.members.find(m => m.id == 349846714892419074);
        if (!author_bot){
            message.reply(`\`я не смог отправить сообщение.. Создателя данного бота нет на данном сервере.\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        author_bot.send(`**Привет! Пользователь <@${message.author.id}> \`(${message.author.id})\` отправил запрос с сервера \`${message.guild.name}\` \`(${message.guild.id})\`.**\n` +
        `**Суть обращения:** ${bugreport}`);
        message.reply(`\`хэй! Я отправил твое сообщение на рассмотрение моему боссу робохомячков!\``).then(msg => msg.delete(15000));
        return message.delete();
    }

    let dataserver = bot.guilds.find(g => g.id == "532206892240601088");
    let scottdale = bot.guilds.find(g => g.id == "531454559038734356");
    if (!dataserver){
        message.channel.send(`\`Дата-сервер omg. your eyes. не был загружен!\nПередайте это сообщение техническому администратору Discord:\`<@349846714892419074>`)
        console.error(`Процесс завершен. Data-Server не найден.`)
        return bot.destroy();
    }
	
    if (message.content.startsWith("/setup")){
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "532206892240601088");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 2) return
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.reply(`\`пользователь не указан! '/setup [user] [уровень]'\``)
            return message.delete();
        }
        const args = message.content.slice(`/setup`).split(/ +/);
        if (!args[2]){
            message.reply(`\`укажи число! '/setup [user] [уровень]'\``)
            return message.delete();
        }
        if (typeof +args[2] != "number") {
            message.reply(`\`укажи число! '/setup [user] [уровень]'\``)
            return message.delete();
        }
        /*
        [0] - снять права доступа
        [1] - может использовать /embhelp и все что с ним связано.
        [2] - может выдавать права доступа на /embhelp
        ADMINISTRATOR само собой
        */
        if (args[2] > 2 || args[2] < 0){
            message.reply(`\`укажи верный уровень доступа! '/setup [user] [уровень (0-2)]'\``)
            return message.delete();
        }
	if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod <= +args[2]){
            message.reply(`\`ты не можешь выдавать уровень равный твоему или выше '/setup [user] [уровень (0-2)]'\``)
            return message.delete();
	}
        let acc = db_server.channels.find(c => c.name == user.id);
        if (!acc){
            await db_server.createChannel(user.id).then(async chan => {
		await chan.setTopic(`<@${user.id}> - ${user.displayName}`);
                acc = chan;
            });
        }

        await acc.fetchMessages({limit: 1}).then(async messages => {
            if (messages.size == 1){
                messages.forEach(async sacc => {
                    let str = sacc.content;
                    let moderation_level = str.split('\n')[0].match(re)[0];
                    let moderation_warns = str.split('\n')[1].match(re)[0];
                    let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
                    let moderation_reason = [];
                    let user_reason = [];
                    let moderation_time = [];
                    let user_time = [];
                    let moderation_give = [];
                    let user_give = [];
                    
                    let circle = 0;
                    while (+moderation_warns > circle){
                        moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
                        moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
                        moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
                        circle++;
                    }
            
                    circle = 0;
                    while (+user_warns > circle){
                        user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                        user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                        user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                        circle++;
                    }
                    
                    moderation_level = +args[2];

                    if (+moderation_level == 0 && +moderation_warns == 0 && +user_warns == 0){
                        acc.delete();
                    }else{
                        let text_end = `Уровень модератора: ${+moderation_level}\n` + 
                        `Предупреждения модератора: ${+moderation_warns}`;
                        for (var i = 0; i < moderation_reason.length; i++){
                        text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
                        }
                        text_end = text_end + `\nПредупреждений: ${+user_warns}`;
                        for (var i = 0; i < user_reason.length; i++){
                        text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
                        }
                        sacc.edit(text_end);
                    }
                    let ann = message.guild.channels.find(c => c.name == "💡уведомления💡");
                    ann.send(`\`Модератор\` <@${message.author.id}> \`установил пользователю\` <@${user.id}> \`уровень модерирования: ${args[2]}\``);
                    return message.delete();
                });
            }else{
                if (+args[2] != 0){
                    await acc.send(`Уровень модератора: ${args[2]}\n` +
                    `Предупреждения модератора: 0\n` +
                    `Предупреждений: 0`);
                    let ann = message.guild.channels.find(c => c.name == "💡уведомления💡");
                    ann.send(`\`Модератор\` <@${message.author.id}> \`установил пользователю\` <@${user.id}> \`уровень модерирования: ${args[2]}\``);
                    return message.delete();
                }
            }
        });
    }
	
    if (message.content == '/embhelp'){
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "532206892240601088");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 1) return
        message.reply(`\`Команды для модерации: /embsetup, /embfield, /embsend - отправить.\``);
        return message.delete();
    }
	
	if (message.content.startsWith("/add")){
  if (!fbi_dostup.has(message.author.id) && !message.member.hasPermission("ADMINISTRATOR")){
    message.reply(`\`недостаточно прав доступа.\``, authorrisbot).then(msg => msg.delete(10000));
    return message.delete();
  }
  let user = message.guild.member(message.mentions.users.first());
  if (!user){
    message.reply(`\`укажите пользователя! '/add @упоминание'\``).then(msg => msg.delete(15000));
    return message.delete();
  }
  let fbi_category = message.guild.channels.find(c => c.name == "FBI ALL CHANNELS");
  await fbi_category.overwritePermissions(user, {
    // GENERAL PERMISSIONS
    CREATE_INSTANT_INVITE: false,
    MANAGE_CHANNELS: false,
    MANAGE_ROLES: false,
    MANAGE_WEBHOOKS: false,
    // TEXT PERMISSIONS
    VIEW_CHANNEL: true,
    SEND_MESSAGES: true,
    SEND_TTS_MESSAGES: false,
    MANAGE_MESSAGES: false,
    EMBED_LINKS: true,
    ATTACH_FILES: true,
    READ_MESSAGE_HISTORY: true,
    MENTION_EVERYONE: false,
    USE_EXTERNAL_EMOJIS: true,
    ADD_REACTIONS: true,

    CONNECT: true,
    SPEAK: true,
    MUTE_MEMBERS: false,
    DEAFEN_MEMBERS: false,
    MOVE_MEMBERS: false,
    USE_VAD: true,
    PRIORITY_SPEAKER: false,
  })
  message.reply(`\`вы успешно выдали доступ пользователю\` <@${user.id}> \`к каналу FBI.\``);
  return message.delete();
}

    if (message.content.startsWith("/embsetup")){
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "532206892240601088");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 1) return
        const args = message.content.slice(`/embsetup`).split(/ +/);
        if (!args[1]){
            message.reply(`\`укажите, что вы установите! Ниже предоставлен список настроек.\`\n\`[1] - Название\`\n\`[2] - Описание\`\n\`[3] - Цвет [#FFFFFF]\`\n\`[4] - Время\`\n\`[5] - Картинка\`\n\`[6] - Подпись\`\n\`[7] - Картинка к подписи\``);
            return message.delete();
        }
        if (typeof(+args[1]) != "number"){
            message.reply(`\`вы должны указать число! '/embsetup [число] [значение]'\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`значение отстутствует!\``);
            return message.delete();
        }
        let cmd_value = args.slice(2).join(" ");
        if (+args[1] == 1){
            message.reply(`\`вы изменили заголовок с '${setembed_general[0]}' на '${cmd_value}'!\``)
            setembed_general[0] = cmd_value;
            return message.delete();
        }else if (+args[1] == 2){
            message.reply(`\`вы изменили описание с '${setembed_general[1]}' на '${cmd_value}'!\``)
            setembed_general[1] = cmd_value;
            return message.delete();
        }else if (+args[1] == 3){
            if (!cmd_value.startsWith("#")){
                message.reply(`\`цвет должен начинаться с хештега. Пример: #FFFFFF - белый цвет!\``);
                return message.delete();
            }
            message.reply(`\`вы изменили цвет с '${setembed_general[2]}' на '${cmd_value}'!\``)
            setembed_general[2] = cmd_value;
            return message.delete();
        }else if (+args[1] == 4){
            if (cmd_value != "включено" && cmd_value != "не указано"){
                message.reply(`\`время имеет параметры 'включено' или 'не указано'!\``);
                return message.delete();
            }
            message.reply(`\`вы изменили статус времени с '${setembed_general[3]}' на '${cmd_value}'!\``)
            setembed_general[3] = cmd_value;
            return message.delete();
        }else if (+args[1] == 5){
            message.reply(`\`вы изменили URL картинки с '${setembed_general[4]}' на '${cmd_value}'!\``)
            setembed_general[4] = cmd_value;
            return message.delete();
        }else if (+args[1] == 6){
            message.reply(`\`вы изменили подпись с '${setembed_general[5]}' на '${cmd_value}'!\``)
            setembed_general[5] = cmd_value;
            return message.delete();
        }else if (+args[1] == 7){
            message.reply(`\`вы изменили URL аватарки подписи с '${setembed_general[6]}' на '${cmd_value}'!\``)
            setembed_general[6] = cmd_value;
            return message.delete();
        }
    }

    if (message.content.startsWith("/embfield")){
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "532206892240601088");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 1) return
        const args = message.content.slice(`/embfield`).split(/ +/);
        if (!args[1]){
            message.reply(`\`укажите номер поля, которое вы хотите отредактировать!\``);
            return message.delete();
        }
        if (typeof(+args[1]) != "number"){
            message.reply(`\`вы должны указать число! '/embfield [число] [значение]'\``);
            return message.delete();
        }
        if (+args[1] < 1 || +args[1] > 10){
            message.reply(`\`минимальное число: 1, а максимальное - 10! '/embfield [число (1-10)] [значение]'\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`значение отстутствует!\``);
            return message.delete();
        }
        let cmd_value = args.slice(2).join(" ");
        let i = +args[1];
        while (i > 1){
            if (setembed_fields[i - 2] == 'нет'){
                message.reply(`\`зачем ты используешь поле №${args[1]}, если есть свободное поле №${+i - 1}?\``);
                return message.delete();
            }
            i--
        }
        message.delete();
        await message.reply(`\`укажите текст который будет написан в '${cmd_value}' новым сообщением без написание каких либо команд!\nНа написание у тебя есть 10 минут! Для удаления можешь отправить в чат минус! '-'\``).then(question => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 600000,
                errors: ['time'],
            }).then(async (answer) => {
                if (answer.first().content != "-"){
                    question.delete().catch(err => console.error(err));
                    setembed_fields[+args[1] - 1] = `${cmd_value}<=+=>${answer.first().content}`;
                    answer.first().delete();
                    message.reply(`\`вы успешно отредактировали поле №${args[1]}!\nДелаем отступ после данного поля (да/нет)? На ответ 30 секунд.\``).then(async vopros => {
                        message.channel.awaitMessages(responsed => responsed.member.id == message.member.id, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        }).then(async (otvet) => {
                            if (otvet.first().content.toLowerCase().includes("нет")){
                                message.reply(`\`окей! Делать отступ не буду!\``);
                                setembed_addline[+args[1] - 1] = 'нет';
                            }else if (otvet.first().content.toLowerCase().includes("да")){
                                message.reply(`\`хорошо! Сделаю отступ!\``);
                                setembed_addline[+args[1] - 1] = 'отступ';
                            }
                        }).catch(() => {
                            message.reply(`\`ты не ответил! Отступа не будет!\``)
                            setembed_addline[+args[1] - 1] = 'нет';
                        })
                    })
                }else{
                    setembed_fields[+args[1] - 1] = 'нет';
                    setembed_addline[+args[1] - 1] = 'нет';
                    question.delete().catch(err => console.error(err));
                }
            }).catch(async () => {
                question.delete().catch(err => console.error(err));
            })
        })
    }

    if (message.content == "/embsend"){
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "532206892240601088");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 1) return
        const embed = new Discord.RichEmbed();
        if (setembed_general[0] != "не указано") embed.setTitle(setembed_general[0]);
        if (setembed_general[1] != "не указано") embed.setDescription(setembed_general[1]);
        if (setembed_general[2] != "не указано") embed.setColor(setembed_general[2]);
        let i = 0;
        while (setembed_fields[i] != 'нет'){
            embed.addField(setembed_fields[i].split(`<=+=>`)[0], setembed_fields[i].split(`<=+=>`)[1]);
            if (setembed_addline[i] != 'нет') embed.addBlankField(false);
            i++;
        }
        if (setembed_general[4] != "не указано") embed.setImage(setembed_general[4]);
        if (setembed_general[5] != "не указано" && setembed_general[6] == "не указано") embed.setFooter(setembed_general[5]);
        if (setembed_general[6] != "не указано" && setembed_general[5] != "не указано") embed.setFooter(setembed_general[5], setembed_general[6]);
        if (setembed_general[3] != "не указано") embed.setTimestamp();
        message.channel.send(embed).catch(err => message.channel.send(`\`Хм.. Не получается. Возможно вы сделали что-то не так.\``));
        return message.delete();
    }

if (message.content.startsWith("/del") && !message.content.includes("fam")){
  if (!fbi_dostup.has(message.author.id) && !message.member.hasPermission("ADMINISTRATOR")){
    message.reply(`\`недостаточно прав доступа.\``, authorrisbot).then(msg => msg.delete(10000));
    return message.delete();
  }
  let user = message.guild.member(message.mentions.users.first());
  if (!user){
    message.reply(`\`укажите пользователя! '/del @упоминание'\``).then(msg => msg.delete(15000));
    return message.delete();
  }
  let fbi_category = message.guild.channels.find(c => c.name == "FBI ALL CHANNELS");
  await fbi_category.permissionOverwrites.forEach(async perm => {
    if (perm.type == `member`){
      if (perm.id == user.id){
        perm.delete();
      }
    }
  });
  message.reply(`\`вы успешно забрали доступ у пользователя\` <@${user.id}> \`к каналу FBI.\``);
  return message.delete();
}
    
if (message.content.startsWith("/mwarn")){
    if (!message.member.hasPermission("MANAGE_ROLES")) return
    let user = message.guild.member(message.mentions.users.first());
    const args = message.content.slice(`/mwarn`).split(/ +/);
    if (!user || !args[2]){
      message.reply(`\`ошибка выполнения! '/mwarn [пользователь] [причина]'\``).then(msg => msg.delete(9000));
      return message.delete();
    }
    let reason = args.slice(2).join(" ");
    if (reason.length < 3 || reason.length > 70){
      message.reply(`\`ошибка выполнения! Причина должна быть больше 3-х и меньше 70-и символов.\``).then(msg => msg.delete(9000));
      return message.delete();
    }
    if (user.hasPermission("ADMINISTRATOR") || !user.roles.some(r => ["💚 Модератор 💚", "💜 Саппорт 💜"].includes(r.name))){
      message.reply(`\`ошибка выполнения! Выдать можно только модераторам!\``).then(msg => msg.delete(9000));
      return message.delete();
    }
    if (reason.includes("==>")){
      message.reply(`\`ошибка выполнения! Вы использовали запрещенный символ!\``).then(msg => msg.delete(9000));
      return message.delete();
    }
    let db_server = bot.guilds.find(g => g.id == "532206892240601088");
    let db_parent = db_server.channels.find(c => c.name == 'db_users');
    let acc = db_server.channels.find(c => c.name == user.id);
    if (!acc){
      await db_server.createChannel(user.id).then(async chan => {
        await chan.setTopic(`<@${user.id}> - ${user.displayName}`);
        acc = chan;
      });
    }
    await acc.fetchMessages({limit: 1}).then(async messages => {
      if (messages.size == 1){
        messages.forEach(async sacc => {
          let str = sacc.content;
          let moderation_level = str.split('\n')[0].match(re)[0];
          let moderation_warns = str.split('\n')[1].match(re)[0];
          let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
          let moderation_reason = [];
          let user_reason = [];
          let moderation_time = [];
          let user_time = [];
          let moderation_give = [];
          let user_give = [];
          
          let circle = 0;
          while (+moderation_warns > circle){
            moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
            moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
            moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
            circle++;
          }
  
          circle = 0;
          while (+user_warns > circle){
            user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
            user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
            user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
            circle++;
          }
          
          moderation_warns++
          moderation_reason.push(reason);
          moderation_time.push(604800000 * +moderation_warns + 604800000 + +message.createdAt.valueOf());
          moderation_give.push(message.member.displayName);
          
          if (+moderation_warns < 3){
            let text_end = `Уровень модератора: ${moderation_level}\n` + 
            `Предупреждения модератора: ${+moderation_warns}`;
            for (var i = 0; i < moderation_reason.length; i++){
              text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
            }
            text_end = text_end + `\nПредупреждений: ${+user_warns}`;
            for (var i = 0; i < user_reason.length; i++){
              text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
            }
  
            sacc.edit(text_end);
            let ann = message.guild.channels.find(c => c.name == "💡уведомления💡");
            ann.send(`<@${user.id}>, \`коммунист\` <@${message.author.id}> \`выдал вам предупреждение (${moderation_warns}/3). Причина: ${reason}\``);
            return message.delete();
          }else{
            let text_end = `Уровень модератора: ${moderation_level}\n` + 
            `Предупреждения модератора: ${+moderation_warns}`;
            for (var i = 0; i < moderation_reason.length; i++){
              text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
            }
            text_end = text_end + `\nПредупреждений: ${+user_warns}`;
            for (var i = 0; i < user_reason.length; i++){
              text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
            }
            if (user.roles.some(r => ["💜 Саппорт 💜"].includes(r.name))){
              await fs.appendFileSync(`./spwarn.txt`, `${text_end}`); // { files: [ `./ban.txt` ] }
              let ann = message.guild.channels.find(c => c.name == "💡уведомления💡");
          await ann.send(`<@${user.id}>, \`коммунист\` <@${message.author.id}> \`выдал вам предупреждение (${moderation_warns}/3). Причина: ${reason}\`\n\`Вы были понижены с должности 💜 Саппорт 💜 на должность 💚 Модератор 💚\``, { files: [ `./spwarn.txt` ] });
              fs.unlinkSync(`./spwarn.txt`);
              user.removeRole(message.guild.roles.find(r => r.name == "💜 Саппорт 💜"))
              if (!user.roles.some(r => ["💚 Модератор 💚"].includes(r.name))) user.addRole(message.guild.roles.find(r => r.name == "💚 Модератор 💚"))
              if (user_warns == 0 && moderation_level == 0){ 
                acc.delete();
              }else{
                moderation_warns = 0;
                let moderation_reason = [];
                let moderation_time = [];
                let moderation_give = [];
                let text_end = `Уровень модератора: ${moderation_level}\n` + 
                `Предупреждения модератора: ${+moderation_warns}`;
                for (var i = 0; i < moderation_reason.length; i++){
                  text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
                }
                text_end = text_end + `\nПредупреждений: ${+user_warns}`;
                for (var i = 0; i < user_reason.length; i++){
                  text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
                }
                sacc.edit(text_end);
              }
              return message.delete();
            }else if (user.roles.some(r => ["💚 Модератор 💚"].includes(r.name))){
              await fs.appendFileSync(`./spwarn.txt`, `${text_end}`); // { files: [ `./ban.txt` ] }
              let ann = message.guild.channels.find(c => c.name == "💡уведомления💡");
          await ann.send(`<@${user.id}>, \`коммунист\` <@${message.author.id}> \`выдал вам предупреждение (${moderation_warns}/3). Причина: ${reason}\`\n\`Вы были сняты с должности 💚 Модератор 💚.\``, { files: [ `./spwarn.txt` ] });
              fs.unlinkSync(`./spwarn.txt`);
              user.removeRole(message.guild.roles.find(r => r.name == "💚 Модератор 💚"))
              if (user_warns == 0 && moderation_level == 0){ 
                acc.delete();
              }else{
                moderation_warns = 0;
                let moderation_reason = [];
                let moderation_time = [];
                let moderation_give = [];
                let text_end = `Уровень модератора: ${moderation_level}\n` + 
                `Предупреждения модератора: ${+moderation_warns}`;
                for (var i = 0; i < moderation_reason.length; i++){
                  text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
                }
                text_end = text_end + `\nПредупреждений: ${+user_warns}`;
                for (var i = 0; i < user_reason.length; i++){
                  text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
                }
                sacc.edit(text_end);
              }
              return message.delete();
            }
          }
        });
      }else{
        await acc.send(`Уровень модератора: 0\n` +
        `Предупреждения модератора: 1\n` +
        `${reason}==>${+message.createdAt.valueOf() + 604800000}==>${message.member.displayName}\n` +
        `Предупреждений: 0`);
        let ann = message.guild.channels.find(c => c.name == "💡уведомления💡");
        ann.send(`<@${user.id}>, \`коммунист\` <@${message.author.id}> \`выдал вам предупреждение (1/3). Причина: ${reason}\``);
        return message.delete();
      }
    });
  }
	
if (message.content.startsWith("/unwarn")){
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.delete();
  let user = message.guild.member(message.mentions.users.first());
  if (!user){
    message.reply(`\`пользователь не указан! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  const args = message.content.slice(`/unwarn`).split(/ +/);
  if (!args[2]){
    message.reply(`\`тип не указан! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  if (args[2] != 'user' && args[2] != 'mod'){
    message.reply(`\`тип может быть 'user' или 'mod'! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  if (!args[3]){
    message.reply(`\`номер предупреждения не указан! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  if (typeof(+args[3]) != "number"){
    message.reply(`\`укажите число! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  if (+args[3] > 2 || +args[3] < 1){
    message.reply(`\`можно указать 1 или 2! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  args[3] = +args[3] - 1;
  if (args[2] == "user"){
    if (user.hasPermission("MANAGE_NICKNAMES") && !message.member.hasPermission("ADMINISTRATOR")){
      message.reply(`\`модератору нельзя снимать предупреждения!\``).then(msg => msg.delete(9000));
      return message.delete();
    }
    let dataserver = bot.guilds.find(g => g.id == "532206892240601088");
    let report_channel = dataserver.channels.find(c => c.name == user.id);
    if (!report_channel){
      message.reply(`\`у пользователя нет предупреждений!\``).then(msg => msg.delete(9000));
      return message.delete();
    }
    await report_channel.fetchMessages({limit: 1}).then(async messages => {
      if (messages.size == 1){
        messages.forEach(async sacc => {
          let str = sacc.content;
          let moderation_level = str.split('\n')[0].match(re)[0];
          let moderation_warns = str.split('\n')[1].match(re)[0];
          let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
          let moderation_reason = [];
          let user_reason = [];
          let moderation_time = [];
          let user_time = [];
          let moderation_give = [];
          let user_give = [];
          
          let circle = 0;
          while (+moderation_warns > circle){
            moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
            moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
            moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
            circle++;
          }

          circle = 0;
	  let rem = 0;
          while (+user_warns > circle){
            if (+circle == +args[3]){
              rem++;
              let genchannel = message.guild.channels.find(c => c.name == "💖общенице💖");
              genchannel.send(`<@${user.id}>, \`вам было снято одно предупреждение. Источник: ${message.member.displayName}\``);
              let schat = message.guild.channels.find(c => c.name == "🔑чат-модераторов🔑");
              schat.send(`\`Модератор\` <@${message.author.id}> \`снял пользователю\` <@${user.id}> \`одно предупреждение.\nИнформация: Выдано было модератором: ${str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]} по причине: ${str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]}\``);
            }else{
              user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
              user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
              user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
            }
            circle++;
          }
	  user_warns = +user_warns - +rem;
          let text_end = `Уровень модератора: ${moderation_level}\n` + 
          `Предупреждения модератора: ${moderation_warns}`;
          for (var i = 0; i < moderation_reason.length; i++){
            text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
          }
          text_end = text_end + `\nПредупреждений: ${+user_warns}`;
          for (var i = 0; i < user_reason.length; i++){
            text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
          }
          if (+moderation_level == 0 && +moderation_warns == 0 && +user_warns == 0){
            report_channel.delete();
          }else{
            sacc.edit(text_end);
          }
          message.delete()
        });
      }else{
        message.reply(`\`произошла ошибка. [USER=${user.id}]\``).then(msg => msg.delete(9000));
        return message.delete();
      }
    });
  }else if (args[2] == "mod"){
    if (!message.member.hasPermission("ADMINISTRATOR")){
      message.reply(`\`недостаточно прав доступа к данному разделу!\``).then(msg => msg.delete(9000));
      return message.delete();
    }
    let dataserver = bot.guilds.find(g => g.id == "532206892240601088");
    let report_channel = dataserver.channels.find(c => c.name == user.id);
    if (!report_channel){
      message.reply(`\`у пользователя нет предупреждений!\``).then(msg => msg.delete(9000));
      return message.delete();
    }
    await report_channel.fetchMessages({limit: 1}).then(async messages => {
      if (messages.size == 1){
        messages.forEach(async sacc => {
          let str = sacc.content;
          let moderation_level = str.split('\n')[0].match(re)[0];
          let moderation_warns = str.split('\n')[1].match(re)[0];
          let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
          let moderation_reason = [];
          let user_reason = [];
          let moderation_time = [];
          let user_time = [];
          let moderation_give = [];
          let user_give = [];
          
          let circle = 0;
          let rem = 0;
          while (+moderation_warns > circle){
            if (+circle == +args[3]){
              rem++;
              let schat = message.guild.channels.find(c => c.name == "🔑чат-модераторов🔑");
              schat.send(`<@${message.author.id}> \`снял модератору\` <@${user.id}> \`одно предупреждение.\nИнформация: Выдано было модератором: ${str.split('\n')[+circle + 2].split('==>')[2]} по причине: ${str.split('\n')[+circle + 2].split('==>')[0]}\``);
            }else{
              moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
              moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
              moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
            }
            circle++;
          }
          circle = 0;
          while (+user_warns > circle){
            user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
            user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
            user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
            circle++;
          }
          moderation_warns = +moderation_warns - +rem;
          let text_end = `Уровень модератора: ${moderation_level}\n` + 
          `Предупреждения модератора: ${moderation_warns}`;
          for (var i = 0; i < moderation_reason.length; i++){
            text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
          }
          text_end = text_end + `\nПредупреждений: ${+user_warns}`;
          for (var i = 0; i < user_reason.length; i++){
            text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
          }
          if (+moderation_level == 0 && +moderation_warns == 0 && +user_warns == 0){
            report_channel.delete();
          }else{
            sacc.edit(text_end);
          }
          message.delete()
        });
      }else{
        message.reply(`\`произошла ошибка. [USER=${user.id}]\``).then(msg => msg.delete(9000));
        return message.delete();
      }
    });
  }
}
	
if (message.content.startsWith("/getmwarns")){
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.delete();
  let user = message.guild.member(message.mentions.users.first());
  if (!user){
    message.reply(`\`для выполнения нужно указать пользователя. '/getmwarns [user]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  if (user.id == message.author.id){
    let db_server = bot.guilds.find(g => g.id == "532206892240601088");
    let acc = db_server.channels.find(c => c.name == user.id);
    if (!acc){
      message.reply(`\`у вас нет текущих предупреждений.\``).then(msg => msg.delete(12000));
      return message.delete();
    }
    await acc.fetchMessages({limit: 1}).then(async messages => {
      if (messages.size == 1){
        messages.forEach(async sacc => {
          let str = sacc.content;
          let moderation_level = str.split('\n')[0].match(re)[0];
          let moderation_warns = str.split('\n')[1].match(re)[0];
          let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
          let moderation_reason = [];
          let user_reason = [];
          let moderation_time = [];
          let user_time = [];
          let moderation_give = [];
          let user_give = [];

          let circle = 0;
          while (+moderation_warns > circle){
            moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
            moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
            moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
            circle++;
          }

          circle = 0;
          while (+user_warns > circle){
            user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
            user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
            user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
            circle++;
          }
          let text_end = `**Предупреждений: ${moderation_warns}**`;
          for (var i = 0; i < moderation_reason.length; i++){
            text_end = text_end + `\n**[#${+i + 1}] Выдано модератором: \`${moderation_give[i]}\`. Причина: \`${moderation_reason[i]}\`**`;
          }
          message.reply(`\`вот информация по поводу аккаунта:\` <@${user.id}>\n${text_end}`, authorrisbot);
          return message.delete();
        });
      }else{
        message.reply(`\`ошибка выполнения 605. [ACC=${user.id}]\``).then(msg => msg.pin());
        return message.delete();
      }
    });
  }else{
    if (!message.member.hasPermission("ADMINISTRATOR")){
      message.reply(`\`у вас нет прав модератора для просмотра чужой статистики.\``, authorrisbot).then(msg => msg.delete(7000));
      return message.delete();
    }
    let db_server = bot.guilds.find(g => g.id == "532206892240601088");
    let acc = db_server.channels.find(c => c.name == user.id);
    if (!acc){
      message.reply(`\`у пользователя нет предупреждений.\``).then(msg => msg.delete(12000));
      return message.delete();
    }
    await acc.fetchMessages({limit: 1}).then(async messages => {
      if (messages.size == 1){
        messages.forEach(async sacc => {
          let str = sacc.content;
          let moderation_level = str.split('\n')[0].match(re)[0];
          let moderation_warns = str.split('\n')[1].match(re)[0];
          let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
          let moderation_reason = [];
          let user_reason = [];
          let moderation_time = [];
          let user_time = [];
          let moderation_give = [];
          let user_give = [];

          let circle = 0;
          while (+moderation_warns > circle){
            moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
            moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
            moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
            circle++;
          }

          circle = 0;
          while (+user_warns > circle){
            user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
            user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
            user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
            circle++;
          }
          let text_end = `**Предупреждений: ${moderation_warns}**`;
          for (var i = 0; i < moderation_reason.length; i++){
            text_end = text_end + `\n**[#${+i + 1}] Выдано модератором: \`${moderation_give[i]}\`. Причина: \`${moderation_reason[i]}\`**`;
          }
          message.reply(`\`вот информация по поводу аккаунта:\` <@${user.id}>\n${text_end}`, authorrisbot);
          return message.delete();
        });
      }else{
        message.reply(`\`ошибка выполнения 605. [ACC=${user.id}]\``).then(msg => msg.pin());
        return message.delete();
      }
    });
  }
}
	
if (message.content.startsWith("/getwarns")){
  let user = message.guild.member(message.mentions.users.first());
  if (!user){
    message.reply(`\`для выполнения нужно указать пользователя. '/getwarns [user]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  if (user.id == message.author.id){
    let db_server = bot.guilds.find(g => g.id == "532206892240601088");
    let acc = db_server.channels.find(c => c.name == user.id);
    if (!acc){
      message.reply(`\`у вас нет текущих предупреждений.\``).then(msg => msg.delete(12000));
      return message.delete();
    }
    await acc.fetchMessages({limit: 1}).then(async messages => {
      if (messages.size == 1){
        messages.forEach(async sacc => {
          let str = sacc.content;
          let moderation_level = str.split('\n')[0].match(re)[0];
          let moderation_warns = str.split('\n')[1].match(re)[0];
          let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
          let moderation_reason = [];
          let user_reason = [];
          let moderation_time = [];
          let user_time = [];
          let moderation_give = [];
          let user_give = [];

          let circle = 0;
          while (+moderation_warns > circle){
            moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
            moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
            moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
            circle++;
          }

          circle = 0;
          while (+user_warns > circle){
            user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
            user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
            user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
            circle++;
          }
          let text_end = `**Предупреждений: ${user_warns}**`;
          for (var i = 0; i < user_reason.length; i++){
            let date = new Date(+user_time[i] + 10800000);
            let formate_date = `${date.getFullYear()}.` + 
            `${(date.getMonth() + 1).toString().padStart(2, '0')}.` +
            `${date.getDate().toString().padStart(2, '0')} в ` + 
            `${date.getHours().toString().padStart(2, '0')}:` + 
            `${date.getMinutes().toString().padStart(2, '0')}:` + 
            `${date.getSeconds().toString().padStart(2, '0')}`;
            text_end = text_end + `\n**[#${+i + 1}] Выдано модератором: \`${user_give[i]}\`. Причина: \`${user_reason[i]}\`\n[#${+i + 1}] Истекает: ${formate_date}**\n`;
          }
          message.reply(`\`вот информация по поводу аккаунта:\` <@${user.id}>\n${text_end}`, authorrisbot);
          return message.delete();
        });
      }else{
        message.reply(`\`ошибка выполнения 605. [ACC=${user.id}]\``).then(msg => msg.pin());
        return message.delete();
      }
    });
  }else{
    if (!message.member.hasPermission("MANAGE_NICKNAMES")){
      message.reply(`\`у вас нет прав модератора для просмотра чужой статистики.\``, authorrisbot).then(msg => msg.delete(7000));
      return message.delete();
    }
    let db_server = bot.guilds.find(g => g.id == "532206892240601088");
    let acc = db_server.channels.find(c => c.name == user.id);
    if (!acc){
      message.reply(`\`у пользователя нет предупреждений.\``).then(msg => msg.delete(12000));
      return message.delete();
    }
    await acc.fetchMessages({limit: 1}).then(async messages => {
      if (messages.size == 1){
        messages.forEach(async sacc => {
          let str = sacc.content;
          let moderation_level = str.split('\n')[0].match(re)[0];
          let moderation_warns = str.split('\n')[1].match(re)[0];
          let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
          let moderation_reason = [];
          let user_reason = [];
          let moderation_time = [];
          let user_time = [];
          let moderation_give = [];
          let user_give = [];

          let circle = 0;
          while (+moderation_warns > circle){
            moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
            moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
            moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
            circle++;
          }

          circle = 0;
          while (+user_warns > circle){
            user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
            user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
            user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
            circle++;
          }
          let text_end = `**Предупреждений: ${user_warns}**`;
          for (var i = 0; i < user_reason.length; i++){
            let date = new Date(+user_time[i] + 10800000);
            let formate_date = `${date.getFullYear()}.` + 
            `${(date.getMonth() + 1).toString().padStart(2, '0')}.` +
            `${date.getDate().toString().padStart(2, '0')} в ` + 
            `${date.getHours().toString().padStart(2, '0')}:` + 
            `${date.getMinutes().toString().padStart(2, '0')}:` + 
            `${date.getSeconds().toString().padStart(2, '0')}`;
            text_end = text_end + `\n**[#${+i + 1}] Выдано модератором: \`${user_give[i]}\`. Причина: \`${user_reason[i]}\`\n[#${+i + 1}] Истекает: ${formate_date}**\n`;
          }
          message.reply(`\`вот информация по поводу аккаунта:\` <@${user.id}>\n${text_end}`, authorrisbot);
          return message.delete();
        });
      }else{
        message.reply(`\`ошибка выполнения 605. [ACC=${user.id}]\``).then(msg => msg.pin());
        return message.delete();
      }
    });
  }
}

if (message.content.startsWith("/warn")){
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) return
  if (warn_cooldown.has(message.author.id)) return message.delete();
  warn_cooldown.add(message.author.id)
  setTimeout(() => {
    if (warn_cooldown.has(message.author.id)) warn_cooldown.delete(message.author.id);
  }, 30000);
  let user = message.guild.member(message.mentions.users.first());
  const args = message.content.slice(`/warn`).split(/ +/);
  if (!user || !args[2]){
    message.reply(`\`ошибка выполнения! '/warn [пользователь] [причина]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  let reason = args.slice(2).join(" ");
  if (reason.length < 3 || reason.length > 70){
    message.reply(`\`ошибка выполнения! Причина должна быть больше 3-х и меньше 70-и символов.\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  if (user.hasPermission("ADMINISTRATOR") || user.roles.some(r => ["💚 Модератор 💚", "💜 Саппорт 💜", "💘 Одмен 💘"].includes(r.name))){
    if (!message.member.hasPermission("ADMINISTRATOR")){
      message.reply(`\`ошибка выполнения! Данному пользователю нельзя выдать предупреждение!\``).then(msg => msg.delete(9000));
      return message.delete();
    }
  }
  if (reason.includes("==>")){
    message.reply(`\`ошибка выполнения! Вы использовали запрещенный символ!\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  let db_server = bot.guilds.find(g => g.id == "532206892240601088");
  let db_parent = db_server.channels.find(c => c.name == 'db_users');
  let acc = db_server.channels.find(c => c.name == user.id);
  if (!acc){
    await db_server.createChannel(user.id).then(async chan => {
      await chan.setTopic(`<@${user.id}> - ${user.displayName}`);
      acc = chan;
    });
  }
  await acc.fetchMessages({limit: 1}).then(async messages => {
    if (messages.size == 1){
      messages.forEach(async sacc => {
        let str = sacc.content;
        let moderation_level = str.split('\n')[0].match(re)[0];
        let moderation_warns = str.split('\n')[1].match(re)[0];
        let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
        let moderation_reason = [];
        let user_reason = [];
        let moderation_time = [];
        let user_time = [];
        let moderation_give = [];
        let user_give = [];
        
        let circle = 0;
        while (+moderation_warns > circle){
          moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
          moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
          moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
          circle++;
        }

        circle = 0;
        while (+user_warns > circle){
          user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
          user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
          user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
          circle++;
        }
        
        user_warns++
        user_reason.push(reason);
        user_time.push(259200000 * +user_warns + 259200000 + +message.createdAt.valueOf());
        user_give.push(message.member.displayName);
        
        let text_end = `Уровень модератора: ${moderation_level}\n` + 
        `Предупреждения модератора: ${moderation_warns}`;
        for (var i = 0; i < moderation_reason.length; i++){
          text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
        }
        text_end = text_end + `\nПредупреждений: ${+user_warns}`;
        for (var i = 0; i < user_reason.length; i++){
          text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
        }
        if (+user_warns < 3){
          sacc.edit(text_end);
          let ann = message.guild.channels.find(c => c.name == "💖общенице💖");
          ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (${user_warns}/3). Причина: ${reason}\nЕсли вы не согласны с модератором, вы можете написать в нашу поддержку\` <#${message.guild.channels.find(c => c.name == "🌀саппорт🌀").id}>`);
          return message.delete();
        }else{
          await fs.appendFileSync(`./ban.txt`, `${text_end}`);
	  await message.guild.channels.find(c => c.name == "💡уведомления💡").send(`\`Привет! Я тут чела за нарушение правил забанил!\``, { files: [ `./ban.txt` ] });
          fs.unlinkSync(`./ban.txt`);
          acc.delete();
          let ann = message.guild.channels.find(c => c.name == "💖общенице💖");
          await ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (${user_warns}/3). Причина: ${reason}\nВам была выдана блокировка за нарушение правил (3/3)!\``);
          user.ban("Максимальное количество предупреждений");
          return message.delete();
        }
      });
    }else{
      await acc.send(`Уровень модератора: 0\n` +
      `Предупреждения модератора: 0\n` +
      `Предупреждений: 1\n` +
      `${reason}==>${+message.createdAt.valueOf() + 259200000}==>${message.member.displayName}`);
      let ann = message.guild.channels.find(c => c.name == "💖общенице💖");
      ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение. Причина: ${reason}\nЕсли вы не согласны с модератором, вы можете написать в нашу поддержку\` <#${message.guild.channels.find(c => c.name == "🌀саппорт🌀").id}>`);
      return message.delete();
    }
  });
}

    if (message.content.startsWith(`/dspanel`)){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return
        if (dspanel.has(message.author.id)){
            dspanel.delete(message.author.id);
            message.reply(`\`успешно вышел из системы.\``);
            return message.delete();
        }
        const args = message.content.slice('/dspanel').split(/ +/)
        if (!args[1]){
            message.reply(`\`введите пароль.\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let password = args.slice(1).join(" ");
        if (password != `${message.author.id[0]}${message.author.id}${message.author.id[1]} 1902`) return message.delete();
        message.reply(`\`успешно авторизован в системе.\``);
        dspanel.add(message.author.id);
        return message.delete();
    }

    if (message.content == `/chat`){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return
        if (!dspanel.has(message.author.id)) return message.reply(`\`вы не авторизованы в системе модерирования.\``) && message.delete()
        message.reply(`\`для выключения чата используй /chat off, для включения: /chat on\``);
        return message.delete();
    }

    if (message.content == `/chat off`){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return
        if (!dspanel.has(message.author.id)) return message.reply(`\`вы не авторизованы в системе модерирования.\``) && message.delete()
        scottdale.channels.find(c => c.name == "💖общенице💖").overwritePermissions(scottdale.roles.find(r => r.name.includes(`everyone`)), {
            SEND_MESSAGES: false,
        })
        scottdale.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`Модератор ${message.member.displayName} отключил чат:\` <#${scottdale.channels.find(c => c.name == "💖общенице💖").id}>`)
        message.reply(`\`вы успешно отключили чат!\``)
        return messages.delete();
    }

    if (message.content == `/chat on`){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return
        if (!dspanel.has(message.author.id)) return message.reply(`\`вы не авторизованы в системе модерирования.\``) && message.delete()
        scottdale.channels.find(c => c.name == "💖общенице💖").overwritePermissions(scottdale.roles.find(r => r.name.includes(`everyone`)), {
            SEND_MESSAGES: true,
        })
        scottdale.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`Модератор ${message.member.displayName} включил чат:\` <#${scottdale.channels.find(c => c.name == "💖общенице💖").id}>`)
        message.reply(`\`вы успешно включили чат!\``)
        return messages.delete();
    }
    
    if (message.content.toLowerCase() == '/famhelp'){
        message.channel.send(`**<@${message.author.id}>, вот справка по системе семей!**`, {embed: {
            color: 3447003,
            fields: [{
                name: `Создание, удаление, информация, покинуть`,
                value: `**Создать семью:** \`/createfam\`\n**Удалить семью:** \`/deletefam [название]\`\n**Информация о семье:** \`/faminfo [название]\`\n**Покинуть семью: \`/fleave [название семьи]\`**`,
            },
            {
                name: `Управление семьей`,
                value: `**Назначить заместителя:** \`/famaddzam [user]\`\n**Снять заместителя:** \`/famdelzam [user]\``,
            },
            {
                name: `Команды для заместителей`,
                value: `**Пригласить участника:** \`/faminvite [user]\`\n**Исключить участника:** \`/famkick [user]\``,
            }]
        }}).then(msg => msg.delete(35000))
        return message.delete();
    }

    if (message.content.startsWith('/fleave')){
        const args = message.content.slice('/fleave').split(/ +/)
        if (!args[1]){
            message.reply(`\`использование: /fleave [название семьи]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let familyname = args.slice(1).join(" ");
        let family_channel = null;
        let family_role = null;
        let cmdallow = true;
        let zam = false;
        await message.guild.channels.filter(async channel => {
            if (channel.name == familyname){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `💒 Семьи 💒`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    if(message.author.id == perm.id) cmdallow = false;
                                }
                            }
                            if (perm.type == `member`){
                                if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                    if(message.author.id == perm.id) {
                                        zam = true;
                                        perm.delete();
                                    }
                                }
                            }
                        })
                    }
                }
            }else if(channel.name.includes(familyname)){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `💒 Семьи 💒`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    if(message.author.id == perm.id) cmdallow = false;
                                }
                            }
                            if (perm.type == `member`){
                                if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                    if(message.author.id == perm.id) {
                                        zam = true;
                                        perm.delete();
                                    }
                                }
                            }
                        })
                    }
                }
            }
        });
        if (family_channel == null || family_role == null){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`ошибка! Семья: '${familyname}' не найдена!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        if (!message.member.roles.some(r => r.name == family_role.name) && zam == false) {
            message.reply(`\`вы не состоите в ${family_role.name}\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        if(cmdallow == false) {
            message.reply(`\`лидер семьи не может покинуть её\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        if(zam == true) {
            message.reply(`**\`вы покинули семью ${family_channel.name} и пост заместителя так же был снят\`**`).then(msg => msg.delete(10000));
            message.member.removeRole(family_role);
            return message.delete();
        }
        message.reply(`**\`вы покинули семью ${family_channel.name}\`**`);
        message.member.removeRole(family_role);
        return message.delete();
    }

    if (message.content.startsWith('/faminfo')){
        const args = message.content.slice('/faminfo').split(/ +/)
        if (!args[1]){
            message.reply(`\`использование: /faminfo [название семьи]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let familyname = args.slice(1).join(" ");
        let family_channel = null;
        let family_role = null;
        let family_leader;
        let families_zams = [];
        await message.guild.channels.filter(async channel => {
            if (channel.name == familyname){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `💒 Семьи 💒`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    family_leader = message.guild.members.find(m => m.id == perm.id);
                                }
                            }
                            if (perm.type == `member`){
                                if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                    families_zams.push(perm.id)
                                }
                            }
                        })
                    }
                }
            }else if(channel.name.includes(familyname)){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `💒 Семьи 💒`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    family_leader = message.guild.members.find(m => m.id == perm.id);
                                }
                            }
                            if (perm.type == `member`){
                                if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                    families_zams.push(perm.id)
                                }
                            }
                        })
                    }
                }
            }
        });
        if (family_channel == null || family_role == null){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`ошибка! Семья: '${familyname}' не найдена!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        if (!family_leader){
            family_leader = `не в дискорде`;
        }else{
            family_leader = `<@${family_leader.id}>`;
        }
        let family_zams = `\`заместителей нет\``;
        for (var i = 0; i < families_zams.length; i++){
            if (family_zams == `\`заместителей нет\``){
                family_zams = `<@${families_zams[i]}>`;
            }else{
                family_zams = family_zams + `, <@${families_zams[i]}>`;
            }
        }
        let members = message.guild.roles.get(family_role.id).members; // members.size
        message.channel.send(`**<@${message.author.id}>, вот информация о семье: <@&${family_role.id}>**`, {embed: {
            color: 3447003,
            fields: [{
                name: `Информация о семье: ${family_role.name}`,
                value: `**Создатель семьи: ${family_leader}\nЗаместители: ${family_zams}\nКоличество участников: ${members.size}**`
            }]
        }})
    }

    if (message.content.startsWith('/createfam')){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`\`эй! Эта функция только для админов!\``) && message.delete()
        let idmember = message.author.id;
        let family_name;
        let family_leader;
        await message.delete();
        await message.channel.send(`\`[FAMILY] Название семьи: [напиши название семьи в чат]\n[FAMILY] Создатель семьи [ID]: [ожидание]\``).then(async delmessage0 => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then(async (collected) => {
                family_name = `${collected.first().content}`;
                await delmessage0.edit(`\`[FAMILY] Название семьи: '${collected.first().content}'\n[FAMILY] Создатель семьи [ID]: [на модерации, если надо себя, отправь минус]\``)
                collected.first().delete();
                message.channel.awaitMessages(response => response.member.id == message.member.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then(async (collectedd) => {
                    if (!message.guild.members.find(m => m.id == collectedd.first().content)){
                        family_leader = `${idmember}`;
                    }else{
                        family_leader = `${collectedd.first().content}`;
                    }
                    await delmessage0.edit(`\`[FAMILY] Название семьи: '${family_name}'\n[FAMILY] Создатель семьи: ${message.guild.members.find(m => m.id == family_leader).displayName}\nСоздать семейный канал и роль [да/нет]?\``)
                    collectedd.first().delete();
                    message.channel.awaitMessages(response => response.member.id == message.member.id, {
                        max: 1,
                        time: 20000,
                        errors: ['time'],
                    }).then(async (collecteds) => {
                        if (!collecteds.first().content.toLowerCase().includes('да')) return delmessage0.delete();
                        collecteds.first().delete();
                        await delmessage0.delete();

                        let family_channel = null;
                        let myfamily_role = null;
                        await message.guild.channels.filter(async channel => {
                            if (channel.name == family_name){
                                if (channel.type == "voice"){
                                    if (channel.parent.name.toString() == `💒 Семьи 💒`){
                                        family_channel = channel;
                                        await channel.permissionOverwrites.forEach(async perm => {
                                            if (perm.type == `role`){
                                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                                if (role_fam.name == channel.name){
                                                    myfamily_role = role_fam;
                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        });
                        if (family_channel != null || myfamily_role != null){
                            message.channel.send(`\`[ERROR]\` <@${idmember}> \`ошибка! Семья: '${family_name}' уже существует!\``).then(msg => msg.delete(10000));
                            return
                        }

                        let family_role = await message.guild.createRole({
                            name: `${family_name}`,
                            position: message.guild.roles.find(r => r.name == `[-] Прочее [-]`).position + 1,
                        })
                        await message.guild.createChannel(`${family_name}`, "voice").then(async (channel) => {
                            await channel.setParent(message.guild.channels.find(c => c.name == `💒 Семьи 💒`))
                            await channel.overwritePermissions(family_role, {
                                // GENERAL PERMISSIONS
                                CREATE_INSTANT_INVITE: false,
                                MANAGE_CHANNELS: false,
                                MANAGE_ROLES: false,
                                MANAGE_WEBHOOKS: false,
                                // VOICE PERMISSIONS
                                VIEW_CHANNEL: true,
                                CONNECT: true,
                                SPEAK: true,
                                MUTE_MEMBERS: false,
                                DEAFEN_MEMBERS: false,
                                MOVE_MEMBERS: false,
                                USE_VAD: true,
                                PRIORITY_SPEAKER: false,
                            })

                            await channel.overwritePermissions(message.guild.members.find(m => m.id == family_leader), {
                                // GENERAL PERMISSIONS
                                CREATE_INSTANT_INVITE: true,
                                MANAGE_CHANNELS: false,
                                MANAGE_ROLES: false,
                                MANAGE_WEBHOOKS: false,
                                // VOICE PERMISSIONS
                                VIEW_CHANNEL: true,
                                CONNECT: true,
                                SPEAK: true,
                                MUTE_MEMBERS: false,
                                DEAFEN_MEMBERS: false,
                                MOVE_MEMBERS: false,
                                USE_VAD: true,
                                PRIORITY_SPEAKER: true,
                            })

                            await channel.overwritePermissions(message.guild.roles.find(r => r.name == `@everyone`), {
                                // GENERAL PERMISSIONS
                                CREATE_INSTANT_INVITE: false,
                                MANAGE_CHANNELS: false,
                                MANAGE_ROLES: false,
                                MANAGE_WEBHOOKS: false,
                                // VOICE PERMISSIONS
                                VIEW_CHANNEL: false,
                                CONNECT: false,
                                SPEAK: false,
                                MUTE_MEMBERS: false,
                                DEAFEN_MEMBERS: false,
                                MOVE_MEMBERS: false,
                                USE_VAD: false,
                                PRIORITY_SPEAKER: false,
                            })
                            if (message.guild.channels.find(c => c.name == `🎭чат-семей🎭`)){
                                await message.guild.channels.find(c => c.name == `🎭чат-семей🎭`).overwritePermissions(family_role, {
                                    // GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: true,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: true,
                                    ATTACH_FILES: true,
                                    READ_MESSAGE_HISTORY: true,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: true,
                                    ADD_REACTIONS: true,
                                })
                            }
                            await message.guild.members.find(m => m.id == family_leader).addRole(family_role);
                            let general = message.guild.channels.find(c => c.name == `💖общенице💖`);
                            if (general) await general.send(`<@${family_leader}>, \`модератор\` <@${idmember}> \`назначил вас контролировать семью: ${family_name}\``)
                            let fam_chat = message.guild.channels.find(c => c.name == `🎭чат-семей🎭`);
                            if (fam_chat) await fam_chat.send(`\`[CREATE]\` \`Пользователь\` <@${family_leader}> \`стал лидером семьи '${family_name}'! Назначил:\` <@${idmember}>`);
                            return
                        })
                    }).catch(() => {
                        return delmessage0.delete();
                    })
                }).catch(() => {
                    return delmessage0.delete();
                })
            }).catch(() => {
                return delmessage0.delete();
            })
        })
    }
    
if (message.content == '/archive'){
  let archive_messages = [];
  await message.channel.fetchMessages({limit: 100}).then(messages => {
    messages.forEach(msg => {
      let date = msg.createdAt;
      let formate_date = `[${date.getFullYear()}-` + 
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} ` + 
      `${date.getHours().toString().padStart(2, '0')}-` + 
      `${date.getMinutes().toString().padStart(2, '0')}-` + 
      `${date.getSeconds().toString().padStart(2, '0')}]`;
      if (!msg.embeds[0]){
        archive_messages.push(`${formate_date} ${msg.member.displayName}: ${msg.content}`);
      }else{
        archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msg.embeds[0].fields[1].value}`);
        archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msg.embeds[0].fields[0].value}`);
        archive_messages.push(`${formate_date} ${msg.member.displayName}: ${msg.content}`);
      }
    })
  });
  let i = archive_messages.length - 1;
  while (i>=0){
    await fs.appendFileSync(`./${message.channel.name}.txt`, `${archive_messages[i]}\n`);
    i--
  }
  await message.channel.send('архив сообщений', { files: [ `./${message.channel.name}.txt` ] })
  fs.unlinkSync(`./${message.channel.name}.txt`);
}

    if (message.content.startsWith(`/faminvite`)){
        if (message.content == `/faminvite`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /faminvite [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `💒 Семьи 💒`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем/заместителем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/faminvite').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /faminvite [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        if (families.length == 1){
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `💒 Семьи 💒`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} уже состоит в вашей семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let msg = await message.channel.send(`<@${user.id}>, \`создатель или заместитель семьи\` <@${message.author.id}> \`приглашает вас вступить в семью:\` **<@&${fam_role.id}>**\n\`Нажмите галочку в течении 10 секунд, если вы согласны принять его приглашение!\``)
            await msg.react(`✔`);
            const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === `✔`, {time: 10000});
            let reacton = reactions.get(`✔`).users.get(user.id)
            if (reacton == undefined){
                return message.channel.send(`<@${message.author.id}>, \`пользователь ${user.displayName} отказался от вашего предложения вступить в семью!\``).then(msg => msg.delete(15000));
            }
            if (!user.roles.some(r => r.id == fam_role.id)) user.addRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `💖общенице💖`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь участником семьи '${families[0]}'! Пригласил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `🎭чат-семей🎭`);
            if (fam_chat) await fam_chat.send(`\`[INVITE]\` <@${message.author.id}> \`пригласил пользователя\` <@${user.id}> \`в семью: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты участник более 1-ой семьи! Что бы пригласить участника, нужно выбрать в какую семью ты его будешь приглашать! Используй: /faminvite [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `💒 Семьи 💒`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} уже состоит в данной семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let msg = await message.channel.send(`<@${user.id}>, \`создатель или заместитель семьи\` <@${message.author.id}> \`приглашает вас вступить в семью:\` **<@&${fam_role.id}>**\n\`Нажмите галочку в течении 10 секунд, если вы согласны принять его приглашение!\``)
            await msg.react(`✔`);
            const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === `✔`, {time: 10000});
            let reacton = reactions.get(`✔`).users.get(user.id)
            if (reacton == undefined){
                return message.channel.send(`<@${message.author.id}>, \`пользователь ${user.displayName} отказался от вашего предложения вступить в семью!\``).then(msg => msg.delete(15000));
            }
            if (!user.roles.some(r => r.id == fam_role.id)) user.addRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `💖общенице💖`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь участником семьи '${families[args[2]]}'! Пригласил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `🎭чат-семей🎭`);
            if (fam_chat) await fam_chat.send(`\`[INVITE]\` <@${message.author.id}> \`пригласил пользователя\` <@${user.id}> \`в семью: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith(`/famkick`)){
        if (message.content == `/famkick`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famkick [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `💒 Семьи 💒`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем/заместителем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/famkick').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famkick [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        if (families.length == 1){
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `💒 Семьи 💒`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} не состоит в вашей семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            if (user.roles.some(r => r.id == fam_role.id)) user.removeRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `💖общенице💖`);
            if (general) await general.send(`<@${user.id}>, \`вы были исключены из семьи '${families[0]}'! Источник:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `🎭чат-семей🎭`);
            if (fam_chat) await fam_chat.send(`\`[KICK]\` <@${message.author.id}> \`выгнал пользователя\` <@${user.id}> \`из семьи: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты участник более 1-ой семьи! Что бы выгнать участника, нужно выбрать семью из которой нужно будет его кикнуть! Используй: /famkick [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `💒 Семьи 💒`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} не состоит в данной семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            if (user.roles.some(r => r.id == fam_role.id)) user.removeRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `💖общенице💖`);
            if (general) await general.send(`<@${user.id}>, \`вы были исключены из семьи '${families[args[2]]}'! Источник:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `🎭чат-семей🎭`);
            if (fam_chat) await fam_chat.send(`\`[KICK]\` <@${message.author.id}> \`выгнал пользователя\` <@${user.id}> \`из семьи: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith(`/deletefam`)){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`\`эй! Эта функция только для админов!\``) && message.delete()
        const args = message.content.slice('/deletefam').split(/ +/)
        if (!args[1]){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите название семьи! /deletefam [name]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let name = args.slice(1).join(" ");
        let family_channel = null;
        let family_role = null;
        let family_leader;
        await message.guild.channels.filter(async channel => {
            if (channel.name == name){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `💒 Семьи 💒`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    family_leader = message.guild.members.find(m => m.id == perm.id);
                                }
                            }
                        })
                    }
                }
            }
        });
        if (family_channel == null || family_role == null){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`ошибка! Семья: '${name}' не найдена!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        family_channel.delete();
        family_role.delete();
        let general = message.guild.channels.find(c => c.name == `💖общенице💖`);
        if (general) await general.send(`<@${family_leader.id}>, \`модератор\` <@${message.author.id}> \`удалил вашу семью: ${name}\``)
        let fam_chat = message.guild.channels.find(c => c.name == `🎭чат-семей🎭`);
        if (fam_chat) await fam_chat.send(`\`[DELETED]\` \`Семья '${name}', главой которой был\` <@${family_leader.id}> \`была удалена модератором. Удалил:\` <@${message.author.id}>`);
        return message.delete();
    }

    if (message.content.startsWith(`/famaddzam`)){
        if (message.content == `/famaddzam`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famaddzam [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `💒 Семьи 💒`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/famaddzam').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famaddzam [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }

        if (user.id == message.author.id){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`воу, воу! Полегче! Если ты сделаешь себя заместителем, то у тебя не будет права управления семьей!\``).then(msg => msg.delete(10000));
            return message.delete();
        }

        if (families.length == 1){
            let fam_role;
            let fam_channel;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `💒 Семьи 💒`){
                            fam_channel = channel;
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} должен состоять в семье, что бы быть заместителем!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            await fam_channel.overwritePermissions(user, {
                // GENERAL PERMISSIONS
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false,
                // VOICE PERMISSIONS
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                MUTE_MEMBERS: false,
                DEAFEN_MEMBERS: false,
                MOVE_MEMBERS: false,
                USE_VAD: true,
                PRIORITY_SPEAKER: true,
            })
            let general = message.guild.channels.find(c => c.name == `💖общенице💖`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь заместителем семьи '${families[0]}'! Назначил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `🎭чат-семей🎭`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`назначил заместителя\` <@${user.id}> \`семья: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты владелец более 1-ой семьи! Что бы назначить заместителя, нужно выбрать в какую семью ты его будешь назначить! Используй: /famaddzam [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            let fam_role;
            let fam_channel;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `💒 Семьи 💒`){
                            let fam_channel = channel;
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} должен состоять в семье, что бы быть заместителем!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            await fam_channel.overwritePermissions(user, {
                // GENERAL PERMISSIONS
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false,
                // VOICE PERMISSIONS
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                MUTE_MEMBERS: false,
                DEAFEN_MEMBERS: false,
                MOVE_MEMBERS: false,
                USE_VAD: true,
                PRIORITY_SPEAKER: true,
            })
            let general = message.guild.channels.find(c => c.name == `💖общенице💖`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь заместителем семьи '${families[args[2]]}'! Назначил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `🎭чат-семей🎭`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`назначил заместителем\` <@${user.id}> \`семья: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith(`/famdelzam`)){
        if (message.content == `/famdelzam`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famdelzam [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `💒 Семьи 💒`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/famdelzam').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famdelzam [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }

        if (user.id == message.author.id){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`воу, воу! Полегче! Забрав у себя доступ ты не сможешь выдавать роли своей семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }

        if (families.length == 1){
            let fam_zam = false;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `💒 Семьи 💒`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `member`){
                                    if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                        if (perm.id == user.id){
                                            fam_zam = true
                                            perm.delete()
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!fam_zam){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`данный пользователь не ваш заместитель!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let general = message.guild.channels.find(c => c.name == `💖общенице💖`);
            if (general) await general.send(`<@${user.id}>, \`вы были изгнаны с поста заместителя семьи '${families[0]}'! Снял:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `🎭чат-семей🎭`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`снял заместителя\` <@${user.id}> \`семья: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты владелец более 1-ой семьи! Что бы снять заместителя, нужно выбрать из какой семьи ты его будешь выгонять! Используй: /famdelzam [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }

            let fam_zam = false;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `💒 Семьи 💒`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `member`){
                                    if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                        if (perm.id == user.id){
                                            fam_zam = true
                                            perm.delete()
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!fam_zam){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`данный пользователь не ваш заместитель!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let general = message.guild.channels.find(c => c.name == `💖общенице💖`);
            if (general) await general.send(`<@${user.id}>, \`вы были изгнаны с поста заместителя семьи '${families[args[2]]}'! Снял:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `🎭чат-семей🎭`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`снял заместителя\` <@${user.id}> \`семья: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith("/ffuser")){
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return
        const args = message.content.slice('/ffuser').split(/ +/)
        if (!args[1]) return
        let name = args.slice(1).join(" ");
        let userfinders = false;
        let foundedusers_nick;
        let numberff_nick = 0;
        let foundedusers_tag;
        let numberff_tag = 0;
        message.guild.members.filter(userff => {
            if (userff.displayName.toLowerCase().includes(name.toLowerCase())){
                if (foundedusers_nick == null){
                    foundedusers_nick = `${numberff_nick + 1}) <@${userff.id}>`
                }else{
                    foundedusers_nick = foundedusers_nick + `\n${numberff_nick + 1}) <@${userff.id}>`
                }
                numberff_nick++
                if (numberff_nick == 15 || numberff_tag == 15){
                    if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
                    if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
                    const embed = new Discord.RichEmbed()
		    .setAuthor(`© 2019 Oye Bot™`, `https://i.imgur.com/V80KM2u.jpg`, "https://vk.com/omgyoureyes")
                    .addField(`BY NICKNAME`, foundedusers_nick, true)
                    .addField("BY DISCORD TAG", foundedusers_tag, true)
                    message.reply(`\`по вашему запросу найдена следующая информация:\``, embed); 
                    numberff_nick = 0;
                    numberff_tag = 0;
                    foundedusers_tag = null;
                    foundedusers_nick = null;
                }
                if (!userfinders) userfinders = true;
            }else if (userff.user.tag.toLowerCase().includes(name.toLowerCase())){
                if (foundedusers_tag == null){
                    foundedusers_tag = `${numberff_tag + 1}) <@${userff.id}>`
                }else{
                    foundedusers_tag = foundedusers_tag + `\n${numberff_tag + 1}) <@${userff.id}>`
                }
                numberff_tag++
                if (numberff_nick == 15 || numberff_tag == 15){
                    if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
                    if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
                    const embed = new Discord.RichEmbed()
		    .setAuthor(`© 2019 Oye Bot™`, `https://i.imgur.com/V80KM2u.jpg`, "https://vk.com/omgyoureyes")
                    .addField(`BY NICKNAME`, foundedusers_nick, true)
                    .addField("BY DISCORD TAG", foundedusers_tag, true)
                    message.reply(`\`по вашему запросу найдена следующая информация:\``, embed); 
                    numberff_nick = 0;
                    numberff_tag = 0;
                    foundedusers_tag = null;
                    foundedusers_nick = null;
                }
                if (!userfinders) userfinders = true;
            }
        })
        if (!userfinders) return message.reply(`я никого не нашел.`, authorrisbot) && message.delete()
        if (numberff_nick != 0 || numberff_tag != 0){
            if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
            if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
            const embed = new Discord.RichEmbed()
	    .setAuthor(`© 2019 Oye Bot™`, `https://i.imgur.com/V80KM2u.jpg`, "https://vk.com/omgyoureyes")
            .addField(`BY NICKNAME`, foundedusers_nick, true)
            .addField("BY DISCORD TAG", foundedusers_tag, true)
            message.reply(`\`по вашему запросу найдена следующая информация:\``, embed); 
        }
    }

    if (message.content.startsWith("/accinfo")){
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return
        let user = message.guild.member(message.mentions.users.first());
        if (user){
            let userroles;
            await user.roles.filter(role => {
                if (userroles == undefined){
                    if (!role.name.includes("everyone")) userroles = `<@&${role.id}>`
                }else{
                    if (!role.name.includes("everyone")) userroles = userroles + `, <@&${role.id}>`
                }
            })
            let perms;
            if (user.permissions.hasPermission("ADMINISTRATOR") || user.permissions.hasPermission("MANAGE_NICKNAMES")){
                perms = "[!] Пользователь модератор [!]";
            }else{
                perms = "У пользователя нет админ прав."
            }
            if (userroles == undefined){
                userroles = `отсутствуют.`
            }
            let date = user.user.createdAt;
            let registed = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            date = user.joinedAt
            let joindate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            const embed = new Discord.RichEmbed()
            .setAuthor(`© 2019 Oye Bot™`, `https://i.imgur.com/V80KM2u.jpg`, "https://vk.com/omgyoureyes")
	    .setColor("#FF0000")
            .setFooter(`Аккаунт пользователя: ${user.displayName}`, user.user.avatarURL)
            .setTimestamp()
            .addField(`Дата создания аккаунта и входа на сервер`, `**Аккаунт создан:** \`${registed}\`\n**Вошел к нам:** \`${joindate}\``)
            .addField("Roles and Permissions", `**Роли:** ${userroles}\n**PERMISSIONS:** \`${perms}\``)
            message.reply(`**вот информация по поводу аккаунта <@${user.id}>**`, embed)
            return message.delete();
        }else{
            const args = message.content.slice('/accinfo').split(/ +/)
            if (!args[1]) return
            let name = args.slice(1).join(" ");
            let foundmember = false;
            await message.guild.members.filter(f_member => {
                if (f_member.displayName.includes(name)){
                    foundmember = f_member
                }else if(f_member.user.tag.includes(name)){
                    foundmember = f_member
                }
            })
            if (foundmember){
                let user = foundmember
                let userroles;
                await user.roles.filter(role => {
                    if (userroles == undefined){
                        if (!role.name.includes("everyone")) userroles = `<@&${role.id}>`
                    }else{
                        if (!role.name.includes("everyone")) userroles = userroles + `, <@&${role.id}>`
                    }
                })
                let perms;
                if (user.permissions.hasPermission("ADMINISTRATOR") || user.permissions.hasPermission("MANAGE_NICKNAMES")){
                    perms = "[!] Пользователь модератор [!]";
                }else{
                    perms = "У пользователя нет админ прав."
                }
                if (userroles == undefined){
                    userroles = `отсутствуют.`
                }
                let date = user.user.createdAt;
                let registed = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                date = user.joinedAt
                let joindate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                const embed = new Discord.RichEmbed()
                .setAuthor(`© 2019 Oye Bot™`, `https://i.imgur.com/V80KM2u.jpg`, "https://vk.com/omgyoureyes")
                .setColor("#FF0000")
                .setFooter(`Аккаунт пользователя: ${user.displayName}`, user.user.avatarURL)
                .setTimestamp()
                .addField(`Краткая информация`, `**Аккаунт создан:** \`${registed}\`\n**Вошел к нам:** \`${joindate}\``)
                .addField("Roles and Permissions", `**Роли:** ${userroles}\n**PERMISSIONS:** \`${perms}\``)
                message.reply(`**вот информация по поводу аккаунта <@${user.id}>**`, embed)
            }
            return message.delete();
        }
    }

    /*
    if (message.content.toLowerCase().startsWith("привет") && message.content.toLocaleLowerCase().includes(`бот`)){
        message.reply('**привет! Как тебя зовут?**').then((nededit) => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 10000,
                errors: ['time'],
            }).then((collected) => {
                nededit.edit(`<@${message.author.id}>, **привет, ${collected.first().content}!**`).then(() => collected.first().delete());
            }).catch(() => {
                nededit.edit(`<@${message.author.id}>, **привет! А ты кто?**`)
            });
        });
    }
    */
	
    if (message.content.startsWith("/dwarn")){
	if (!message.member.hasPermission("MANAGE_ROLES")){
	    message.reply(`\`недостаточно прав доступа!\``).then(msg => msg.delete(12000));
	    return message.delete();
	}
	let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.reply(`\`пользователь не указан! '/dwarn [user]'\``)
            return message.delete();
        }
	antislivsp1.delete(user.id);
	antislivsp2.delete(user.id);
	let spchangg = message.guild.channels.find(c => c.name == "🔑чат-модераторов🔑");
	spchangg.send(`\`${message.member.displayName} очистил все предупреждения системой антислива пользователю\` <@${user.id}>`);
    }

    if (message.content.toLowerCase().startsWith("/itester")){
        if (message.guild.id == "531454559038734356") return message.reply("`команда работает только на тестовом сервере omg. your eyes.`", {embed: {
            color: 3447003,
            fields: [{
                name: "`omg. your eyes. - Сервер разработчиков`",
                value: "**Набор в тестеры закрыт!**"
            }]}}).then(msg => msg.delete(12000))
        if (message.member.roles.some(r => r.name == "Tester's Team ✔")){
            return message.reply("`вы уже являетесь тестером.`")
        }
        message.member.addRole(bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == "Tester's Team ✔"));
        return message.reply(`\`теперь вы тестер.\``)
    }
    
    if (message.content.toLowerCase().includes("сними") || message.content.toLowerCase().includes("снять")){
        if (!message.member.roles.some(r => canremoverole.includes(r.name)) && !message.member.hasPermission("MANAGE_NICKNAMES")) return
        const args = message.content.split(/ +/)
        let onebe = false;
        let twobe = false;
        args.forEach(word => {
            if (word.toLowerCase().includes(`роль`)) onebe = true
            if (word.toLowerCase().includes(`у`)) twobe = true
        })
        if (!onebe || !twobe) return
        if (message.mentions.users.size > 1) return message.react(`📛`)
        let user = message.guild.member(message.mentions.users.first());
        if (!user) return message.react(`📛`)
        if (snyatie.has(message.author.id + `=>` + user.id)) return message.react(`🕖`)
        let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`); // Найти чат на сервере.
        if(!reqchat){
            message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
            return console.error(`Канал requests-for-roles не был найден!`)
        }
        let roleremove = user.roles.find(r => rolesgg.includes(r.name));
        if (!roleremove) return message.react(`📛`)

        message.reply(`\`напишите причину снятия роли.\``).then(answer => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then((collected) => {
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Запрос о снятии роли.`")
                .setColor("#483D8B")
                .addField("Отправитель", `\`Пользователь:\` <@${message.author.id}>`)
                .addField("Кому снять роль", `\`Пользователь:\` <@${user.id}>`)
                .addField("Роль для снятия", `\`Роль для снятия:\` <@&${roleremove.id}>`)
                .addField("Отправлено с канала", `<#${message.channel.id}>`)
                .addField("Причина снятия роли", `${collected.first().content}`)
                .addField("Информация", `\`[✔] - снять роль\`\n` + `\`[❌] - отказать в снятии роли\`\n` + `\`[D] - удалить сообщение\``)
                .setFooter("© Support Team")
                .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    answer.delete();
                    collected.first().delete();
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                snyatie.add(message.author.id + `=>` + user.id)
                return message.react(`📨`);
            }).catch(() => {
                return answer.delete()
            });
        });
    }


    if (message.content.toLowerCase().includes("роль") && !message.content.toLowerCase().includes(`сними`) && !message.content.toLowerCase().includes(`снять`)){
        // Проверить невалидный ли ник.
        if (nrpnames.has(message.member.displayName)){
            if(message.member.roles.some(r=>rolesgg.includes(r.name)) ) {
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (message.member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        await message.member.removeRole(rolerem); // Забрать роли указанные ранее.
                    }
                }
            }
            message.react(`📛`) // Поставить знак стоп под отправленным сообщением.
            return // Выход
        }
        // Проверить все доступные тэги
        for (var i in manytags){
            if (message.member.displayName.toLowerCase().includes("[" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + "]") || message.member.displayName.toLowerCase().includes("(" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + ")") || message.member.displayName.toLowerCase().includes("{" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + "}")){
                let rolename = tags[manytags[i].toUpperCase()] // Указать название роли по соответствию с тэгом
                let role = message.guild.roles.find(r => r.name == rolename); // Найти эту роль на discord сервере.
                let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`); // Найти чат на сервере.
                if (!role){
                    message.reply(`\`Ошибка выполнения. Роль ${rolename} не была найдена.\``)
                    return console.error(`Роль ${rolename} не найдена!`);
                }else if(!reqchat){
                    message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
                    return console.error(`Канал requests-for-roles не был найден!`)
                }
                if (message.member.roles.some(r => [rolename].includes(r.name))){
                    return message.react(`👌`) // Если роль есть, поставить окей.
                }
                if (sened.has(message.member.displayName)) return message.react(`🕖`) // Если уже отправлял - поставить часы.
                let nickname = message.member.displayName;
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Проверка на валидность ник нейма.`")
                .setColor("#483D8B")
                .addField("Аккаунт", `\`Пользователь:\` <@${message.author.id}>`, true)
                .addField("Никнейм", `\`Ник:\` ${nickname}`, true)
                .addField("Роль для выдачи", `\`Роль для выдачи:\` <@&${role.id}>`)
                .addField("Отправлено с канала", `<#${message.channel.id}>`)
                .addField("Информация по выдачи", `\`[✔] - выдать роль\`\n` + `\`[❌] - отказать в выдачи роли\`\n` + `\`[D] - удалить сообщение\``)
                .setFooter("© Support Team")
                .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                sened.add(message.member.displayName); // Пометить данный ник, что он отправлял запрос.
                return message.react(`📨`);
            }
        }
    }
});


bot.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (newMember.guild.id != "531454559038734356") return // Сервер не 03!
    if (oldMember.roles.size == newMember.roles.size) return // Сменил ник или еще чет!
    if (newMember.user.bot) return // Бот не принимается!
    if (oldMember.roles.size < newMember.roles.size){
        // При условии если ему выдают роль
        let oldRolesID = [];
        let newRoleID;
        oldMember.roles.forEach(role => oldRolesID.push(role.id));
        newMember.roles.forEach(role => {
            if (!oldRolesID.some(elemet => elemet == role.id)) newRoleID = role.id;
        })
        let role = newMember.guild.roles.get(newRoleID);
        if (role.name != "💚 Модератор 💚" && role.name != "💜 Саппорт 💜") return
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
        let member = await newMember.guild.members.get(entry.executor.id);
        if (member.user.bot) return // Бот не принимается!
        if (!member.hasPermission("MANAGE_ROLES")){
            if (antislivsp1.has(member.id)){
                if (antislivsp2.has(member.id)){
                    member.removeRoles(member.roles);
                    return newMember.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[ANTISLIV SYSTEM]\` <@${member.id}> \`подозревался в попытке слива. [3/3] Я снял с него роли. Пострадал:\` <@${newMember.id}>, \`выдали роль\` <@&${role.id}>`);
                }else{
                    newMember.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [2/3] Выдача роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
                    return antislivsp2.add(member.id);
                }
            }
            newMember.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [1/3] Выдача роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
            return antislivsp1.add(member.id);
        }
        let spec_chat = await newMember.guild.channels.find(c => c.name == "💡уведомления💡");
        let question = await spec_chat.send(`<@${member.id}>, \`вы выдали роль\` <@&${role.id}> \`пользователю\` <@${newMember.id}>\n\`Укажите причину выдачи роли в новом сообщении!\``);
        spec_chat.awaitMessages(response => response.member.id == member.id, {
            max: 1,
            time: 120000,
            errors: ['time'],
        }).then(async (answer) => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[ВЫДАЧА]\` \`${member.displayName} выдал роль\` <@&${role.id}> \`пользователю\` <@${newMember.id}>. \`Причина: ${answer.first().content}\``);
            answer.first().delete().catch(() => {});
        }).catch(async () => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[ВЫДАЧА]\` \`${member.displayName} выдал роль\` <@&${role.id}> \`пользователю\` <@${newMember.id}>. \`Причина: не указана.\``);
        })
    }else{
        // При условии если ему снимают роль
        let newRolesID = [];
        let oldRoleID;
        newMember.roles.forEach(role => newRolesID.push(role.id));
        oldMember.roles.forEach(role => {
            if (!newRolesID.some(elemet => elemet == role.id)) oldRoleID = role.id;
        })
        let role = newMember.guild.roles.get(oldRoleID);
        if (role.name != "💚 Модератор 💚" && role.name != "💜 Саппорт 💜") return
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first())
        let member = await newMember.guild.members.get(entry.executor.id);
        if (member.user.bot) return // Бот не принимается!
        if (!member.hasPermission("MANAGE_ROLES")){
            if (antislivsp1.has(member.id)){
                if (antislivsp2.has(member.id)){
                    member.removeRoles(member.roles);
                    return newMember.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[ANTISLIV SYSTEM]\` <@${member.id}> \`подозревался в попытке слива. [3/3] Я снял с него роли. Пострадал:\` <@${newMember.id}>, \`сняли роль\` <@&${role.id}>`);
                }else{
                    newMember.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [2/3] Снятие роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
                    return antislivsp2.add(member.id);
                }
            }
            newMember.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [1/3] Снятие роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
            return antislivsp1.add(member.id);
        }
        let spec_chat = await newMember.guild.channels.find(c => c.name == "💡уведомления💡");
        let question = await spec_chat.send(`<@${member.id}>, \`вы сняли роль\` <@&${role.id}> \`модератору\` <@${newMember.id}>\n\`Укажите причину снятия роли в новом сообщении!\``);
        spec_chat.awaitMessages(response => response.member.id == member.id, {
            max: 1,
            time: 120000,
            errors: ['time'],
        }).then(async (answer) => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[СНЯТИЕ]\` \`${member.displayName} снял роль\` <@&${role.id}> \`модератору\` <@${newMember.id}>. \`Причина: ${answer.first().content}\``);
            answer.first().delete().catch(() => {});
        }).catch(async () => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[СНЯТИЕ]\` \`${member.displayName} снял роль\` <@&${role.id}> \`у модератора\` <@${newMember.id}>. \`Причина: не указана.\``);
        })
    }
})

bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return; // Если не будет добавление или удаление смайлика, то выход
    const authorrisbot = new Discord.RichEmbed()
    .setAuthor(`© 2019 Oye Bot™`, `https://i.imgur.com/V80KM2u.jpg`, "https://vk.com/omgyoureyes")
    if (event.t == "MESSAGE_REACTION_ADD"){
        let event_guildid = event.d.guild_id // ID discord сервера
        let event_channelid = event.d.channel_id // ID канала
        let event_userid = event.d.user_id // ID того кто поставил смайлик
        let event_messageid = event.d.message_id // ID сообщение куда поставлен смайлик
        let event_emoji_name = event.d.emoji.name // Название смайлика

        if (event_userid == bot.user.id) return // Если поставил смайлик бот то выход
        if (event_guildid != serverid) return // Если сервер будет другой то выход

        let server = bot.guilds.find(g => g.id == event_guildid); // Получить сервер из его ID
        let channel = server.channels.find(c => c.id == event_channelid); // Получить канал на сервере по списку каналов
        let message = await channel.fetchMessage(event_messageid); // Получить сообщение из канала
        let member = server.members.find(m => m.id == event_userid); // Получить пользователя с сервера

        if (channel.name != `requests-for-roles`) return // Если название канала не будет 'requests-for-roles', то выйти

        if (event_emoji_name == "🇩"){
            if (!message.embeds[0]){
                channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
                return message.delete();
            }else if (message.embeds[0].title == "`Discord » Проверка на валидность ник нейма.`"){
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (!field_user || !field_nickname || !field_role || !field_channel){
                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
                }else{
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (!field_author || !field_user || !field_role || !field_channel){
                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос на снятие роли.\``);
                }else{
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос на снятие роли от ${field_author.displayName}, с ID: ${field_author.id}\``);
                }
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete();
            }
        }else if(event_emoji_name == "❌"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на выдачу роли.\nВаш ник при отправке: ${field_nickname}\nУстановите ник на: [Фракция] Имя_Фамилия [Ранг]\``)
                nrpnames.add(field_nickname); // Добавить данный никнейм в список невалидных
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы отклонять нельзя!\``).then(msg => msg.delete(5000))
                if (!field_user.roles.some(r => r.id == field_role.id)){
                    if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                    return message.delete();
                }
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос на снятие роли от\` <@${field_author.id}>\`, с ID: ${field_author.id}\``);
                field_channel.send(`<@${field_author.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на снятие роли пользователю:\` <@${field_user.id}>`)
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete();
            }
        }else if (event_emoji_name == "✔"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    // return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (field_user.roles.some(r => field_role.id == r.id)){
                    if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                    return message.delete(); // Если роль есть, то выход
                }
                let rolesremoved = false;
                let rolesremovedcount = 0;
                if (field_user.roles.some(r=>rolesgg.includes(r.name))) {
                    for (var i in rolesgg){
                        let rolerem = server.roles.find(r => r.name == rolesgg[i]);
                        if (field_user.roles.some(role=>[rolesgg[i]].includes(role.name))){
                            rolesremoved = true;
                            rolesremovedcount = rolesremovedcount+1;
                            await field_user.removeRole(rolerem); // Забрать фракционные роли
                        }
                    }
                }
                await field_user.addRole(field_role); // Выдать роль по соответствию с тэгом
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                if (rolesremoved){
                    if (rolesremovedcount == 1){
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! ${rolesremovedcount} роль другой фракции была убрана.\``)
                    }else if (rolesremovedcount < 5){
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} роли других фракций были убраны.\``)
                    }else{
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} ролей других фракций были убраны.\``)
                    }
                }else{
                    field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана!\``)
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                if (message.reactions.size != 3){
                    // return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы принимать нельзя!\``).then(msg => msg.delete(5000))
                if (!field_user.roles.some(r => r.id == field_role.id)){
                    if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                    return message.delete();
                }
                field_user.removeRole(field_role);
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил снятие роли (${field_role.name}) от\` <@${field_author.id}>, \`пользователю\` <@${field_user.id}>, \`с ID: ${field_user.id}\``);
                field_channel.send(`**<@${field_user.id}>, с вас сняли роль**  <@&${field_role.id}>  **по запросу от <@${field_author.id}>.**`)
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete()
            }
        }
    }
});

bot.on('guildBanAdd', async (guild, user) => {
    if (guild.id != serverid) return
    setTimeout(async () => {
        const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
        let member = await guild.members.get(entry.executor.id);
        if (member.user.bot && lasttestid != 'net'){
            member = await guild.members.get(lasttestid);
            lasttestid = 'net';
        }
        let reason = await entry.reason;
        if (!reason) reason = 'Причина не указана';
        const embed_ban = new Discord.RichEmbed()
        .setThumbnail(user.avatarURL)
        .setColor("#FF0000")
        .addField(`**Информация о блокировке**`, `**Заблокирован: ${user}**\n**Заблокировал: ${member}**\n**Причина: \`${reason}\`**`)
        // .addField(`**Причина блокировки**`, `**\`${reason}\`**`)
        .setFooter(`Команда по безопасности Discord сервера.`, guild.iconURL)
        guild.channels.find(c => c.name == "❌наказания❌").send(embed_ban).catch(() => {
            guild.channels.find(c => c.name == "❌наказания❌").send(`**${user} был заблокирован.**`)
        })
    }, 2000);
})

bot.on('guildMemberAdd', async member => {
    if (member.guild.id != serverid) return
    levelhigh++;
    if (levelhigh >= 5){
        if (member.hasPermission("MANAGE_NICKNAMES")){
            member.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[SYSTEM]\` ${member} \`мог быть заблокирован за попытку атаки. Уровень опасности: ${levelhigh}\``);
        }else{
            member.ban(`SYSTEM: DDOS ATTACK`);
            console.log(`${member.id} - заблокирован за ДДОС.`)
            member.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[SYSTEM]\` ${member} \`был заблокирован за попытку атаки. Уровень опасности: ${levelhigh}\``)
        }
        setTimeout(() => {
            if (levelhigh > 0){
                member.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[SYSTEM]\` \`Уровень опасности сервера был установлен с ${levelhigh} на ${+levelhigh - 1}.\``);
                levelhigh--;
            }
        }, 60000*levelhigh);
    }else{
        member.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[SYSTEM]\` ${member} \`вошел на сервер. Уровень опасности: ${levelhigh}/5\``)
        setTimeout(() => {
            if (levelhigh > 0){
                member.guild.channels.find(c => c.name == "🔑чат-модераторов🔑").send(`\`[SYSTEM]\` \`Уровень опасности сервера был установлен с ${levelhigh} на ${+levelhigh - 1}.\``);
                levelhigh--;
            }
        }, 60000*levelhigh);
    }
})
