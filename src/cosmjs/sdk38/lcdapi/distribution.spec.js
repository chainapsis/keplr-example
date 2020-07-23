"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const encoding_1 = require("@cosmjs/encoding");
const utils_1 = require("@cosmjs/utils");
const coins_1 = require("../coins");
const cosmosclient_1 = require("../cosmosclient");
const encoding_2 = require("../encoding");
const signingcosmosclient_1 = require("../signingcosmosclient");
const testutils_spec_1 = require("../testutils.spec");
const wallet_1 = require("../wallet");
const distribution_1 = require("./distribution");
const lcdclient_1 = require("./lcdclient");
function makeDistributionClient(apiUrl) {
    return lcdclient_1.LcdClient.withExtensions({ apiUrl }, distribution_1.setupDistributionExtension);
}
describe("DistributionExtension", () => {
    const defaultFee = {
        amount: coins_1.coins(25000, "ucosm"),
        gas: "1500000",
    };
    beforeAll(async () => {
        if (testutils_spec_1.wasmdEnabled()) {
            const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.wasmd.endpoint, testutils_spec_1.faucet.address, wallet, {});
            const chainId = await client.getChainId();
            const msg = {
                type: "cosmos-sdk/MsgDelegate",
                value: {
                    delegator_address: testutils_spec_1.faucet.address,
                    validator_address: testutils_spec_1.validatorAddress,
                    amount: coins_1.coin(25000, "ustake"),
                },
            };
            const memo = "Test delegation for wasmd";
            const { accountNumber, sequence } = await client.getSequence();
            const signBytes = encoding_2.makeSignBytes([msg], defaultFee, chainId, memo, accountNumber, sequence);
            const signature = await wallet.sign(testutils_spec_1.faucet.address, signBytes);
            const tx = {
                msg: [msg],
                fee: defaultFee,
                memo: memo,
                signatures: [signature],
            };
            const receipt = await client.postTx(tx);
            utils_1.assert(!cosmosclient_1.isPostTxFailure(receipt));
            await utils_1.sleep(75); // wait until transactions are indexed
        }
    });
    describe("delegatorRewards", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = makeDistributionClient(testutils_spec_1.wasmd.endpoint);
            const response = await client.distribution.delegatorRewards(testutils_spec_1.faucet.address);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    rewards: [
                        {
                            validator_address: testutils_spec_1.validatorAddress,
                            reward: null,
                        },
                    ],
                    total: null,
                },
            });
        });
    });
    describe("delegatorReward", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = makeDistributionClient(testutils_spec_1.wasmd.endpoint);
            const response = await client.distribution.delegatorReward(testutils_spec_1.faucet.address, testutils_spec_1.validatorAddress);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [],
            });
        });
    });
    describe("withdrawAddress", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = makeDistributionClient(testutils_spec_1.wasmd.endpoint);
            const response = await client.distribution.withdrawAddress(testutils_spec_1.faucet.address);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: testutils_spec_1.faucet.address,
            });
        });
    });
    describe("validator", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = makeDistributionClient(testutils_spec_1.wasmd.endpoint);
            const response = await client.distribution.validator(testutils_spec_1.validatorAddress);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    // TODO: This smells like a bug in the backend to me
                    operator_address: encoding_1.Bech32.encode("cosmos", encoding_1.Bech32.decode(testutils_spec_1.validatorAddress).data),
                    self_bond_rewards: [
                        { denom: "ucosm", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                        { denom: "ustake", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                    ],
                    val_commission: [
                        { denom: "ucosm", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                        { denom: "ustake", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                    ],
                },
            });
        });
    });
    describe("validatorRewards", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = makeDistributionClient(testutils_spec_1.wasmd.endpoint);
            const response = await client.distribution.validatorRewards(testutils_spec_1.validatorAddress);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    { denom: "ucosm", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                    { denom: "ustake", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                ],
            });
        });
    });
    describe("validatorOutstandingRewards", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = makeDistributionClient(testutils_spec_1.wasmd.endpoint);
            const response = await client.distribution.validatorOutstandingRewards(testutils_spec_1.validatorAddress);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    { denom: "ucosm", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                    { denom: "ustake", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                ],
            });
        });
    });
    describe("parameters", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = makeDistributionClient(testutils_spec_1.wasmd.endpoint);
            const response = await client.distribution.parameters();
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    community_tax: "0.020000000000000000",
                    base_proposer_reward: "0.010000000000000000",
                    bonus_proposer_reward: "0.040000000000000000",
                    withdraw_addr_enabled: true,
                },
            });
        });
    });
    describe("communityPool", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = makeDistributionClient(testutils_spec_1.wasmd.endpoint);
            const response = await client.distribution.communityPool();
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    { denom: "ucosm", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                    { denom: "ustake", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                ],
            });
        });
    });
});
//# sourceMappingURL=distribution.spec.js.map