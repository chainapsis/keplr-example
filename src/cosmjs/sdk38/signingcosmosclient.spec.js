"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@cosmjs/utils");
const cosmosclient_1 = require("./cosmosclient");
const signingcosmosclient_1 = require("./signingcosmosclient");
const testutils_spec_1 = require("./testutils.spec");
const wallet_1 = require("./wallet");
const httpUrl = "http://localhost:1317";
const faucet = {
    mnemonic: "economy stock theory fatal elder harbor betray wasp final emotion task crumble siren bottom lizard educate guess current outdoor pair theory focus wife stone",
    pubkey: {
        type: "tendermint/PubKeySecp256k1",
        value: "A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
    },
    address: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
};
describe("SigningCosmosClient", () => {
    describe("makeReadOnly", () => {
        it("can be constructed", async () => {
            const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(httpUrl, faucet.address, wallet);
            expect(client).toBeTruthy();
        });
    });
    describe("getHeight", () => {
        it("always uses authAccount implementation", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(httpUrl, faucet.address, wallet);
            const openedClient = client;
            const blockLatestSpy = spyOn(openedClient.lcdClient, "blocksLatest").and.callThrough();
            const authAccountsSpy = spyOn(openedClient.lcdClient.auth, "account").and.callThrough();
            const height = await client.getHeight();
            expect(height).toBeGreaterThan(0);
            expect(blockLatestSpy).toHaveBeenCalledTimes(0);
            expect(authAccountsSpy).toHaveBeenCalledTimes(1);
        });
    });
    describe("sendTokens", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(httpUrl, faucet.address, wallet);
            // instantiate
            const transferAmount = [
                {
                    amount: "7890",
                    denom: "ucosm",
                },
            ];
            const beneficiaryAddress = testutils_spec_1.makeRandomAddress();
            // no tokens here
            const before = await client.getAccount(beneficiaryAddress);
            expect(before).toBeUndefined();
            // send
            const result = await client.sendTokens(beneficiaryAddress, transferAmount, "for dinner");
            utils_1.assert(!cosmosclient_1.isPostTxFailure(result));
            const [firstLog] = result.logs;
            expect(firstLog).toBeTruthy();
            // got tokens
            const after = await client.getAccount(beneficiaryAddress);
            utils_1.assert(after);
            expect(after.balance).toEqual(transferAmount);
        });
    });
});
//# sourceMappingURL=signingcosmosclient.spec.js.map