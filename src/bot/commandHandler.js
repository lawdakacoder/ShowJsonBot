import { sendMessage, sendJsonMessage } from "../telegram/api";
import { Texts } from "../utils/static";
import { isPositiveIntegerString, generateUrlSafeToken } from "../utils/misc";

export async function handleCommand(message) {
    const { from: user, chat, text } = message;
    const [command, ...args] = text.split(' ');
    let response = '';

    switch (command) {
        case '/start':
            response = Texts.start
            .replace('{first_name}', user.first_name);

            const reply_markup = {
                inline_keyboard: [[{ text: 'Source Code', url: 'https://github.com/lawdakacoder/ShowJsonBot'}]]
            };
            
            await sendMessage(chat.id, response, message.message_id, reply_markup);
            return true;
        case '/help':
            response = Texts.help;
            await sendMessage(chat.id, response, message.message_id);
            return true;
        case '/info':
            response = JSON.stringify(user, null, 2);
            await sendJsonMessage(chat.id, response, message.message_id);
            return true;
        case '/chat':
            response = JSON.stringify(chat, null, 2);
            await sendJsonMessage(chat.id, response, message.message_id);
            return true;
        case '/secret':
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
