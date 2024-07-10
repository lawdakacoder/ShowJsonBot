import { sendDocument, answerCallbackQuery } from "../telegram/api";

export async function handleCallbackQuery(callbackQuery) {
    const { id, message, data: text } = callbackQuery;
    let response = '';

    switch (text) {
        case 'send_as_file':
            response = 'Sent as file.';
            const messageJson = message.text
            await sendDocument(message.chat.id, messageJson, message.message_id);
            break;
        default:
            response = 'Invalid query data.';
    }

    await answerCallbackQuery(id, response);
}