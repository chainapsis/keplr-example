"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encoding_1 = require("@cosmjs/encoding");
const address_1 = require("./address");
describe("address", () => {
    describe("pubkeyToAddress", () => {
        it("works for Secp256k1 compressed", () => {
            const prefix = "cosmos";
            const pubkey = {
                type: "tendermint/PubKeySecp256k1",
                value: "AtQaCqFnshaZQp6rIkvAPyzThvCvXSDO+9AzbxVErqJP",
            };
            expect(address_1.pubkeyToAddress(pubkey, prefix)).toEqual("cosmos1h806c7khnvmjlywdrkdgk2vrayy2mmvf9rxk2r");
        });
        it("works for Ed25519", () => {
            const prefix = "cosmos";
            const pubkey = {
                type: "tendermint/PubKeyEd25519",
                value: encoding_1.toBase64(encoding_1.fromHex("12ee6f581fe55673a1e9e1382a0829e32075a0aa4763c968bc526e1852e78c95")),
            };
            expect(address_1.pubkeyToAddress(pubkey, prefix)).toEqual("cosmos1pfq05em6sfkls66ut4m2257p7qwlk448h8mysz");
        });
    });
});
//# sourceMappingURL=address.spec.js.map