"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployedErc20 = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const utils_1 = require("@cosmjs/utils");
const cosmosclient_1 = require("../cosmosclient");
const encoding_1 = require("../encoding");
const logs_1 = require("../logs");
const signingcosmosclient_1 = require("../signingcosmosclient");
const cosmoshub_json_1 = __importDefault(require("../testdata/cosmoshub.json"));
const testutils_spec_1 = require("../testutils.spec");
const wallet_1 = require("../wallet");
const auth_1 = require("./auth");
const lcdclient_1 = require("./lcdclient");
/** Deployed as part of scripts/wasmd/init.sh */
exports.deployedErc20 = {
    codeId: 1,
    source: "https://crates.io/api/v1/crates/cw-erc20/0.5.1/download",
    builder: "cosmwasm/rust-optimizer:0.8.0",
    checksum: "3e97bf88bd960fee5e5959c77b972eb2927690bc10160792741b174f105ec0c5",
    instances: [
        "cosmos18vd8fpwxzck93qlwghaj6arh4p7c5n89uzcee5",
        "cosmos1hqrdl6wstt8qzshwc6mrumpjk9338k0lr4dqxd",
        "cosmos18r5szma8hm93pvx6lwpjwyxruw27e0k5uw835c",
    ],
};
describe("LcdClient", () => {
    const defaultRecipientAddress = testutils_spec_1.makeRandomAddress();
    it("can be constructed", () => {
        const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
        expect(client).toBeTruthy();
    });
    describe("withModules", () => {
        function isWasmError(resp) {
            return resp.error !== undefined;
        }
        function unwrapWasmResponse(response) {
            if (isWasmError(response)) {
                throw new Error(response.error);
            }
            return response.result;
        }
        function setupWasmExtension(base) {
            return {
                wasm: {
                    listCodeInfo: async () => {
                        const path = `/wasm/code`;
                        const responseData = (await base.get(path));
                        return lcdclient_1.normalizeLcdApiArray(unwrapWasmResponse(responseData));
                    },
                },
            };
        }
        it("works for no extension", async () => {
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.wasmd.endpoint });
            expect(client).toBeTruthy();
        });
        it("works for one extension", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.wasmd.endpoint }, setupWasmExtension);
            const codes = await client.wasm.listCodeInfo();
            expect(codes.length).toBeGreaterThanOrEqual(3);
            expect(codes[0].id).toEqual(exports.deployedErc20.codeId);
            expect(codes[0].data_hash).toEqual(exports.deployedErc20.checksum.toUpperCase());
            expect(codes[0].builder).toEqual(exports.deployedErc20.builder);
            expect(codes[0].source).toEqual(exports.deployedErc20.source);
        });
        it("works for two extensions", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            function setupSupplyExtension(base) {
                return {
                    supply: {
                        totalAll: async () => {
                            const path = `/supply/total`;
                            return (await base.get(path));
                        },
                    },
                };
            }
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.wasmd.endpoint }, setupWasmExtension, setupSupplyExtension);
            const codes = await client.wasm.listCodeInfo();
            expect(codes.length).toBeGreaterThanOrEqual(3);
            expect(codes[0].id).toEqual(exports.deployedErc20.codeId);
            expect(codes[0].data_hash).toEqual(exports.deployedErc20.checksum.toUpperCase());
            expect(codes[0].builder).toEqual(exports.deployedErc20.builder);
            expect(codes[0].source).toEqual(exports.deployedErc20.source);
            const supply = await client.supply.totalAll();
            expect(supply).toEqual({
                height: jasmine.stringMatching(/^[0-9]+$/),
                result: [
                    {
                        amount: jasmine.stringMatching(/^[0-9]+$/),
                        denom: "ucosm",
                    },
                    {
                        amount: jasmine.stringMatching(/^[0-9]+$/),
                        denom: "ustake",
                    },
                ],
            });
        });
        it("can merge two extensions into the same module", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            function setupSupplyExtensionBasic(base) {
                return {
                    supply: {
                        totalAll: async () => {
                            const path = `/supply/total`;
                            return base.get(path);
                        },
                    },
                };
            }
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            function setupSupplyExtensionPremium(base) {
                return {
                    supply: {
                        total: async (denom) => {
                            return base.get(`/supply/total/${denom}`);
                        },
                    },
                };
            }
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.wasmd.endpoint }, setupSupplyExtensionBasic, setupSupplyExtensionPremium);
            expect(client.supply.totalAll).toEqual(jasmine.any(Function));
            expect(client.supply.total).toEqual(jasmine.any(Function));
        });
    });
    // The /txs endpoints
    describe("txById", () => {
        let successful;
        let unsuccessful;
        beforeAll(async () => {
            if (testutils_spec_1.wasmdEnabled()) {
                const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
                const accounts = await wallet.getAccounts();
                const [{ address: walletAddress }] = accounts;
                const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.wasmd.endpoint, testutils_spec_1.faucet.address, wallet);
                {
                    const recipient = testutils_spec_1.makeRandomAddress();
                    const transferAmount = {
                        denom: "ucosm",
                        amount: "1234567",
                    };
                    const result = await client.sendTokens(recipient, [transferAmount]);
                    successful = {
                        sender: testutils_spec_1.faucet.address,
                        recipient: recipient,
                        hash: result.transactionHash,
                    };
                }
                {
                    const memo = "Sending more than I can afford";
                    const recipient = testutils_spec_1.makeRandomAddress();
                    const transferAmount = [
                        {
                            denom: "ucosm",
                            amount: "123456700000000",
                        },
                    ];
                    const sendMsg = {
                        type: "cosmos-sdk/MsgSend",
                        value: {
                            from_address: testutils_spec_1.faucet.address,
                            to_address: recipient,
                            amount: transferAmount,
                        },
                    };
                    const fee = {
                        amount: [
                            {
                                denom: "ucosm",
                                amount: "2000",
                            },
                        ],
                        gas: "80000",
                    };
                    const { accountNumber, sequence } = await client.getSequence();
                    const chainId = await client.getChainId();
                    const signBytes = encoding_1.makeSignBytes([sendMsg], fee, chainId, memo, accountNumber, sequence);
                    const signature = await wallet.sign(walletAddress, signBytes);
                    const signedTx = {
                        msg: [sendMsg],
                        fee: fee,
                        memo: memo,
                        signatures: [signature],
                    };
                    const transactionId = await client.getIdentifier({ type: "cosmos-sdk/StdTx", value: signedTx });
                    const result = await client.postTx(signedTx);
                    utils_1.assert(cosmosclient_1.isPostTxFailure(result));
                    unsuccessful = {
                        sender: testutils_spec_1.faucet.address,
                        recipient: recipient,
                        hash: transactionId,
                    };
                }
                await utils_1.sleep(75); // wait until transactions are indexed
            }
        });
        it("works for successful transaction", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(successful);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
            const result = await client.txById(successful.hash);
            expect(result.height).toBeGreaterThanOrEqual(1);
            expect(result.txhash).toEqual(successful.hash);
            expect(result.codespace).toBeUndefined();
            expect(result.code).toBeUndefined();
            const logs = logs_1.parseLogs(result.logs);
            expect(logs).toEqual([
                {
                    msg_index: 0,
                    log: "",
                    events: [
                        {
                            type: "message",
                            attributes: [
                                { key: "action", value: "send" },
                                { key: "sender", value: successful.sender },
                                { key: "module", value: "bank" },
                            ],
                        },
                        {
                            type: "transfer",
                            attributes: [
                                { key: "recipient", value: successful.recipient },
                                { key: "sender", value: successful.sender },
                                { key: "amount", value: "1234567ucosm" },
                            ],
                        },
                    ],
                },
            ]);
        });
        it("works for unsuccessful transaction", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(unsuccessful);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
            const result = await client.txById(unsuccessful.hash);
            expect(result.height).toBeGreaterThanOrEqual(1);
            expect(result.txhash).toEqual(unsuccessful.hash);
            expect(result.codespace).toEqual("sdk");
            expect(result.code).toEqual(5);
            expect(result.logs).toBeUndefined();
            expect(result.raw_log).toContain("insufficient funds");
        });
    });
    describe("txsQuery", () => {
        let posted;
        beforeAll(async () => {
            if (testutils_spec_1.wasmdEnabled()) {
                const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
                const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.wasmd.endpoint, testutils_spec_1.faucet.address, wallet);
                const recipient = testutils_spec_1.makeRandomAddress();
                const transferAmount = [
                    {
                        denom: "ucosm",
                        amount: "1234567",
                    },
                ];
                const result = await client.sendTokens(recipient, transferAmount);
                await utils_1.sleep(75); // wait until tx is indexed
                const txDetails = await new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint).txById(result.transactionHash);
                posted = {
                    sender: testutils_spec_1.faucet.address,
                    recipient: recipient,
                    hash: result.transactionHash,
                    height: Number.parseInt(txDetails.height, 10),
                    tx: txDetails,
                };
            }
        });
        it("can query transactions by height", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(posted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
            const result = await client.txsQuery(`tx.height=${posted.height}&limit=26`);
            expect(result).toEqual({
                count: jasmine.stringMatching(/^(1|2|3|4|5)$/),
                limit: "26",
                page_number: "1",
                page_total: "1",
                total_count: jasmine.stringMatching(/^(1|2|3|4|5)$/),
                txs: jasmine.arrayContaining([posted.tx]),
            });
        });
        it("can query transactions by ID", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(posted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
            const result = await client.txsQuery(`tx.hash=${posted.hash}&limit=26`);
            expect(result).toEqual({
                count: "1",
                limit: "26",
                page_number: "1",
                page_total: "1",
                total_count: "1",
                txs: [posted.tx],
            });
        });
        it("can query transactions by sender", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(posted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
            const result = await client.txsQuery(`message.sender=${posted.sender}&limit=200`);
            expect(parseInt(result.count, 10)).toBeGreaterThanOrEqual(1);
            expect(parseInt(result.limit, 10)).toEqual(200);
            expect(parseInt(result.page_number, 10)).toEqual(1);
            expect(parseInt(result.page_total, 10)).toEqual(1);
            expect(parseInt(result.total_count, 10)).toBeGreaterThanOrEqual(1);
            expect(result.txs.length).toBeGreaterThanOrEqual(1);
            expect(result.txs[result.txs.length - 1]).toEqual(posted.tx);
        });
        it("can query transactions by recipient", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(posted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
            const result = await client.txsQuery(`transfer.recipient=${posted.recipient}&limit=200`);
            expect(parseInt(result.count, 10)).toEqual(1);
            expect(parseInt(result.limit, 10)).toEqual(200);
            expect(parseInt(result.page_number, 10)).toEqual(1);
            expect(parseInt(result.page_total, 10)).toEqual(1);
            expect(parseInt(result.total_count, 10)).toEqual(1);
            expect(result.txs.length).toBeGreaterThanOrEqual(1);
            expect(result.txs[result.txs.length - 1]).toEqual(posted.tx);
        });
        it("can filter by tx.hash and tx.minheight", async () => {
            pending("This combination is broken 🤷‍♂️. Handle client-side at higher level.");
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(posted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
            const hashQuery = `tx.hash=${posted.hash}`;
            {
                const { count } = await client.txsQuery(`${hashQuery}&tx.minheight=0`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${hashQuery}&tx.minheight=${posted.height - 1}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${hashQuery}&tx.minheight=${posted.height}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${hashQuery}&tx.minheight=${posted.height + 1}`);
                expect(count).toEqual("0");
            }
        });
        it("can filter by recipient and tx.minheight", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(posted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
            const recipientQuery = `transfer.recipient=${posted.recipient}`;
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.minheight=0`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.minheight=${posted.height - 1}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.minheight=${posted.height}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.minheight=${posted.height + 1}`);
                expect(count).toEqual("0");
            }
        });
        it("can filter by recipient and tx.maxheight", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(posted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
            const recipientQuery = `transfer.recipient=${posted.recipient}`;
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.maxheight=9999999999999`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.maxheight=${posted.height + 1}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.maxheight=${posted.height}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.maxheight=${posted.height - 1}`);
                expect(count).toEqual("0");
            }
        });
    });
    describe("encodeTx", () => {
        it("works for cosmoshub example", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = new lcdclient_1.LcdClient(testutils_spec_1.wasmd.endpoint);
            const response = await client.encodeTx(cosmoshub_json_1.default.tx);
            expect(response).toEqual(jasmine.objectContaining({
                tx: cosmoshub_json_1.default.tx_data,
            }));
        });
    });
    describe("postTx", () => {
        it("can send tokens", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const accounts = await wallet.getAccounts();
            const [{ address: walletAddress }] = accounts;
            const memo = "My first contract on chain";
            const theMsg = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: testutils_spec_1.faucet.address,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const fee = {
                amount: [
                    {
                        amount: "5000",
                        denom: "ucosm",
                    },
                ],
                gas: "890000",
            };
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.wasmd.endpoint }, auth_1.setupAuthExtension);
            const { account_number, sequence } = (await client.auth.account(testutils_spec_1.faucet.address)).result.value;
            const signBytes = encoding_1.makeSignBytes([theMsg], fee, testutils_spec_1.wasmd.chainId, memo, account_number, sequence);
            const signature = await wallet.sign(walletAddress, signBytes);
            const signedTx = testutils_spec_1.makeSignedTx(theMsg, fee, memo, signature);
            const result = await client.postTx(signedTx);
            expect(result.code).toBeUndefined();
            expect(result).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                txhash: jasmine.stringMatching(testutils_spec_1.tendermintIdMatcher),
                // code is not set
                raw_log: jasmine.stringMatching(/^\[.+\]$/i),
                logs: jasmine.any(Array),
                gas_wanted: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                gas_used: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
            });
        });
        it("can't send transaction with additional signatures", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const account1 = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, wallet_1.makeCosmoshubPath(0));
            const account2 = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, wallet_1.makeCosmoshubPath(1));
            const account3 = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, wallet_1.makeCosmoshubPath(2));
            const [address1, address2, address3] = await Promise.all([account1, account2, account3].map(async (wallet) => {
                return (await wallet.getAccounts())[0].address;
            }));
            const memo = "My first contract on chain";
            const theMsg = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address1,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const fee = {
                amount: [
                    {
                        amount: "5000",
                        denom: "ucosm",
                    },
                ],
                gas: "890000",
            };
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.wasmd.endpoint }, auth_1.setupAuthExtension);
            const { account_number: an1, sequence: sequence1 } = (await client.auth.account(address1)).result.value;
            const { account_number: an2, sequence: sequence2 } = (await client.auth.account(address2)).result.value;
            const { account_number: an3, sequence: sequence3 } = (await client.auth.account(address3)).result.value;
            const signBytes1 = encoding_1.makeSignBytes([theMsg], fee, testutils_spec_1.wasmd.chainId, memo, an1, sequence1);
            const signBytes2 = encoding_1.makeSignBytes([theMsg], fee, testutils_spec_1.wasmd.chainId, memo, an2, sequence2);
            const signBytes3 = encoding_1.makeSignBytes([theMsg], fee, testutils_spec_1.wasmd.chainId, memo, an3, sequence3);
            const signature1 = await account1.sign(address1, signBytes1);
            const signature2 = await account2.sign(address2, signBytes2);
            const signature3 = await account3.sign(address3, signBytes3);
            const signedTx = {
                msg: [theMsg],
                fee: fee,
                memo: memo,
                signatures: [signature1, signature2, signature3],
            };
            const postResult = await client.postTx(signedTx);
            expect(postResult.code).toEqual(4);
            expect(postResult.raw_log).toContain("wrong number of signers");
        });
        it("can send multiple messages with one signature", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const wallet = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, wallet_1.makeCosmoshubPath(0));
            const accounts = await wallet.getAccounts();
            const [{ address: walletAddress }] = accounts;
            const memo = "My first contract on chain";
            const msg1 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: walletAddress,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const msg2 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: walletAddress,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "7654321",
                        },
                    ],
                },
            };
            const fee = {
                amount: [
                    {
                        amount: "5000",
                        denom: "ucosm",
                    },
                ],
                gas: "890000",
            };
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.wasmd.endpoint }, auth_1.setupAuthExtension);
            const { account_number, sequence } = (await client.auth.account(walletAddress)).result.value;
            const signBytes = encoding_1.makeSignBytes([msg1, msg2], fee, testutils_spec_1.wasmd.chainId, memo, account_number, sequence);
            const signature1 = await wallet.sign(walletAddress, signBytes);
            const signedTx = {
                msg: [msg1, msg2],
                fee: fee,
                memo: memo,
                signatures: [signature1],
            };
            const postResult = await client.postTx(signedTx);
            expect(postResult.code).toBeUndefined();
        });
        it("can send multiple messages with multiple signatures", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const account1 = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, wallet_1.makeCosmoshubPath(0));
            const account2 = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, wallet_1.makeCosmoshubPath(1));
            const [address1, address2] = await Promise.all([account1, account2].map(async (wallet) => {
                return (await wallet.getAccounts())[0].address;
            }));
            const memo = "My first contract on chain";
            const msg1 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address1,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const msg2 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address2,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "7654321",
                        },
                    ],
                },
            };
            const fee = {
                amount: [
                    {
                        amount: "5000",
                        denom: "ucosm",
                    },
                ],
                gas: "890000",
            };
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.wasmd.endpoint }, auth_1.setupAuthExtension);
            const { account_number: an1, sequence: sequence1 } = (await client.auth.account(address1)).result.value;
            const { account_number: an2, sequence: sequence2 } = (await client.auth.account(address2)).result.value;
            const signBytes1 = encoding_1.makeSignBytes([msg2, msg1], fee, testutils_spec_1.wasmd.chainId, memo, an1, sequence1);
            const signBytes2 = encoding_1.makeSignBytes([msg2, msg1], fee, testutils_spec_1.wasmd.chainId, memo, an2, sequence2);
            const signature1 = await account1.sign(address1, signBytes1);
            const signature2 = await account2.sign(address2, signBytes2);
            const signedTx = {
                msg: [msg2, msg1],
                fee: fee,
                memo: memo,
                signatures: [signature2, signature1],
            };
            const postResult = await client.postTx(signedTx);
            expect(postResult.code).toBeUndefined();
            await utils_1.sleep(500);
            const searched = await client.txsQuery(`tx.hash=${postResult.txhash}`);
            expect(searched.txs.length).toEqual(1);
            expect(searched.txs[0].tx.value.signatures).toEqual([signature2, signature1]);
        });
        it("can't send transaction with wrong signature order (1)", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const account1 = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, wallet_1.makeCosmoshubPath(0));
            const account2 = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, wallet_1.makeCosmoshubPath(1));
            const [address1, address2] = await Promise.all([account1, account2].map(async (wallet) => {
                return (await wallet.getAccounts())[0].address;
            }));
            const memo = "My first contract on chain";
            const msg1 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address1,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const msg2 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address2,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "7654321",
                        },
                    ],
                },
            };
            const fee = {
                amount: [
                    {
                        amount: "5000",
                        denom: "ucosm",
                    },
                ],
                gas: "890000",
            };
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.wasmd.endpoint }, auth_1.setupAuthExtension);
            const { account_number: an1, sequence: sequence1 } = (await client.auth.account(address1)).result.value;
            const { account_number: an2, sequence: sequence2 } = (await client.auth.account(address2)).result.value;
            const signBytes1 = encoding_1.makeSignBytes([msg1, msg2], fee, testutils_spec_1.wasmd.chainId, memo, an1, sequence1);
            const signBytes2 = encoding_1.makeSignBytes([msg1, msg2], fee, testutils_spec_1.wasmd.chainId, memo, an2, sequence2);
            const signature1 = await account1.sign(address1, signBytes1);
            const signature2 = await account2.sign(address2, signBytes2);
            const signedTx = {
                msg: [msg1, msg2],
                fee: fee,
                memo: memo,
                signatures: [signature2, signature1],
            };
            const postResult = await client.postTx(signedTx);
            expect(postResult.code).toEqual(8);
        });
        it("can't send transaction with wrong signature order (2)", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const account1 = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, wallet_1.makeCosmoshubPath(0));
            const account2 = await wallet_1.Secp256k1Wallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, wallet_1.makeCosmoshubPath(1));
            const [address1, address2] = await Promise.all([account1, account2].map(async (wallet) => {
                return (await wallet.getAccounts())[0].address;
            }));
            const memo = "My first contract on chain";
            const msg1 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address1,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const msg2 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address2,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "7654321",
                        },
                    ],
                },
            };
            const fee = {
                amount: [
                    {
                        amount: "5000",
                        denom: "ucosm",
                    },
                ],
                gas: "890000",
            };
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.wasmd.endpoint }, auth_1.setupAuthExtension);
            const { account_number: an1, sequence: sequence1 } = (await client.auth.account(address1)).result.value;
            const { account_number: an2, sequence: sequence2 } = (await client.auth.account(address2)).result.value;
            const signBytes1 = encoding_1.makeSignBytes([msg2, msg1], fee, testutils_spec_1.wasmd.chainId, memo, an1, sequence1);
            const signBytes2 = encoding_1.makeSignBytes([msg2, msg1], fee, testutils_spec_1.wasmd.chainId, memo, an2, sequence2);
            const signature1 = await account1.sign(address1, signBytes1);
            const signature2 = await account2.sign(address2, signBytes2);
            const signedTx = {
                msg: [msg2, msg1],
                fee: fee,
                memo: memo,
                signatures: [signature1, signature2],
            };
            const postResult = await client.postTx(signedTx);
            expect(postResult.code).toEqual(8);
        });
    });
});
//# sourceMappingURL=lcdclient.spec.js.map