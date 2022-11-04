const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song"),
	execute: async ({ interaction, client }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
		{
			await interaction.reply("There are no songs in the queue")
			return;
		}

        // Pause the current song
		queue.setPaused(true);
        const song = queue.current

        const embed = new EmbedBuilder()
                            .setTitle(`Paused the song`)
                            .setDescription(song?.title)
                            .setColor([102, 0, 204])

        await interaction.reply({
            embeds: [embed]
        })
	},
}