import { SECRET_TOKEN } from "./config";
import { handleCommand } from "./bot/commandHandler";
import { handleCallbackQuery } from "./bot/callbackHandler";
import { handleJsonUpdate } from "./bot/jsonHandler";

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {

    const secret_token = request.headers.get('X-Telegram-Bot-Api-Secret-Token');

    if (secret_token !== SECRET_TOKEN) {
        return new Response('Authentication Failed.', { status: 403 });
    }

    const data = await request.json();

    if (data.message) {
        const text = data.message.text;

        if (text && text.startsWith('/')) {
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

    return new Response('OK', { status: 200 });

}