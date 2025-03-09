
/**
 * SPEC: PPPATTTTTTTTTTC
 * P: Prefix - "AUR"
 * A: AuracleIDType
 * T: unix integer millisecond timestamp, in Crockford's 32
 * C: mod31 Check bit of digits 3-13, in Crockford's
 *
 * Usage:
 * let newId = AuracleID.create(AuracleIDType.RECORDING);
 * console.log(`New recording ID ${newId.value} (type: ${newId.type}, created at: ${newId.createdAt})`)
 * try {
 *   newId = new AuracleID('AURR01JNYJMQP5A');
 * } catch (e) {
 *     console.log(e instanceof AuracleIDValidationError);  // true
 * }
*/


import {encodeTimestamp, decodeTimestamp, uniqueTimestamp, calculateCheckDigit} from "./utils";

/**
 * Enum for Auracle ID types
 */
enum AuracleIDType {
    ARTIST = "A",   // AURA
    COLLAB = "B",   // AURB (band)
    RECORDING = "R" // AURR
}

/**
 * Generate a new Auracle ID
 * @param idType - Type of ID to generate (defaults to ARTIST)
 * @returns Generated Auracle ID
 */
function generateAuracleId(idType: AuracleIDType): string {
    const uniqueNow = uniqueTimestamp();
    const encodedTime = encodeTimestamp(uniqueNow);
    const checkDigit = calculateCheckDigit(`${idType}${encodedTime}`);

    return `AUR${idType}${encodedTime}${checkDigit}`;
}

/**
 * Error class for Auracle ID validation failures
 */
class AuracleIDValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuracleIDValidationError';
    }
}

/**
 * Validate an Auracle ID
 * @param auracleId - ID to validate
 * @returns True if valid, throws error otherwise
 * @throws {AuracleIDValidationError} When ID is invalid
 */
function validateAuracleId(auracleId: string): boolean {
        // Check length
        if (auracleId.length !== 15) {
            throw new AuracleIDValidationError('Not a valid Auracle ID: invalid length');
        }

        // Check prefix
        const prefix = auracleId.substring(0, 3);
        if (prefix !== "AUR") {
            throw new AuracleIDValidationError('Not a valid Auracle ID: invalid prefix');
        }

        // Check type code
        const typeCode = auracleId[3];
        const validTypes = Object.values(AuracleIDType);
        if (!validTypes.includes(typeCode as AuracleIDType)) {
            throw new AuracleIDValidationError(`Not a valid Auracle ID: invalid type code: ${typeCode}`);
        }

        // Check digit validation
        const mainPart = auracleId.substring(3, 14);
        const expectedCheckDigit = calculateCheckDigit(mainPart);

        if (auracleId[14] !== expectedCheckDigit) {
            throw new AuracleIDValidationError('Not a valid Auracle ID: Fake/corrupted');
        }

        const encodedTimestamp = auracleId.substring(4, 14);

        if (!/^[0-9A-HJKMNP-TV-Z]{10}$/.test(encodedTimestamp)) {
            throw new AuracleIDValidationError("Invalid format");
        }

        return true;
}

/**
 * Interface for Auracle ID
 */
interface IAuracleID {
    readonly value: string;
    readonly type: AuracleIDType;
    readonly createdAt: Date;
    validate(): boolean;
}

/**
 * Class implementation of Auracle ID
 */
class AuracleID implements IAuracleID {
    readonly value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error(`Constructor must have an auracleID string`)
        }
        this.value = value;
        // Validate on construction
        this.validate();
    }

    get type(): AuracleIDType {
        return this.value[3] as AuracleIDType;
    }

    get createdAt(): Date {
        const timeStampString = this.value.substring(4, 14);
        const timestamp = decodeTimestamp(timeStampString);
        return new Date(timestamp);
    }

    validate(): boolean {
        return validateAuracleId(this.value);
    }

    static create(type: AuracleIDType): AuracleID {
        if (!type) {
            throw new Error('An AuracleIDType must be specified')
        }
        const value = generateAuracleId(type);
        return new AuracleID(value);
    }
}


export {
    AuracleIDType,
    AuracleIDValidationError,
    AuracleID
};