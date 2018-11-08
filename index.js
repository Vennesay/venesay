const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
const Logger = require('./objects/logger');

let requests = JSON.parse(fs.readFileSync("./database/requests.json", "utf8"));
let blacklist = JSON.parse(fs.readFileSync("./database/blacklist names.json", "utf8"));
let reqrem = JSON.parse(fs.readFileSync("./database/requests remove.json", "utf8"));

let version = "7.8";
let hideobnova = true;

const nrpnames = new Set();
const cooldowncommand = new Set();
const report_cooldown = new Set();

punishment_rep = ({
    "mute": "Вы были замучены в текстовых каналах.",
    "kick": "Вы были отключены от Discord-сервера.",
})

tags = ({
    "G": "🎮 Геймер 🎮"

});

let manytags = [
"G",
];

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

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
                let rolesgg = ["🎮 Геймер 🎮"]
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

function hook(channel, name, message, avatar) {

    if (!channel) return console.log('Channel not specified.');
    if (!name) return console.log('Title not specified.');
    if (!message) return console.log('Message not specified.');
    if (!avatar) return console.log('Avatar not specified.');

    avatar = avatar.replace(/\s/g, '');
        channel.fetchWebhooks()
        .then(webhook => {
            let foundHook = webhook.find(web => web.name == "Капитан Патрик")
            if (!foundHook) {
                channel.createWebhook('Капитан Патрик', 'https://cdn4.iconfinder.com/data/icons/technology-devices-1/500/speech-bubble-128.png')
                    .then(webhook => {
                        webhook.send(message, {
                            "username": name,
                            "avatarURL": avatar,
                        }).catch(error => { // We also want to make sure if an error is found, to report it in chat.
                            console.log(error);
                            return channel.send('**Something went wrong when sending the webhook. Please check console.**');
                        })
                    })
            }else{ // That webhook was only for if it couldn't find the original webhook
                foundHook.send(message, { // This means you can just copy and paste the webhook & catch part.
                    "username": name,
                    "avatarURL": avatar,
                }).catch(error => { // We also want to make sure if an error is found, to report it in chat.
                        console.log(error);
                        return channel.send('**Something went wrong when sending the webhook. Please check console.**');
                    })
                }
        })
}

bot.login(process.env.token);

bot.on('ready', () => {
    console.log("Бот был успешно запущен!");
    bot.guilds.find(g => g.id == "427906722527707147").channels.find(c => c.name == "🎮game-bot-logs🎮").send(`\`Я был запущен! Версия ${version}\``)
    if (!hideobnova){
        if (bot.guilds.find(g => g.id == "427906722527707147").channels.find(c => c.name == "updates-bot-user")) bot.guilds.find(g => g.id == "427906722527707147").channels.find(c => c.name == "updates-bot-user").send(`**DISCORD BOT UPDATE** @everyone\n\`\`\`diff
Вышло обновление версии ${version}:
- При отправки запроса на выдачу роли ставится смайлик 📨
» Venesay™.\`\`\``).then(msgdone => {
            msgdone.react(`👍`).then(() => {
                msgdone.react(`👎`)
            })
        })
    }
});

bot.on('message', async message => {
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.guild.id != "427906722527707147" && message.guild.id != "427906722527707147" && message.guild.id != "427906722527707147") return
    if (message.type === "PINS_ADD") if (message.channel.name == "🔞spectators-chat🔞") message.delete();
    if (message.type === "PINS_ADD") if (message.channel.name == "🔞spectators-chat🔞") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн.`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    if (message.member.id == bot.user.id) return

    if (message.guild.id == 427906722527707147){
        if (message.channel.name == "ваши-предложения"){
            if (!message) return
            message.react(`✔`).then(() => {
                if (!message) return
                message.react(`❌`).then(() => {
                    if (!message) return
                    message.react(`🌿`)
                })
            })
        }
    }

    let dataserver = bot.guilds.find(g => g.id == "427906722527707147");
    let scottdale = bot.guilds.find(g => g.id == "427906722527707147");
    if (!dataserver){
        message.channel.send(`\`Data-Server of Scottdale не был загружен!\nПередайте это сообщение техническим администраторам Discord:\`<@336207279412215809>, <@402092109429080066>`)
        console.error(`Процесс завершен. Data-Server не найден.`)
        return bot.destroy();
    }
    let reportlog = scottdale.channels.find(c => c.name == "🚽reports-log🚽");
    if (!reportlog) return

      
      if (message.content == "/questions"){

        
        let admin_level = 1;
        let db_channel = dataserver.channels.find(c => c.name == "admins");
        if (!db_channel) return
        if (message.channel.name != "🚀reports🚀") return
        let user_admin_level;

        await db_channel.fetchMessages().then(messages => {
            let user_admin = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${message.member.id}\``))
            if (user_admin){
                const admin_lvl = user_admin.content.slice().split('ADMIN PERMISSIONS:** ');
                user_admin_level = admin_lvl[1]
            }else{
                user_admin_level = 0;
            }
        });

        if (user_admin_level < admin_level){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }

        if (message.channel.name == "🔥чатик🔥") return message.delete();

        let en_questions = false;
        let num_questions = 0;
        let text_questions;
        let rep_channel = message.guild.channels.find(c => c.name == "🚀reports🚀");

        let _report_number;
        let _report_user;
        let _report_content;
        let _report_channel;
        let _report_status;

        await rep_channel.fetchMessages().then(repmessages => {
            repmessages.filter(repmessage => {
                if (repmessage.content.startsWith(`REPORT`)){
                    _report_status = repmessage.content.slice().split('=>')[9]
                    if (_report_status == "WAIT"){
                        en_questions = true;
                        _report_number = repmessage.content.slice().split('=>')[1]
                        _report_user = repmessage.content.slice().split('=>')[3]
                        _report_content = repmessage.content.slice().split('=>')[5]
                        _report_channel = repmessage.content.slice().split('=>')[7]
                        if (num_questions == 0){
                            text_questions = `[№${_report_number}] ${_report_content}`
                        }else{
                            text_questions = `[№${_report_number}] ${_report_content}\n` + text_questions
                        }
                        if (num_questions == 7){
                            message.channel.send(``, {embed: {
                                color: 3447003,
                                fields: [{
                                    name: `Вопросы`,
                                    value: `${text_questions}`
                                }]
                            }});
                            num_questions = 0;
                        }
                        num_questions++
                    }
                }
            })
        })
        if (en_questions){
            if (num_questions != 0){
                message.channel.send(``, {embed: {
                    color: 3447003,
                    fields: [{
                        name: `Активные вопросы`,
                        value: `${text_questions}`
                    }]
                }});
            }
        }else{
            message.reply(`\`активных вопросов нет.\``)
        }
        message.delete();
    }

    if (message.content == "/help"){
        if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }
        const get_dp = message.guild.channels.find(c => c.name == "🚀reports🚀");
        const sell_dp = message.guild.channels.find(c => c.name == "🚀reports🚀");
        const help = new Discord.RichEmbed()
        .setTitle(`Инструкция по использованию.`)
        .setColor("#FF0000")
        .addField(`**Команды основного бота**`, `**1. /ans - ответить на жалобу/вопрос (только в <#${get_dp.id}>).**\n**2. /questions - посмотреть список активных жалоб/вопросов (только в <#${get_dp.id}>).**\n**3. /remove - запросить снятие ролей у пользователя.**\n**4. /ping - проверить, работает ли бот.**\n**5. /addbadword - добавить запрещенное слово**\n**6. /accinfo - узнать полную информацию об аккаунте.**`)
        .addField(`**Команды игрового бота**`, `**1. /givemoney - выдать ₯ пользователю.**\n**2. /takemoney - пополнить свой счет на 1000 ₯.**\n**3. /pingbot - проверить, онлайн ли бот.**`)
        .addField(`**Команды бота ๖ۣۣۜOfficial Spectator™**`, `**1. !mute - заблокировать навсегда чат пользователю.**\n**2. !tempmute - выдать мут на определенное количество времени пользователю.**\n**3. !kick - выгнать пользователя с сервера.**\n**4. !tempban - выдать временную блокировку пользователю.**\n**5. !unmute - снять блокировку чата пользователю**\n**6. !unban - разблокировать пользователя.**\n**7. !clear - очистить чат на определенное количество сообщений.**`)
        .addField(`**Команды бота ๖ۣۣۜManager™**`, `**1. -+warn - выдать предупреждение пользователю**\n**2. -+clearwarn - аннулировать предупреждение пользователю**\n**3. -+warnings - посмотреть список предупреждений**`)
        .setFooter(`© ๖ۣۣۜVenesay™`, `https://cdn.discordapp.com/avatars/349846714892419074/8b0a30fd048d8780736a1241b133fdba.png?size=128`)
        message.channel.send(help);
        return message.delete();
    }
    
    if (message.content == "/helpusers"){
        if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }
        const get_dp = message.guild.channels.find(c => c.name == "💬правила💬");
        const get_reports = message.guild.channels.find(c => c.name == "📑репорты📑");
        const get_info = message.guild.channels.find(c => c.name == "⭐информация⭐");
        const help = new Discord.RichEmbed()
        .setTitle(`Краткий экскурс.`)
        .setColor("#ADFF2F")
        .addField(`**Команды**`, `**1. /report - задать вопрос или отправить жалобу на кого-либо (только в канале <#${get_reports.id}>).**`)
        .addField(`**К ознакомлению**`, `**1. Данный сервер создан в целях сплочения геймерского сообщества различных игр, а также для веселья!**\n\n**2. Каждый пользователь нашего Discord сервера обязан быть ознакомлен с правилами (канал <#${get_dp.id}>).**\n\n**3. Если Вашей любимой игры нет в списке игровых каналов - Вы можете сообщить об этом модераторам (/report).**\n\n**4. Вы можете предлагать идеи для улучшения нашего Discord сервера (/report), мы обязательно будем это поощрять.**\n\n**5. У нашего сервера имеется игровой бот (ознакомьтесь с функционал в канале <#${get_info.id}> )**\n\n**6. Если Вы хотите следить за порядком на нашем сервере - сообщите об этом администрации (/report).**\n\n**7. Веселитесь! Ведь одна из тех причин, почему мы создали данный сервер.**`)
        .setFooter(`© ๖ۣۣۜVenesay™`, `https://cdn.discordapp.com/avatars/349846714892419074/8b0a30fd048d8780736a1241b133fdba.png?size=128`)
        message.channel.send(help);
        return message.delete();
    } 

    if (message.content.startsWith("/report")){
        let rep_channel = message.guild.channels.find(c => c.name == "🚀reports🚀");
        if (message.channel.name != "📑репорты📑") return
        if (!rep_channel) return message.reply(`\`[ERROR] Канал ${rep_channel.name} не был найден.\nПередайте это сообщение техническим администраторам Discord:\`<@336207279412215809>, <@402092109429080066>`)
        if (report_cooldown.has(message.author.id)) {
            message.channel.send("`Можно использовать раз в минуту!` - " + message.author).then(msg => msg.delete(7000));
            return message.delete();
        }
        if (!message.member.hasPermission("ADMINISTRATOR")){
            report_cooldown.add(message.author.id);
            setTimeout(() => {
                report_cooldown.delete(message.author.id);
            }, 60000);
        }
        const args = message.content.slice('/report').split(/ +/)
        if (!args[1]){
            message.reply(`\`вы не указали суть вашего вопроса/жалобы. /report [текст]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let text = args.slice(1).join(" ");
        if (text.includes(`=>`)){
            message.reply(`\`ваш текст содержит запрещенный символ "=>", замените его на "->".\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let reportnum_message = false;
        let rep_number = 0;
        let report_number_message;
        await rep_channel.fetchMessages().then(repmessages => {
            repmessages.filter(repmessage => {
                if (repmessage.content.startsWith(`[REPORTNUMBER]`)){
                    rep_number = repmessage.content.slice().split('=>')[1]
                    reportnum_message = true;
                    report_number_message = repmessage;
                }
            })
        })
        if (!reportnum_message){
            await rep_channel.send(`[REPORTNUMBER]=>0`).then(msg => {
                report_number_message = msg;
            })
            rep_number = 0;
        }
        rep_number++
        await report_number_message.edit(`[REPORTNUMBER]=>${rep_number}`)
        rep_channel.send(`REPORT=>${rep_number}=>USER=>${message.author.id}=>CONTENT_REP=>${text}=>CHANNEL=>${message.channel.id}=>STATUS=>WAIT`).then(hayway => {
            hayway.pin();
        })
        message.reply(`\`ваш вопрос/жалоба была успешно отправлена! Номер вашего вопроса: №${rep_number}\``).then(msg => msg.delete(35000));
        reportlog.send(`\`[REPORT]\` <@${message.author.id}> \`отправил вопрос №${rep_number}. Суть:\` ${text}`)
        message.delete();
        return message.guild.channels.find(c => c.name == "🚀reports🚀").send(`\`Появился новый вопрос №${rep_number}. Используйте '/ans' что бы ответить. '/questions' - список активных вопросов.\``).then(msg => msg.delete(120000))
    }

    if (message.content.startsWith(`/ans`)){
        let admin_level = 1;
        let db_channel = dataserver.channels.find(c => c.name == "admins");
        if (!db_channel) return
        if (message.channel.name != "🚀reports🚀") return
        let user_admin_level;

        await db_channel.fetchMessages().then(messages => {
            let user_admin = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${message.member.id}\``))
            if (user_admin){
                const admin_lvl = user_admin.content.slice().split('ADMIN PERMISSIONS:** ');
                user_admin_level = admin_lvl[1]
            }else{
                user_admin_level = 0;
            }
        });

        if (user_admin_level < admin_level){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }

        if (message.channel.name == "🔥чатик🔥") return message.delete();

        let rep_channel = message.guild.channels.find(c => c.name == "🚀reports🚀");
        const args = message.content.slice('/ans').split(/ +/)
        if (!args[1]){
            let reportnum_message = false;
            await rep_channel.fetchMessages().then(repmessages => {
                repmessages.filter(repmessage => {
                    if (repmessage.content.startsWith(`[REPORTNUMBER]`)){
                        reportnum_message = true;
                    }
                })
            })
            if (!reportnum_message){
                message.reply(`\`на данный момент вопросов нет.\``).then(msg => msg.delete(7000));
                return message.delete();
            }
            let reportmessageid = false;
            let _report_number;
            let _report_user;
            let _report_content;
            let _report_channel;
            let _report_status;
            let del_rep_message;
            await rep_channel.fetchMessages().then(repmessages => {
                repmessages.filter(repmessage => {
                    if (repmessage.content.startsWith(`REPORT`)){
                        _report_status = repmessage.content.slice().split('=>')[9]
                        if (_report_status == "WAIT"){
                            reportmessageid = true;
                            _report_number = repmessage.content.slice().split('=>')[1]
                            _report_user = repmessage.content.slice().split('=>')[3]
                            _report_content = repmessage.content.slice().split('=>')[5]
                            _report_channel = repmessage.content.slice().split('=>')[7]
                            del_rep_message = repmessage;
                        }
                    }
                })
            })
            if (!reportmessageid){
                message.reply(`\`на данный момент вопросов нет.\``).then(msg => msg.delete(7000));
                return message.delete();
            }
            _report_status = "ON EDIT"
            await del_rep_message.edit(`REPORT=>${_report_number}=>USER=>${_report_user}=>CONTENT_REP=>${_report_content}=>CHANNEL=>${_report_channel}=>STATUS=>${_report_status}`)
            message.reply(`\`Отпишите ответ на данный вопрос в чат. Жалоба/вопрос от пользователя:\` <@${_report_user}>\n\`Отклонить вопрос => "-"\``, {embed: {
                color: 3447003,
                fields: [{
                    name: `Номер вопроса/жалобы: ${_report_number}`,
                    value: `${_report_content}`
                }]}}).then(req_report_message => {
                message.channel.awaitMessages(response => response.member.id == message.member.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then((collected) => {
                    if (collected.first().content != "-"){
                        let user = message.guild.members.find(m => m.id == _report_user);
                        let general = message.guild.channels.find(c => c.id == _report_channel);
                        user.sendMessage(`<@${_report_user}>, \`на ваш вопрос №${_report_number} поступил ответ от:\` <@${message.author.id}>`, {embed: {
                            color: 3447003,
                            fields: [{
                                name: `Ваш вопрос, который вы задали.`,
                                value: `${_report_content}`
                            },
                            {
                                name: `Ответ модератора`,
                                value: `${collected.first().content}`
                            }]
                        }}).catch(() => {
                            general.send(`<@${_report_user}>, \`на ваш вопрос №${_report_number} поступил ответ от:\` <@${message.author.id}>`, {embed: {
                                color: 3447003,
                                fields: [{
                                    name: `Ваш вопрос, который вы задали.`,
                                    value: `${_report_content}`
                                },
                                {
                                    name: `Ответ модератора`,
                                    value: `${collected.first().content}`
                                }]
                            }})
                        })
                        reportlog.send(`\`[ANSWER]\` <@${message.author.id}> \`ответил на вопрос №${_report_number} от\` <@${_report_user}>\n\`Вопрос:\` ${_report_content}\n\`Ответ:\` ${collected.first().content}`)
                        req_report_message.delete();
                        del_rep_message.delete();
                        message.delete();
                        collected.first().delete();
                    }else{
                        let user = message.guild.members.find(m => m.id == _report_user);
                        let general = message.guild.channels.find(c => c.id == _report_channel);
                        user.sendMessage(`<@${_report_user}>, \`модератор\` <@${message.author.id}> \`отказался отвечать на ваш вопрос №${_report_number}\``).catch(() => {
                          general.send(`<@${_report_user}>, \`модератор\` <@${message.author.id}> \`отказался отвечать на ваш вопрос №${_report_number}\``)  
                        })
                        reportlog.send(`\`[DELETE]\` <@${message.author.id}> \`отказался от вопроса №${_report_number} от\` <@${_report_user}>\n\`Вопрос:\` ${_report_content}`)
                        req_report_message.delete();
                        del_rep_message.delete();
                        message.delete();
                        collected.first().delete();
                    }
                }).catch(() => {
                    del_rep_message.edit(`REPORT=>${_report_number}=>USER=>${_report_user}=>CONTENT_REP=>${_report_content}=>CHANNEL=>${_report_channel}=>STATUS=>WAIT`)
                    message.reply('\`вы не успели ответить на данный вопрос.\`');
                    req_report_message.delete();
                    message.delete();
                });
            });
        }else{
            let reportnum_message = false;
            await rep_channel.fetchMessages().then(repmessages => {
                repmessages.filter(repmessage => {
                    if (repmessage.content.startsWith(`[REPORTNUMBER]`)){
                        reportnum_message = true;
                    }
                })
            })
            if (!reportnum_message){
                message.reply(`\`на данный момент вопросов нет.\``).then(msg => msg.delete(7000));
                return message.delete();
            }
            let reportmessageid = false;
            let _report_number;
            let _report_user;
            let _report_content;
            let _report_channel;
            let _report_status;
            let del_rep_message;
            await rep_channel.fetchMessages().then(repmessages => {
                repmessages.filter(repmessage => {
                    if (repmessage.content.startsWith(`REPORT`)){
                        _report_number = repmessage.content.slice().split('=>')[1]
                        if (args[1] == _report_number){
                            reportmessageid = true;
                            _report_user = repmessage.content.slice().split('=>')[3]
                            _report_content = repmessage.content.slice().split('=>')[5]
                            _report_channel = repmessage.content.slice().split('=>')[7]
                            _report_status = repmessage.content.slice().split('=>')[9]
                            del_rep_message = repmessage;
                        }
                    }
                })
            })
            if (!reportmessageid){
                message.reply(`\`данного вопроса не существует.\``).then(msg => msg.delete(7000));
                return message.delete();
            }
            if (_report_status != "WAIT"){
                message.reply(`\`на данный вопрос уже отвечают.\``).then(msg => msg.delete(7000))
                return message.delete();
            }
            _report_status = "ON EDIT"
            await del_rep_message.edit(`REPORT=>${_report_number}=>USER=>${_report_user}=>CONTENT_REP=>${_report_content}=>CHANNEL=>${_report_channel}=>STATUS=>${_report_status}`)
            message.reply(`\`Отпишите ответ на данный вопрос в чат. Жалоба/вопрос от пользователя:\` <@${_report_user}>\n\`Отклонить вопрос => "-"\``, {embed: {
                color: 3447003,
                fields: [{
                    name: `Номер вопроса/жалобы: ${_report_number}`,
                    value: `${_report_content}`
                }]}}).then(req_report_message => {
                message.channel.awaitMessages(response => response.member.id == message.member.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then((collected) => {
                    if (collected.first().content != "-"){
                        let user = message.guild.members.find(m => m.id == _report_user);
                        let general = message.guild.channels.find(c => c.id == _report_channel);
                        user.sendMessage(`<@${_report_user}>, \`на ваш вопрос №${args[1]} поступил ответ от:\` <@${message.author.id}>`, {embed: {
                            color: 3447003,
                            fields: [{
                                name: `Ваш вопрос, который вы задали.`,
                                value: `${_report_content}`
                            },
                            {
                                name: `Ответ модератора`,
                                value: `${collected.first().content}`
                            }]
                        }}).catch(() => {
                            general.send(`<@${_report_user}>, \`на ваш вопрос №${args[1]} поступил ответ от:\` <@${message.author.id}>`, {embed: {
                                color: 3447003,
                                fields: [{
                                    name: `Ваш вопрос, который вы задали.`,
                                    value: `${_report_content}`
                                },
                                {
                                    name: `Ответ модератора`,
                                    value: `${collected.first().content}`
                                }]
                            }})
                        })
                        reportlog.send(`\`[ANSWER]\` <@${message.author.id}> \`ответил на вопрос №${args[1]} от\` <@${_report_user}>\n\`Вопрос:\` ${_report_content}\n\`Ответ:\` ${collected.first().content}`)
                        req_report_message.delete();
                        del_rep_message.delete();
                        message.delete();
                        collected.first().delete();
                    }else{
                        let user = message.guild.members.find(m => m.id == _report_user);
                        let general = message.guild.channels.find(c => c.id == _report_channel);
                        user.sendMessage(`<@${_report_user}>, \`модератор\` <@${message.author.id}> \`отказался отвечать на ваш вопрос №${args[1]}\``).catch(() => {
                            general.send(`<@${_report_user}>, \`модератор\` <@${message.author.id}> \`отказался отвечать на ваш вопрос №${args[1]}\``)
                        })
                        reportlog.send(`\`[DELETE]\` <@${message.author.id}> \`отказался от вопроса №${args[1]} от\` <@${_report_user}>\n\`Вопрос:\` ${_report_content}`)
                        req_report_message.delete();
                        del_rep_message.delete();
                        message.delete();
                        collected.first().delete();
                    }
                }).catch(() => {
                    del_rep_message.edit(`REPORT=>${_report_number}=>USER=>${_report_user}=>CONTENT_REP=>${_report_content}=>CHANNEL=>${_report_channel}=>STATUS=>WAIT`)
                    message.reply('\`вы не успели ответить на данный вопрос.\`');
                    req_report_message.delete();
                    message.delete();
                });
            });
        }
    }

    if (message.content.startsWith("/ffuser")){
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (message.channel.name != "🔞spectators-chat🔞") return
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
        if (!userfinders) return message.reply(`я никого не нашел.`) && message.delete()
        if (numberff_nick != 0 || numberff_tag != 0){
            if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
            if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
            const embed = new Discord.RichEmbed()
            .addField(`BY NICKNAME`, foundedusers_nick, true)
            .addField("BY DISCORD TAG", foundedusers_tag, true)
            message.reply(`\`по вашему запросу найдена следующая информация:\``, embed); 
        }
    }

    if (message.content.startsWith("/accinfo")){
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (message.channel.name != "🔞spectators-chat🔞") return
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
            if (user.permissions.hasPermission("ADMINISTRATOR") || user.permissions.hasPermission("MANAGE_ROLES")){
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
                if (user.permissions.hasPermission("ADMINISTRATOR") || user.permissions.hasPermission("MANAGE_ROLES")){
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

    if (message.content.startsWith("/setadmin")){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.delete();
            return message.reply(`\`пользователь не указан. /setadmin [USER] [LVL]\``).then(msg => msg.delete(7000));
        }  
        const args = message.content.slice('/setadmin').split(/ +/)
        let db_channel = dataserver.channels.find(c => c.name == "admins");
        let find_message;
        await db_channel.fetchMessages().then(messages => {
            find_message = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${user.id}\``));
        });
        if (find_message) return message.reply(`\`он уже является модератором.\``).then(msg => msg.delete(7000));
        if (!args[2]) return message.reply(`\`лвл модератора не указан.\``).then(msg => msg.delete(7000));
        if (args[2] > 3) return message.reply(`\`лвл модерирования не может быть больше 3-х.\``).then(msg => msg.delete(7000));
        if (args[2] < 1) return message.reply(`\`лвл модерирования не может быть меньше 1-ого.\``).then(msg => msg.delete(7000));
        db_channel.send(`**ADMINISTRATION\nUSER-ID: \`${user.id}\`\nADMIN PERMISSIONS:** ${args[2]}`)
        return message.reply(`\`вы назначили\` <@${user.id}> \`модератором ${args[2]} уровня.\``)
    }

    if (message.content.startsWith("/admininfo")){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.delete();
            return message.reply(`\`вы не указали пользователя! /admininfo [USER]\``).then(msg => msg.delete(7000));
        }  
        let db_channel = dataserver.channels.find(c => c.name == "admins");
        db_channel.fetchMessages().then(messages => {
            let msgconst = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${user.id}\``))
            if (msgconst){
                const adminlvl = msgconst.content.slice().split('ADMIN PERMISSIONS:** ');
                message.reply(`\`по вашему запросу найдена следующая информация:\``, {embed: {
                color: 3447003,
                fields: [{
                    name: `Информация о ${scottdale.members.find(m => m.id == user.id).displayName}`,
                    value: `**Пользователь:** <@${user.id}>\n` +
                    `**Уровень модерирования:** \`${adminlvl[1]}\``
                }]}})
            }else{
                message.reply("`пользователь которого вы указали не является модератором.`").then(msg => msg.delete(7000));
            }
        })
    }

    if (message.content.startsWith("/deladmin")){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }
        const args = message.content.slice('/deladmin').split(/ +/)
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            let userfind = false;
            if (args[1]){
                userfind = message.guild.members.find(m => m.id == args[1]);
                user = message.guild.members.find(m => m.id == args[1]);
            }
            if (!userfind){
            message.delete();
            return message.reply(`\`вы не указали пользователя! /deladmin [USER]\``).then(msg => msg.delete(7000));
            }
        }
        if (user == message.member){
            let db_channel = dataserver.channels.find(c => c.name == "admins");
            await db_channel.fetchMessages().then(messages => {
                let find_message = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${user.id}\``));
                if (!find_message){
                    return message.reply(`\`вы не являетесь модератором.\``)
                }else{
                    find_message.delete();
                    return message.reply(`\`вы назначили себя 0-ым уровнем модерирования.\``)
                }
            });
            return
        }
        let db_channel = dataserver.channels.find(c => c.name == "admins");
        await db_channel.fetchMessages().then(messages => {
            let find_message = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${user.id}\``));
            if (!find_message) return message.reply(`\`пользователь не модератор.\``);
            let my_message = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${message.member.id}\``));
            if (!my_message) return message.reply(`\`вы не модератор.\``)
            const adminlvl = find_message.content.slice().split('ADMIN PERMISSIONS:** ');
            const adminlvl_my = my_message.content.slice().split('ADMIN PERMISSIONS:** ');
            if (adminlvl[1] >= adminlvl_my[1] && message.member.id != "336207279412215809") return message.reply(`\`вы не можете убрать модера выше или равному вас по уровню.\``)
            find_message.delete()
            return message.reply(`\`вы сняли\` <@${user.id}> \`с поста модератора ${adminlvl[1]} уровня. \``);
        });
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

    if (message.content.toLowerCase() == "/invalidrole"){
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(`\`нет прав доступа.\``)
        if (cooldowncommand.has(message.guild.id)) {
            return message.channel.send("`Можно использовать раз в две минуты!` - " + message.author);
        }
        cooldowncommand.add(message.guild.id);
        setTimeout(() => {
            cooldowncommand.delete(message.guild.id);
        }, 120000);
        let noformnick;
        await bot.guilds.find(g => g.id == message.guild.id).members.forEach(member => {
            checknick(member, "🎮 Геймер 🎮", 0, 3, bot, message);
        })
        let nrpsend;
        let nrpnamesget = 0;
        let allservernonrpnames = false;
        await bot.guilds.find(g => g.id == message.guild.id).members.forEach(newmember => {
            if (nrpnames.has(newmember.id)){
                allservernonrpnames = true;
                if (nrpnamesget == 0){
                    nrpsend = `<@${newmember.id}>`;
                }else{
                    nrpsend = nrpsend + `\n<@${newmember.id}>`;
                }
                nrpnamesget = nrpnamesget + 1;
                nrpnames.delete(newmember.id);
                if (nrpnamesget == 15){
                    bot.guilds.find(g => g.id == message.guild.id).channels.find(c => c.id == message.channel.id).send(`<@${message.author.id}> \`вот, держи невалидные ники.\`\n\n**${nrpsend}**\n\`Я автоматически забрал у них роли.\``)
                    nrpnamesget = 0;
                    nrpsend = null;
                }
            }
        })
        if (!allservernonrpnames){
            return message.reply(`Невалидных ников нет.`)
        }else{
            if (nrpsend == null) return
            bot.guilds.find(g => g.id == message.guild.id).channels.find(c => c.id == message.channel.id).send(`<@${message.author.id}> \`вот, держи невалидные ники.\`\n\n**${nrpsend}**\n\`Я автоматически забрал у них роли.\``)
            nrpnamesget = 0;
            nrpsend = null;
        }
    }
    
    if (message.content.toLowerCase().startsWith("/remove")){
        if (!message.member.roles.some(r=>["Администратор", "☆ Поддержка ☆", "✔ Spectator™"].includes(r.name)) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.delete();
            return message.reply(`\`Вы не указали пользователя! /remove [@упоминание]\``);
        }
        let countroles = 0;
        let rolesgg = ["🎮 Геймер 🎮", "🎶 Музыкант 🎶", "🎤 Народный артист 🎤"]
        for (i in rolesgg){
            if(user.roles.some(r=>rolesgg[i].includes(r.name)) ) countroles = countroles + 1;
        }
        if (countroles == 0){
            message.delete();
            return message.reply(`\`у данного пользователя нет индивидуальных ролей.\``)
        }
        if (countroles > 1){
            for (var i in rolesgg){
                let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                if (user.roles.some(role=>[rolesgg[i]].includes(role.name))){
                    await user.removeRole(rolerem);
                }
            }
            bot.guilds.find(g => g.id == message.guild.id).channels.find(c => c.name == "🔞spectators-chat🔞").send(`<@${user.id}> \`у вас забрали индивидуальных роли, если Вы не согласны с данным решением, пожалуйста свяжитесь с модераторами нашего сервера.\``)
        }else{
            let reqchat = message.guild.channels.find(c => c.name == `🔞spectators-chat🔞`);
            let rolerem = user.roles.find(r=>rolesgg.includes(r.name))
            const embed = new Discord.RichEmbed()
            .setTitle("`Discord » Снятие ролей участнику`")
            .setColor("#FF0000")
            .setFooter("© Support Team | by Venesay™")
            .setTimestamp()
            .addField("Информация", 
            `\`Пользователь:\` <@${user.id}>\n` +
            `\`Модератор:\` <@${message.author.id}>\n` +
            `\`Роль для снятия:\` <@&${rolerem.id}>\n` +
            `\`[D] - УДАЛИТЬ/ОТКЛОНИТЬ\``)
            reqchat.send(embed).then(async msgsen => {
                await msgsen.react('✔')
                await msgsen.react('🇩')
                reqrem[msgsen.id] = {
                    "status": "wait",
                    "userrem": user.id,
                    "whorem": message.author.id,
                    "rolerem": rolerem.name,
                };
                fs.writeFileSync("./database/requests remove.json", JSON.stringify(reqrem), (err) => {
                    return console.error(`Произошла ошибка. ${err}`)
                });
                await msgsen.pin();
            })
        }
        return message.delete();
    }

    if (message.content.toLowerCase().startsWith("/itester")){
        if (message.guild.id == "355656045600964609") return message.reply("`команда работает только на тестовом сервере Scottdale Brotherhood.`", {embed: {
            color: 3447003,
            fields: [{
                name: "`MidNight - Сервер разработчиков`",
                value: "**[Подключение к каналу тестеров](https://discord.gg/VTE9cWk)**"
            }]}}).then(msg => msg.delete(12000))
        if (message.member.roles.some(r => r.name == "Tester's Team ✔")){
            return message.reply("`вы уже являетесь тестером.`")
        }
        message.member.addRole(bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == "Tester's Team ✔"));
        return message.reply(`\`теперь вы тестер.\``)
    }

    if (message.content.toLowerCase().includes("роль")){
        if (blacklist[message.member.displayName]){
            let rolesgg = ["🎮 Геймер 🎮"]
            if(message.member.roles.some(r=>rolesgg.includes(r.name)) ) {
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (message.member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        await message.member.removeRole(rolerem);
                    }
                }
            }
            return message.reply(`\`Модератор\` <@${blacklist[message.member.displayName].moderatorid}> \`отметил данный ник как невалидный!\nСоставьте никнейм по форме: [Фракция] Имя_Фамилия [Ранг]\``);
        }
        for (var i in manytags){
            if (message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase())){
                let rolename = tags[manytags[i].toUpperCase()]
                let role = message.guild.roles.find(r => r.name == rolename);
                let reqchat = message.guild.channels.find(c => c.name == `🎃requests-for-roles🎃`);
                if (!role){
                    message.reply(`\`Ошибка выполнения. Роль ${rolename} не была найдена.\``)
                    return console.error(`Роль ${rolename} не найдена!`);
                }else if(!reqchat){
                    message.reply(`\`Ошибка выполнения. Канал 🎃requests-for-roles🎃 не был найден!\``)
                    return console.error(`Канал 🎃requests-for-roles🎃 не был найден!`)
                }
                if (message.member.roles.some(r => [rolename].includes(r.name))) return message.react(`➕`)
                let nickname = message.member.displayName
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Запрос на выдачу роли.`")
                .setColor("#FF0000")
                .setFooter("© ๖ۣۣۜVenesay™")
                .setTimestamp()
                .addField("Информация", 
                `\`Пользователь:\` <@${message.author.id}>\n` +
                `\`Ник:\`  \`${nickname}\`\n` +
                `\`Роль для выдачи:\` <@&${role.id}>\n` +
                `\`Сообщение:\`  \`${message.content}\`\n` +
                `\`[D] - УДАЛИТЬ ЕСЛИ ЗАБАГАЛОСЬ\``)
                reqchat.send(embed).then(async msgsen => {
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    requests[msgsen.id] = {
                        "status": "wait",
                        "supernickname": nickname,
                        "whogetrole": message.author.id,
                        "superrole": role.name,
                        "channel": message.channel.id,
                        "suptag": manytags[i],
                    };
                    fs.writeFileSync("./database/requests.json", JSON.stringify(requests), (err) => {
                        return console.error(`Произошла ошибка. ${err}`)
                    });
                    await msgsen.pin();
                })
                return message.react(`📨`)
            }
        }
    }

    let bad_words_channel = dataserver.channels.find(c => c.name == "bad-words");

    if (message.content.toLowerCase().startsWith("/addbadword")){
        if (message.channel.name != "🔞spectators-chat🔞") return
        if (!message.member.roles.some(r => ["✔Spectator™", "☆ Поддержка ☆"].includes(r.name)) && !message.member.hasPermission("ADMINISTRATOR")) return
        const args = message.content.slice('/addbadword').split(/ +/)
        let text = args.slice(2).join(" ");
        if (!args[1]) return message.reply(`\`вы не указали наказание. /addbadword [none/mute/kick] [фраза]\nПример: /addbadword mute дурак\``)
        if (args[1] != "none" && args[1] != "mute" && args[1] != "kick") return message.reply(`\`наказания: ["none", "mute", "kick"]. /addbadword [none/mute/kick] [фраза]\nПример: /addbadword mute дурак\``)
        if (!text) return message.reply(`\`укажите запрещенную фразу. /addbadword [none/mute/kick] [фраза]\nПример: /addbadword mute дурак\``)
        let checkword;
        checkword = false;
        await bad_words_channel.fetchMessages().then(badmessages => {
            badmessages.filter(badmessage => {
                const bad_word = badmessage.content.slice().split('=>')[1]
                const punish = badmessage.content.slice().split('=>')[3]
                if (text == bad_word.toLowerCase()){
                    checkword = true;
                }
            })
        })
        if (checkword){
            return message.reply(`\`данная фраза уже в списке запрещенных!\``).then(msg => msg.delete(7000))
        }else{
            bad_words_channel.send(`BAD WORD=>${text}=>PUNISHMENT=>${args[1]}=>\`Добавил: ${message.member.displayName} (${message.author.id})\``)
            message.delete();
            return message.reply(`\`вы успешно добавили фразу:\` **${text}** \`в список запрещенных.\``).then(msg => msg.delete(10000))
        }
    }

    if (!message.member.hasPermission("ADMINISTRATOR")){
        bad_words_channel.fetchMessages().then(badmessages => {
            badmessages.filter(badmessage => {
                const bad_word = badmessage.content.slice().split('=>')[1]
                const punish = badmessage.content.slice().split('=>')[3]
                if (message.content.toLowerCase().includes(bad_word.toLowerCase())){
                    scottdale.channels.find(c => c.name == "bad-words-log").send(`<@${message.member.id}> \`использовал запрещенную фразу "${bad_word}" в сообщении: "${message.content}".\nDEBUG: [PUNISHMENT=${punish}]\``)
                    message.delete();
                    if (punish == "none") return
                    message.reply(`\`ваше сообщение было удалено из-за содержания откровенного контента.\`\n\`${punishment_rep[punish]}\``).then(msg => msg.delete(12000))
                    if (punish == "mute"){
                        let muterole = scottdale.roles.find(r => r.name == "Muted");
                        return message.member.addRole(muterole); 
                    }
                    if (punish == "kick"){
                        message.member.sendMessage(`\`Вас наказала система за использование зап.слов.\``).then(() => {
                            message.member.kick(`Зап.слово [${bad_word}]`)
                        })
                    }
                }
            })
        })
    }
});

bot.on('raw', async event => {
    if (event.t == 'GUILD_MEMBER_UPDATE') console.log(event)
    if (!events.hasOwnProperty(event.t)) return;

    if (event.t == "MESSAGE_REACTION_ADD"){
        let event_userid = event.d.user_id
        let event_messageid = event.d.message_id
        let event_emoji_name = event.d.emoji.name
        let event_channelid = event.d.channel_id
        let event_guildid = event.d.guild_id
        if (event_guildid != "427906722527707147" && event_guildid != "427906722527707147" && event_guildid != "427906722527707147") return
        if (event_userid == bot.user.id) return
        let requser = bot.guilds.find(g => g.id == event_guildid).members.find(m => m.id == event_userid);
        let reqchannel = bot.guilds.find(g => g.id == event_guildid).channels.find(c => c.id == event_channelid);

        bot.guilds.find(g => g.id == event_guildid).channels.find(c => c.id == event_channelid).fetchMessage(event_messageid).then(msg => {
            if (!msg) return
        })

        if (reqchannel.name != "🎃requests-for-roles🎃") return

        if (event_emoji_name == "🇩"){
            if (requser.roles.some(r=>["✔Spectator™"].includes(r.name)) && !requser.roles.some(r => ["☆ Поддержка ☆", "Администратор"].includes(r.name))){
                return reqchannel.send(`\`[ERROR]\` <@${requser.id}> \`ошибка доступа! Функция доступна Spectator'ам и выше.\``).then(mesg => mesg.delete(7000))
            }

            if (reqrem[event_messageid]){
                if (reqrem[event_messageid].userrem == undefined){
                    reqchannel.send(`\`[DELETED]\` <@${requser.id}> \`удалил багнутый запрос.\``)
                    reqrem[event_messageid] = {
                        "status": "deleted",
                    };
                    fs.writeFileSync("./database/requests remove.json", JSON.stringify(reqrem), (err) => {
                        return console.error(`Произошла ошибка: ${err}`)
                    });
                    return reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
                }else{
                    let usernick = bot.guilds.find(g => g.id == event_guildid).members.find(m => m.id == reqrem[event_messageid].userrem);
                    reqchannel.send(`\`[DELETED]\` <@${requser.id}> \`удалил запрос от: ${usernick.nickname}, с ID: ${reqrem[event_messageid].userrem}\``)
                    reqrem[event_messageid] = {
                        "status": "deleted",
                    };
                    fs.writeFileSync("./database/requests remove.json", JSON.stringify(reqrem), (err) => {
                        return console.error(`Произошла ошибка: ${err}`)
                    });
                    return reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
                }
            }

            if (!requests[event_messageid]){
                reqchannel.send(`\`[DELETED]\` <@${requser.id}> \`удалил багнутый запрос.\``)
            }else{
                if (requests[event_messageid].supernickname == undefined){
                    reqchannel.send(`\`[DELETED]\` <@${requser.id}> \`удалил багнутый запрос.\``)
                }else{
                    reqchannel.send(`\`[DELETED]\` <@${requser.id}> \`удалил запрос от: ${requests[event_messageid].supernickname}, с ID: ${requests[event_messageid].whogetrole}\``)
                }
            }
            requests[event_messageid] = {
                "status": "deleted",
            };
            fs.writeFileSync("./database/requests.json", JSON.stringify(requests), (err) => {
                return console.error(`Произошла ошибка: ${err}`)
            });
            return reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
        }

        if (event_emoji_name == "❌"){
            if (!requests[event_messageid]){
                reqchannel.send(`\`[ERROR]\` <@${requser.id}> \`пользователь не отправлял запрос или сообщение не загрузилось!\``);
                return
            }
            reqchannel.send(`\`[DENY]\` <@${requser.id}> \`отклонил запрос от ${requests[event_messageid].supernickname}, с ID: ${requests[event_messageid].whogetrole}\``);
            let userto = bot.guilds.find(g => g.id == event_guildid).members.find(m => m.id == requests[event_messageid].whogetrole);
            let channelto = bot.guilds.find(g => g.id == event_guildid).channels.find(c => c.id == requests[event_messageid].channel);
            channelto.send(`<@${userto.id}>**,** \`модератор\` <@${requser.id}> \`отклонил ваш запрос на выдачу роли.\nВаш ник при отправке: ${requests[event_messageid].supernickname}\nВалидный ник: [${requests[event_messageid].suptag}] Имя_Фамилия [Ранг]\``)
            requests[event_messageid] = {
                "status": "deny",
            };
            fs.writeFileSync("./database/requests.json", JSON.stringify(requests), (err) => {
                return console.error(`Произошла ошибка: ${err}`)
            });
            blacklist[userto.displayName] = {
                "moderatorid": requser.id,
            };
            fs.writeFileSync("./database/blacklist names.json", JSON.stringify(blacklist), (err) => {
                return console.error(`Произошла ошибка ${err}`);
            });
            return reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
        }

        if (event_emoji_name == "✔"){
            if (!requests[event_messageid]){
                if (!reqrem[event_messageid]){
                return reqchannel.send(`\`[ERROR]\` <@${requser.id}> \`пользователь не отправлял запрос или сообщение не загрузилось!\``);
                }else{
                    /*
                    "status": "wait",
                    "userrem": user.id,
                    "whorem": message.author.id,
                    "rolerem": rolerem.name,
                    */
                    let userremto = bot.guilds.find(g => g.id == event_guildid).members.find(m => m.id == reqrem[event_messageid].userrem);
                    let whoremto = bot.guilds.find(g => g.id == event_guildid).members.find(m => m.id == reqrem[event_messageid].whorem)
                    let roleremto = bot.guilds.find(g => g.id == event_guildid).roles.find(r => r.name == reqrem[event_messageid].rolerem);
                    if (userremto.roles.some(r => [roleremto.name].includes(r.name))){
                        userremto.removeRole(roleremto)
                        reqchannel.send(`\`[ACCEPT]\` <@${requser.id}> \`одобрил запрос на снятие роли от ${whoremto.displayName}, с ID: ${whoremto.id} пользователю:\` <@${userremto.id}>`);
                        reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
                    }else{
                        reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
                    }
                    return
                }
            }
            let userto = bot.guilds.find(g => g.id == event_guildid).members.find(m => m.id == requests[event_messageid].whogetrole);
            let channelto = bot.guilds.find(g => g.id == event_guildid).channels.find(c => c.id == requests[event_messageid].channel);
            let roleto = bot.guilds.find(g => g.id == event_guildid).roles.find(r => r.name == requests[event_messageid].superrole);
            let rolesgg = ["🎮 Геймер 🎮"]
            reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
            if (userto.roles.some(r => roleto.name.includes(r.name))) return
            reqchannel.send(`\`Начинаю забирать роли. Этот процесс может занять некоторое время.\``).then(msg => msg.delete(12000))
            let rolesremoved = false;
            let rolesremovedcount = 0;
            if(userto.roles.some(r=>rolesgg.includes(r.name)) ) {
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == event_guildid).roles.find(r => r.name == rolesgg[i]);
                    if (userto.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        rolesremoved = true;
                        rolesremovedcount = rolesremovedcount+1;
                        await userto.removeRole(rolerem);
                    }
                }
            }
            await userto.addRole(roleto);
            reqchannel.send(`\`[ACCEPT]\` <@${requser.id}> \`одобрил запрос от ${requests[event_messageid].supernickname}, с ID: ${requests[event_messageid].whogetrole}\``);
            if (rolesremoved){
                if (rolesremovedcount == 1){
                    channelto.send(`<@${userto.id}>**,** \`модератор\` <@${requser.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${roleto.id}>  \`была выдана! ${rolesremovedcount} роль была убрана.\``)
                }else if (rolesremovedcount < 5){
                    channelto.send(`<@${userto.id}>**,** \`модератор\` <@${requser.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${roleto.id}>  \`была выдана! Остальные ${rolesremovedcount} роли были убраны.\``)
                }else{
                    channelto.send(`<@${userto.id}>**,** \`модератор\` <@${requser.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${roleto.id}>  \`была выдана! Остальные ${rolesremovedcount} ролей были убраны.\``)
                }
            }else{
                channelto.send(`<@${userto.id}>**,** \`модератор\` <@${requser.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${roleto.id}>  \`была выдана!\``)
            }
            return
        }

    }
});
