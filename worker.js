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
    console.log(options.body);
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

  // src/bot/commandHandler.js
  async function handleCommand(message) {
    const { from: user, chat, text } = message;
    const [command, ...args] = text.split(" ");
    let response = "";
    switch (command) {
      case "/start":
        response = Texts.start.replace("{first_name}", user.first_name);
        const reply_markup = {
          inline_keyboard: [[{ text: "Source Code", url: "https://github.com/lawdakacoder/ShowJsonBot" }]]
        };
        await sendMessage(chat.id, response, message.message_id, reply_markup);
        return true;
      case "/help":
        response = Texts.help;
        await sendMessage(chat.id, response, message.message_id);
        return true;
      case "/info":
        response = JSON.stringify(user, null, 2);
        await sendJsonMessage(chat.id, response, message.message_id);
        return true;
      case "/chat":
        response = JSON.stringify(chat, null, 2);
        await sendJsonMessage(chat.id, response, message.message_id);
        return true;
      case "/secret":
        if (args.length === 0) {
          response = Texts.secret;
        } else {
          const num = isPositiveIntegerString(args[0]);
          if (num === null) {
            response = Texts.notValidArgument;
          } else if (num > 4096) {
            response = Texts.expectedValueTooBig;
          } else {
            response = `<code>${generateUrlSafeToken(num)}</code>`;
          }
        }
        await sendMessage(chat.id, response, message.message_id);
        return true;
      default:
        return false;
    }
  }

  // src/bot/callbackHandler.js
  async function handleCallbackQuery(callbackQuery) {
    const { id, message, data: text } = callbackQuery;
    let response = "";
    switch (text) {
      case "send_as_file":
        response = "Sent as file.";
        const messageJson = message.text;
        await sendDocument(message.chat.id, messageJson, message.message_id);
        break;
      default:
        response = "Invalid query data.";
    }
    await answerCallbackQuery(id, response);
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
