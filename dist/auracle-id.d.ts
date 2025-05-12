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
/**
 * Enum for Auracle ID types
 */
declare enum AuracleIDType {
    ARTIST = "A",// AURA
    COLLAB = "B",// AURB (band)
    COMPOSITION = "C",// AURC
    PERSONA = "P",// AURP
    RECORDING = "R",// AURR
    PROJECT = "W"
}
/**
 * Error class for Auracle ID validation failures
 */
declare class AuracleIDValidationError extends Error {
    constructor(message: string);
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
declare class AuracleID implements IAuracleID {
    readonly value: string;
    constructor(value: string);
    get type(): AuracleIDType;
    get createdAt(): Date;
    validate(): boolean;
    static create(type: AuracleIDType): AuracleID;
}
export { AuracleIDType, AuracleIDValidationError, AuracleID };
