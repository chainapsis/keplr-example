"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secp256k1Wallet = exports.makeCosmoshubPath = void 0;
const crypto_1 = require("@cosmjs/crypto");
const address_1 = require("./address");
const signature_1 = require("./signature");
function prehash(bytes, type) {
    switch (type) {
        case null:
            return new Uint8Array([...bytes]);
        case "sha256":
            return new crypto_1.Sha256(bytes).digest();
        case "sha512":
            return new crypto_1.Sha512(bytes).digest();
        default:
            throw new Error("Unknown prehash type");
    }
}
/**
 * The Cosmoshub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
function makeCosmoshubPath(a) {
    return [
        crypto_1.Slip10RawIndex.hardened(44),
        crypto_1.Slip10RawIndex.hardened(118),
        crypto_1.Slip10RawIndex.hardened(0),
        crypto_1.Slip10RawIndex.normal(0),
        crypto_1.Slip10RawIndex.normal(a),
    ];
}
exports.makeCosmoshubPath = makeCosmoshubPath;
class Secp256k1Wallet {
    constructor(privkey, pubkey, prefix) {
        this.algo = "secp256k1";
        this.privkey = privkey;
        this.pubkey = pubkey;
        this.prefix = prefix;
    }
    static async fromMnemonic(mnemonic, hdPath = makeCosmoshubPath(0), prefix = "cosmos") {
        const seed = await crypto_1.Bip39.mnemonicToSeed(new crypto_1.EnglishMnemonic(mnemonic));
        const { privkey } = crypto_1.Slip10.derivePath(crypto_1.Slip10Curve.Secp256k1, seed, hdPath);
        const uncompressed = (await crypto_1.Secp256k1.makeKeypair(privkey)).pubkey;
        return new Secp256k1Wallet(privkey, crypto_1.Secp256k1.compressPubkey(uncompressed), prefix);
    }
    get address() {
        return address_1.rawSecp256k1PubkeyToAddress(this.pubkey, this.prefix);
    }
    async getAccounts() {
        return [
            {
                address: this.address,
                algo: this.algo,
                pubkey: this.pubkey,
            },
        ];
    }
    async sign(address, message, prehashType = "sha256") {
        if (address !== this.address) {
            throw new Error(`Address ${address} not found in wallet`);
        }
        const hashedMessage = prehash(message, prehashType);
        const signature = await crypto_1.Secp256k1.createSignature(hashedMessage, this.privkey);
        const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);
        return signature_1.encodeSecp256k1Signature(this.pubkey, signatureBytes);
    }
}
exports.Secp256k1Wallet = Secp256k1Wallet;
//# sourceMappingURL=wallet.js.map