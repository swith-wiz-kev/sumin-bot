// Require the necessary discord.js classes
const {
  Client,
  Events,
  GatewayIntentBits,
  AttachmentBuilder,
} = require("discord.js");
const twitterExtract = require("./extractor/twitter");
require("dotenv").config()

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    "MessageContent",
  ],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content.slice(0, 3) === "-=t") {
    const url = message.content.slice(4);
    const links = await twitterExtract(url);
    const attachments = [];
    links.forEach((link) => {
      const attachment = new AttachmentBuilder(link);
      const fileName = link.slice(
        link.indexOf("media/") + 6,
        link.indexOf("?format"),
      );
      const fileExtension = link.slice(
        link.indexOf("format=") + 7,
        link.indexOf("&name"),
      );
      attachment.setName(fileName + "." + fileExtension);
      attachments.push(attachment);
    });
    /* const attachment = new AttachmentBuilder(
      "https://pbs.twimg.com/media/FuADGQ8aIAAv2L2?format=jpg&name=large",
    ); 
    attachment.setName(
      attachment.attachment.toString().split("/")[4].slice(0, 15) + ".jpeg",
    );
    console.log(attachment.name);
    */
    message.channel.send({
      content: `<${url}>`,
      files: attachments,
    });
    //console.log(attachments[0].name);
  }
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
