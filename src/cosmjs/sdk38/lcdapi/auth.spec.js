"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const pubkey_1 = require("../pubkey");
const testutils_spec_1 = require("../testutils.spec");
const auth_1 = require("./auth");
const lcdclient_1 = require("./lcdclient");
function makeAuthClient(apiUrl) {
    return lcdclient_1.LcdClient.withExtensions({ apiUrl }, auth_1.setupAuthExtension);
}
describe("AuthExtension", () => {
    it("works for unused account without pubkey", async () => {
        testutils_spec_1.pendingWithoutWasmd();
        const client = makeAuthClient(testutils_spec_1.wasmd.endpoint);
        const { height, result } = await client.auth.account(testutils_spec_1.unused.address);
        expect(height).toMatch(testutils_spec_1.nonNegativeIntegerMatcher);
        expect(result).toEqual({
            type: "cosmos-sdk/Account",
            value: {
                address: testutils_spec_1.unused.address,
                public_key: "",
                coins: [
                    {
                        amount: "1000000000",
                        denom: "ucosm",
                    },
                    {
                        amount: "1000000000",
                        denom: "ustake",
                    },
                ],
                account_number: testutils_spec_1.unused.accountNumber,
                sequence: 0,
            },
        });
    });
    // This fails in the first test run if you forget to run `./scripts/wasmd/init.sh`
    it("has correct pubkey for faucet", async () => {
        testutils_spec_1.pendingWithoutWasmd();
        const client = makeAuthClient(testutils_spec_1.wasmd.endpoint);
        const { result } = await client.auth.account(testutils_spec_1.faucet.address);
        expect(result.value).toEqual(jasmine.objectContaining({
            public_key: pubkey_1.encodeBech32Pubkey(testutils_spec_1.faucet.pubkey, "cosmospub"),
        }));
    });
    // This property is used by CosmWasmClient.getAccount
    it("returns empty address for non-existent account", async () => {
        testutils_spec_1.pendingWithoutWasmd();
        const client = makeAuthClient(testutils_spec_1.wasmd.endpoint);
        const nonExistentAccount = testutils_spec_1.makeRandomAddress();
        const { result } = await client.auth.account(nonExistentAccount);
        expect(result).toEqual({
            type: "cosmos-sdk/Account",
            value: jasmine.objectContaining({ address: "" }),
        });
    });
});
//# sourceMappingURL=auth.spec.js.map