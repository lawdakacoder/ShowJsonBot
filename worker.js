// This file is auto generated and directly
// deployable to cloudflare workers from
// user dashboard.

(() => {
  // src/config.js
  var API_ROOT = "https://api.telegram.org";
  var SECRET_TOKEN = "";
  var BOT_TOKEN = "";

  // src/utils/misc.js
  function isPositiveIntegerString(str) {
    const integerRegex = /^\d+$/;
    if (integerRegex.test(str)) {
      return parseInt(str, 10);
    }
    return null;
  }
  function generateUrlSafeToken(len) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
    let result = "";
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  function generateRandomFileName(len = 12, ext = ".json") {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + ext;
  }

  // src/telegram/api.js
  async function sendRequest(method, payload, isFormData = false) {
    const url = `${API_ROOT}/bot${BOT_TOKEN}/${method}`;
    const options = {
      method: "POST",
      headers: isFormData ? void 0 : { "Content-Type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload)
    };
    return fetch(url, options);
  }
  async function sendMessage(chatId, text, replyToMessageId = null, replyMarkup = null) {
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: "HTML"
    };
    if (replyToMessageId) {
      payload.reply_parameters = { message_id: replyToMessageId };
    }
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }
    await sendRequest("sendMessage", payload);
  }
  async function editMessageText(chatId, messageId, text, replyMarkup = null) {
    const payload = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "HTML"
    };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }
    await sendRequest("editMessageText", payload);
  }
  async function sendDocument(chatId, content, replyToMessageId = null) {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", new Blob([content], { type: "application/json" }), generateRandomFileName());
    if (replyToMessageId) {
      const reply_parameters = { message_id: replyToMessageId };
      formData.append("reply_parameters", JSON.stringify(reply_parameters));
    }
    await sendRequest("sendDocument", formData, true);
  }
  async function answerCallbackQuery(id, text, show_alert = false) {
    const payload = {
      callback_query_id: id,
      text,
      show_alert
    };
    await sendRequest("answerCallbackQuery", payload);
  }
  async function sendJsonMessage(chatId, text, replyToMessageId = null) {
    const payload = {
      chat_id: chatId,
      text: `<pre><code class="language-json">${text}</code></pre>`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Send as file", callback_data: "send_as_file" }]]
      }
    };
    if (replyToMessageId) {
      payload.reply_parameters = { message_id: replyToMessageId };
    }
    await sendRequest("sendMessage", payload);
  }

  // src/utils/static.js
  var Texts = {
    start: `Hi there, <b>{first_name}</b>! Send me any message, and I will send its beautiful JSON.`,
    help: `
<b>Available Commands:</b>
<code>/start</code> - Ping the bot.
<code>/info</code> - Show user info.
<code>/chat</code> - Show chat info.
<code>/secret</code> - Generate url safe token.
<code>/help</code> - Show help text.
    `,
    secret: `
    Generate a random url safe token of given length.
<code>/secret 32</code>
    `,
    notValidArgument: "The provided argument is invalid.",
    expectedValueTooBig: "Expected value is too big."
  };

  // src/bot/deeplinkHandler.js
  async function handleDeepLink(message, arg) {
    const [deeplink, ...args] = arg.split("_");
    switch (deeplink) {
      case "info":
        await infoCommand(message);
        break;
      case "chat":
        await chatCommand(message);
        break;
      case "secret":
        await secretCommand(message, args);
        break;
      case "help":
        await helpCommand(message);
        break;
      default:
        const text = Texts.notValidArgument;
        await sendMessage(message.chat.id, text, message.message_id);
    }
  }

  // src/bot/commandHandler.js
  async function startCommand(message, args) {
    if (args.length !== 0) {
      await handleDeepLink(message, args[0]);
      return true;
    }
    const { from: user, chat } = message;
    const response = Texts.start.replace("{first_name}", user.first_name);
    const reply_markup = {
      inline_keyboard: [[{ text: "Source Code", url: "https://github.com/lawdakacoder/ShowJsonBot" }]]
    };
    await sendMessage(chat.id, response, message.message_id, reply_markup);
    return true;
  }
  async function helpCommand(message) {
    const { chat } = message;
    const response = Texts.help;
    await sendMessage(chat.id, response, message.message_id);
    return true;
  }
  async function infoCommand(message) {
    const { from: user, chat } = message;
    const response = JSON.stringify(user, null, 2);
    await sendJsonMessage(chat.id, response, message.message_id);
    return true;
  }
  async function chatCommand(message) {
    const { chat } = message;
    const response = JSON.stringify(chat, null, 2);
    await sendJsonMessage(chat.id, response, message.message_id);
    return true;
  }
  async function secretCommand(message, args) {
    const { chat } = message;
    let response = "";
    let reply_markup = {};
    if (args.length === 0) {
      response = Texts.secret;
    } else {
      const num = isPositiveIntegerString(args[0]);
      if (num === null || num === 0) {
        response = Texts.notValidArgument;
      } else if (num > 4096) {
        response = Texts.expectedValueTooBig;
      } else {
        response = `<code>${generateUrlSafeToken(num)}</code>`;
        reply_markup.inline_keyboard = [[{ text: "Refresh Token", callback_data: "refresh_secret_token" }]];
      }
    }
    await sendMessage(chat.id, response, message.message_id, reply_markup);
    return true;
  }
  async function handleCommand(message) {
    const { text } = message;
    const [command, ...args] = text.split(" ");
    switch (command) {
      case "/start":
        return await startCommand(message, args);
      case "/help":
        return await helpCommand(message);
      case "/info":
        return await infoCommand(message);
      case "/chat":
        return await chatCommand(message);
      case "/secret":
        return await secretCommand(message, args);
      default:
        return false;
    }
  }

  // src/bot/callbackHandler.js
  async function sendAsFile(query) {
    const { id, message } = query;
    const response = "Sent as file.";
    const messageJson = message.text;
    await sendDocument(message.chat.id, messageJson, message.message_id);
    await answerCallbackQuery(id, response);
  }
  async function refreshSecretToken(query) {
    const { id, message } = query;
    const response = "Token refreshed.";
    const secret_token = generateUrlSafeToken(message.text.length);
    const text = `<code>${secret_token}</code>`;
    const reply_markup = {
      inline_keyboard: [[{ text: "Refresh Token", callback_data: "refresh_secret_token" }]]
    };
    await editMessageText(message.chat.id, message.message_id, text, reply_markup);
    await answerCallbackQuery(id, response);
  }
  async function handleCallbackQuery(callbackQuery) {
    const { id, data: text } = callbackQuery;
    let response = "";
    switch (text) {
      case "send_as_file":
        await sendAsFile(callbackQuery);
        break;
      case "refresh_secret_token":
        await refreshSecretToken(callbackQuery);
        break;
      default:
        response = "Invalid query data.";
        await answerCallbackQuery(id, response);
    }
  }

  // src/bot/jsonHandler.js
  async function handleJsonUpdate(data) {
    const user = data.chat;
    const jsonText = JSON.stringify(data, null, 2);
    if (jsonText.length > 4096) {
      await sendDocument(user.id, jsonText, data.message_id);
    } else {
      await sendJsonMessage(user.id, jsonText, data.message_id);
    }
  }

  // src/index.js
  addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
  async function handleRequest(request) {
    const secret_token = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (secret_token !== SECRET_TOKEN) {
      return new Response("Authentication Failed.", { status: 403 });
    }
    const data = await request.json();
    if (data.message) {
      const text = data.message.text;
      if (text && text.startsWith("/")) {
        const isCommandHandled = await handleCommand(data.message);
        if (!isCommandHandled) {
          await handleJsonUpdate(data.message);
        }
      } else {
        await handleJsonUpdate(data.message);
      }
    } else if (data.edited_message) {
      await handleJsonUpdate(data.edited_message);
    } else if (data.channel_post) {
      await handleJsonUpdate(data.channel_post);
    } else if (data.edited_channel_post) {
      await handleJsonUpdate(data.edited_channel_post);
    } else if (data.callback_query) {
      await handleCallbackQuery(data.callback_query);
    } else if (data.message_reaction) {
      await handleJsonUpdate(data.message_reaction);
    }
    return new Response("OK", { status: 200 });
  }
})();
//# sourceMappingURL=index.js.map
