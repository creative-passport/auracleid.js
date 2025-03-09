```
SPEC: PPPATTTTTTTTTTC
P: Prefix - "AUR"
A: AuracleIDType - A|B|R
T: unix integer millisecond timestamp, in Crockford's 32
C: mod31 Check bit of digits 3-13, in Crockford's
```

Usage:
```typescript
let newId = AuracleID.create(AuracleIDType.RECORDING);
console.log(`New recording ID ${newId.value} (type: ${newId.type}, created at: ${newId.createdAt})`)
try {
  newId = new AuracleID('AURR01JNYJMQP5A');
} catch (e) {
  console.log(e instanceof AuracleIDValidationError);  // true
}
```
