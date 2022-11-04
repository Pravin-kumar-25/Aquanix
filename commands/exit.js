const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Exits from the voice channel"),
    execute: async ({ interaction, client }) => {
        // Get the queue for the server
        try {


            const queue = client.player.getQueue(interaction.guildId)

            // Check if the queue is empty
            if (!queue) {
                await interaction.reply({
                    content: `🤡 Put your glass and check where am I!!`
                })
                return;
            }
            await queue.destroy()

            const embed = new EmbedBuilder()
                .setTitle(`Why you bully me?? 🥺`)
                .setDescription('Bye bye...')
                .setColor('red')

            await interaction.reply({
                embeds: [embed]
            })
        } catch (error) {
            console.log(error.message)
            await interaction.reply('Something went wrong !!')
        }
    },
}