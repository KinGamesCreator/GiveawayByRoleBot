const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');
const fs = require("fs");

//Crear archivos de datos.
if (!fs.existsSync("./data.json")) fs.writeFileSync("./data.json","{}");

//Crear client
const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers ],
    partials:['MESSAGE', 'CHANNEL', 'REACTION']
});

client.login(config.token);
client.once('ready', () => { console.log("READY") });

function isSnowflake(snowflake_str) {
    try{
        let snowflake = BigInt(snowflake_str)
        return(snowflake>0 && snowflake<BigInt("9223372036854775807"));
    } catch(e){
        return false;
    }
}

async function getMember (message,id) {
    let member;
    let ID = id.replace("<@","").replace(">","").replace("!","");
    if (!isSnowflake(ID)) {
        member = (await message.guild.members.search({query:ID})).first();
        return member;
    }
    member = message.guild.members.cache.get(ID);
    if (!member) { message.guild.members.fetch(ID).then(a => {member = a}); }
    return member;
}

client.on('messageCreate', async message => {

    let _d = JSON.parse(fs.readFileSync("./data.json"));

    if (message.author.id == "805930930736594995" || message.author.id == "653360060516270151" || message.author.id == "362290838858104842") {
        if (message.content.startsWith("!random")) {
            var members = await message.guild.members.fetch();
            var _user = Object.keys(_d)[Math.floor(Math.random()* Object.keys(_d).length)];
            var member = members.find(m=>{return m.id === _user; });
            while(!member) {
                _user = Object.keys(_d)[Math.floor(Math.random()* Object.keys(_d).length)];
                member = members.find(m=>{return m.id === _user; });
            }
            
            message.channel.send({embeds:[{
                thumbnail : { url: "https://media.discordapp.net/attachments/897241788509724718/1195561735990563037/8ec185f87fc0d88b3788..png"},
                color : 10181046,
                title : "SORTEO",
                description : `El ganador es: **${member.user.username}**!`,
                footer:{
                    "text" : `userId: ${_user}`
                }
            }]}/*`<@${_user}>`*/);
            return;
        } else if (message.content.startsWith("!list")) {
            var members = await message.guild.members.fetch();
            var _list = [];
            var _ids = Object.keys(_d);
            for (var i = 0; i < _ids.length; i++) {

                var member = members.find(m=>{return m.id === _ids[i]; });
                if (!member) continue;
                var username = member.user.username;

                _list.push(`Nickname: **${username}** | Messages: **${_d[_ids[i]].count}** | ID: **${_ids[i]}**`);
                if (_list.length >= 40) {
                    message.channel.send({embeds:[{
                        title : "!list",
                        description : _list.join("\n")
                    }]})
                    _list = [];
                }
            }
            if (_list.length > 0) {
                message.channel.send({embeds:[{
                    title : "!list",
                    description : _list.join("\n")
                }]})
                _list = [];
            }
            return;
        }
    }

    if (message.guild.id != "805931317018755122") return;
    if (message.channel.id == "1191769517601341531") return;
    if (message.author.bot) return;

    if (!_d.hasOwnProperty(message.author.id)) _d[message.author.id] = {count : 0, channels : [] };
    _d[message.author.id].count++;
    if (_d[message.author.id].channels.indexOf(message.channel.id) == -1) _d[message.author.id].channels.push(message.channel.id);

    fs.writeFileSync("./data.json",JSON.stringify(_d));

});
