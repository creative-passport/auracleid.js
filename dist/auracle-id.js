"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuracleID = exports.AuracleIDValidationError = exports.AuracleIDType = void 0;
const utils_1 = require("./utils");
/**
 * Enum for Auracle ID types
 */
var AuracleIDType;
(function (AuracleIDType) {
    AuracleIDType["ARTIST"] = "A";
    AuracleIDType["COLLAB"] = "B";
    AuracleIDType["COMPOSITION"] = "C";
    AuracleIDType["PERSONA"] = "P";
    AuracleIDType["RECORDING"] = "R"; // AURR
})(AuracleIDType || (exports.AuracleIDType = AuracleIDType = {}));
/**
 * Generate a new Auracle ID
 * @param idType - Type of ID to generate (defaults to ARTIST)
 * @returns Generated Auracle ID
 */
function generateAuracleId(idType) {
    const uniqueNow = (0, utils_1.uniqueTimestamp)();
    const encodedTime = (0, utils_1.encodeTimestamp)(uniqueNow);
    const checkDigit = (0, utils_1.calculateCheckDigit)(`${idType}${encodedTime}`);
    return `AUR${idType}${encodedTime}${checkDigit}`;
}
/**
 * Error class for Auracle ID validation failures
 */
class AuracleIDValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuracleIDValidationError';
    }
}
exports.AuracleIDValidationError = AuracleIDValidationError;
/**
 * Validate an Auracle ID
 * @param auracleId - ID to validate
 * @returns True if valid, throws error otherwise
 * @throws {AuracleIDValidationError} When ID is invalid
 */
function validateAuracleId(auracleId) {
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
    if (!validTypes.includes(typeCode)) {
        throw new AuracleIDValidationError(`Not a valid Auracle ID: invalid type code: ${typeCode}`);
    }
    // Check digit validation
    const mainPart = auracleId.substring(3, 14);
    const expectedCheckDigit = (0, utils_1.calculateCheckDigit)(mainPart);
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
 * Class implementation of Auracle ID
 */
class AuracleID {
    constructor(value) {
        if (!value) {
            throw new Error(`Constructor must have an auracleID string`);
        }
        this.value = value;
        // Validate on construction
        this.validate();
    }
    get type() {
        return this.value[3];
    }
    get createdAt() {
        const timeStampString = this.value.substring(4, 14);
        const timestamp = (0, utils_1.decodeTimestamp)(timeStampString);
        return new Date(timestamp);
    }
    validate() {
        return validateAuracleId(this.value);
    }
    static create(type) {
        if (!type) {
            throw new Error('An AuracleIDType must be specified');
        }
        const value = generateAuracleId(type);
        return new AuracleID(value);
    }
}
exports.AuracleID = AuracleID;
