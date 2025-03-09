const BASE_32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ" // Crockford's Base32
let lastMillis: number = 0;

/**
 * Calculate check digit using Crockford's Base32
 * @param idStr - String to calculate check digit for
 * @returns Check digit
 */
export function calculateCheckDigit(idStr: string): string {
    let total = 0;

    for (const char of idStr) {
        const index = BASE_32.indexOf(char);
        if (index === -1) {
            throw new Error(`Invalid character in ID: ${char}`);
        }
        total += index;
    }

    return BASE_32[total % 31];
}

/**
 * Generate a unique integer equal to or minimally grater than Date.now()
 * @returns timestamp
 */
export function uniqueTimestamp(): number {
    let nowMillis = Date.now();

    // If this is called in the same millisecond, increment
    if (nowMillis <= lastMillis) {
        nowMillis = lastMillis + 1;
    }

    lastMillis = nowMillis;
    return nowMillis;
}

/**
 * Calculate 10-character time part of id using Crockford's Base32
 * @param nowMillis - (unique) timestamp
 * @returns timestampString
 */
export function encodeTimestamp(nowMillis: number): string {
    let remainder;
    let str = "";
    for (let i = 10; i > 0; i--) {
        remainder = nowMillis % 32;
        str = BASE_32.charAt(remainder) + str;
        nowMillis = (nowMillis - remainder) / 32;
    }
    return str;
}

/**
 * Calculate unix milliseconds from encoded timestamp
 * @param timestampString - (unique) timestamp
 * @returns unixMillis
 */
export function decodeTimestamp(timestampString: string): number {
    if (timestampString.length !== 10) {
        throw new Error("Cannot decode time with wrong length: " + timestampString);
    }
    let sum = 0;
    for (const char of timestampString) {
        sum *= 32;
        sum += BASE_32.indexOf(char);
    }
    return sum;
}
