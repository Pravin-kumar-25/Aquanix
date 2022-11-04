const { SlashCommandBuilder, MessageEmbed, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays the song that you wanted to.. !!!')
        .addStringOption(option =>
            option
                .setName("search-terms")
                .setDescription('Enter the song name or URL')
                .setRequired(true)
        ),
    async execute({ interaction, client }) {

        try {
            if (!interaction.member.voice.channelId) return await interaction.reply('Are you dumb ???')
            await interaction.reply('Searching.....')
            const queue = await client.player.createQueue(interaction.guild)

            if (!queue.connection) {
                await queue.connect(interaction.member.voice.channel)
            }

            console.log(QueryType)

            let searchTerm = await interaction.options.getString("search-terms")

            const result = await client.player.search(searchTerm, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_SEARCH
            })

            console.log(result)

            if (result.tracks.length === 0) {
                const noResultsEmbed = new EmbedBuilder()
                    .setTitle('🥲')
                    .setDescription(`No results found for **${searchTerm.toUpperCase()}**`)
                await interaction.editReply({
                    content: '',
                    embeds: [noResultsEmbed]
                })
                return;
            }
            const song = result.tracks[0]

            await queue.addTrack(song)

            if (!queue.playing) queue.play()

            if (queue.tracks.length > 0) {
                const currentSong = queue.current

                const queues = queue.tracks.slice(0, 10).map((track, i) => {
                    return `${i + 1}. ${track.duration} - ${track.title.split(" ").slice(0, 5).join(' ')} - <@${track.requestedBy.id}> `
                }).join('\n')

                const queueEmbed = new EmbedBuilder()
                    .setTitle(`Added song to the queue 😚`)
                    .setDescription(`**Currently Playing** \n` +
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title.split(" ").slice(0, 5).join(' ')} - <@${currentSong.requestedBy.id}>` : "None") +
                        `\n\n**Queue**\n ${queues}`
                    )
                    .setThumbnail(currentSong.thumbnail)
                    .setColor([0, 179, 60])

                await interaction.editReply({
                    content: '',
                    embeds: [queueEmbed]
                })

                return;
            }


            const embed = new EmbedBuilder()
                .setTitle(`🎶 ${song.title}`)
                .setDescription(`Author: ${song.author}`)
                .setFooter({ text: `Duration: ${song.duration}` })
                .setThumbnail(song.thumbnail)
                .setColor([0, 179, 60])

            await interaction.editReply({
                content: '',
                embeds: [embed],
            });
            return;

        } catch (error) {
            console.log(error)
            await interaction.editReply('Please try again...:(')
            return;
        }
    }
};