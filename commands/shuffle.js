const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the queue..!"),
    execute: async ({ interaction, client }) => {
        if (!interaction.member.voice.channelId) return await interaction.reply('Are you dumb ???')

        const queue = client.player.getQueue(interaction.guildId)
        if (!queue) {
            const noQueue = new EmbedBuilder()
                .setDescription("I'm not in the voice channel!!!")
            await interaction.reply({
                embeds: [noQueue]
            })
        }

        if (queue.tracks.length === 0) {
            const noTracks = new EmbedBuilder()
                .setDescription("No songs present in the queue...!!!")
            await interaction.reply({
                embeds: [noTracks]
            })
        }

        await queue.shuffle()

        const nextSong = queue.tracks[0]

        const shuffledEmbed = new EmbedBuilder()
            .setTitle(`Shuffled the queue....`)
            .setDescription(`**Next song**: ${nextSong.title.split(" ").slice(0, 5).join(' ')} - <@${nextSong.requestedBy.id}>`)
            .setColor([0, 51, 102])


        await interaction.reply({
            embeds: [shuffledEmbed]
        })
    }
}