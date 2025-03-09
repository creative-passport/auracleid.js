/**
 * Calculate check digit using Crockford's Base32
 * @param idStr - String to calculate check digit for
 * @returns Check digit
 */
export declare function calculateCheckDigit(idStr: string): string;
/**
 * Generate a unique integer equal to or minimally grater than Date.now()
 * @returns timestamp
 */
export declare function uniqueTimestamp(): number;
/**
 * Calculate 10-character time part of id using Crockford's Base32
 * @param nowMillis - (unique) timestamp
 * @returns timestampString
 */
export declare function encodeTimestamp(nowMillis: number): string;
/**
 * Calculate unix milliseconds from encoded timestamp
 * @param timestampString - (unique) timestamp
 * @returns unixMillis
 */
export declare function decodeTimestamp(timestampString: string): number;
