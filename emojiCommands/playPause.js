const pausePlay = async ({ interaction, client, reaction, user }) => {
    const queue = client.player.getQueue(reaction.message.guildId)
    if (!queue) {
        return;
    }
    console.log(queue.connection.paused)
    await queue.setPaused(!queue.connection.paused)
    // await reaction.remove()
    // await reaction.react('◼️')

    console.log(user)
    await reaction.users.remove(user)
}

const previousTrack = async ({ interaction, client, reaction, user }) => {
    await reaction.users.remove(user)
    const queue = await client.player.getQueue(reaction.message.guildId)
    if (!queue) {
        return;
    }
    console.log(queue.previousTracks)
    try {
        await queue.back()
        reaction.message.delete()
        const currentSong = await queue.current
        
        // reaction.message.delete()
        // reaction.message.reply({
        //     content:'here is edited'
        // })
    } catch (error) {
        console.log(error)
    }

}

const nextTrack = async ({ interaction, client, reaction, user }) => {
    const queue = client.player.getQueue(reaction.message.guildId)
    try {
        await queue.skip()
        const currentSong = await queue.current
        reaction.message.delete()
        // reaction.message.reply({
        //     content:'here is edited'
        // })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    '◼️': pausePlay,
    '◀️': previousTrack,
    '▶️': nextTrack
}