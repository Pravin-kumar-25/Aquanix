module.exports.registerPlayerEvents = (player) => {

    player.on("trackStart",(queue,track) => {
        // queue.metadata.send(`Started playing ${track.title}`)
    })

    player.on("botDisconnect", (queue) => {
        console.log('bot disconned')
        // queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
    });
    
    player.on("channelEmpty", (queue) => {
        console.log(queue.metadata)
        // queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
    });

    player.on("trackAdd",(queue,track) => {
        console.log(queue.metadata)

    })
}