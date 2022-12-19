const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { QueryType } = require('discord-player')
const fetch = require('isomorphic-unfetch')
const { Track } = require("discord-player")
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)
const convertMStoSeconds = require("../utils/Utils")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("spotify")
        .setDescription("Plays song from spotify🎶")
        .addStringOption(option =>
            option
                .setName("url")
                .setDescription('Enter the song name or URL')
                .setRequired(true)
        ),
    execute: async ({ interaction, client }) => {
        // Get the queue for the server
        // if (!interaction.member.voice.channelId) return await interaction.reply('Are you dumb ???')
        try {
            await interaction.reply({
                content: 'Fetching playlist..!!!'
            })

            const queue = await client.player.createQueue(interaction.guild)

            if (!queue.connection) {
                await queue.connect(interaction.member.voice.channel)
            }

            let searchTerm = await interaction.options.getString("url")

            const spotifyTrack = await getData(searchTerm)
                

            const result = {
                tracks: []
            }
            const addAllTracks = []
            for (const m of spotifyTrack.trackList) {
                const newTrack = new Track(queue.player, {
                    title: m.title ?? "",
                    description: m.subtitle ?? "",
                    author: m.subtitle ?? "Unknown Artist",
                    url: m.external_urls?.spotify ?? searchTerm,
                    thumbnail:  "https://www.scdn.co/i/_global/twitter_card-default.jpg",
                    duration: convertMStoSeconds(m.duration),
                    views: 0,
                    requestedBy: interaction.user,
                    source: "spotify"
                })

                addAllTracks.push(newTrack)
            }
            // const result = await client.player.search(searchTerm, {
            //     requestedBy: interaction.user
            //     // searchEngine: QueryType[8]
            // })
            result.tracks = addAllTracks


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

            await result.tracks.forEach(async (track) => {
                await queue.addTrack(track)
            });

            if (!queue.playing) await queue.play()

            const currentSong = await queue.current
            const nextSong = queue.tracks[0]

            const embed = new EmbedBuilder()
                .setTitle(`Playing spotify playlist`)
                .setDescription(`**Currently Playing** \n` +
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title.split(" ").slice(0, 5).join(' ')} - <@${currentSong.requestedBy.id}>` : "None") +
                    `\n\n**Next song:**\n ${nextSong.title.split(" ").slice(0, 5).join(' ')} - <@${nextSong.requestedBy.id}>`
                )
                .setThumbnail(currentSong.thumbnail)
                .setColor([134, 0, 179])

            await interaction.editReply({
                content: '',
                embeds: [embed]
            })
        } catch (error) {
            console.log(error, "found")
            await queue.destroy()
        }
        return;
    },
}