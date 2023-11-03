const datab = [
  {
    chat_id: 274577663,
    message_id: 1290,
    settings: {
      usd: true,
      eur: true,
      rub: true,
      cny: false,
    },
  },
];

bot.onText(/\/start/, async (msg) => {
  const res = await bot.sendMessage(msg.chat.id, lastDate, {
    parse_mode: "HTML",
    disable_notification: true,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "◆ USD", callback_data: "setUSD" },
          { text: "◆ EUR", callback_data: "setEur" },
          { text: "◆ RUB", callback_data: "setRub" },
          { text: "◇ CNY", callback_data: "setCny" },
        ],
      ],
    },
  });

  bot.on("callback_query", async (ctx) => {
    try {
      switch (ctx.data) {
        case "setUSD":
          // await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
          bot.editMessageText(ctx.message.text, {
            chat_id: ctx.message.chat.id,
            message_id: ctx.message.message_id,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "◇ USD", callback_data: "setUSD" },
                  { text: "◆ EUR", callback_data: "setEur" },
                  { text: "◆ RUB", callback_data: "setRub" },
                  { text: "◇ CNY", callback_data: "setCny" },
                ],
              ],
            },
          });
          break;
      }
    } catch (error) {
      console.log(error);
    }
  });

  bot.pinChatMessage(res.chat.id, res.message_id);

  if (
    messagesID.get(res.chat.id) &&
    messagesID.get(res.chat.id) !== res.message_id
  ) {
    console.log("unpin");
    bot.deleteMessage(res.chat.id, messagesID.get(res.chat.id));
  }

  messagesID.set(res.chat.id, res.message_id);
  console.log(messagesID);
  files.saveMapToFile(messagesID);
});
