import { API_ROOT, BOT_TOKEN } from "../config";
import { generateRandomFileName } from "../utils/misc";

/**
Send request to Bot API.
**/

async function sendRequest(
    method,
    payload,
    isFormData = false
) {
    const url = `${API_ROOT}/bot${BOT_TOKEN}/${method}`;
    const options = {
        method: 'POST',
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        body: isFormData ? payload : JSON.stringify(payload)
    };

    console.log(options.body)

    return fetch(url, options);
}

/**
Send message to Telegram.
**/

export async function sendMessage(
    chatId,
    text,
    replyToMessageId = null,
    replyMarkup = null
) {
    const payload = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
    };

    if (replyToMessageId) {
        payload.reply_parameters = {message_id: replyToMessageId};
    }

    if (replyMarkup) {
        payload.reply_markup = replyMarkup
    }

    await sendRequest('sendMessage', payload);
}

/**
Send document to Telegram.
**/

export async function sendDocument(
    chatId,
    content,
    replyToMessageId = null
) {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', new Blob([content], { type: 'application/json' }), generateRandomFileName());

    if (replyToMessageId) {
        const reply_parameters = {message_id: replyToMessageId};
        formData.append('reply_parameters', JSON.stringify(reply_parameters));
    }

    await sendRequest('sendDocument', formData, true);
}

/**
Answer callback query.
**/

export async function answerCallbackQuery(
    id,
    text,
    show_alert = false
) {
    const payload = {
        callback_query_id: id,
        text: text,
        show_alert: show_alert
    };

    await sendRequest('answerCallbackQuery', payload);
}

/**
Special function to make sending JSON easy.
**/

export async function sendJsonMessage(
    chatId,
    text,
    replyToMessageId = null
) {
    const payload = {
        chat_id: chatId,
        text: `<pre><code class="language-json">${text}</code></pre>`,
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [[{ text: 'Send as file', callback_data: 'send_as_file' }]]
        }
    };

    if (replyToMessageId) {
        payload.reply_parameters = {message_id: replyToMessageId};
    }

    await sendRequest('sendMessage', payload);
}