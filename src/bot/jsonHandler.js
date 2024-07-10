import { sendDocument, sendJsonMessage } from "../telegram/api";

export async function handleJsonUpdate(data) {
    const user = data.chat;
    const jsonText = JSON.stringify(data, null, 2);
    
    if (jsonText.length > 4096) {
        await sendDocument(user.id, jsonText, data.message_id);
    } else {
        await sendJsonMessage(user.id, jsonText, data.message_id);
    }
}