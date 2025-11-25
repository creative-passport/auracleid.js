## auracle-id.js

Official Auracle IDs can only be minted by Auracles.

However, we have opened the JavaScript source for how create new Auracle IDs, and check the integrity of IDs.

An Auracle ID is only truly valid if it was minted by Auracles. For `AURA`, `AURB` and `AURP` IDs, for example, this can be verified by
```
GET https://api.id.auracles.io/auracle_id/{auracleID}/
```

### Spec

```
SPEC: PPPATTTTTTTTTTC
P: Prefix - "AUR"
A: AuracleIDType - A|B|C|P|R|W
T: unix integer millisecond timestamp, in Crockford's 32
C: mod31 Check bit of digits 3-13, in Crockford's
```

### Usage:

```typescript
let newId = AuracleID.create(AuracleIDType.RECORDING);
console.log(`New recording ID ${newId.value} (type: ${newId.type}, created at: ${newId.createdAt})`)
try {
  newId = new AuracleID('AURR01JNYJMQP5A');
} catch (e) {
  console.log(e instanceof AuracleIDValidationError);  // true
}
```
