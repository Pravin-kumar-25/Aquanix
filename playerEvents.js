const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.registerPlayerEvents = (player, client) => {

    player.on("trackStart", (queue, track) => {
        console.log('from start')
        // console.log(queue.getPlayerTimestamp())
        // console.log(queue.metadata);
        // console.log(queue.metadata.interaction)
        queue.metadata.channel.messages.fetch()
            .then(async (message) => {
                message.filter((m) => m?.author?.id === process.env.CLIENT_ID).forEach((m) => {
                    if (m.embeds[0]?.data?.color === 45884) {
                        m.delete()
                    }
                })
                const song = queue.nowPlaying()
                const embed = new EmbedBuilder()
                    .setTitle(`🎶 ${song.title}`)
                    .setDescription(`Requested By: <@${song.requestedBy.id}>`)
                    .setFooter({ text: `Duration: ${song.duration}` })
                    .setThumbnail(song.thumbnail)
                    .setColor([0, 179, 60])
                queue.metadata.channel.send({
                    embeds: [embed]
                }).then(async (msg) => {
                    await msg.react('◀️')
                    await msg.react('◼️')
                    await msg.react('▶️')
                })
            })
        // queue.metadata.interation.deleteReply()
    })

    player.on("botDisconnect", (queue) => {
        console.log('bot disconned')
        // queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
    });

    player.on("channelEmpty", (queue) => {
        // console.log(queue.metadata.channel.messages)
        // queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
    });

    player.on("trackAdd", (queue, track) => {
        console.log('from add')
        // console.log(queue.metadata.channel.messages.lastMessageId)
        const id = queue.metadata.channel.messages.lastMessageId
        queue.metadata.channel.messages.fetch(id)
            .then((message) => {
                // console.log(message.edit('edited bruh'))
            })
            .catch((err) => {
                console.log(err)
            })
        console.log(queue.getPlayerTimestamp())

    })
}
