import { infoCommand, chatCommand, secretCommand, helpCommand } from "./commandHandler";
import { Texts } from "../utils/static";
import { sendMessage } from "../telegram/api";

export async function handleDeepLink(message, arg) {
    const [deeplink, ...args] = arg.split('_');

    switch (deeplink) {
        case 'info':
            await infoCommand(message);
            break;
        case 'chat':
            await chatCommand(message);
            break;
        case 'secret':
            await secretCommand(message, args);
            break;
        case 'help':
            await helpCommand(message);
            break;
        default:
            const text = Texts.notValidArgument;
            await sendMessage(message.chat.id, text, message.message_id);
    }
}
