const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Gets the top 10 songs list!"),
    execute: async ({ interaction, client }) => {
        // Get the queue for the server
        try {
            await interaction.reply('Fetching queue...⌛')
            const queue = client.player.getQueue(interaction.guildId)

            // Check if the queue is empty
            if (!queue) {
                await interaction.editReply({
                    content: `No songs in the queue!!! ❌`
                })
                return;
            }
            const currentSong = queue.current

            const queues = queue.tracks.slice(0,10).map((track,i) => {
                return `${i+1}. ${track.duration} - ${track.title.split(" ").slice(0,5).join(' ')} - <@${track.requestedBy.id}> `
            }).join('\n')

            const embed = new EmbedBuilder()
                .setTitle(`Queues`)
                .setDescription(`**Currently Playing** \n` +
                (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title.split(" ").slice(0,5).join(' ')} - <@${currentSong.requestedBy.id}>` : "None") +
                `\n\n**Queue:**\n ${queues}`
                )
                .setThumbnail(currentSong.thumbnail)

            await interaction.editReply({
                content:'',
                embeds: [embed]
            })
        } catch (error) {
            console.log(error.message)
            await interaction.reply('Something went wrong !!')
        }
    },
}