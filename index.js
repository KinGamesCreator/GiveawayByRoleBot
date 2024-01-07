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
    if (message.channel.id == "1078275340058763374" && message.content.startsWith("!random") && (message.author.id == "805930930736594995" || message.author.id == "653360060516270151")) {
        var _user = Object.keys(_d)[Math.floor(Math.random()* Object.keys(_d).length)];
        message.channel.send(`<@${_user}>`);
        return;
    }

    if (message.guild.id != "805931317018755122") return;
    if (message.channel.id == "1191769517601341531") return;
    if (message.author.bot) return;

    if (!_d.hasOwnProperty(message.author.id)) _d[message.author.id] = {count : 0, channels : [] };
    _d[message.author.id].count++;
    if (_d[message.author.id].channels.indexOf(message.channel.id) == -1) _d[message.author.id].channels.push(message.channel.id);

    fs.writeFileSync("./data.json",JSON.stringify(_d));

});
