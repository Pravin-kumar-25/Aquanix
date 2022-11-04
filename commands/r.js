const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("r")
        .setDescription("Resumes the paused song🎶"),
	execute: async ({ interaction, client }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
		{
			await interaction.reply("😑No song is paused😑")
			return;
		}

        // Resume the current song
        queue.setPaused(false)
        const song = queue.current

        const embed = new EmbedBuilder()
                            .setTitle(`Resumed`)
                            .setDescription(song?.title)
                            .setThumbnail(song?.thumbnail)
                            .setColor([0, 230, 230])

        await interaction.reply({
            embeds: [embed]
        })
	},
}