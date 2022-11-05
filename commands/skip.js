const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),
    async execute({ interaction, client }) {
        console.log(interaction.member.voice.channelId)
        if (!interaction.member.voice.channelId) return await interaction.reply('Join voice channel broo...!!!😑')

        try {
            const queue = await client.player.getQueue(interaction.guildId)
            // console.log(queue.tracks)

            if(!queue || !queue.connection) {
                await interaction.reply("I'm not in the voice channel..🙉")
                return;
            }

            if (queue.tracks.length === 0) {
                const noSongsEmbed = new EmbedBuilder()
                    .setTitle('No songs present..😵')
                    .setDescription('Queue is empty or there is no next song')
                    .setColor([255, 166, 77])
                await queue.destroy()
                return await interaction.reply({
                    embeds: [noSongsEmbed]
                })
            }
            const skipSong = queue.current
            const nextSong = queue.tracks[0]
            await queue.skip()
            // console.log(skipSong, nextSong)

            const embed = new EmbedBuilder()
                .setTitle(`Playing ${nextSong.title}`)
                .setDescription(`Author: ${nextSong.author}\nDuration: ${nextSong.duration}`)
                .setThumbnail(nextSong.thumbnail)
                .setColor([255, 166, 77])

            await interaction.reply({
                content: `Skipped **${skipSong.title}**`,
                embeds: [embed]
            })
        } catch (error) {
            console.log('sd',error)
            const noSongsEmbed = new EmbedBuilder()
                .setTitle('No songs present..👎')
                .setDescription('Queue is empty or there is no next song')
                .setColor([153, 0, 0])
            if (queue.length === 1) {
                await queue.skip()
            }
            return await interaction.reply({
                embeds: [noSongsEmbed]
            })
        }
    }
}