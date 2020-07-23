"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const utils_1 = require("@cosmjs/utils");
const coins_1 = require("./coins");
const cosmosclient_1 = require("./cosmosclient");
const encoding_1 = require("./encoding");
const lcdapi_1 = require("./lcdapi");
const msgs_1 = require("./msgs");
const signingcosmosclient_1 = require("./signingcosmosclient");
const testutils_spec_1 = require("./testutils.spec");
const wallet_1 = require("./wallet");
describe("CosmosClient.searchTx", () => {
    let sendUnsuccessful;
    let sendSuccessful;
    beforeAll(async () => {
        if (testutils_spec_1.wasmdEnabled()) {
            const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const accounts = await wallet.getAccounts();
            const [{ address: walletAddress }] = accounts;
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.wasmd.endpoint, testutils_spec_1.faucet.address, wallet);
            {
                const memo = "Sending more than I can afford";
                const recipient = testutils_spec_1.makeRandomAddress();
                const transferAmount = coins_1.coins(123456700000000, "ucosm");
                const sendMsg = {
                    type: "cosmos-sdk/MsgSend",
                    value: {
                        from_address: testutils_spec_1.faucet.address,
                        to_address: recipient,
                        amount: transferAmount,
                    },
                };
                const fee = {
                    amount: coins_1.coins(2000, "ucosm"),
                    gas: "80000",
                };
                const { accountNumber, sequence } = await client.getSequence();
                const chainId = await client.getChainId();
                const signBytes = encoding_1.makeSignBytes([sendMsg], fee, chainId, memo, accountNumber, sequence);
                const signature = await wallet.sign(walletAddress, signBytes);
                const tx = {
                    type: "cosmos-sdk/StdTx",
                    value: {
                        msg: [sendMsg],
                        fee: fee,
                        memo: memo,
                        signatures: [signature],
                    },
                };
                const transactionId = await client.getIdentifier(tx);
                const result = await client.postTx(tx.value);
                if (cosmosclient_1.isPostTxFailure(result)) {
                    sendUnsuccessful = {
                        sender: testutils_spec_1.faucet.address,
                        recipient: recipient,
                        hash: transactionId,
                        height: result.height,
                        tx: tx,
                    };
                }
            }
            {
                const recipient = testutils_spec_1.makeRandomAddress();
                const transferAmount = coins_1.coins(1234567, "ucosm");
                const result = await client.sendTokens(recipient, transferAmount);
                await utils_1.sleep(75); // wait until tx is indexed
                const txDetails = await new lcdapi_1.LcdClient(testutils_spec_1.wasmd.endpoint).txById(result.transactionHash);
                sendSuccessful = {
                    sender: testutils_spec_1.faucet.address,
                    recipient: recipient,
                    hash: result.transactionHash,
                    height: Number.parseInt(txDetails.height, 10),
                    tx: txDetails.tx,
                };
            }
        }
    });
    describe("with SearchByIdQuery", () => {
        it("can search successful tx by ID", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful, "value must be set in beforeAll()");
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const result = await client.searchTx({ id: sendSuccessful.hash });
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(jasmine.objectContaining({
                height: sendSuccessful.height,
                hash: sendSuccessful.hash,
                code: 0,
                tx: sendSuccessful.tx,
            }));
        });
        it("can search unsuccessful tx by ID", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendUnsuccessful, "value must be set in beforeAll()");
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const result = await client.searchTx({ id: sendUnsuccessful.hash });
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(jasmine.objectContaining({
                height: sendUnsuccessful.height,
                hash: sendUnsuccessful.hash,
                code: 5,
                tx: sendUnsuccessful.tx,
            }));
        });
        it("can search by ID (non existent)", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const nonExistentId = "0000000000000000000000000000000000000000000000000000000000000000";
            const result = await client.searchTx({ id: nonExistentId });
            expect(result.length).toEqual(0);
        });
        it("can search by ID and filter by minHeight", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful);
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const query = { id: sendSuccessful.hash };
            {
                const result = await client.searchTx(query, { minHeight: 0 });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { minHeight: sendSuccessful.height - 1 });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { minHeight: sendSuccessful.height });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { minHeight: sendSuccessful.height + 1 });
                expect(result.length).toEqual(0);
            }
        });
    });
    describe("with SearchByHeightQuery", () => {
        it("can search successful tx by height", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful, "value must be set in beforeAll()");
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const result = await client.searchTx({ height: sendSuccessful.height });
            expect(result.length).toBeGreaterThanOrEqual(1);
            expect(result).toContain(jasmine.objectContaining({
                height: sendSuccessful.height,
                hash: sendSuccessful.hash,
                code: 0,
                tx: sendSuccessful.tx,
            }));
        });
        it("can search unsuccessful tx by height", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendUnsuccessful, "value must be set in beforeAll()");
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const result = await client.searchTx({ height: sendUnsuccessful.height });
            expect(result.length).toBeGreaterThanOrEqual(1);
            expect(result).toContain(jasmine.objectContaining({
                height: sendUnsuccessful.height,
                hash: sendUnsuccessful.hash,
                code: 5,
                tx: sendUnsuccessful.tx,
            }));
        });
    });
    describe("with SearchBySentFromOrToQuery", () => {
        it("can search by sender", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful, "value must be set in beforeAll()");
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const results = await client.searchTx({ sentFromOrTo: sendSuccessful.sender });
            expect(results.length).toBeGreaterThanOrEqual(1);
            // Check basic structure of all results
            for (const result of results) {
                const containsMsgWithSender = !!result.tx.value.msg.find((msg) => msgs_1.isMsgSend(msg) && msg.value.from_address == sendSuccessful.sender);
                const containsMsgWithRecipient = !!result.tx.value.msg.find((msg) => msgs_1.isMsgSend(msg) && msg.value.to_address === sendSuccessful.sender);
                expect(containsMsgWithSender || containsMsgWithRecipient).toEqual(true);
            }
            // Check details of most recent result
            expect(results[results.length - 1]).toEqual(jasmine.objectContaining({
                height: sendSuccessful.height,
                hash: sendSuccessful.hash,
                tx: sendSuccessful.tx,
            }));
        });
        it("can search by recipient", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful, "value must be set in beforeAll()");
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const results = await client.searchTx({ sentFromOrTo: sendSuccessful.recipient });
            expect(results.length).toBeGreaterThanOrEqual(1);
            // Check basic structure of all results
            for (const result of results) {
                const msg = testutils_spec_1.fromOneElementArray(result.tx.value.msg);
                utils_1.assert(msgs_1.isMsgSend(msg), `${result.hash} (height ${result.height}) is not a bank send transaction`);
                expect(msg.value.to_address === sendSuccessful.recipient ||
                    msg.value.from_address == sendSuccessful.recipient).toEqual(true);
            }
            // Check details of most recent result
            expect(results[results.length - 1]).toEqual(jasmine.objectContaining({
                height: sendSuccessful.height,
                hash: sendSuccessful.hash,
                tx: sendSuccessful.tx,
            }));
        });
        it("can search by recipient and filter by minHeight", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful);
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const query = { sentFromOrTo: sendSuccessful.recipient };
            {
                const result = await client.searchTx(query, { minHeight: 0 });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { minHeight: sendSuccessful.height - 1 });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { minHeight: sendSuccessful.height });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { minHeight: sendSuccessful.height + 1 });
                expect(result.length).toEqual(0);
            }
        });
        it("can search by recipient and filter by maxHeight", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful);
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const query = { sentFromOrTo: sendSuccessful.recipient };
            {
                const result = await client.searchTx(query, { maxHeight: 9999999999999 });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { maxHeight: sendSuccessful.height + 1 });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { maxHeight: sendSuccessful.height });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { maxHeight: sendSuccessful.height - 1 });
                expect(result.length).toEqual(0);
            }
        });
    });
    describe("with SearchByTagsQuery", () => {
        it("can search by transfer.recipient", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful, "value must be set in beforeAll()");
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.wasmd.endpoint);
            const results = await client.searchTx({
                tags: [{ key: "transfer.recipient", value: sendSuccessful.recipient }],
            });
            expect(results.length).toBeGreaterThanOrEqual(1);
            // Check basic structure of all results
            for (const result of results) {
                const msg = testutils_spec_1.fromOneElementArray(result.tx.value.msg);
                utils_1.assert(msgs_1.isMsgSend(msg), `${result.hash} (height ${result.height}) is not a bank send transaction`);
                expect(msg.value.to_address).toEqual(sendSuccessful.recipient);
            }
            // Check details of most recent result
            expect(results[results.length - 1]).toEqual(jasmine.objectContaining({
                height: sendSuccessful.height,
                hash: sendSuccessful.hash,
                tx: sendSuccessful.tx,
            }));
        });
    });
});
//# sourceMappingURL=cosmosclient.searchtx.spec.js.map