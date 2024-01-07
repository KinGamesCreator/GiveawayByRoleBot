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

client.on('messageCreate', async message => {

    let _d = JSON.parse(fs.readFileSync("./data.json"));

    if (message.channel.id == "1078275340058763374" && (message.author.id == "805930930736594995" || message.author.id == "653360060516270151")) {
        if (message.content.startsWith("!random")) {
            var _user = Object.keys(_d)[Math.floor(Math.random()* Object.keys(_d).length)];
            message.channel.send({embeds:[{
                title : "!Random",
                description : `El ganador es <@${_user}>!`
            }]}/*`<@${_user}>`*/);
            return;
        } else if (message.content.startsWith("!list")) {
            console.log("running")
            var _list = [];
            var _ids = Object.keys(_d);
            for (var i = 0; i < _ids.length; i++) {
                console.log(_ids[i]);

                member = await get_members[_ids[i]];

                _list.push(`Nickname: ${member.nickname} | Messages: ${_d[_ids[i]].count} | ID: ${_ids[i]}`);
                if (_list.length >= 50) {
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

getMember = async (message,id) => {
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
