const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');

//Crear client
const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers ],
    partials:['MESSAGE', 'CHANNEL', 'REACTION']
});

client.login(config.token);
client.once('ready', () => { console.log('iniciado.'); });

client.on('messageCreate', async message => {

    let content = message.content.trim().split(' ');

    if (content[0] != '!giveawaybyrole') return;
    if (content.length < 2 || isNaN(parseInt(content[1]))) return;
    
    let cantidad = parseInt(content[1]);
    if (cantidad > 20) return;

    r = (text) => {
        if (cantidad == 1) return ""; else return text;
    }
    r2 = (text1,text2) => {
        if (cantidad == 1) return text1; else return text2;
    }

    try {
        message.guild.roles.fetch().then(roles => {
            let role = roles.find(role => role.id === '1042793508173520927');
            message.guild.members.fetch().then(members => { //obtiene todos los miembros

                //filtra los miembros por el rol.
                let membersWithRole = members.filter(member => { return member.roles.cache.has(role.id); });

                //Mete los ids en un array.
                let memberList = [];
                membersWithRole.forEach(member => { memberList.push(member.user.id); });
            
                //selecciona users diferentes.
                let winners = [];

                for (var i = 0; i < cantidad; i++) {
                    let _index = Math.floor(Math.random() * memberList.length);

                    while (winners.includes(memberList[_index])) {
                        _index = Math.floor(Math.random() * memberList.length);
                    }

                    winners.push(memberList[_index]);
                }

                let _embed = {
                    thumbnail: {
                        url: 'https://yt3.ggpht.com/x0SFeIwvr8gJ7svDp3oeb2RDR38FXefC8ETy0SM41e2uh3rurlu8C6N5qcCG8Sj2L8NhBpMCCS2Z=s640-nd-v1'
                    },
                    color : 0x9B59B6,
                    title : `¡Sorteo de ${cantidad} Jasper peluche${r("s")}!`,
                    description : `**🎉 GANADOR${r("ES")} 🎉**`,
                    fields : [],
                    footer : {
                        text : `Felicidades ${r2("al ganador ¡Que disfrute su premio!","a los ganadores ¡Que disfruten su premio!")}`
                    }
                };

                for (var i = 0; i < cantidad; i++) {
                    _embed.fields.push({
                        name : `${i+1}º: 🎊`,
                        value : `<@${winners[i]}>`
                    })
                }

                message.channel.send({embeds:[_embed]});

            });
        });
    } catch (e) {
        message.channel.send("error");
        console.log(e);
    }
});
