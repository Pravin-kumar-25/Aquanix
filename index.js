require('dotenv').config()
const { Client, GatewayIntentBits, Collection, Events, REST, Routes, Partials } = require('discord.js');
const { Player } = require("discord-player")
const { registerPlayerEvents } = require('./playerEvents');
const reactionFunction = require('./emojiCommands/playPause')
const fs = require('node:fs')
const path = require('node:path')

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
})

const commands = []
client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})
registerPlayerEvents(client.player)

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) return;

    try {
        await command.execute({ interaction, client })
    } catch (error) {
        await interaction.edit("wasted di maplai.....")
    }
})

client.on(Events.MessageReactionAdd, async (reaction, user) => {

    const message = reaction.message

    if (message?.author?.bot === true && message?.author?.username === process.env.BOT_NAME) {
        if (['◼️','◀️','▶️'].includes(reaction.emoji.name) && reaction.count > 1) {
            const execute = reactionFunction[reaction.emoji.name]
            const interaction = reaction.message.interaction
            console.log(reaction.message)
            execute({ interaction, client, reaction, user })
        }
    }
})

// client.on(Events.InteractionCreate, async (interaction) => {
//     if(!interaction.isButton()) return;
// })

// client.once(Events.ClientReady, () => {
// 	console.log('Ready!');
// });

client.once('ready', (interaction) => {
    // console.log(interaction)

    console.log('Listening to your commands..')
    const guild_ids = client.guilds.cache.map(guild => guild.id);
    // console.log(commands)

    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            for (const guildId of guild_ids) {

                const data = await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                    { body: commands },
                );
            }


            console.log(`Successfully reloaded application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
})


client.login(process.env.CLIENT_TOKEN)