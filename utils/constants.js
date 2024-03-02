exports.MYFIN_SRC = "https://admin.myfin.by/outer/informer/minsk/full";
exports.BCSE_API_SRC = "https://www.bcse.by/charts/index/currency";
exports.BCSE_SRC = "https://www.bcse.by/";

exports.DATABASE_FILE_NAME = "./msgdata.json";
exports.INTERVAL_UPDATE = 90000; // 600000 - 10 minutes .. 900000 - 15 minutes

exports.commands = [
  {
    command: "start",
    description: "Запустить бота",
  },
  {
    command: "info",
    description: "О боте",
  },
  // {
  //   command: "currency",
  //   description: "Обновить курсы валют",
  // },
];

exports.infoBotText = `<b><code>Информер курсов валют</code> beta</b>\nИнформер отображает курс валют с Белорусской валютно-фондовой биржи.
Бот обновляет данные каждые 10 минут.
Источник информации - сайт <a href='https://www.bcse.by/'>bcse.by</a>

При старте, бот отправит сообщение с курсами валют и автоматически закрепит это сообщение в чате (<i>для группы необходимы права администратора</i>) и будет автоматически обновляться.
При повторном старте, предыдущее сообщение удаляется и создаётся новое.
`;
