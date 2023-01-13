const { Client, GatewayIntentBits } = require('discord.js');

//Crear client
const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers ],
    partials:['MESSAGE', 'CHANNEL', 'REACTION']
});

client.login('');
client.once('ready', () => { console.log('iniciado.'); });

client.on('messageCreate', async message => {
    if (message.content != '!memberlist') return;

    message.guild.roles.fetch().then(roles => {
        let role = roles.find(role => role.id === '897265067953881118');
        message.guild.members.fetch().then(members => { //obtiene todos los miembros

            //filtra los miembros por el rol.
            let membersWithRole = members.filter(member => { return member.roles.cache.has(role.id); });

            //Mete los ids en un array.
            let memberList = [];
            membersWithRole.forEach(member => { memberList.push(member.user.id); });
        
            //selecciona 3 diferentes.
            let winners = [];

            for (var i = 0; i < 3; i++) {
                let _index = Math.floor(Math.random() * memberList.length);

                while (winners.includes(memberList[_index])) {
                    _index = Math.floor(Math.random() * memberList.length);
                }

                winners.push(memberList[_index]);
            }

            message.channel.send({embeds:[{
                thumbnail: {
                    url: 'https://yt3.ggpht.com/x0SFeIwvr8gJ7svDp3oeb2RDR38FXefC8ETy0SM41e2uh3rurlu8C6N5qcCG8Sj2L8NhBpMCCS2Z=s640-nd-v1'
                },
                color : 0x9B59B6,
                title : "¡Sorteo de 3 Jasper peluches!",
                description : `**🎉 GANADORES 🎉**`,
                fields : [{
                    name : "1ero: 🎊",
                    value : `<@${winners[0]}>`
                },{
                    name : "2do: 🎊",
                    value : `<@${winners[1]}>`
                },{
                    name : "3ero: 🎊",
                    value : `<@${winners[2]}>`
                }],
                footer : {
                    text : "Felicidades a los ganadores ¡Que disfruten su premio!"
                }
            }]})

        });
    });
});
