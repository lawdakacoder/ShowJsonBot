/**
Check if string is a positive integer then convert it.
**/
export function isPositiveIntegerString(str) {
    const integerRegex = /^\d+$/;

    if (integerRegex.test(str)) {
        return parseInt(str, 10);
    }

    return null;
}

/**
Generate url safe token.
**/
export function generateUrlSafeToken(len) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    let result = '';

    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result
}

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
