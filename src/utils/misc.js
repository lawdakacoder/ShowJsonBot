/**
Generate random file name.
**/
export function generateRandomFileName(
    len = 12,
    ext = '.json'
){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result + ext;
}