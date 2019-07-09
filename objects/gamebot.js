const Discord = require('discord.js');
const bot = new Discord.Client();
const Logger = require('./objects/logger');

let point_full = "Discord Point";
let point_name = "₯";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max + 1);
    return Math.floor(Math.random() * (max - min)) + min;
}

let messages_bot = 0;
let messages_data = 0;

function hook(channel, message, webhook_name, name, time, avatar) {
    if (!channel) return console.log('Канал не выбран.');
    if (!message) return console.log('Сообщение не указано.');
    if (!webhook_name) return console.log('Вебхук не найден.');
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

const balance_cooldown = new Set();
const rullete_cooldown = new Set();
const duel_cooldown = new Set();

bot.on('ready', () => {
    console.log("Бот был успешно запущен!");
    bot.guilds.find(g => g.id == "531454559038734356").channels.find(c => c.name == "🎮game-bot-logs🎮").send(`Хэй! Я был запущен!`);
});

bot.on('message', async message => {
    if (message.channel.type == "dm") return
    if (message.author.bot) return
    if (message.content == "/pingg") return message.reply("`игровой бот в норме!`") && console.log(`Бот ответил ${message.member.displayName}, что он онлайн.`)

    let scottdale = bot.guilds.find(g => g.id == "531454559038734356");

    // Info Game

    if (message.content == "/gameinfo"){
        const get_dp = message.guild.channels.find(c => c.name == "🎱для-игр🎱");
        const sell_dp = message.guild.channels.find(c => c.name == "🎱для-игр🎱");
        const gameinfo = new Discord.RichEmbed()
        .setTitle(`Discord Games - Инструкция по использованию`)
        .addField(`**Игровая валюта**`, `**Игровая валюта называется: ${point_full}**\n**Сокращенное название: ${point_name}**`)
        .addField(`**Играть**`, `**Для игры нажмите на <#${get_dp.id}>.**`)
        .setFooter(`Игровой бот для Discord'a © ๖ۣۣۜVenesay™`, `https://cdn.discordapp.com/avatars/349846714892419074/8b0a30fd048d8780736a1241b133fdba.png?size=128`)
        message.channel.send(gameinfo);
        return message.delete();
    }

    if (message.content == "/balance"){
        if (message.channel.name != "🎱для-игр🎱") return
        let account_exsist = false;
        let account_money = 0;
        await accounts.fetchMessages().then(messages => {
            messages.filter(account => {
                if (account.content.startsWith(`ACCOUNT=>${message.author.id}`)){
                    account_exsist = true;
                    account_money = account.content.slice().split('=>')[3]
                    account_msg = account;
                }
            })
        })
        message.reply(`**ваш баланс составляет: ${account_money} ${point_name}**`);
    }

    let dataserver = bot.guilds.find(g => g.id == "531454559038734356");
    if (!dataserver){
        message.reply(`\`data-server не был найден! Передайте данное сообщение техническим администраторам.\``).then(msg => msg.pin());
        message.delete();
        return bot.destroy();
    }
    let accounts = dataserver.channels.find(c => c.name == "🎮game-bot-logs🎮");
    if (!accounts){
        message.reply(`\`data-server => 🎮game-bot-logs🎮 не был найден! Передайте данное сообщение техническим администраторам.\``).then(msg => msg.pin());
        return message.delete();
    }

    // Получение денег

    if (message.content == "/creategame"){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`**у вас нет доступа.**`).then(msg => msg.delete(7000)) && message.delete()
        let title;
        let join_money;
        let how_to_play;
        let prise;
        let author;
        message.reply(`[CREATE GAME] => Введите название игры.`).then(title_game => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 180000,
                errors: ['time'],
            }).then((collected_title) => {
                title = collected_title.first().content;
                title_game.delete();
                collected_title.first().delete();
                message.reply(`[CREATE GAME] => Введите стартовую сумму`).then(join_game => {
                    message.channel.awaitMessages(response => response.member.id == message.member.id, {
                        max: 1,
                        time: 180000,
                        errors: ['time'],
                    }).then((collected_join) => {
                        join_money = collected_join.first().content;
                        join_game.delete();
                        collected_join.first().delete();
                        message.reply(`[CREATE GAME] => Введите суть игры`).then(howto_game => {
                            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                                max: 1,
                                time: 500000,
                                errors: ['time'],
                            }).then((collected_howto) => {
                                how_to_play = collected_howto.first().content;
                                howto_game.delete();
                                collected_howto.first().delete();
                                message.reply(`[CREATE GAME] => Введите приз`).then(prise_game => {
                                    message.channel.awaitMessages(response => response.member.id == message.member.id, {
                                        max: 1,
                                        time: 180000,
                                        errors: ['time'],
                                    }).then((collected_prise) => {
                                        prise = collected_prise.first().content;
                                        prise_game.delete();
                                        collected_prise.first().delete();
                                        message.reply(`[CREATE GAME] => Укажите ID автора`).then(author_game => {
                                            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                                                max: 1,
                                                time: 180000,
                                                errors: ['time'],
                                            }).then((collected_author) => {
                                                author = bot.guilds.find(g => g.id == "531454559038734356").members.find(m => m.id == collected_author.first().content);
                                                author_game.delete();
                                                collected_author.first().delete();
                                                if (!author) author = message.member
                                                const gamecreate = new Discord.RichEmbed()
                                                .setTitle(`Название игры: "${title}"`)
                                                .setColor("#FF0000")
                                                .addField(`**Суть игры**`, how_to_play)
                                                .addField(`**Стоимость участия**`, `**${join_money}** \`${point_full}\``, true)
                                                .addField(`**Приз**`, `**${prise}** \`${point_full}\``, true)
                                                .setFooter(`Игру предоставил: ${author.displayName}`, `${author.user.avatarURL}`)
                                                message.channel.send(gamecreate);
                                                message.delete();
                                            }).catch((err) => console.error(err));
                                        })
                                    }).catch((err) => console.error(err));
                                })
                            }).catch((err) => console.error(err));
                        })
                    }).catch((err) => console.error(err));
                })
            }).catch((err) => console.error(err));
        })
    }

    if (message.content == "/rullete"){
        if (message.channel.name != "🎱для-игр🎱") return
        if (rullete_cooldown.has(message.author.id)) {
            return message.delete();
        }
        rullete_cooldown.add(message.author.id);
        setTimeout(() => {
            rullete_cooldown.delete(message.author.id);
        }, 2000);
        let account_msg;
        let account_exsist = false;
        let account_money = 0;
        await accounts.fetchMessages().then(messages => {
            messages.filter(account => {
                if (account.content.startsWith(`ACCOUNT=>${message.author.id}`)){
                    account_exsist = true;
                    account_money = account.content.slice().split('=>')[3]
                    account_msg = account;
                }
            })
        })

        if (!account_exsist){
            account_money = 0;
        }
        if (account_money < 50){
            var need = 50 - account_money;

            let tempmessage = `<@${message.author.id}>, **у вас недостаточно ${point_full}! Нужно еще ${need} ${point_name}!** \`[MONEY: ${account_money}]\``
            if (messages_bot <= 5){
                hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 12000);
            }else if(messages_bot <= 10){
                hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 12000);
            }else if(messages_bot <= 15){
                hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 12000);
            }
            if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }

            message.delete();
        }else{
            var need = account_money - 50;
            var x = await getRandomInt(0, 30);
            var y = await getRandomInt(30, 150);
            if (x < 23){
                account_money = need;

                let tempmessage = `<@${message.author.id}>, **к сожалению вы проиграли.** \`[MONEY: ${account_money}]\``
                if (messages_bot <= 5){
                    hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 7000);
                }else if(messages_bot <= 10){
                    hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 7000);
                }else if(messages_bot <= 15){
                    hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 7000);
                }
                if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }

            }else if (x == 30){
                account_money = need + 350;

                let tempmessage = `<@${message.author.id}>, **вы выиграли 300 ${point_name}!** \`[MONEY: ${account_money}]\``
                if (messages_bot <= 5){
                    hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 7000);
                }else if(messages_bot <= 10){
                    hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 7000);
                }else if(messages_bot <= 15){
                    hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 7000);
                }
                if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }

            }else if (x > 22){
                account_money = need + 50 + y;

                let tempmessage = `<@${message.author.id}>, **вы выиграли ${y} ${point_name}!** \`[MONEY: ${account_money}]\``
                if (messages_bot <= 5){
                    hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 7000);
                }else if(messages_bot <= 10){
                    hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 7000);
                }else if(messages_bot <= 15){
                    hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 7000);
                }
                if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
            }

            if (account_exsist) account_msg.delete();

            let tempdata = `ACCOUNT=>${message.author.id}=>MONEY=>${account_money}`

            if (messages_data <= 4){
                await hook(accounts, tempdata, `Основной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
            }else if(messages_data <= 8){
                await hook(accounts, tempdata, `Запасной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
            }else if(messages_data <= 12){
                await hook(accounts, tempdata, `Аварийный`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
            }else if(messages_data <= 16){
                await hook(accounts, tempdata, `Критический`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
            }else if(messages_data <= 20){
                await hook(accounts, tempdata, `ERROR`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
            }else if(messages_data <= 24){
                await hook(accounts, tempdata, `CRITICAL`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
            }
            if (messages_data == 24){ messages_data = 0 }else{ messages_data++ }
            message.delete();
        }
    }

    if (message.content.startsWith("/duel")){
        if (message.channel.name != "🎱для-игр🎱") return
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            let tempmessage = `<@${message.author.id}>, **вы не указали пользователя. \`/duel @user [ставка]\`**`
            if (messages_bot <= 5){
                hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 7000);
            }else if(messages_bot <= 10){
                hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 7000);
            }else if(messages_bot <= 15){
                hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 7000);
            }
            if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
            return message.delete();
        }
        if (user.id == message.author.id){
            let tempmessage = `<@${message.author.id}>, **с собой играть нельзя! \`/duel @user [ставка]\`**`
            if (messages_bot <= 5){
                hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 7000);
            }else if(messages_bot <= 10){
                hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 7000);
            }else if(messages_bot <= 15){
                hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 7000);
            }
            if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
            return message.delete();
        }
        const args = message.content.slice('/duel').split(/ +/)
        if (!args[2]){
            let tempmessage = `<@${message.author.id}>, **вы не указали ставку. \`/duel @user [ставка]\`**`
            if (messages_bot <= 5){
                hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 7000);
            }else if(messages_bot <= 10){
                hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 7000);
            }else if(messages_bot <= 15){
                hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 7000);
            }
            if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
            return message.delete();
        }

        if (args[2] <= 0){
            let tempmessage = `<@${message.author.id}>, **вы не можете играть на сумму меньше или равной 0 ${point_name} \`/duel @user [ставка]\`**`
            if (messages_bot <= 5){
                hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 7000);
            }else if(messages_bot <= 10){
                hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 7000);
            }else if(messages_bot <= 15){
                hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 7000);
            }
            if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
            return message.delete();
        }
        message.channel.send(`**<@${user.id}>, пользователь <@${message.author.id}> предложил вам сыграть с ним в дуэль на ${args[2]} ${point_name}**`).then(async msg => {
            let first_msg_member = message.member.id;
            message.delete();
            await msg.react(`✔`)
            await msg.react(`❌`)
            const filter = (reaction, user_member) => {
                return ['✔', '❌'].includes(reaction.emoji.name) && user_member.id === user.id;
            };
            msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(async collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '✔'){
                    var nmoney = args[2]
                    let account_msg;
                    let account_exsist = false;
                    let account_money = 0;
                    await accounts.fetchMessages().then(messages => {
                        messages.filter(account => {
                            if (account.content.startsWith(`ACCOUNT=>${first_msg_member}`)){
                                account_exsist = true;
                                account_money = account.content.slice().split('=>')[3]
                                account_msg = account;
                            }
                        })
                    })
            
                    if (!account_exsist){
                        account_money = 0;
                    }
            
                    if (account_money < args[2]){
                        let tempmessage = `<@${message.author.id}>, **у вас недостаточно ${point_full}'s.**`
                        if (messages_bot <= 5){
                            hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 9000);
                        }else if(messages_bot <= 10){
                            hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 9000);
                        }else if(messages_bot <= 15){
                            hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 9000);
                        }
                        if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
                        return msg.delete();
                    }
            
                    let accounttwo_msg;
                    let accounttwo_exsist = false;
                    let accounttwo_money = 0;
                    await accounts.fetchMessages().then(messagestwo => {
                        messagestwo.filter(accounttwo => {
                            if (accounttwo.content.startsWith(`ACCOUNT=>${user.id}`)){
                                accounttwo_exsist = true;
                                accounttwo_money = accounttwo.content.slice().split('=>')[3]
                                accounttwo_msg = accounttwo;
                            }
                        })
                    })
            
                    if (!accounttwo_exsist){
                        accounttwo_money = 0;
                    }
            
                    if (accounttwo_money < args[2]){
                        let tempmessage = `<@${message.author.id}>, **у пользователя с которым вы хотите сыграть недостаточно ${point_full}**`
                        if (messages_bot <= 5){
                            hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 12000);
                        }else if(messages_bot <= 10){
                            hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 12000);
                        }else if(messages_bot <= 15){
                            hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 12000);
                        }
                        if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
                        return msg.delete();
                    }

                    var x = await getRandomInt(0, 100);
                    if (x <= 50){
                        account_money = account_money + nmoney
                        accounttwo_money = accounttwo_money - nmoney
                        if (account_exsist) account_msg.delete();
                        if (accounttwo_exsist) accounttwo_msg.delete();

                        let tempdata = `ACCOUNT=>${first_msg_member}=>MONEY=>${account_money}`

                        if (messages_data <= 4){
                            await hook(accounts, tempdata, `Основной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 8){
                            await hook(accounts, tempdata, `Запасной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 12){
                            await hook(accounts, tempdata, `Аварийный`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 16){
                            await hook(accounts, tempdata, `Критический`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 20){
                            await hook(accounts, tempdata, `ERROR`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 24){
                            await hook(accounts, tempdata, `CRITICAL`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }
                        if (messages_data == 24){ messages_data = 0 }else{ messages_data++ }

                        let tempdatatwo = `ACCOUNT=>${user.id}=>MONEY=>${accounttwo_money}`

                        if (messages_data <= 4){
                            await hook(accounts, tempdatatwo, `Основной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 8){
                            await hook(accounts, tempdatatwo, `Запасной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 12){
                            await hook(accounts, tempdatatwo, `Аварийный`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 16){
                            await hook(accounts, tempdatatwo, `Критический`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 20){
                            await hook(accounts, tempdatatwo, `ERROR`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 24){
                            await hook(accounts, tempdatatwo, `CRITICAL`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }
                        if (messages_data == 24){ messages_data = 0 }else{ messages_data++ }

                        let tempmessage = `**Пользователь <@${first_msg_member}> получил ${args[2]} ${point_name}! Источник: /duel с <@${user.id}>**`
                        if (messages_bot <= 5){
                            hook(message.channel, tempmessage, `Основной`, `Работник Казино`, 12000);
                        }else if(messages_bot <= 10){
                            hook(message.channel, tempmessage, `Запасной`, `Работник Казино`, 12000);
                        }else if(messages_bot <= 15){
                            hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`, 12000);
                        }
                        if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
                    }else if(x > 50){
                        
                        account_money = account_money - nmoney
                        accounttwo_money = accounttwo_money + nmoney
                        if (account_exsist) account_msg.delete();
                        if (accounttwo_exsist) accounttwo_msg.delete();

                        let tempdata = `ACCOUNT=>${first_msg_member}=>MONEY=>${account_money}`

                        if (messages_data <= 4){
                            await hook(accounts, tempdata, `Основной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 8){
                            await hook(accounts, tempdata, `Запасной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 12){
                            await hook(accounts, tempdata, `Аварийный`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 16){
                            await hook(accounts, tempdata, `Критический`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 20){
                            await hook(accounts, tempdata, `ERROR`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 24){
                            await hook(accounts, tempdata, `CRITICAL`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }
                        if (messages_data == 24){ messages_data = 0 }else{ messages_data++ }

                        let tempdatatwo = `ACCOUNT=>${user.id}=>MONEY=>${accounttwo_money}`

                        if (messages_data <= 4){
                            await hook(accounts, tempdatatwo, `Основной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 8){
                            await hook(accounts, tempdatatwo, `Запасной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 12){
                            await hook(accounts, tempdatatwo, `Аварийный`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 16){
                            await hook(accounts, tempdatatwo, `Критический`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 20){
                            await hook(accounts, tempdatatwo, `ERROR`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }else if(messages_data <= 24){
                            await hook(accounts, tempdatatwo, `CRITICAL`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
                        }
                        if (messages_data == 24){ messages_data = 0 }else{ messages_data++ }

                        let tempmessage = `**Пользователь <@${user.id}> получил ${args[2]} ${point_name}! Источник: /duel с <@${first_msg_member}>**`
                        if (messages_bot <= 5){
                            hook(message.channel, tempmessage, `Основной`, `Работник Казино`);
                        }else if(messages_bot <= 10){
                            hook(message.channel, tempmessage, `Запасной`, `Работник Казино`);
                        }else if(messages_bot <= 15){
                            hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`);
                        }
                        if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
                    }
                    return msg.delete();
                }else{
                    let tempmessage = `**<@${first_msg_member}>, пользователь <@${user.id}> отказался играть с вами в дуэль.**`
                    if (messages_bot <= 5){
                        hook(message.channel, tempmessage, `Основной`, `Работник Казино`);
                    }else if(messages_bot <= 10){
                        hook(message.channel, tempmessage, `Основной`, `Работник Казино`);
                    }else if(messages_bot <= 15){
                        hook(message.channel, tempmessage, `Основной`, `Работник Казино`);
                    }
                    if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
                    return msg.delete();
                }
            })
            .catch(collected => {
                let tempmessage = `**<@${first_msg_member}>, пользователь <@${user.id}> не успел принять ваше приглашение.**`
                if (messages_bot <= 5){
                    hook(message.channel, tempmessage, `Основной`, `Работник Казино`);
                }else if(messages_bot <= 10){
                    hook(message.channel, tempmessage, `Запасной`, `Работник Казино`);
                }else if(messages_bot <= 15){
                    hook(message.channel, tempmessage, `Аварийный`, `Работник Казино`);
                }
                if (messages_bot == 15){ messages_bot = 0 }else{ messages_bot++ }
                return msg.delete();
            });
        })
    
    }

    // Потратить деньги



    // Tester's Commands

    if (message.content.startsWith("/givemoney")){
        if (!message.member.roles.some(r=>["Администратор", "☆ Поддержка ☆", "✔ Spectator™"].includes(r.name)) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            return message.delete();
        }
        const args = message.content.slice('/givemoney').split(/ +/)
        if (!args[2]) return
        
        let account_exsist = false;
        let ac_msg;
        await accounts.fetchMessages().then(messages => {
            messages.filter(account => {
                if (account.content.startsWith(`ACCOUNT=>${user.id}`)){
                    account_exsist = true;
                    ac_msg = account;
                }
            })
        })
        if (account_exsist){
            ac_msg.delete();
        }

        let tempdata = `ACCOUNT=>${user.id}=>MONEY=>${args[2]}`

        if (messages_data <= 4){
            await hook(accounts, tempdata, `Основной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }else if(messages_data <= 8){
            await hook(accounts, tempdata, `Запасной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }else if(messages_data <= 12){
            await hook(accounts, tempdata, `Аварийный`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }else if(messages_data <= 16){
            await hook(accounts, tempdata, `Критический`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }else if(messages_data <= 20){
            await hook(accounts, tempdata, `ERROR`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }else if(messages_data <= 24){
            await hook(accounts, tempdata, `CRITICAL`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }
        if (messages_data == 24){ messages_data = 0 }else{ messages_data++ }
        message.reply(`**вы установили пользователю <@${user.id}> => ${args[2]} ${point_name}**`);
    }

    if (message.content == "/takemoney"){
        let account_exsist = false;
        let ac_msg;
        await accounts.fetchMessages().then(messages => {
            messages.filter(account => {
                if (account.content.startsWith(`ACCOUNT=>${message.author.id}`)){
                    account_exsist = true;
                    ac_msg = account;
                }
            })
        })
        if (account_exsist){
            ac_msg.delete();
        }

        let tempdata = `ACCOUNT=>${message.author.id}=>MONEY=>1000`

        if (messages_data <= 4){
            await hook(accounts, tempdata, `Основной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }else if(messages_data <= 8){
            await hook(accounts, tempdata, `Запасной`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }else if(messages_data <= 12){
            await hook(accounts, tempdata, `Аварийный`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }else if(messages_data <= 16){
            await hook(accounts, tempdata, `Критический`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }else if(messages_data <= 20){
            await hook(accounts, tempdata, `ERROR`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }else if(messages_data <= 24){
            await hook(accounts, tempdata, `CRITICAL`, `DATA-BASE`, false, 'https://i.imgur.com/rkiem1S.png');
        }
        if (messages_data == 24){ messages_data = 0 }else{ messages_data++ }
        message.reply(`**вам было установлено 1000 ₯.**`)
    }
});