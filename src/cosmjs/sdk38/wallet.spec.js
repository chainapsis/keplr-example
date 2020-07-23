"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const wallet_1 = require("./wallet");
describe("Secp256k1Wallet", () => {
    // m/44'/118'/0'/0/0
    // pubkey: 02baa4ef93f2ce84592a49b1d729c074eab640112522a7a89f7d03ebab21ded7b6
    const defaultMnemonic = "special sign fit simple patrol salute grocery chicken wheat radar tonight ceiling";
    const defaultPubkey = encoding_1.fromHex("02baa4ef93f2ce84592a49b1d729c074eab640112522a7a89f7d03ebab21ded7b6");
    const defaultAddress = "cosmos1jhg0e7s6gn44tfc5k37kr04sznyhedtc9rzys5";
    it("can be constructed", async () => {
        const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(defaultMnemonic);
        expect(wallet).toBeTruthy();
    });
    describe("getAccounts", () => {
        it("resolves to a list of accounts if enabled", async () => {
            const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(defaultMnemonic);
            const accounts = await wallet.getAccounts();
            expect(accounts.length).toEqual(1);
            expect(accounts[0]).toEqual({
                address: defaultAddress,
                algo: "secp256k1",
                pubkey: defaultPubkey,
            });
        });
        it("creates the same address as Go implementation", async () => {
            const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic("oyster design unusual machine spread century engine gravity focus cave carry slot");
            const [{ address }] = await wallet.getAccounts();
            expect(address).toEqual("cosmos1cjsxept9rkggzxztslae9ndgpdyt2408lk850u");
        });
    });
    describe("sign", () => {
        it("resolves to valid signature if enabled", async () => {
            const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(defaultMnemonic);
            const message = encoding_1.toAscii("foo bar");
            const signature = await wallet.sign(defaultAddress, message);
            const valid = await crypto_1.Secp256k1.verifySignature(crypto_1.Secp256k1Signature.fromFixedLength(encoding_1.fromBase64(signature.signature)), new crypto_1.Sha256(message).digest(), defaultPubkey);
            expect(valid).toEqual(true);
        });
    });
});
//# sourceMappingURL=wallet.spec.js.map