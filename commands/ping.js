const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
                .setName('ping')
                .setDescription('Provides info about praga'),
    async execute(interaction) {
        console.log(interaction.member.nickname)

        const embed= new EmbedBuilder()
                         .setTitle('Hola amigo')
                         .setDescription('Have a nice day.. ! ')
        await interaction.reply({
            content: `I think you should..`,
            embeds: [embed]
        })
    }
}
