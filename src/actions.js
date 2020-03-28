async function getChatList(bot){
  const chatList = await bot.chat.list({showErrors: true});
  return chatList;
}

async function sendMessage(bot, chatId , message){
  const messageBot = {};
  messageBot.body = message;
  await bot.chat.send(chatId, messageBot);
}

module.exports = {
  getChatList,
  sendMessage,
};