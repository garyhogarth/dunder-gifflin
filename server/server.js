const Botkit = require('botkit');
const controller = Botkit.slackbot({})

const bot = controller.spawn({
  token: my_slack_bot_token
});

// use RTM
bot.startRTM(function(err,bot,payload) {
  // handle errors...
});

// send webhooks
bot.configureIncomingWebhook({url: webhook_url});
bot.sendWebhook({
  text: 'Hey!',
  channel: '#testing',
},function(err,res) {
  // handle error
});

// receive outgoing or slash commands
// if you are already using Express, you can use your own server instance...
// see "Use BotKit with an Express web server"
controller.setupWebserver(process.env.port,function(err,webserver) {

  controller.createWebhookEndpoints(controller.webserver);

});

controller.on('slash_command',function(bot,message) {

  // reply to slash command
  bot.replyPublic(message,'Everyone can see the results of this slash command');

});