export const Texts = {
    start: `Hi there, <b>{first_name}</b>! Send me any message, and I will send its beautiful JSON.`,
    help:`
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
    notValidArgument: 'The provided argument is invalid.',
    expectedValueTooBig: 'Expected value is too big.'
};
