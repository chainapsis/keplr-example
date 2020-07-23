"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubkeyTypes = exports.pubkeyType = exports.isStdTx = void 0;
function isStdTx(txValue) {
    const { memo, msg, fee, signatures } = txValue;
    return (typeof memo === "string" && Array.isArray(msg) && typeof fee === "object" && Array.isArray(signatures));
}
exports.isStdTx = isStdTx;
exports.pubkeyType = {
    /** @see https://github.com/tendermint/tendermint/blob/v0.33.0/crypto/ed25519/ed25519.go#L22 */
    secp256k1: "tendermint/PubKeySecp256k1",
    /** @see https://github.com/tendermint/tendermint/blob/v0.33.0/crypto/secp256k1/secp256k1.go#L23 */
    ed25519: "tendermint/PubKeyEd25519",
    /** @see https://github.com/tendermint/tendermint/blob/v0.33.0/crypto/sr25519/codec.go#L12 */
    sr25519: "tendermint/PubKeySr25519",
};
exports.pubkeyTypes = [exports.pubkeyType.secp256k1, exports.pubkeyType.ed25519, exports.pubkeyType.sr25519];
//# sourceMappingURL=types.js.map