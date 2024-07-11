import {
    sendDocument,
    answerCallbackQuery,
    editMessageText
} from "../telegram/api";
import { generateUrlSafeToken } from "../utils/misc";

async function sendAsFile(query) {
    const { id, message } = query;
    const response = 'Sent as file.';
    const messageJson = message.text;

    await sendDocument(message.chat.id, messageJson, message.message_id);
    await answerCallbackQuery(id, response);
}

async function refreshSecretToken(query) {
    const { id, message } = query;
    const secret_token = generateUrlSafeToken(message.text.length);
    const text = `<code>${secret_token}</code>`;
    const reply_markup = {
        inline_keyboard: [[{ text: 'Refresh Token', callback_data: 'refresh_secret_token' }]]
    };
    const response = 'Token refreshed.';

    await editMessageText(message.chat.id, message.message_id, text, reply_markup);
    await answerCallbackQuery(id, response);
}

export async function handleCallbackQuery(callbackQuery) {
    const { id, data: text } = callbackQuery;
    let response = '';

    switch (text) {
        case 'send_as_file':
            await sendAsFile(callbackQuery);
            break;
        case 'refresh_secret_token':
            await refreshSecretToken(callbackQuery);
            break;
        default:
            response = 'Invalid query data.';
            await answerCallbackQuery(id, response);
    }
}
