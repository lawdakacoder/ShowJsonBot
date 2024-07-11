import { sendMessage, sendJsonMessage } from "../telegram/api";
import { Texts } from "../utils/static";
import { isPositiveIntegerString, generateUrlSafeToken } from "../utils/misc";

async function startCommand(message) {
    const { from: user, chat} = message;
    const response = Texts.start
    .replace('{first_name}', user.first_name);
    const reply_markup = {
        inline_keyboard: [[{text: 'Source Code', url: 'https://github.com/lawdakacoder/ShowJsonBot'}]]
    };

    await sendMessage(chat.id, response, message.message_id, reply_markup);
    return true;
}

async function helpCommand(message) {
    const { from: user, chat} = message;
    const response = Texts.help;

    await sendMessage(chat.id, response, message.message_id);
    return true;
}

async function infoCommand(message) {
    const { from: user, chat} = message;
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
    let response = '';
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
            reply_markup.inline_keyboard = 
            [[{text: 'Refresh Token', callback_data: 'refresh_secret_token'}]];
        }
    }

    await sendMessage(chat.id, response, message.message_id, reply_markup);
    return true;
}

export async function handleCommand(message) {
    const { text } = message;
    const [command, ...args] = text.split(' ');

    switch (command) {
        case '/start':
            return await startCommand(message)
        case '/help':
            return await helpCommand(message)
        case '/info':
            return await infoCommand(message)
        case '/chat':
            return await chatCommand(message)
        case '/secret':
            return await secretCommand(message, args)
        default:
            return false;
    }
}
